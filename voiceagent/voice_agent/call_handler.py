
import asyncio
import datetime
import re
import time
from typing import Optional

from livekit import rtc
from livekit.agents import AgentSession, JobContext, room_io
from livekit.plugins import cartesia, deepgram, groq, noise_cancellation, openai

from .agent_class import RealEstateTools
from .airtable import log_call_to_airtable
from .config import (
    AGENT_INSTRUCTIONS,
    FAREWELL_WORDS,
    LIVEKIT_API_KEY,
    LIVEKIT_API_SECRET,
    LIVEKIT_URL,
    MAX_CALL_DURATION,
    SILENCE_TIMEOUT,
    TRANSFER_NUMBER,
    TRANSFER_WORDS,
    logger,
)
from .vad_config import build_vad

from livekit.agents import Agent, AgentSession, JobContext, room_io


async def handle_inbound_call(ctx: JobContext) -> None:
    call_started_at = datetime.datetime.now(datetime.timezone.utc)
    call_start_time = time.monotonic()
    transcript_lines: list[str] = []
    
    # Structured lead data
    lead_info = {
        "name": "",
        "email": "",
        "budget": "",
        "property_type": ""
    }

    caller_number: str = "unknown"

    def extract_caller_number() -> Optional[str]:
        for participant in ctx.room.remote_participants.values():
            if participant.kind == rtc.ParticipantKind.PARTICIPANT_KIND_SIP:
                number = participant.attributes.get("sip.phoneNumber")
                if number:
                    return number
                identity = participant.identity or ""
                if identity.startswith("sip_"):
                    phone = identity[4:]
                    if phone:
                        return phone
                call_id = participant.attributes.get("sip.callID")
                if call_id:
                    return call_id
        room_name = ctx.room.name or ""
        if room_name.startswith("_+") or room_name.startswith("_0"):
            parts = room_name.lstrip("_").split("_")
            if parts:
                return "+" + parts[0].lstrip("+")
        return None

    found = extract_caller_number()
    if not found:
        await asyncio.sleep(0.5)
        found = extract_caller_number()
    if found:
        caller_number = found
        logger.info(f"Inbound call from: {caller_number}")
    else:
        logger.warning("Could not determine caller number from SIP attributes")

    # Use multi-language STT (en, hi, mr) as requested in prompt
    session = AgentSession(
        stt=deepgram.STT(
            model="nova-2",
            language="hi", # Primary, but smart_format and multi-model if available
            smart_format=True,
        ),
        llm=groq.LLM(
            model="llama-3.3-70b-versatile",
        ),
        tts=cartesia.TTS(
            model="sonic-multilingual",
            voice="faf0731e-dfb9-4cfc-8119-259a79b27e12",
        ),
        vad=build_vad(),
    )

    @session.on("conversation_item_added")
    def on_conversation_item(ev) -> None:
        item = ev.item
        text = getattr(item, "text_content", None) or getattr(item, "content", None)
        if isinstance(text, list):
            text = " ".join(
                getattr(c, "text", "") for c in text
                if getattr(c, "type", "") == "text"
            )
        if not text or not str(text).strip():
            return
        role = getattr(item, "role", "")
        if role == "user":
            transcript_lines.append(f"[CALLER] {str(text).strip()}")
            logger.info(f"CALLER: {str(text).strip()}")
        elif role == "assistant":
            transcript_lines.append(f"[AGENT] {str(text).strip()}")
            logger.info(f"AGENT: {str(text).strip()}")

    fnc_ctx = RealEstateTools()

    await session.start(
        room=ctx.room,
        agent=Agent(instructions=AGENT_INSTRUCTIONS, fnc_ctx=fnc_ctx),
        room_options=room_io.RoomOptions(
            audio_input=room_io.AudioInputOptions(
                noise_cancellation=lambda params: (
                    noise_cancellation.BVCTelephony()
                    if params.participant.kind == rtc.ParticipantKind.PARTICIPANT_KIND_SIP
                    else noise_cancellation.BVC()
                ),
            ),
        ),
    )

    await session.generate_reply(
        instructions=(
            "Greet the caller in English. Say exactly: "
            "'Thank you for calling! I'm Aarti. Are you looking for a new home, a plot, or inquiring new project leads today?'"
        )
    )

    disconnect_event = asyncio.Event()
    last_activity: list[float] = [time.monotonic()]

    def _refresh_activity(*_) -> None:
        last_activity[0] = time.monotonic()
    _hanging_up: list[bool] = [False]

    async def _say_goodbye_and_hang_up() -> None:
        if _hanging_up[0] or disconnect_event.is_set():
            return
        _hanging_up[0] = True

        try:
            await session.say(
                "It was a pleasure speaking with you. Have a great day, goodbye!",
                allow_interruptions=False,
            )
        except Exception:
            pass

        await asyncio.sleep(1.0)

        try:
            from livekit import api as lk_api
            async with lk_api.LiveKitAPI(
                url=LIVEKIT_URL,
                api_key=LIVEKIT_API_KEY,
                api_secret=LIVEKIT_API_SECRET,
            ) as lk_client:
                await lk_client.room.delete_room(
                    lk_api.DeleteRoomRequest(room=ctx.room.name)
                )
            logger.info("Room deleted — SIP call terminated.")
        except Exception as exc:
            logger.warning(f"Could not delete room via API: {exc}")

        disconnect_event.set()

    async def _transfer_call() -> None:
        if _hanging_up[0] or disconnect_event.is_set():
            return
        _hanging_up[0] = True

        sip_participant = None
        for p in ctx.room.remote_participants.values():
            if p.kind == rtc.ParticipantKind.PARTICIPANT_KIND_SIP:
                sip_participant = p
                break

        if not sip_participant:
            logger.warning("No SIP participant found — cannot transfer")
            return

        logger.info(f"Transferring call to {TRANSFER_NUMBER}")
        try:
            from livekit import api as lk_api
            async with lk_api.LiveKitAPI(
                url=LIVEKIT_URL,
                api_key=LIVEKIT_API_KEY,
                api_secret=LIVEKIT_API_SECRET,
            ) as lk_client:
                await lk_client.sip.transfer_sip_participant(
                    lk_api.TransferSIPParticipantRequest(
                        room_name=ctx.room.name,
                        participant_identity=sip_participant.identity,
                        transfer_to=f"tel:{TRANSFER_NUMBER}",
                        play_dialtone=True,
                    )
                )
            logger.info("SIP transfer initiated successfully.")
        except Exception as exc:
            logger.error(f"SIP transfer failed: {exc}")
        disconnect_event.set()

    # Formal tool monitor for TRANSFER keyword in tool outputs
    @session.on("function_call_completed")
    def on_tool_call(event) -> None:
        _refresh_activity()
        if "TRANSFER" in str(event.response).upper():
            logger.info("Tool triggered TRANSFER — initiating SIP transfer")
            asyncio.create_task(_transfer_call())

    # Watch for lead data in agent output to populate Airtable fields
    @session.on("assistant_speech_committed")
    def on_agent_speech(event) -> None:
        _refresh_activity()
        text = str(event.text).lower()
        # Simple extraction logic - in a real app, we'd use LLM to extract structured data
        # but here we follow the prompt's summary logic
        if "name is" in text:
            match = re.search(r"name is ([\w\s]+)", text)
            if match: lead_info["name"] = match.group(1).split()[0]
        if "email is" in text:
            match = re.search(r"email is ([\w\d@.]+)", text)
            if match: lead_info["email"] = match.group(1)

    async def _silence_watchdog() -> None:
        while not disconnect_event.is_set():
            await asyncio.sleep(2)
            if time.monotonic() - last_activity[0] >= SILENCE_TIMEOUT:
                logger.info(f"Silence for {SILENCE_TIMEOUT}s — ending call")
                await _say_goodbye_and_hang_up()
                break

    async def _max_duration_watchdog() -> None:
        await asyncio.sleep(MAX_CALL_DURATION)
        logger.warning(f"Max duration ({MAX_CALL_DURATION}s) reached — ending call")
        await session.say(
            "I'm sorry, we've reached the maximum call duration. "
            "Please call back if you need further assistance. Goodbye!",
            allow_interruptions=False,
        )
        disconnect_event.set()

    @ctx.room.on("participant_disconnected")
    def on_participant_disconnected(participant: rtc.RemoteParticipant) -> None:
        if participant.kind == rtc.ParticipantKind.PARTICIPANT_KIND_SIP:
            logger.info(f"SIP participant disconnected: {participant.identity}")
            disconnect_event.set()

    @ctx.room.on("disconnected")
    def on_room_disconnected(*_args) -> None:
        disconnect_event.set()

    silence_task  = asyncio.create_task(_silence_watchdog())
    duration_task = asyncio.create_task(_max_duration_watchdog())

    try:
        await disconnect_event.wait()
    finally:
        silence_task.cancel()
        duration_task.cancel()

        duration_seconds = time.monotonic() - call_start_time
        full_transcript = (
            "\n".join(transcript_lines) if transcript_lines else "(no transcript captured)"
        )
        
        # Final log to Airtable with structured fields
        log_call_to_airtable(
            caller_number=caller_number,
            duration_seconds=duration_seconds,
            transcript=full_transcript,
            started_at=call_started_at,
            lead_name=lead_info["name"],
            lead_email=lead_info["email"],
            lead_budget=lead_info["budget"],
            lead_property_type=lead_info["property_type"]
        )

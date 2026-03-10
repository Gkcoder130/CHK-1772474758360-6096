
from livekit.agents import AgentServer, JobContext

from .call_handler import handle_inbound_call

server = AgentServer()


@server.rtc_session(agent_name="inbound-voice-agent")
async def _handle(ctx: JobContext) -> None:
    await handle_inbound_call(ctx)

# LiveKit inbound Voice Agent

A self-hosted AI voice agent that answers inbound phone calls via Twilio + LiveKit, converses using OpenAI GPT-4o-mini, and logs every call to Airtable.

**Pipeline:** Twilio Phone → LiveKit SIP → Deepgram STT → OpenAI LLM → ElevenLabs TTS → Caller

---



```bash
# 1. Clone / copy this project to your VPS or local machine
cd /opt/voice-agent 

# 2. Create a Python virtual environment
python3 -m venv .venv
source .venv/bin/activate   # Linux/macOS
# .venv\Scripts\activate    # Windows

# 3. Install dependencies
pip install -r requirements.txt

# 4. Download the Silero VAD model (required once)
python -m livekit.plugins.silero download-files

# 5. Set up your environment variables
cp .env.example .env
nano .env   # fill in all your keys
```

---


## Running the Agent

### Development (foreground, with debug logs)
```bash
python agent.py start --log-level debug
```



## Architecture

```
Phone Call
    │
    ▼
Twilio (SIP Trunk)
    │  SIP/RTP
    ▼
LiveKit Cloud (SIP Gateway)
    │  WebRTC
    ▼
agent.py (your VPS)
    │
    ├─▶ Deepgram   → real-time speech → text (STT)
    ├─▶ openai5 → text → text  (LLM, streaming)
    ├─▶ ElevenLabs → text → speech (TTS, streaming)
    │
    └─▶airtable/spreadsheet   → call log on hangup
```

The agent process is **persistent** — it stays running and handles many sequential calls. LiveKit dispatches each inbound call as a job to the worker, which handles each call in its own async task.

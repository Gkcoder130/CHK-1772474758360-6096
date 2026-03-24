

from livekit import agents

from voice_agent.server import server

if __name__ == "__main__":
    agents.cli.run_app(server)

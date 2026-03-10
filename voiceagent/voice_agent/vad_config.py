
from livekit.plugins import silero


def build_vad() -> silero.VAD:
    return silero.VAD.load(
        min_silence_duration=0.5,

        min_speech_duration=0.1,

        prefix_padding_duration=0.3,

        max_buffered_speech=60.0,

        activation_threshold=0.5,
    )

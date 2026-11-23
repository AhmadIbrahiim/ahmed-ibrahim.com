"""The navigation test calls the configured language model and needs agent/.env.local."""

import pytest
from dotenv import load_dotenv
from livekit.agents import AgentSession

import agent
from agent import SiteAssistant

load_dotenv(".env.local")


@pytest.mark.parametrize("voice_id", [None, " "])
def test_tts_requires_a_custom_voice(monkeypatch, voice_id):
    if voice_id is None:
        monkeypatch.delenv("ELEVENLABS_VOICE_ID", raising=False)
    else:
        monkeypatch.setenv("ELEVENLABS_VOICE_ID", voice_id)
    with pytest.raises(ValueError, match="ELEVENLABS_VOICE_ID"):
        agent.build_tts()


@pytest.mark.parametrize(
    ("question", "path"),
    [
        ("Can you open your writing page?", "/blog/"),
        ("Can you open your voice AI consulting page?", "/voice-ai-engineer/"),
    ],
)
@pytest.mark.asyncio
async def test_opens_page_when_asked(question: str, path: str) -> None:
    assert path in agent.ROUTES
    async with AgentSession() as session:
        await session.start(SiteAssistant())
        result = await session.run(user_input=question)
        result.expect.contains_function_call(name="navigate", arguments={"path": path})

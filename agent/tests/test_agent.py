"""Runs the real model through LiveKit Inference, so it needs agent/.env.local."""

import pytest
from dotenv import load_dotenv
from livekit.agents import AgentSession

from agent import SiteAssistant

load_dotenv(".env.local")


@pytest.mark.asyncio
async def test_opens_writing_page_when_asked() -> None:
    async with AgentSession() as session:
        await session.start(SiteAssistant())
        result = await session.run(user_input="Can you take me to his writing page?")
        result.expect.contains_function_call(
            name="navigate", arguments={"path": "/blog/"}
        )

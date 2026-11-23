# Site voice agent

LiveKit Agents (Python) voice agent for ahmed-ibrahim.com. It speaks as the AI version of Ahmed using his ElevenLabs voice.

- Code: `src/agent.py`
- Knowledge: built from the site's markdown by `scripts/sync_knowledge.py`
- Checks: `scenarios.yaml`
- Deploying, secrets policy and the deployment log: [DEPLOYMENT.md](DEPLOYMENT.md)

Local run: `uv sync`, create `.env.local` (see DEPLOYMENT.md), then `uv run python src/agent.py console`.

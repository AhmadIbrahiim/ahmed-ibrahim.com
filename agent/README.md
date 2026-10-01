# Site voice agent

LiveKit Agents (Python) assistant for ahmed-ibrahim.com. Built from LiveKit's `agent-starter-python` template.

- Code: `src/agent.py`
- Knowledge: built from the site's markdown by `scripts/sync_knowledge.py`
- Checks: `scenarios.yaml`
- Deploying, secrets policy and the deployment log: [DEPLOYMENT.md](DEPLOYMENT.md)

Local run: `uv sync`, create `.env.local` (see DEPLOYMENT.md), then `uv run python src/agent.py console`.

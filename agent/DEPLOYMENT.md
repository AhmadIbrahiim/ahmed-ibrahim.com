# Voice agent deployment

The site assistant for ahmed-ibrahim.com. A LiveKit Agents (Python) app, deployed to LiveKit Cloud. It is separate from the Gatsby site and from the Cloudflare Pages deploy.

This repo is public. Nothing in it may be a secret. See [What must never be committed](#what-must-never-be-committed).

## Where it runs

| | |
|---|---|
| Platform | LiveKit Cloud, project `ahmed-ibrahim-com` (personal, not Goodcall's) |
| Agent id | in `livekit.toml` (git-ignored) |
| Dispatch name | `ahmed-site` (set in `src/agent.py`; the site's token endpoint must request exactly this) |
| Region | `us-east` |
| Models | LiveKit Inference: Gemma 4 (LLM), AssemblyAI (speech to text), Fish Audio (text to speech). No provider API keys needed |
| Session cap | 180 seconds (`MAX_SESSION_SECONDS` in `src/agent.py`) |

## Everyday commands

Run from `agent/`.

```sh
lk agent status                 # running? version, replicas
lk agent logs                   # live runtime logs (--log-type=build for build logs)
lk agent deploy                 # ship a new version (rolling; live calls finish on the old one, up to 1 hour)
lk agent rollback               # previous version (paid plans only; on free, redeploy old code)
lk agent simulate text --scenarios scenarios.yaml   # run the conversation checks
uv run ruff check src && uv run ruff format src     # lint before deploying
uv run python src/agent.py console                  # talk to it locally (needs agent/.env.local)
```

Deploying uploads the contents of `agent/` to LiveKit's build service, minus everything in `.dockerignore`.

## First time on a new machine

1. `lk cloud auth`, then `lk project set-default "ahmed-ibrahim-com"`.
2. `cd agent && lk agent config` and pick the existing agent. It regenerates `livekit.toml`.
3. For local runs only: create `agent/.env.local` with `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` (`lk app env -w` can write it). LiveKit injects these into the deployed agent by itself.

## What must never be committed

Git-ignored in the root `.gitignore`: `agent/.env*`, `agent/livekit.toml`, `agent/.venv/`, `__pycache__/`.

- `agent/.env.local` holds the project's API key and secret.
- `agent/livekit.toml` holds the agent id and project subdomain. Not a credential, but it identifies the cloud project.
- `src/agent.py` holds the assistant's instructions. They contain only facts already public on the site. Keep it that way: no phone number, address, salary, or private notes.
- Provider keys (only if the models change away from LiveKit Inference) go in `agent/.env.local` locally and in LiveKit's secret store with `lk agent update-secrets --secrets-file agent/.env.local`. They are never written into source.

Before committing, run `git status` and `git diff --cached --stat` and confirm none of the above appear.

## Cold starts and cost

- On LiveKit's free Build plan an idle agent scales to zero. The first visitor waits about 10 to 20 seconds for the agent to join. Paid plans stay warm.
- Every session costs inference and transport minutes. The 180 second cap bounds each one. The site's token endpoint should also require a Turnstile pass and rate-limit per IP (not built yet).
- LiveKit Cloud keeps session reports for agents it hosts. Check the project's observability and recording settings before telling visitors nothing is stored.

## Deployment log

Add a row for every `lk agent deploy`.

| Date | Version | Region | Change |
|---|---|---|---|
| 2026-10-01 | `GnDPPRnTJ8fS` | us-east | First deploy. Site assistant persona, 180 second cap. Three simulation scenarios pass. |

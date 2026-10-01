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
| Models | LiveKit Inference: Gemma 4 (LLM), AssemblyAI (speech to text). Voice: Cartesia `sonic-3.5` through the Cartesia plugin with voice `8a99c589-94d4-48d4-befc-07b097fa1246` |
| Knowledge | All of `content/pages` and `content/posts`, copied into the prompt (see [Knowledge](#knowledge)) |
| Session cap | 180 seconds (`MAX_SESSION_SECONDS` in `src/agent.py`) |

## Everyday commands

Run from `agent/`.

```sh
lk agent status                 # running? version, replicas
lk agent logs                   # live runtime logs (--log-type=build for build logs)
./deploy.sh                     # rebuild knowledge, lint, then `lk agent deploy` (rolling; live calls finish on the old one, up to 1 hour)
lk agent rollback               # previous version (paid plans only; on free, redeploy old code)
lk agent simulate text --scenarios scenarios.yaml   # run the conversation checks
uv run ruff check src && uv run ruff format src     # lint before deploying
uv run python src/agent.py console                  # talk to it locally (needs agent/.env.local)
```

Deploying uploads the contents of `agent/` to LiveKit's build service, minus everything in `.dockerignore`.

## Knowledge

The agent is not fine-tuned. `scripts/sync_knowledge.py` turns the site's markdown into `agent/knowledge/site.md` (git-ignored, regenerated on every `./deploy.sh`), and the agent loads that whole file into its prompt at startup. So: write a post or edit a page, run `./deploy.sh`, and it knows. The script redacts phone numbers (the CV page has one). About 42,000 characters today; if the content grows past roughly 100,000 tokens, switch to retrieval.

## Voice

The Cartesia voice id is a custom or community voice, which LiveKit Inference does not serve (it returned no audio; the stock voices do work). It runs through the Cartesia plugin and needs your own Cartesia key as a LiveKit secret:

```sh
# put CARTESIA_API_KEY=... in agent/.env.local (git-ignored), then:
cd agent && lk agent update-secrets --secrets-file .env.local   # triggers a rolling restart
```

Until that secret exists the agent logs `CARTESIA_API_KEY not set` and speaks with a stock Cartesia voice.

## First time on a new machine

1. `lk cloud auth`, then `lk project set-default "ahmed-ibrahim-com"`.
2. `cd agent && lk agent config` and pick the existing agent. It regenerates `livekit.toml`.
3. For local runs only: create `agent/.env.local` with `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` (`lk app env -w` can write it). LiveKit injects these into the deployed agent by itself.

## What must never be committed

Git-ignored in the root `.gitignore`: `agent/.env*`, `agent/livekit.toml`, `agent/.venv/`, `__pycache__/`.

- `agent/.env.local` holds the project's API key and secret.
- `agent/livekit.toml` holds the agent id and project subdomain. Not a credential, but it identifies the cloud project.
- `src/agent.py` holds the assistant's instructions. They contain only facts already public on the site. Keep it that way: no phone number, address, salary, or private notes.
- `CARTESIA_API_KEY` and any other provider key go in `agent/.env.local` locally and in LiveKit's secret store with `lk agent update-secrets --secrets-file agent/.env.local`. They are never written into source.

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
| 2026-10-01 | `vTwHDrPXSZKi` | us-east | Whole site markdown as knowledge. Cartesia voice wired in; running on a stock Cartesia voice until `CARTESIA_API_KEY` is set. |

# Voice agent deployment

Ahmed's personal AI assistant, which visitors talk to on ahmed-ibrahim.com. A LiveKit Agents (Python) app, deployed to LiveKit Cloud. It is separate from the Gatsby site and from the Cloudflare Pages deploy.

This repo is public. Nothing in it may be a secret. See [What must never be committed](#what-must-never-be-committed).

## Where it runs

| | |
|---|---|
| Platform | LiveKit Cloud, project `ahmed-ibrahim-com` (personal, not Goodcall's) |
| Agent id | in `livekit.toml` (git-ignored) |
| Dispatch name | `ahmed-site` (set in `src/agent.py`; the site's token endpoint must request exactly this) |
| Region | `us-east` |
| Models | LiveKit Inference: Gemma 4 (LLM), AssemblyAI (speech to text), Cartesia `sonic-3.6` (voice "Leo", male) with expressive mode on for emotion |
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

## Prompts

All in `src/agent.py`: `INSTRUCTIONS` (persona and rules, then the site knowledge, then a short reminder), the greeting passed to `generate_reply`, the goodbye line in `end_after`, and the `expressive` emotion steering. Persona: Ahmed's personal AI assistant, a funny, warm teammate and his biggest fan (an AI that says so, never Ahmed himself; it talks about him, not about the website). It finds out what the visitor is building once, backs it with one real fact from the knowledge, and offers his email once when interest is real.

Rules when editing them:

- The model is open-weight (Gemma 4), so keep sections short and flat, rules explicit, and the reminder after the knowledge block in sync with the rules above it.
- Never add prices, rates, availability, client names or numbers that are not on the site. The agent is told to defer those to Ahmed's email, and `scenarios.yaml` tests it.
- The greeting examples set spirit and length; the model writes a fresh line each time.
- After any prompt change run `uv run pytest` and `lk agent simulate text --scenarios scenarios.yaml`. The judge sometimes reads an example list as a strict list, so write "any of them is fine" where that is intended.

## Voice and emotion

Cartesia `sonic-3.6` through LiveKit Inference, stock male voice "Leo" (`0834f3df-e650-4766-a20c-5a93a43aa6e3`). Emotion comes from expressive mode: the model tags its own replies with emotion, pacing and breaths, LiveKit renders them and strips them from the transcript. Tuning is the `expressive` option in `src/agent.py`.

What [Cartesia's emotion guide](https://docs.cartesia.ai/build-with-cartesia/capability-guides/volume-speed-emotion) says, and how it shapes the setup:

- Emotion is in beta, works in English only, and is guidance rather than a guarantee. Results depend on the voice.
- The voices with the best emotional response are Leo, Jace, Kyle and Gavin (male), plus Maya, Tessa, Dana and Marian. The agent uses Leo. Jace (`6776173b-fd72-460d-89b3-d85812ee518d`), Kyle (`c961b81c-a935-4c17-bfb3-ba2239de8c2f`) and Gavin (`f4a3a8e4-694c-4c45-9ca0-27caf97901b5`) also work through Inference; change `VOICE_ID` to switch.
- The most reliable emotions are neutral, calm, content, sad and scared, so the instructions steer the model to calm, content or neutral most of the time, and sad or happy only when they clearly fit.

Voice must stay on Inference, because expressive mode only works there. A custom Cartesia voice (for example `8a99c589-94d4-48d4-befc-07b097fa1246`) is not served by Inference, and the Cartesia plugin route would turn emotion off. LiveKit's [custom voices](https://docs.livekit.io/agents/models/tts/custom-voices/) page covers cloning a voice through LiveKit instead (not tried).

The current mood is also published to the browser as `lk.expression` (the `useAgentExpression` hook), so the Aura can change colour with the mood.

## Navigation (agent to browser)

The agent has a `navigate(path)` tool. It only accepts paths from `knowledge/routes.json`, which `scripts/sync_knowledge.py` builds from the markdown plus a few fixed routes (`/`, `/#work`, `/blog/`). It sends an RPC to the visitor's browser:

- method: `navigate`
- payload: `{"path": "/blog/"}`
- the browser replies with any string, or throws to report failure (the agent then tells the visitor it could not open the page)

The site must register the handler once the room is connected (not built yet):

```js
import { navigate } from "gatsby";

room.localParticipant.registerRpcMethod("navigate", async ({ payload }) => {
  const { path } = JSON.parse(payload);
  // The agent is not trusted: same-site paths only.
  if (typeof path !== "string" || !path.startsWith("/") || path.startsWith("//")) {
    throw new Error("bad path");
  }
  navigate(path);
  return "ok";
});
```

`tests/test_agent.py` checks that asking for the writing page makes the agent call `navigate` with `/blog/`. Run it with `uv run pytest` (needs `.env.local`; it calls the real model).

## First time on a new machine

1. `lk cloud auth`, then `lk project set-default "ahmed-ibrahim-com"`.
2. `cd agent && lk agent config` and pick the existing agent. It regenerates `livekit.toml`.
3. For local runs only: create `agent/.env.local` with `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` (`lk app env -w` can write it). LiveKit injects these into the deployed agent by itself.

## What must never be committed

Git-ignored in the root `.gitignore`: `agent/.env*`, `agent/livekit.toml`, `agent/.venv/`, `__pycache__/`.

- `agent/.env.local` holds the project's API key and secret.
- `agent/livekit.toml` holds the agent id and project subdomain. Not a credential, but it identifies the cloud project.
- `src/agent.py` holds the assistant's instructions. They contain only facts already public on the site. Keep it that way: no phone number, address, salary, or private notes.
- Any provider key (none are used today) goes in `agent/.env.local` locally and in LiveKit's secret store with `lk agent update-secrets --secrets-file agent/.env.local`. They are never written into source.

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
| 2026-10-01 | `vTwHDrPXSZKi` | us-east | Whole site markdown as knowledge. |
| 2026-10-01 | `LVYGtH7AU2gm` | us-east | Male stock voice (Blake) on `sonic-3.6` with expressive mode. `navigate` tool plus site map. Four simulation scenarios pass. |
| 2026-10-01 | `pnxYzdv5wtng` | us-east | Voice changed to Leo (Cartesia's best-for-emotion male voice). Emotion guidance prefers calm, content and neutral. Four scenarios and the navigate test pass. |
| 2026-10-01 | `5GYmHdrXwUBi` | us-east | Salesperson persona with light humour, new greeting and goodbye, rules repeated after the knowledge block, deferrals always include the email. Six scenarios (two new: sales, no prices) and the navigate test pass. |
| 2026-10-01 | `XXn8CePyLDCF` | us-east | Persona is now Ahmed's personal AI assistant (talks about him, not the website). Greeting examples and scenarios updated. |

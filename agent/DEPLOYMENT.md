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
| Models | Language: LiveKit Inference Gemma 4, or Cloudflare Workers AI `@cf/google/gemma-4-26b-a4b-it` when its secrets are set. Speech to text: AssemblyAI. With the owner's key (`ASSEMBLYAI_API_KEY`, set) it is the cheapest streaming model, `universal-streaming-english`; without it, LiveKit Inference's `universal-3-5-pro`. Voice: Rime `coda`, male voice `cupola`, through the Rime plugin with the owner's own key |
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

Hard rule: the agent never says the name of the realtime platform it runs on, and never names the platform, vendors or models behind it. Asked how it is built, it pitches that Ahmed builds production voice agents and can build one for the visitor. `scripts/sync_knowledge.py` rewrites the name out of the knowledge, the prompt forbids it, and a scenario checks it.

All in `src/agent.py`: `INSTRUCTIONS` (persona and rules, then the site knowledge, then a short reminder), the greeting passed to `generate_reply`, the goodbye line in `end_after`, and the `expressive` emotion steering. Persona: Ahmed's personal AI assistant, a funny, warm teammate and his biggest fan (an AI that says so, never Ahmed himself; it talks about him, not about the website). It finds out what the visitor is building once, backs it with one real fact from the knowledge, and offers his email once when interest is real.

Rules when editing them:

- The model is open-weight (Gemma 4), so keep sections short and flat, rules explicit, and the reminder after the knowledge block in sync with the rules above it.
- Never add prices, rates, availability, client names or numbers that are not on the site. The agent is told to defer those to Ahmed's email, and `scenarios.yaml` tests it.
- The greeting examples set spirit and length; the model writes a fresh line each time.
- After any prompt change run `uv run pytest` and `lk agent simulate text --scenarios scenarios.yaml`. The judge sometimes reads an example list as a strict list, so write "any of them is fine" where that is intended.

## Where the knowledge comes from

`./deploy.sh` rebuilds it on every deploy from three places: the site's markdown (`content/`), a live pull of Ahmed's latest public GitHub repos (the GitHub API, no key needed; a few noisy repos are skipped in `SKIP_REPOS`), and `knowledge-src/linkedin.md`, a small hand-kept file of public LinkedIn facts (LinkedIn cannot be fetched reliably). All of it goes through the same filter that removes the platform name and vendor names and strips emoji.

## Inference credits

The free plan includes only $2.50 of inference credit in total (about 50 minutes of conversation by LiveKit's own estimate; the full-site prompt makes each turn heavier). When it runs out, the model refuses every request with a 429 quota error and the assistant goes silent; the site then shows the "isn't available right now" message with Ahmed's email. Running simulations or `uv run pytest` spends the same credit, so use them sparingly. Fixes: upgrade the plan, or point the agent at another model provider with its own key (the key goes in `.env.local` and `lk agent update-secrets`, never in the repo).

## Voice

Rime's newest model, `coda`, voice `cupola` (a confident, warm male American voice), streamed over WebSocket through the Rime plugin with the owner's own key. The key is the agent secret `RIME_API_KEY`: keep it in `agent/.env.local` (git-ignored) and push it with `lk agent update-secrets --secrets-file .env.local`. Other male coda voices: godfrey, beatty, masonry, parapet; change `RIME_VOICE`.

Rime is not one of the providers LiveKit's emotion-tag mode supports (Fish Audio, Inworld, Cartesia, Gemini), so there is no `expressive` setting any more; the delivery comes from the voice itself. Earlier versions used Cartesia with emotion tags (see the log). The current mood is no longer published to the browser as `lk.expression`.

## Language model

`build_llm()` in `src/agent.py` uses LiveKit Inference by default. Setting the agent secrets `CLOUDFLARE_AI_TOKEN` (a token with the Workers AI permission) and `CLOUDFLARE_ACCOUNT_ID` switches it to `@cf/google/gemma-4-26b-a4b-it` on Cloudflare Workers AI through its OpenAI-compatible endpoint, which keeps the model off the inference credit meter. Check tool calling (the `navigate` tool) works with that model before relying on it. Remove the secrets to go back.

## Speech to text

`build_stt()` in `src/agent.py` uses LiveKit Inference by default. Setting the agent secret `ASSEMBLYAI_API_KEY` switches it to the cheapest AssemblyAI streaming model (`universal-streaming-english`, $0.0025/min, a third of `universal-3-5-pro`) through the AssemblyAI plugin on the owner's own key, off the inference credit meter. Remove the secret to go back. Keyterms (names it would misspell) are in `KEYTERMS`.

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
| 2026-10-01 | `QLPnW5KemV6D` | us-east | Never names the platform; asked how it is built it pitches a build and gives the email. Knowledge rewritten to drop the name. Seven scenarios pass. |
| 2026-10-01 | `GMEjqER8Qmhh` | us-east | Knowledge now includes LinkedIn highlights and live GitHub projects; prompt focuses on his work and expertise; natural spoken email ("dash"). Deployed without running the scenarios (inference credit was exhausted). |
| 2026-10-01 | `3qbFEQZM4SvD` | us-east | Voice switched to Rime `coda` / `cupola` with the owner's key (no emotion tags). Deployed without running the scenarios. |
| 2026-10-01 | `o3d48M3wjsid` | us-east | Opt-in Cloudflare Workers AI language model (`build_llm`), off until its secrets exist. Deployed without running the scenarios. |
| 2026-10-01 | `Version
Xxw5Pkxzh2ST` | us-east | Opt-in own-key AssemblyAI speech to text (`build_stt`), off until `ASSEMBLYAI_API_KEY` exists. Deployed without running the scenarios. |
| 2026-10-01 | `aXdXLXnsLGkp` | us-east | Speech to text now on the owner's AssemblyAI key, cheapest model `universal-streaming-english`. Deployed without running the scenarios. |

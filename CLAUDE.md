# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run develop` — start the Gatsby dev server (prefer this over `npm run dev`, which shells out to Yarn).
- `npm run build` — production build into `public/`. This is what gets uploaded to Cloudflare Pages (see Deploys).
- `npm run serve` — serve the built `public/` directory.
- `npm run clean` — remove `public/` and `.cache/`. Run this when Gatsby's GraphQL schema or `gatsby-node.js` page generation gets out of sync.
- `npm run lint:js` / `npm run lint:md` / `npm run format:js` — ESLint (Airbnb + Prettier), remark on `content/posts/`, Prettier write.
- `npm run build:gh` — clean, build with `--prefix-paths`, deploy `public/` to GitHub Pages via `gh-pages`.

There is no automated test suite. Validation for a change is: `lint:js`, `lint:md`, and a full `build` succeeding, plus a smoke test in `gatsby develop` for any UI or content change.

## Architecture

**Gatsby 5 + React 19 static site.** Content is Markdown, pages are generated at build time, and runtime state is minimal (a theme/dark-mode context).

### Page generation flow (`gatsby-node.js`)

This is the core piece of the build to understand:

1. `onCreateNode` runs for every `MarkdownRemark` node and writes a `fields.slug`. Slug resolution order: explicit `frontmatter.slug` wins; otherwise `kebabCase(frontmatter.title)`; otherwise the file path. It also normalizes `frontmatter.date` into a `fields.date` ISO string.
2. `createPages` queries all markdown, then for each node dispatches on `frontmatter.template`:
   - `template: post` → `src/templates/post.js`
   - `template: page` → `src/templates/page.js`
   - Any post/page without one of those `template` values **will not get a route**.
3. Tags and categories are collected across all frontmatter and rendered via `src/templates/tag.js` / `category.js` at `/tags/<kebab>/` and `/categories/<kebab>/`.
4. `onCreateWebpackConfig` patches Gatsby's webpack rules to force the modern Dart Sass compiler API (`api: 'modern-compiler'`). This is required for Sass ≥ 1.7x to work with `gatsby-plugin-sass`; don't remove it without testing the build.

### Content layout

- `content/posts/*.md` — blog posts. Frontmatter must include `template: post`, `title`, `date` (YYYY-MM-DD), `slug` (kebab-case), `categories`, `tags`, and a `thumbnail` path relative to the markdown file. `gatsby-remark-images` resizes images to 850px max; `gatsby-remark-prismjs` handles code blocks.
- `content/pages/*.md` — standalone pages (e.g. `me.md`, `learn.md`) with `template: page`.
- `content/thumbnails/` and `content/images/` — referenced by relative paths from markdown frontmatter/body.
- `data/SiteConfig.js` — site metadata, menu links, theme color, Google tag ID. Edit this rather than hardcoding in components.
- `data/{projects,publications,quotes,speaking}.js` — curated lists imported directly by page components. A project with a `repo` field shows its GitHub star count (from 5 up) on the home page; `data/github.json` holds the counts and `scripts/sync-github.js` refreshes it before every `npm run build` (npm `prebuild`), keeping the old file if GitHub is unreachable.

### Runtime structure

- `src/context/ThemeContext.js` — exports `ThemeProvider` and `useTheme`. Provides `dark`, `notFound`, `toggleDark`, `setNotFound`, `setFound`. Dark mode is persisted in `localStorage` under the `dark` key. `gatsby-browser.js` and `gatsby-ssr.js` both wrap the root with `ThemeProvider` — keep them in sync.
- `src/layout/index.js` — root layout consumed by every template.
- `src/templates/{post,page,tag,category}.js` — receive their `slug`/`tag`/`category` via Gatsby page context (see `gatsby-node.js`).
- `src/pages/*.js` — standalone routes (`index`, `blog`, `categories`, `tags`, `404`). Don't add markdown-driven pages here; add them as `content/pages/*.md` with `template: page`.
- `src/styles/` — Sass entry is `main.scss`, with `base/` (variables, mixins, globals, reset), `components/`, and `themes/dark.scss`. The `components/new-moon.scss` file is the PrismJS code theme.

### Conventions

- 2-space indent, JS/JSX. Components and context files use PascalCase (`NewsletterForm.js`, `ThemeContext.js`); routes, utilities, and Sass partials use lowercase/kebab-case (`src/pages/blog.js`, `src/styles/components/new-moon.scss`).
- ESLint extends `airbnb` with a long list of project-specific React/a11y rules disabled (see `.eslintrc.json` — `react/prop-types`, `jsx-filename-extension`, several `jsx-a11y` rules are off by design).
- New post slugs must be lowercase, hyphen-separated, and match the `slug` frontmatter field.

### Deploys

**Cloudflare Pages** (primary). Project `ahmed-ibrahim` on the ahmed.ibrrahhim@gmail.com Cloudflare account, serving `ahmed-ibrahim.com` + `www` (both CNAME → `ahmed-ibrahim.pages.dev`, proxied; DNS zone is on the same account). Moved off Vercel in Sep 2026 after the Vercel project was paused.

It's a **direct-upload** project — no Git integration, so pushing to `master` does **not** deploy. To ship:

```sh
npm run build && npx wrangler pages deploy public --project-name ahmed-ibrahim --branch master
```

- `--branch master` makes it a production deploy; any other branch name gives a preview URL.
- Wrangler must be logged in (`npx wrangler whoami`; if not, the user runs `! npx wrangler login`).
- Don't pass `--force` and don't run `wrangler deploy` / `wrangler init`: newer wrangler tries to redirect Pages commands into a Workers setup that writes `wrangler.jsonc` and edits `package.json`/`.gitignore`. If a `wrangler.jsonc` shows up, delete it — its presence breaks `pages deploy`.
- `.nvmrc` pins Node 22.
- DNS: wrangler's OAuth login only gets `zone:read`, and the Cloudflare MCP plugin token can't write DNS or Pages. DNS changes need the dashboard or a user-provided API token with Zone:DNS:Edit.

### Voice assistant on the site (`src/components/AgentDock/`, `functions/api/token.js`)

The hero shows a pixel orb (`PixelOrb.js`: an audio-reactive orb of pixels on plain canvas 2D, no shader and nothing in the middle) with a handwritten "Click to talk to me" hint and arrow. The state is shown below it, with the conversation in one fixed-size speech bubble so streaming text never shifts the layout (short windows use the docked card instead). It travels to a corner dock on scroll and opens a conversation with the agent in `agent/`. `gatsby-browser.js` and `gatsby-ssr.js` mount `AgentDock` at the root (keep them in sync) so a session survives page changes; `AgentSlot` in `src/pages/index.js` marks the hero spot. The realtime client (`voiceSession.js`) loads only on the first click.

- `functions/api/token.js` is a Cloudflare Pages Function. It needs `LIVEKIT_URL`, `LIVEKIT_API_KEY`, `LIVEKIT_API_SECRET` as Pages secrets (`npx wrangler pages secret put NAME --project-name ahmed-ibrahim`, values from `agent/.env.local`; never commit them). It checks the Origin, allows 5 tokens per IP per 10 minutes, and ignores any room or agent the client asks for. Optional hard limits: `TURNSTILE_SECRET` and a Cloudflare rate-limiting rule on `/api/token`. Local test: put the three values in `.dev.vars` (git-ignored) and run `npx wrangler pages dev public`.
- Every failure (blocked or missing mic, offline, rate limit, dropped connection, agent not answering) shows its own message in the panel; they live in `ENDINGS` in `AgentDock/index.js`. Add a case there when you add a new way to fail.
- The agent drives the page through a `navigate` RPC, which `voiceSession.js` handles for same-site paths only.
- **Never show the realtime platform's name to visitors** (UI text, the agent's speech, shipped comments). If asked how it is built, the answer is that Ahmed builds voice agents and can build one for them. The agent's knowledge is rewritten for this in `agent/scripts/sync_knowledge.py`.
- Build with Node 22 (`.nvmrc`); the build has also been run on Node 24 without trouble.

### Voice agent (`agent/`)

LiveKit Agents (Python) site assistant, deployed to LiveKit Cloud separately from the site. Deploy with `cd agent && ./deploy.sh` (rebuilds the agent's knowledge from `content/*.md` first). Everything about it (project, dispatch name, secrets policy, cold starts, deployment log) is in `agent/DEPLOYMENT.md`; update its log table on every deploy. This repo is public: `agent/.env*` and `agent/livekit.toml` are git-ignored, so never commit credentials and keep the agent's instructions limited to facts already public on the site.

Legacy/unused: `netlify.toml` (old Netlify config) and `build:gh` (GitHub Pages via `--prefix-paths`, only meaningful with a non-empty `pathPrefix` in `data/SiteConfig.js`).

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run develop` — start the Gatsby dev server (prefer this over `npm run dev`, which shells out to Yarn).
- `npm run build` — production build into `public/`. Netlify deploys from this; `netlify.toml` overrides locally with `yarn run build`.
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
- `data/{projects,publications,quotes,speaking}.js` — curated lists imported directly by page components.

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

Netlify (primary, see `netlify.toml`) builds from `master`. `build:gh` is the GitHub Pages fallback path and uses `--prefix-paths` — only meaningful if `data/SiteConfig.js` has a non-empty `pathPrefix`.

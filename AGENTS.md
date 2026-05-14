# Repository Guidelines

## Project Structure & Module Organization
This repository is a Gatsby personal site. Core app code lives in `src/`: route files in `src/pages`, reusable UI in `src/components`, page templates in `src/templates`, shared config/context in `src/utils` and `src/context`, and Sass in `src/styles`. Markdown content is stored in `content/posts` and `content/pages`; related thumbnails and images live under `content/thumbnails` and `content/images`. Site metadata and curated lists live in `data/`. Gatsby entry points such as `gatsby-config.js` and `gatsby-node.js` stay at the repo root.

## Build, Test, and Development Commands
Install dependencies with `npm install`.

- `npm run develop` starts the Gatsby dev server.
- `npm run build` creates the production build in `public/`.
- `npm run serve` serves the built site locally.
- `npm run clean` removes `public/` and `.cache/`.
- `npm run lint:js` runs ESLint on all `.js` and `.jsx` files.
- `npm run lint:md` checks Markdown in `content/posts/`.
- `npm run format:js` formats JavaScript with Prettier.

Prefer `npm run develop` over `npm run dev`; the `dev` alias shells out to Yarn.

## Coding Style & Naming Conventions
Use 2-space indentation in JavaScript and Sass. Components and context files use PascalCase, for example `NewsletterForm.js` and `ThemeContext.js`. Route files, utility modules, and Sass partials use lowercase or kebab-case, for example `src/pages/blog.js` and `src/styles/components/new-moon.scss`. ESLint extends Airbnb with project-specific React and accessibility relaxations; Stylelint uses `stylelint-config-standard`.

## Testing Guidelines
There is no dedicated automated test suite in this repository today. Treat `npm run lint:js`, `npm run lint:md`, and a full `npm run build` as the minimum validation for every change. For UI or content updates, also smoke-test the affected page in `gatsby develop`.

## Content & Frontmatter
Posts are Markdown files in `content/posts/` with frontmatter such as `date`, `title`, `template`, `thumbnail`, `slug`, `categories`, and `tags`. Follow the existing slug style: lowercase words separated by hyphens.

## Commit & Pull Request Guidelines
Recent commits use short, descriptive subjects such as `Update years of c` and `Bump moment from 2.29.2 to 2.29.4`. Keep subjects imperative and concise, ideally under 72 characters. Pull requests should describe the change, list validation performed, link any related issue, and include screenshots for visible layout or theme changes.

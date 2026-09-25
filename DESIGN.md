# Ahmed Ibrahim — personal site

## Direction

Simple, clean, personal. Warm white, charcoal type, and restrained orange voice details. The pixel portrait is drawn from Ahmed’s own photos; keep natural adult proportions and thin navy glasses. No oversized mascot, photo mosaic, gradients, or dashboard styling.

The homepage keeps the personal tagline as a small, tilted two-line side note on wide screens. An experience strip, three short Voice AI focus areas, project categories and descriptions, and a fuller personal introduction add substance without adding decorative panels. Experience details come from the existing About page.

The About page uses a large real portrait and an editorial introduction, then four anchored chapters: story, work, tools, and beyond work. Career entries use native details/summary elements, with the latest role open initially. Keep the original career facts and personal interests; all pixel illustrations remain static.

## System

- `src/styles/components/layout.scss` owns layout, responsive rules, motion, and light/dark tokens.
- DM Sans for text; IBM Plex Mono only for small technical notes and code.
- Content width: 1088px; article width: 790px. Mobile gutters: 24px.
- Light: paper `#fffefd`, ink `#222329`, muted `#686974`, line `#e3e2df`, accent `#bc4019`.
- Dark: paper `#191b1e`, ink `#f1eee8`, muted `#acaeb4`, line `#383b40`, accent `#ff966d`.
- Fine rules, open lists, modest type weights, and generous spacing. Orange is an accent, not a large background fill.

## Motion and interaction

The introduction enters in a short stagger. Its underline draws once. The waveform animates only when requested and has a pause control; it does not record or play audio. The Listen / Understand / Respond buttons explain the voice pipeline. Long articles have a thin reading-progress line where CSS scroll timelines are supported, plus a keyboard-accessible return-to-top link. All motion respects `prefers-reduced-motion`.

Use native CSS and React state; no animation dependency is needed. Keep interactions keyboard accessible, with visible focus styles. Articles remain readable without client JavaScript. The theme preference is optional local storage and must not prevent rendering when storage is unavailable.

Five static pixel portraits connect Ahmed to each subject: headset for Voice AI, laptop for projects, notebook for writing, a wave for About, and an envelope for Contact. These are decorative images, not interactive controls. Do not animate faces, hands, props, portraits, or their speech bubbles.

## Content and validation

Markdown remains the source of truth for articles. Preserve existing slugs, tags, categories, images, RSS, and sitemap. Keep genuine profile photos on the about page and article bylines.

Run `npm run lint:js`, `npm run lint:md`, `npm run build`, and `node scripts/check-build.cjs`. Smoke-test the homepage interactions, theme persistence, article search, article/code rendering, archives, about, contact, and 404 in Gatsby develop, at desktop and mobile widths.

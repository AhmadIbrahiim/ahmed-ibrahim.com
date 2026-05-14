# DESIGN.md

Source of truth for ahmed-ibrahim.com visual system. Reference path: `~/.gstack/projects/AhmadIbrahiim-ahmed-ibrahim.com/designs/whole-site-20260513/finalized.html`.

## Direction

Brutalist editorial × terminal voice. Reads as a senior engineer's site — confident, dense, content-first. No gradients, no shadows, no rounded corners. One electric accent.

## Tokens

### Color

| Token         | Value     | Use                                              |
| ------------- | --------- | ------------------------------------------------ |
| `--paper`     | `#FFFFFF` | Page background                                  |
| `--paper2`    | `#F8F6F0` | Featured-essay surround, alt block backgrounds   |
| `--ink`       | `#000000` | Body text, all borders, hard rules               |
| `--ink2`      | `#1A1A1A` | Body prose on cards, secondary text on light     |
| `--muted`     | `#666666` | Metadata, labels, dates, sub-text                |
| `--acid`      | `#BFFF00` | Single accent — pills, hover bg, code highlights |
| `--rule-soft` | `#00000033` | Dashed dividers between list rows              |

Footer inverts to `--ink` background with `--paper` text and `--acid` for highlights.

### Type

| Family           | Source        | Use                                                       |
| ---------------- | ------------- | --------------------------------------------------------- |
| Archivo Black    | Google Fonts  | Display only — giant hero name, featured-essay heading    |
| JetBrains Mono   | Google Fonts  | Body default, labels, metadata, dates, code blocks        |
| Inter (400–700)  | Google Fonts  | Sans-serif accents — h3 in cards, body in featured essay  |

Sizes:

- Display (hero name): `clamp(56px, 11vw, 168px)`, weight 900, line-height 0.85, letter-spacing −0.045em
- Section H3 (NOW heading, featured essay body): 22px sans, weight 700
- Featured essay display: 30px Archivo Black, line-height 0.95
- Body: 13.5–15px (mono base, sans inside cards)
- Labels: 11px uppercase, letter-spacing 0.1em
- Code: 12.5px mono in 22px padded block, black bg, white text, acid green strings + cyan/pink keywords

### Spacing

Base unit: 4px. Common rhythms:

- Cell padding: `22px 28px`
- Hero text padding: `28px 32px 24px`
- Featured essay outer: `24px 28px`
- Section dividers: 1px solid `--ink`
- Row dividers inside cards: 1px dashed `--rule-soft`

### Borders & shape

- All borders: 1.5px solid `--ink` (frame), 1px solid `--ink` (rules)
- Border radius: **0** everywhere — no rounded corners
- Drop shadows: **none**
- Photo: grayscale + contrast 1.05

### Accent rules

- Acid `#BFFF00` is the only color besides black/white/gray
- Used as: meta pill backgrounds, blockquote backgrounds, code-block string syntax, `:hover` text background, single dot on the hero name period
- Footer uses acid for label color and link hover
- Never use acid for borders or large fills (it'd dominate)

## Components

### Hero (`hero`)

Two-column: grayscale portrait left (240px fixed) + content right.
Content: tiny kicker (11px muted caps), giant display name with acid-period, role paragraph (max 600px wide), stack line (`Stack · Node.js · TypeScript · ...` middot-separated, muted with bold names).

### Stats strip (`sub-meta`)

Three inline stat cells separated by 1px black borders. Each: `<strong>10+ yrs</strong> shipping software`. Compact — 10px vertical padding.

### Section grid (`grid`)

1-column or 2-column cells with hard borders. Each cell has a `cell-label` (11px caps, muted) and content. Cells with `.full` class span the full row.

### NOW

Sans h3 + mono body paragraph + "Open to senior IC roles" link with ▲ prefix and 1.5px underline.

### Writing list (`writing-grid`)

2×2 grid of compact post rows. Each row: 28px squared thumbnail (1.5px ink border) · sans-bold title (13.5px) · mono date (10.5px muted). Hover: title gets acid background.

### Featured essay (`article-row`)

Off-paper2 surround, white inner panel with 1.5px ink border. Left column (240px): meta panel with display-title (TypeScript Decorators.) + key/value info + black "Open full" pill. Right column: sans body with mono inline code, acid blockquote, black-bg code block with acid-green strings.

### Work strip (`work`)

Four projects in a horizontal grid, separated by dashed verticals. Each: sans-bold name + acid pill (mono 10px caps).

### Footer

Black background, two cells, acid labels, white links with translucent underlines that turn acid on hover.

## Responsive

Breakpoint: 880px.

- Hero collapses to single column (photo on top, 220px tall)
- Grid cells stack
- Work strip becomes 2×2
- Writing list becomes single column
- Stats: 2 cells per row
- Footer single column

## Don't

- Don't add a second accent color (cyan, blue, etc.) — it dilutes the acid
- Don't add rounded corners on cards/buttons
- Don't add box shadows (defeats the hard-bordered identity)
- Don't use gradients
- Don't change the grayscale on the portrait — color reads as a generic LinkedIn photo
- Don't add emoji as decorative elements (chips are fine for project tiles since they're functional, but not as section dividers or hero ornaments)
- Don't replace JetBrains Mono with a different mono — it's the voice

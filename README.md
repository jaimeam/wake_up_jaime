# Wake Up Jaime

A retro CRT terminal personal website. Black screen, phosphor-green text, blinking cursor, typewriter output, and keyboard-driven navigation.

**Live site:** https://jaimeam.github.io/wake_up_jaime/

Built with vanilla TypeScript and CSS. No frameworks, no runtime dependencies.

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

This starts esbuild in watch mode with sourcemaps. Open `index.html` in a browser, or serve it:

```bash
npx serve .
```

Then visit `http://localhost:3000`.

### Production Build

```bash
npm run build
```

Outputs a minified bundle to `dist/bundle.js` (~7KB gzipped).

### Type Checking

```bash
npm run typecheck
```

Runs TypeScript in strict mode. This should pass cleanly before every commit.

## Pre-Commit Checklist

Before committing, run both:

```bash
npm run typecheck    # Must pass with zero errors
npm run build        # Must produce dist/bundle.js without errors
```

## Project Structure

```
index.html              Single-page HTML shell
styles/
  reset.css             Minimal CSS reset
  terminal.css          Terminal styles, colors, cursor, responsive design
  crt-effects.css       Scanlines, vignette, flicker, glitch, text glow
scripts/
  main.ts               State machine, boot sequence, command dispatch
  typewriter.ts          Character-by-character typing engine
  input.ts              Keyboard input handling, menu buttons
  router.ts             Hash-based URL routing
  transitions.ts        Glitch transition effects
content/
  site.json             All site content as JSON (single source of truth)
  sections.ts           TypeScript types + JSON import + tree traversal helpers
dist/
  bundle.js             Built output (gitignored)
.github/
  workflows/
    deploy.yml          GitHub Pages deployment workflow
SPEC.md                 Full design specification
CLAUDE.md               Agent/developer guide
```

## How It Works

The site is a finite state machine: `boot → typing → waiting_input → transitioning`.

- **Boot sequence** scrolls fake POST/startup logs, then clears
- **Welcome** types out an ASCII banner and tagline
- **Menu** shows numbered options; users type a number or keyword and press Enter
- **Sections** type out their content, then offer navigation back

Users can also click/tap menu items directly (mobile-friendly). Hash routing (`#about`, `#projects/project-terminal`) enables deep links and back/forward navigation.

## Customizing Content

All content lives in `content/site.json` — a single JSON file that is the source of truth for everything. `content/sections.ts` provides TypeScript types and tree traversal helpers.

- **Sections** — `sections` array in `site.json`
- **Boot lines** — `boot.lines` in `site.json`
- **Welcome message** — `welcome` in `site.json`
- **Easter eggs** — `easterEggs` object in `site.json`

The main menu is auto-generated from top-level entries in the `sections` array — no separate menu config to maintain. To add a new section, just add an object with `id`, `commands`, `title`, and `content` to the `sections` array. Children can be nested to arbitrary depth.

## Customizing Appearance

- **Colors:** CSS custom properties in `styles/terminal.css` (`:root` block)
- **CRT effects:** `styles/crt-effects.css` — scanlines, vignette, flicker, glitch
- **Typing speed:** Constants at the top of `scripts/typewriter.ts`
- **Font:** VT323 loaded from Google Fonts in `index.html`

## Accessibility

- Screen reader support via `aria-live` region with instant text
- Menu items are semantic `<button>` elements
- `prefers-reduced-motion` disables all animations
- `<noscript>` fallback renders full content without JavaScript
- Skip-to-content link for keyboard navigation
- Color contrast ratio ~10:1 (passes WCAG AAA)

## Deployment

The site deploys automatically to GitHub Pages via `.github/workflows/deploy.yml` on push to `main`.

For manual deployment to other static hosts:

- **Vercel:** `npx vercel`
- **Netlify:** drag-and-drop the project folder, or connect the repo

Make sure `dist/bundle.js` is built before deploying (`npm run build`).

## License

ISC

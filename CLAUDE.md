# CLAUDE.md — Agent & Developer Guide

## Project Overview

Cyberpunk CRT terminal personal website. Vanilla TypeScript + CSS, no frameworks. The entire site is a finite state machine that types content character-by-character into a simulated retro terminal.

See `SPEC.md` for the full design spec (vision, interaction design, accessibility requirements, performance budgets).

## Quick Reference

```bash
npm install          # Install dependencies (esbuild, typescript)
npm run build        # Bundle TS → dist/bundle.js (minified, ~7KB gzip)
npm run dev          # Watch mode with sourcemaps
npm run typecheck    # Run tsc --noEmit (strict mode)
```

## Pre-Commit Checks

Run these before every commit. Both must pass with zero errors:

```bash
npm run typecheck    # TypeScript strict type checking
npm run build        # Ensure the bundle compiles cleanly
```

There are no tests yet. If tests are added, run them too.

## Architecture

```
index.html              ← Single-page HTML shell (entry point, served directly)
styles/
  reset.css             ← Minimal CSS reset
  terminal.css          ← Core terminal styles, colors, cursor, responsive
  crt-effects.css       ← Scanlines, vignette, flicker, glitch, glow
scripts/
  main.ts               ← Entry point. State machine, boot, command dispatch
  typewriter.ts          ← Character-by-character typing engine
  input.ts              ← Hidden input element, mirror display, menu buttons
  router.ts             ← Hash-based URL routing (#about, #projects/foo)
  transitions.ts        ← Glitch CSS transition between sections
content/
  site.json             ← ALL site content as JSON (single source of truth)
  sections.ts           ← TypeScript types + JSON import + tree traversal helpers
dist/
  bundle.js             ← Built output (gitignored)
```

**Build pipeline:** esbuild bundles `scripts/main.ts` (which imports everything) into a single `dist/bundle.js`. No CSS processing — CSS files are loaded directly by `index.html`.

## Key Concepts

### State Machine (`scripts/main.ts`)
The app has four phases: `boot → typing → waiting_input → transitioning`. The `state` object tracks the current phase, current section ID, and navigation history stack.

### Content Model (`content/site.json` + `content/sections.ts`)
All content lives in `content/site.json` — a single JSON file that is the source of truth for boot text, welcome screen, sections, and easter eggs. `content/sections.ts` imports the JSON at build time, applies TypeScript types, and exports helpers for recursive tree traversal.

Each content block has a type (`text`, `ascii`, `link`, `divider`), optional style (`dim`, `bright`, `error`, `accent`), and optional typing speed override.

**To add/edit content: modify `content/site.json`.** The main menu is auto-generated from the top-level entries in the `sections` array — no separate `MENU_OPTIONS` to maintain. Children can be nested to arbitrary depth and navigation adapts automatically.

**Important:** Do NOT use large ASCII art banners (block characters, box-drawing headers, etc.). They break on mobile/narrow screens and are unreadable. Use simple text headers with `style: "bright"` and single-line dividers instead.

### Typewriter Engine (`scripts/typewriter.ts`)
Types text character-by-character with configurable speed, random jitter, and punctuation pauses. Respects `prefers-reduced-motion` (shows text instantly). Users can skip by pressing any key or clicking.

### Routing (`scripts/router.ts`)
Hash-based: `#about`, `#projects/project-terminal`. Deep links work — the boot sequence is skipped and the target section loads directly. Navigation updates the hash via `history.replaceState`.

## Style & Conventions

- **TypeScript strict mode** is enabled. All types must be explicit at module boundaries.
- **No frameworks or runtime dependencies.** Only devDependencies (esbuild, typescript).
- **CSS custom properties** for all colors — defined in `:root` in `terminal.css`.
- **Color tokens:** `--bg: #0a0a0a`, `--fg: #00ff41`, `--fg-dim: #00aa2a`, `--fg-error: #ff0040`, `--fg-accent: #00d4ff`.
- **Font:** VT323 from Google Fonts, loaded in `index.html`.
- Keep the bundle small. Performance budget: JS < 30KB gzip, CSS < 10KB gzip, font < 20KB.

## Accessibility

- `#aria-live-region` (sr-only, `aria-live="polite"`) receives full text instantly during typewriter animations.
- Menu options are `<button>` elements for keyboard/screen-reader access.
- `prefers-reduced-motion: reduce` disables all animations (typing, CRT flicker, glitch, scanlines).
- `<noscript>` block in `index.html` renders all content statically.
- Skip-to-content link is present.

## Common Tasks

### Add a new top-level section
1. Add a new object to the `sections` array in `content/site.json`
2. Give it a unique `id`, `commands` (first entry becomes the menu key), `title`, and `content`
3. The main menu and state machine pick it up automatically — no other file needs editing

### Add a new subsection (project, blog post, etc.) at any depth
1. Add a `children` array to any section in `content/site.json` (or append to an existing one)
2. Give each child `id`, `commands`, `title`, and `content`
3. Children can themselves have `children` — nesting depth is unlimited
4. Navigation, hash routing, and back buttons adapt automatically
5. `backLabel` is optional — defaults to "BACK TO {parent title}"

### Add a new easter egg
1. Add an entry to the `easterEggs` object in `content/site.json`
2. The command processor in `main.ts` checks this map automatically

### Change colors/effects
- Colors: edit CSS custom properties in `styles/terminal.css` `:root`
- CRT effects: edit `styles/crt-effects.css`
- Typing speed: edit constants at top of `scripts/typewriter.ts`

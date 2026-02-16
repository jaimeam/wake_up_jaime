# Cyberpunk Terminal Personal Website — Technical Spec

## 1. Vision

A personal website that looks and behaves like a retro CRT terminal. Black screen, phosphor-green text, blinking cursor, typewriter output, and keyboard-driven navigation. The entire experience is a conversation between the visitor and the "system."

**References & inspiration:** Fallout terminal UI, cool-retro-term, old BBS/MUD interfaces, the Matrix "wake up Neo" sequence, `htop` / `ncurses` aesthetics.

-----

## 2. Core Experience Flow

```
[BOOT SEQUENCE] → [WELCOME MESSAGE] → [MAIN MENU PROMPT] → [SECTION CONTENT] → [BACK TO MENU]
```

### 2.1 Boot Sequence (optional, skippable)

- 1–3 seconds of fast-scrolling fake POST/startup logs
- Lines like `LOADING KERNEL...`, `INITIALIZING NEURAL LINK...`, `MEMORY CHECK: 640K OK`
- Ends with a brief pause, then clears screen

### 2.2 Welcome Message

- Typed out character-by-character
- Contains: name/alias, one-liner tagline, ASCII art logo (optional)
- After typing completes → show menu prompt

### 2.3 Main Menu Prompt

```
> SELECT AN OPTION:
  [1] ABOUT
  [2] PROJECTS
  [3] WRITING
  [4] CONTACT
  [5] CREDITS

> _
```

- User types a number and presses Enter (desktop)
- User can also click/tap an option directly (mobile fallback)
- Invalid input → error message like `ERR: UNRECOGNIZED COMMAND. TRY AGAIN.`

### 2.4 Section Content

- Screen clears (with optional glitch transition)
- New content types out
- At the bottom: `[0] BACK TO MAIN MENU` or `> PRESS 0 TO RETURN`

### 2.5 Sub-navigation (if needed)

- Sections like PROJECTS can list items, each selectable by number
- Keeps the same interaction pattern recursively

-----

## 3. Visual Design

### 3.1 Typography

- **Font:** Monospace only. Candidates:
  - `IBM Plex Mono` (clean, good Unicode support)
  - `Fira Code` (ligatures for code sections)
  - `VT323` (Google Font, authentic terminal look)
  - `Share Tech Mono` (slightly futuristic)
- **Size:** 16–18px base, responsive down to 14px on mobile
- **Color palette:**
  - Background: `#0a0a0a` (not pure black — avoids OLED harshness)
  - Primary text: `#00ff41` (phosphor green)
  - Dimmed text: `#00aa2a` (for already-typed content, timestamps)
  - Error text: `#ff0040` (for invalid input feedback)
  - Cursor: `#00ff41` with blink animation
  - Accent (optional): `#00d4ff` (cyan, for links or highlights)

### 3.2 CRT Effects (CSS/shader)

- **Scanlines:** horizontal semi-transparent lines via CSS `repeating-linear-gradient`, low opacity (0.03–0.06)
- **Screen curvature:** subtle `perspective` + `rotateX/Y` or a CSS `border-radius` trick on the outer container
- **Vignette:** radial gradient overlay darkening edges
- **Flicker:** CSS animation that subtly varies `opacity` (0.97–1.0) at random intervals
- **Text glow:** `text-shadow: 0 0 5px #00ff41` on the primary text color
- **Glitch effect:** on section transitions, brief CSS `clip-path` + `transform: translate` animation

### 3.3 Cursor

- Block cursor (`█`) or underscore (`_`), blinking at ~530ms interval
- Positioned after the last typed character
- During typewriter output: cursor leads the text
- During input: cursor follows user's typed characters

### 3.4 Screen Layout

```
┌──────────────────────────────────────────┐
│  ┌────────────────────────────────────┐  │  <- CRT bezel (optional)
│  │                                    │  │
│  │  [TYPED CONTENT AREA]              │  │
│  │                                    │  │
│  │                                    │  │
│  │  > _                               │  │  <- Input prompt, pinned to
│  │                                    │  │     bottom of content or viewport
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

- Max-width container: ~800px, centered
- Padding: generous (2–3rem) to simulate monitor bezel inset
- Content scrolls naturally; input prompt stays contextually at the end of content

-----

## 4. Interaction Design

### 4.1 Typewriter Effect

- **Base speed:** 30–60ms per character (configurable)
- **Variability:** ±20ms random jitter per character for organic feel
- **Punctuation pauses:** periods, commas, colons get an extra 80–150ms delay
- **Paragraph breaks:** 300–500ms pause
- **Skip mechanism:** clicking/tapping or pressing any key during typing instantly completes the current block (important UX — don't trap users)
- **Implementation:** `async function typeText(element, text, speed)` using `requestAnimationFrame` or `setTimeout` chain

### 4.2 Input Handling

- Hidden `<input>` element, always focused (on desktop)
- Keystrokes are mirrored to a visible `<span>` styled as terminal text
- On `Enter`: process the command
- On mobile: tap-to-focus the hidden input, or tap menu items directly
- Input is always a single line (no multiline needed)

### 4.3 Command Processing

```
"1", "about"       → navigate to ABOUT section
"2", "projects"    → navigate to PROJECTS section
"3", "writing"     → navigate to WRITING section
"4", "contact"     → navigate to CONTACT section
"0", "back"        → return to main menu
"help"             → re-display current options
"clear"            → clear screen, re-show current context
"secret"           → easter egg (optional)
```

- Accept both number and keyword (case-insensitive, trimmed)
- Unknown commands → `COMMAND NOT RECOGNIZED. TYPE "HELP" FOR OPTIONS.`

### 4.4 Transitions

1. User enters command → brief pause (100ms)
1. Screen content fades/glitches (200–400ms)
1. Screen clears
1. New content types out
1. Menu/prompt appears at the end

-----

## 5. Content Architecture

### 5.1 Data Model

All content lives in a single structured data file (JSON or TS object):

```typescript
interface TerminalSection {
  id: string;                    // "about", "projects", etc.
  command: string[];             // ["1", "about"] — accepted inputs
  title: string;                 // ASCII art or plain text header
  content: ContentBlock[];       // ordered content to type out
  children?: TerminalSection[];  // sub-items (e.g., individual projects)
}

interface ContentBlock {
  type: "text" | "ascii" | "link" | "divider";
  value: string;
  style?: "dim" | "bright" | "error" | "accent";
  typingSpeed?: "fast" | "normal" | "slow"; // override default
}
```

### 5.2 Sections

**ABOUT**

- Short personal bio, 2–3 paragraphs
- Can include inline ASCII art separator
- Tone: in-character (cyberpunk/hacker persona) or sincere — your call

**PROJECTS**

- List of projects, each selectable
- Each project detail page: name, description, tech stack, link
- Links open in new tab (styled as `> OPEN EXTERNAL LINK: [url]`)

**WRITING** (blog/articles)

- List of post titles with dates
- Each selectable to show content or redirect to external blog
- Consider: full posts typed out in-terminal vs. links to a separate blog

**CONTACT**

- Email (obfuscated or `mailto:` link)
- Social links (GitHub, LinkedIn, X, etc.)
- Links open in new tab

**CREDITS**

- Tech stack used
- Inspirations
- Easter egg hint

-----

## 6. Technical Stack

### 6.1 Recommended Stack

|Layer      |Choice                          |Rationale                                    |
|-----------|--------------------------------|---------------------------------------------|
|Framework  |**Astro** or **plain HTML/TS**  |Minimal JS needed; Astro gives SSR for SEO   |
|Language   |**TypeScript**                  |Type safety for the state machine and content|
|Styling    |**Plain CSS** (no framework)    |Full control over CRT effects, no bloat      |
|Font       |**VT323** (Google Fonts)        |Authentic CRT look, self-hostable            |
|Hosting    |**Vercel** or **Netlify**       |Free tier, instant deploys, good for static  |
|Audio (opt)|**Tone.js** or raw Web Audio API|For keystroke/ambient sounds                 |

### 6.2 Why Not React/Vue/Svelte?

You *can* use them, but the DOM interactions here are fundamentally imperative (type this character, then the next, then wait…). A reactive framework adds overhead without much benefit.

### 6.3 Alternative: Go Full Vanilla

A single `index.html` + `terminal.ts` + `styles.css` with no build step is entirely viable here and aligns with the punk ethos. Keeps it fast and dependency-free.

-----

## 7. State Management

### 7.1 State Machine

The app is a finite state machine:

```
BOOT → WELCOME → MENU → SECTION → [SUB_SECTION] → MENU
                   ↑___________________________________|
```

```typescript
interface TerminalState {
  phase: "boot" | "typing" | "waiting_input" | "transitioning";
  currentSection: string;      // "menu", "about", "projects", etc.
  history: string[];            // breadcrumb for back-navigation
  inputBuffer: string;          // current user-typed text
}
```

### 7.2 URL Hash Routing

- `#about`, `#projects`, `#projects/cool-thing`, `#contact`
- On load: if hash present, skip boot, jump to section (still type it out)
- On navigation: update hash silently via `history.replaceState`
- Enables shareable deep links without breaking the terminal metaphor

-----

## 8. Accessibility

### 8.1 Requirements

- All typed content is immediately present in the DOM (with `aria-live="polite"` region), even if visually it appears character-by-character. Use a hidden div that gets the full text instantly.
- Menu options are `<button>` elements under the hood, reachable via Tab.
- `prefers-reduced-motion`: if set, disable all animations, show content instantly (no typewriter), disable CRT flicker/glitch.
- Skip-to-content link for screen readers.
- Semantic HTML: use `<main>`, `<nav>`, `<section>`, `<h1>`–`<h3>` in the actual DOM, visually hidden if needed.
- Color contrast: `#00ff41` on `#0a0a0a` = contrast ratio ~10:1 (passes AAA).

### 8.2 `<noscript>` Fallback

Render all content statically in a `<noscript>` block so the site is usable without JS (and crawlable).

-----

## 9. Mobile Strategy

### 9.1 Key Adaptations

- **No hidden input tricks on mobile.** Instead, show tappable menu items that *look* like terminal lines but are actual buttons.
- When a user taps an option, echo their "typed" command in the terminal for visual consistency.
- Virtual keyboard should NOT appear unless user explicitly taps an input area.
- Font size: minimum 14px, comfortable at 16px. No zooming tricks.
- CRT bezel: remove or minimize on small screens.

### 9.2 Breakpoints

- `> 768px`: full desktop experience with keyboard input
- `≤ 768px`: tap-driven navigation, simplified CRT effects (scanlines and glow only, no curvature)

-----

## 10. Performance Budget

|Metric         |Target     |
|---------------|-----------|
|First paint    |< 500ms    |
|Total JS       |< 30KB gzip|
|Total CSS      |< 10KB gzip|
|Font           |< 20KB     |
|LCP            |< 1.0s     |
|No layout shift|CLS = 0    |

-----

## 11. Optional Enhancements (Post-MVP)

1. **ASCII art name banner** — high impact, easy
2. **Boot sequence** — high impact, easy
3. **Sound effects** — medium impact, medium effort
4. **Easter eggs** — hidden commands like `sudo`, `rm -rf /`, `matrix`
5. **Theme switcher** — `color amber`, `color blue`
6. **Visitor counter** — fake or real
7. **"Hack" minigame** — Fallout-style word puzzle
8. **Ambient CRT hum** — subtle background audio loop
9. **Custom 404 page** — `SEGMENTATION FAULT. SECTOR NOT FOUND.`
10. **Print stylesheet** — green-on-white for printing

-----

## 12. File Structure

```
terminal-site/
├── index.html
├── styles/
│   ├── reset.css
│   ├── terminal.css
│   └── crt-effects.css
├── scripts/
│   ├── main.ts
│   ├── typewriter.ts
│   ├── input.ts
│   ├── router.ts
│   ├── transitions.ts
│   └── audio.ts
├── content/
│   └── sections.ts
├── assets/
│   ├── fonts/
│   └── audio/
└── public/
    ├── favicon.ico
    └── og-image.png
```

-----

## 13. Development Phases

### Phase 1 — Core Shell
- HTML structure with terminal container
- CSS: black background, green text, font, cursor blink
- Typewriter function that takes a string and types it out
- Basic "hello world" typed on load

### Phase 2 — Navigation
- State machine implementation
- Menu rendering and input handling
- Command parsing (numbers + keywords)
- Screen clear + new content flow
- Hash routing

### Phase 3 — Content & Polish
- All section content written and structured
- CRT effects (scanlines, glow, vignette, flicker)
- Glitch transitions between sections
- Mobile tap-to-navigate fallback
- `prefers-reduced-motion` support

### Phase 4 — Enhancements
- Boot sequence
- ASCII art
- Easter eggs
- SEO (meta tags, `<noscript>`, OG image)
- Accessibility audit
- Deploy

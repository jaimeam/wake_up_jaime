// ── Data Model ──────────────────────────────────────────

export interface ContentBlock {
  type: "text" | "ascii" | "link" | "divider";
  value: string;
  href?: string;
  style?: "dim" | "bright" | "error" | "accent";
  typingSpeed?: "fast" | "normal" | "slow";
}

export interface TerminalSection {
  id: string;
  commands: string[];
  title: string;
  content: ContentBlock[];
  children?: TerminalSection[];
  backLabel?: string;
}

// ── Constants ───────────────────────────────────────────
// NOTE: Avoid large ASCII art banners — they break on narrow
// mobile screens and are not readable. Use short text headers
// or single-line separators instead.

const DIVIDER = "════════════════════════════════════════════════════";

// ── Boot Lines ──────────────────────────────────────────

export const BOOT_LINES: string[] = [
  "POST INIT v3.7.2 ...",
  "BIOS DATE: 12/19/87  VER: 1.01",
  "MEMORY CHECK: 640K OK",
  "EXTENDED MEMORY: 131072K OK",
  "LOADING KERNEL ................ DONE",
  "INITIALIZING NEURAL LINK ...... DONE",
  "DECRYPTING FILESYSTEM ......... DONE",
  "MOUNTING /dev/thoughts ........ DONE",
  "SCANNING NETWORK NODES ........ 7 FOUND",
  "VERIFYING ENCRYPTION KEYS ..... OK",
  "ESTABLISHING SECURE TUNNEL .... OK",
  "LOADING PERSONALITY MATRIX .... OK",
  "",
  "ALL SYSTEMS NOMINAL.",
  "WAKE UP, JAIME.",
  "",
];

// ── Welcome ─────────────────────────────────────────────

export const WELCOME_CONTENT: ContentBlock[] = [
  { type: "text", value: "" },
  { type: "text", value: "  W A K E   U P ,   J A I M E", style: "bright" },
  { type: "text", value: "" },
  { type: "divider", value: DIVIDER, style: "dim" },
  { type: "text", value: "" },
  {
    type: "text",
    value: "  SYSTEM ONLINE // SECURE CONNECTION ESTABLISHED",
    style: "dim",
  },
  {
    type: "text",
    value: "  Welcome, operator. Personal terminal loaded.",
  },
  {
    type: "text",
    value: "  Thoughts, projects, and experiments inside.",
  },
  { type: "text", value: "" },
  { type: "divider", value: DIVIDER, style: "dim" },
];

// ── Menu ────────────────────────────────────────────────

export const MENU_PROMPT: ContentBlock[] = [
  { type: "text", value: "" },
  { type: "text", value: "> SELECT AN OPTION:", style: "bright" },
  { type: "text", value: "" },
];

export const MENU_OPTIONS = [
  { key: "1", label: "ABOUT", sectionId: "about" },
  { key: "2", label: "PROJECTS", sectionId: "projects" },
  { key: "3", label: "WRITING", sectionId: "writing" },
  { key: "4", label: "CONTACT", sectionId: "contact" },
  { key: "5", label: "CREDITS", sectionId: "credits" },
];

// ── Sections ────────────────────────────────────────────

export const SECTIONS: TerminalSection[] = [
  {
    id: "about",
    commands: ["1", "about"],
    title: "ABOUT",
    content: [
      { type: "text", value: "  ABOUT // DOSSIER", style: "bright" },
      { type: "divider", value: "  ──────────────────────────────────", style: "dim" },
      { type: "text", value: "" },
      {
        type: "text",
        value:
          "  Handle:    JAIME",
      },
      {
        type: "text",
        value:
          "  Status:    ACTIVE",
        style: "bright",
      },
      {
        type: "text",
        value:
          "  Location:  Somewhere on the grid",
        style: "dim",
      },
      { type: "text", value: "" },
      { type: "divider", value: "  ──────────────────────────────────", style: "dim" },
      { type: "text", value: "" },
      {
        type: "text",
        value:
          "  I build things for the web and occasionally write about it.",
      },
      {
        type: "text",
        value:
          "  Software engineer by trade. I like digging into systems,",
      },
      {
        type: "text",
        value:
          "  understanding how things work beneath the surface, and",
      },
      {
        type: "text",
        value:
          "  building new things that feel like they've been around",
      },
      {
        type: "text",
        value:
          "  forever.",
      },
      { type: "text", value: "" },
      {
        type: "text",
        value:
          "  When I'm not writing code, I'm probably reading about",
      },
      {
        type: "text",
        value:
          "  computing history, tinkering with side projects, or",
      },
      {
        type: "text",
        value:
          "  staring into a terminal very much like this one.",
      },
      { type: "text", value: "" },
      { type: "divider", value: "  ──────────────────────────────────", style: "dim" },
      { type: "text", value: "" },
      {
        type: "text",
        value: "  SKILLS: TypeScript, Rust, Python, Systems Design",
        style: "dim",
      },
      {
        type: "text",
        value: "  INTERESTS: Open source, Optimization, Cybersecurity",
        style: "dim",
      },
      { type: "text", value: "" },
    ],
  },
  {
    id: "projects",
    commands: ["2", "projects"],
    title: "PROJECTS",
    content: [
      { type: "text", value: "  PROJECTS // PORTFOLIO", style: "bright" },
      { type: "divider", value: "  ──────────────────────────────────", style: "dim" },
      { type: "text", value: "" },
      { type: "text", value: "  Public repos from github.com/jaimeam:", style: "dim" },
      { type: "text", value: "" },
    ],
    children: [
      {
        id: "project-wake-up-jaime",
        commands: ["1", "wake_up_jaime"],
        title: "WAKE UP JAIME",
        backLabel: "BACK TO PROJECTS",
        content: [
          { type: "text", value: "  PROJECT: WAKE UP JAIME", style: "bright" },
          { type: "divider", value: "  ──────────────────────────────────", style: "dim" },
          { type: "text", value: "" },
          { type: "text", value: "  You're looking at it." },
          { type: "text", value: "" },
          {
            type: "text",
            value:
              "  A CRT-style retro personal website built with",
          },
          {
            type: "text",
            value:
              "  vanilla TypeScript, HTML, and CSS. No frameworks,",
          },
          {
            type: "text",
            value:
              "  no dependencies — just raw code and phosphor glow.",
          },
          { type: "text", value: "" },
          { type: "text", value: "  STACK: TypeScript, HTML, CSS, esbuild", style: "dim" },
          {
            type: "text",
            value: "  FEATURES: Typewriter engine, CRT shaders,",
            style: "dim",
          },
          {
            type: "text",
            value: "            State machine, Hash routing",
            style: "dim",
          },
          { type: "text", value: "" },
          {
            type: "link",
            value: "  > VIEW SOURCE ON GITHUB",
            href: "https://github.com/jaimeam/wake_up_jaime",
            style: "accent",
          },
          { type: "text", value: "" },
        ],
      },
      {
        id: "project-astra",
        commands: ["2", "astra"],
        title: "ASTRA",
        backLabel: "BACK TO PROJECTS",
        content: [
          { type: "text", value: "  PROJECT: ASTRA", style: "bright" },
          { type: "divider", value: "  ──────────────────────────────────", style: "dim" },
          { type: "text", value: "" },
          {
            type: "text",
            value:
              "  A Rust project currently in development.",
          },
          { type: "text", value: "" },
          { type: "text", value: "  STACK: Rust", style: "dim" },
          { type: "text", value: "" },
          {
            type: "link",
            value: "  > VIEW SOURCE ON GITHUB",
            href: "https://github.com/jaimeam/astra",
            style: "accent",
          },
          { type: "text", value: "" },
        ],
      },
      {
        id: "project-pyomo",
        commands: ["3", "pyomo"],
        title: "PYOMO SOLVER ANALYZER",
        backLabel: "BACK TO PROJECTS",
        content: [
          { type: "text", value: "  PROJECT: PYOMO SOLVER ANALYZER", style: "bright" },
          { type: "divider", value: "  ──────────────────────────────────", style: "dim" },
          { type: "text", value: "" },
          {
            type: "text",
            value:
              "  A constraint analysis and debugging toolkit for Pyomo.",
          },
          {
            type: "text",
            value:
              "  Provides tools for analyzing solver outputs, diagnosing",
          },
          {
            type: "text",
            value:
              "  infeasibility, and identifying binding constraints in",
          },
          {
            type: "text",
            value:
              "  linear optimization models.",
          },
          { type: "text", value: "" },
          { type: "text", value: "  STACK: Python, Pyomo", style: "dim" },
          { type: "text", value: "" },
          {
            type: "link",
            value: "  > VIEW SOURCE ON GITHUB",
            href: "https://github.com/jaimeam/Pyomo-Solver-Analyzer",
            style: "accent",
          },
          { type: "text", value: "" },
        ],
      },
      {
        id: "project-endorsa",
        commands: ["4", "endorsa"],
        title: "ENDORSA",
        backLabel: "BACK TO PROJECTS",
        content: [
          { type: "text", value: "  PROJECT: ENDORSA", style: "bright" },
          { type: "divider", value: "  ──────────────────────────────────", style: "dim" },
          { type: "text", value: "" },
          {
            type: "text",
            value:
              "  A social network for exclusive professional networking",
          },
          {
            type: "text",
            value:
              "  based on trustful relationships. Application back-end",
          },
          {
            type: "text",
            value:
              "  developed with Flask and SQLAlchemy.",
          },
          { type: "text", value: "" },
          { type: "text", value: "  STACK: Python, Flask, SQLAlchemy", style: "dim" },
          { type: "text", value: "" },
          {
            type: "link",
            value: "  > VIEW SOURCE ON GITHUB",
            href: "https://github.com/jaimeam/endorsa",
            style: "accent",
          },
          { type: "text", value: "" },
        ],
      },
    ],
  },
  {
    id: "writing",
    commands: ["3", "writing"],
    title: "WRITING",
    content: [
      { type: "text", value: "  WRITING // TRANSMISSION LOG", style: "bright" },
      { type: "divider", value: "  ──────────────────────────────────", style: "dim" },
      { type: "text", value: "" },
      { type: "text", value: "  Recent transmissions:", style: "dim" },
      { type: "text", value: "" },
    ],
    children: [
      {
        id: "post-1",
        commands: ["1"],
        title: "WHY I STILL USE A TERMINAL",
        backLabel: "BACK TO WRITING",
        content: [
          { type: "text", value: "  WHY I STILL USE A TERMINAL", style: "bright" },
          { type: "divider", value: "  ──────────────────────────────────", style: "dim" },
          { type: "text", value: "" },
          { type: "text", value: "  DATE: 2026.01.15  //  READ TIME: 5 MIN", style: "dim" },
          { type: "text", value: "" },
          {
            type: "text",
            value:
              "  There's something deeply satisfying about a blinking",
          },
          {
            type: "text",
            value:
              "  cursor on a dark screen. No distractions. No pop-ups.",
          },
          {
            type: "text",
            value:
              "  No notifications. Just you and the machine, talking in",
          },
          {
            type: "text",
            value:
              "  a language you both understand.",
          },
          { type: "text", value: "" },
          {
            type: "text",
            value:
              "  In an era of Electron apps and cloud IDEs, the humble",
          },
          {
            type: "text",
            value:
              "  terminal remains the most efficient interface ever",
          },
          {
            type: "text",
            value:
              "  designed. It's composable, scriptable, and honest.",
          },
          {
            type: "text",
            value:
              "  It doesn't lie about what it's doing.",
          },
          { type: "text", value: "" },
          {
            type: "text",
            value:
              "  Every morning I open tmux, split my panes, and feel",
          },
          {
            type: "text",
            value:
              "  like a pilot running pre-flight checks. The ritual",
          },
          {
            type: "text",
            value:
              "  matters. The interface is the experience.",
          },
          { type: "text", value: "" },
          { type: "text", value: "  END TRANSMISSION.", style: "dim" },
          { type: "text", value: "" },
        ],
      },
      {
        id: "post-2",
        commands: ["2"],
        title: "THE BEAUTY OF OLD CODE",
        backLabel: "BACK TO WRITING",
        content: [
          { type: "text", value: "  THE BEAUTY OF OLD CODE", style: "bright" },
          { type: "divider", value: "  ──────────────────────────────────", style: "dim" },
          { type: "text", value: "" },
          { type: "text", value: "  DATE: 2025.12.03  //  READ TIME: 4 MIN", style: "dim" },
          { type: "text", value: "" },
          {
            type: "text",
            value:
              "  I've been reading through the original Unix source",
          },
          {
            type: "text",
            value:
              "  code lately. Not because I need to — because I want",
          },
          {
            type: "text",
            value:
              "  to understand how the architects of our digital world",
          },
          {
            type: "text",
            value:
              "  thought about problems.",
          },
          { type: "text", value: "" },
          {
            type: "text",
            value:
              "  What strikes me most is the economy. Every line has",
          },
          {
            type: "text",
            value:
              "  purpose. There's no abstraction for abstraction's sake.",
          },
          {
            type: "text",
            value:
              "  No design patterns layered on top of each other like",
          },
          {
            type: "text",
            value:
              "  a digital archaeological dig site.",
          },
          { type: "text", value: "" },
          {
            type: "text",
            value:
              "  We could learn a lot from writing code as if bytes",
          },
          {
            type: "text",
            value:
              "  still mattered. Because in a way, they still do.",
          },
          { type: "text", value: "" },
          { type: "text", value: "  END TRANSMISSION.", style: "dim" },
          { type: "text", value: "" },
        ],
      },
      {
        id: "post-3",
        commands: ["3"],
        title: "BUILDING THIS TERMINAL",
        backLabel: "BACK TO WRITING",
        content: [
          { type: "text", value: "  BUILDING THIS TERMINAL", style: "bright" },
          { type: "divider", value: "  ──────────────────────────────────", style: "dim" },
          { type: "text", value: "" },
          { type: "text", value: "  DATE: 2026.02.10  //  READ TIME: 3 MIN", style: "dim" },
          { type: "text", value: "" },
          {
            type: "text",
            value:
              "  I wanted a personal site that felt like me. Not a",
          },
          {
            type: "text",
            value:
              "  polished portfolio with smooth gradients and hero",
          },
          {
            type: "text",
            value:
              "  sections — something that felt like booting into",
          },
          {
            type: "text",
            value:
              "  an old machine and finding a message waiting.",
          },
          { type: "text", value: "" },
          {
            type: "text",
            value:
              "  Vanilla TypeScript. No React. No Tailwind. Just a",
          },
          {
            type: "text",
            value:
              "  state machine, a typewriter engine, and some CSS",
          },
          {
            type: "text",
            value:
              "  tricks that make your screen look like a CRT.",
          },
          { type: "text", value: "" },
          { type: "text", value: "  END TRANSMISSION.", style: "dim" },
          { type: "text", value: "" },
        ],
      },
    ],
  },
  {
    id: "contact",
    commands: ["4", "contact"],
    title: "CONTACT",
    content: [
      { type: "text", value: "  CONTACT // OPEN CHANNEL", style: "bright" },
      { type: "divider", value: "  ──────────────────────────────────", style: "dim" },
      { type: "text", value: "" },
      {
        type: "text",
        value: "  Channels for communication:",
      },
      { type: "text", value: "" },
      {
        type: "link",
        value: "  > GITHUB:   github.com/jaimeam",
        href: "https://github.com/jaimeam",
        style: "accent",
      },
      { type: "text", value: "" },
      { type: "divider", value: "  ──────────────────────────────────", style: "dim" },
      { type: "text", value: "" },
      {
        type: "text",
        value: "  All channels monitored. Response time: < 24 hours.",
        style: "dim",
      },
      { type: "text", value: "" },
    ],
  },
  {
    id: "credits",
    commands: ["5", "credits"],
    title: "CREDITS",
    content: [
      { type: "text", value: "  CREDITS // ACKNOWLEDGMENTS", style: "bright" },
      { type: "divider", value: "  ──────────────────────────────────", style: "dim" },
      { type: "text", value: "" },
      { type: "text", value: "  BUILT WITH:", style: "bright" },
      { type: "text", value: "    TypeScript / HTML / CSS", style: "dim" },
      { type: "text", value: "    esbuild (bundler)", style: "dim" },
      { type: "text", value: "    VT323 (font by Peter Hull)", style: "dim" },
      { type: "text", value: "" },
      { type: "text", value: "  INSPIRED BY:", style: "bright" },
      { type: "text", value: "    Fallout terminal UI", style: "dim" },
      { type: "text", value: "    cool-retro-term", style: "dim" },
      { type: "text", value: "    Classic BBS/MUD interfaces", style: "dim" },
      { type: "text", value: '    The Matrix "wake up, Neo" sequence', style: "dim" },
      { type: "text", value: "    ncurses / htop aesthetics", style: "dim" },
      { type: "text", value: "" },
      { type: "text", value: "  PHILOSOPHY:", style: "bright" },
      { type: "text", value: "    No frameworks. No dependencies.", style: "dim" },
      { type: "text", value: "    Just code and phosphor glow.", style: "dim" },
      { type: "text", value: "" },
      { type: "divider", value: "  ──────────────────────────────────", style: "dim" },
      { type: "text", value: "" },
      {
        type: "text",
        value: '  HINT: Try typing "secret" at the prompt...',
        style: "dim",
      },
      { type: "text", value: "" },
    ],
  },
];

// ── Easter Eggs ─────────────────────────────────────────

export const EASTER_EGGS: Record<string, ContentBlock[]> = {
  secret: [
    { type: "text", value: "" },
    { type: "text", value: "  SECRET AREA UNLOCKED", style: "accent" },
    { type: "divider", value: "  ──────────────────────────────────", style: "dim" },
    { type: "text", value: "" },
    {
      type: "text",
      value: "  You found it. Not many do.",
    },
    { type: "text", value: "" },
    {
      type: "text",
      value: "  Fun fact: this entire site is a finite state machine.",
    },
    {
      type: "text",
      value: "  Every interaction — every keystroke — is a transition",
    },
    {
      type: "text",
      value: "  from one state to the next. Just like life, really.",
    },
    { type: "text", value: "" },
    {
      type: "text",
      value: "  Try the other hidden commands. There are a few more.",
      style: "dim",
    },
    { type: "text", value: "" },
  ],
  sudo: [
    { type: "text", value: "" },
    {
      type: "text",
      value: "  ACCESS DENIED.",
      style: "error",
    },
    { type: "text", value: "" },
    {
      type: "text",
      value: "  Nice try, operator. But root access requires",
      style: "error",
    },
    {
      type: "text",
      value: "  LEVEL 7 CLEARANCE. Your current level: 2.",
      style: "error",
    },
    { type: "text", value: "" },
    {
      type: "text",
      value: "  This incident has been reported.",
      style: "dim",
    },
    { type: "text", value: "" },
  ],
  "rm -rf /": [
    { type: "text", value: "" },
    { type: "text", value: "  ⚠ CRITICAL WARNING ⚠", style: "error" },
    { type: "text", value: "" },
    {
      type: "text",
      value: "  FILESYSTEM DESTRUCTION SEQUENCE INITIATED...",
      style: "error",
    },
    { type: "text", value: "  ...", typingSpeed: "slow" },
    { type: "text", value: "  ...", typingSpeed: "slow" },
    { type: "text", value: "  Just kidding. This is a website." },
    { type: "text", value: "  What did you expect?" },
    { type: "text", value: "" },
  ],
  matrix: [
    { type: "text", value: "" },
    { type: "text", value: "  Wake up, Neo...", style: "bright", typingSpeed: "slow" },
    { type: "text", value: "  The Matrix has you...", style: "bright", typingSpeed: "slow" },
    { type: "text", value: "  Follow the white rabbit.", style: "bright", typingSpeed: "slow" },
    { type: "text", value: "" },
    { type: "text", value: "  Knock, knock.", style: "accent", typingSpeed: "slow" },
    { type: "text", value: "" },
  ],
  hello: [
    { type: "text", value: "" },
    { type: "text", value: "  Hello, friend." },
    { type: "text", value: "  That's lame. Maybe I should give you a name." },
    { type: "text", value: "  But that's a slippery slope..." },
    { type: "text", value: "" },
  ],
};

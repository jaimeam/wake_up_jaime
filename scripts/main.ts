// ── Main Entry Point ────────────────────────────────────
// State machine that orchestrates the terminal experience.

import {
  BOOT_LINES,
  WELCOME_CONTENT,
  MENU_PROMPT,
  MENU_OPTIONS,
  SECTIONS,
  EASTER_EGGS,
  type ContentBlock,
  type TerminalSection,
} from "../content/sections";
import {
  typeLines,
  typeText,
  printInstant,
  printLink,
  requestSkip,
  isTyping,
  scrollToBottom,
} from "./typewriter";
import {
  showPrompt,
  hidePrompt,
  createMenuButtons,
  createChildMenuButtons,
  focusInput,
  initGlobalFocus,
} from "./input";
import { glitchTransition } from "./transitions";
import { getCurrentHash, setHash, onHashChange, parseHashPath } from "./router";

// ── DOM References ──────────────────────────────────────

const screen = document.querySelector(".crt-screen") as HTMLElement;
const output = document.getElementById("terminal-output") as HTMLElement;
const ariaLive = document.getElementById("aria-live-region") as HTMLElement;

// ── State ───────────────────────────────────────────────

interface TerminalState {
  phase: "boot" | "typing" | "waiting_input" | "transitioning";
  currentSection: string;
  history: string[];
}

const state: TerminalState = {
  phase: "boot",
  currentSection: "menu",
  history: [],
};

// ── Boot Sequence ───────────────────────────────────────

async function runBoot(): Promise<void> {
  state.phase = "boot";

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    // Skip boot entirely
    return;
  }

  const bootContainer = document.createElement("div");
  bootContainer.className = "boot-text";
  output.appendChild(bootContainer);

  for (const line of BOOT_LINES) {
    if (line === "") {
      const div = document.createElement("div");
      div.className = "line";
      div.innerHTML = "&nbsp;";
      bootContainer.appendChild(div);
    } else {
      const div = document.createElement("div");
      div.className = "line";
      // Highlight key words
      const highlighted = line.replace(
        /(OK|DONE|NOMINAL)/g,
        '<span class="highlight">$1</span>'
      );
      div.innerHTML = highlighted;
      bootContainer.appendChild(div);
    }
    scrollToBottom();
    await sleep(80 + Math.random() * 60);

    // Allow skipping boot
    if (isTyping()) break;
  }

  await sleep(600);
  output.innerHTML = "";
}

// ── Welcome + Menu ──────────────────────────────────────

async function showWelcome(): Promise<void> {
  state.phase = "typing";
  state.currentSection = "menu";
  setHash("");

  // Update aria-live with full content
  updateAriaLive("Welcome to Ancient Terminal. Main menu.");

  await renderContentBlocks(WELCOME_CONTENT);
  await renderContentBlocks(MENU_PROMPT);

  // Create menu buttons
  const menuDiv = createMenuButtons(output, MENU_OPTIONS, (sectionId, key) => {
    if (state.phase !== "waiting_input" && state.phase !== "typing") return;
    requestSkip();
    handleMenuSelection(sectionId, key);
  });

  printInstant(output, "", "");

  state.phase = "waiting_input";
  await waitForCommand();
}

async function waitForCommand(): Promise<void> {
  while (true) {
    state.phase = "waiting_input";
    const cmd = await showPrompt(output);
    hidePrompt();

    // Echo the command
    printInstant(output, `> ${cmd}`, "text-dim");

    const result = processCommand(cmd);
    if (result.action === "navigate") {
      await handleMenuSelection(result.target!, cmd);
      return;
    } else if (result.action === "back") {
      await navigateBack();
      return;
    } else if (result.action === "easter_egg") {
      await renderContentBlocks(result.content!);
      printInstant(output, "");
      // Continue waiting for input
    } else if (result.action === "help") {
      await showHelp();
      // Continue waiting for input
    } else if (result.action === "clear") {
      output.innerHTML = "";
      if (state.currentSection === "menu") {
        await showWelcome();
        return;
      } else {
        await navigateToSection(state.currentSection);
        return;
      }
    } else {
      // Error
      printInstant(
        output,
        '  COMMAND NOT RECOGNIZED. TYPE "HELP" FOR OPTIONS.',
        "text-error"
      );
      printInstant(output, "");
    }
  }
}

// ── Command Processing ──────────────────────────────────

interface CommandResult {
  action: "navigate" | "back" | "easter_egg" | "help" | "clear" | "error";
  target?: string;
  content?: ContentBlock[];
}

function processCommand(raw: string): CommandResult {
  const cmd = raw.toLowerCase().trim();

  // Easter eggs
  if (EASTER_EGGS[cmd]) {
    return { action: "easter_egg", content: EASTER_EGGS[cmd] };
  }

  // Back
  if (cmd === "0" || cmd === "back") {
    return { action: "back" };
  }

  // Help
  if (cmd === "help") {
    return { action: "help" };
  }

  // Clear
  if (cmd === "clear") {
    return { action: "clear" };
  }

  // Look up section or child
  const currentSection = findSection(state.currentSection);

  // Check children first (if we're in a section with children)
  if (currentSection?.children) {
    for (const child of currentSection.children) {
      if (child.commands.includes(cmd)) {
        return { action: "navigate", target: child.id };
      }
    }
  }

  // Check top-level sections
  for (const section of SECTIONS) {
    if (section.commands.includes(cmd)) {
      return { action: "navigate", target: section.id };
    }
  }

  return { action: "error" };
}

// ── Navigation ──────────────────────────────────────────

async function handleMenuSelection(
  sectionId: string,
  _key: string
): Promise<void> {
  state.phase = "transitioning";
  hidePrompt();
  await glitchTransition(screen, output);
  await navigateToSection(sectionId);
}

async function navigateToSection(sectionId: string): Promise<void> {
  // Try top-level first
  let section = findSection(sectionId);
  let isChild = false;
  let parentSection: TerminalSection | null = null;

  if (!section) {
    // Try as child of current section
    const parent = findSection(state.currentSection);
    if (parent?.children) {
      section = parent.children.find((c) => c.id === sectionId) ?? null;
      if (section) {
        isChild = true;
        parentSection = parent;
      }
    }
    // Try as child of any section
    if (!section) {
      for (const s of SECTIONS) {
        if (s.children) {
          const child = s.children.find((c) => c.id === sectionId);
          if (child) {
            section = child;
            isChild = true;
            parentSection = s;
            break;
          }
        }
      }
    }
  }

  if (!section) {
    printInstant(output, "  SECTION NOT FOUND.", "text-error");
    state.currentSection = "menu";
    await showWelcome();
    return;
  }

  // Push history
  if (state.currentSection !== sectionId) {
    state.history.push(state.currentSection);
  }
  state.currentSection = sectionId;

  // Update hash
  if (isChild && parentSection) {
    setHash(`${parentSection.id}/${section.id}`);
  } else {
    setHash(section.id);
  }

  // Update aria-live
  updateAriaLive(
    `${section.title}. ${section.content
      .filter((b) => b.type === "text")
      .map((b) => b.value)
      .join(" ")}`
  );

  state.phase = "typing";
  await renderContentBlocks(section.content);

  // If section has children, render child menu
  if (section.children && section.children.length > 0) {
    createChildMenuButtons(
      output,
      section.children,
      (childId, key) => {
        if (state.phase !== "waiting_input" && state.phase !== "typing") return;
        requestSkip();
        handleMenuSelection(childId, key);
      }
    );
    printInstant(output, "");
  }

  // Back option
  const backLabel = section.backLabel || "BACK TO MAIN MENU";
  printInstant(output, `  [0] ${backLabel}`, "text-dim");
  printInstant(output, "");

  state.phase = "waiting_input";
  await waitForCommand();
}

async function navigateBack(): Promise<void> {
  state.phase = "transitioning";
  hidePrompt();
  await glitchTransition(screen, output);

  const prev = state.history.pop();
  if (prev && prev !== "menu") {
    await navigateToSection(prev);
  } else {
    state.history = [];
    await showWelcome();
  }
}

// ── Helpers ─────────────────────────────────────────────

function findSection(id: string): TerminalSection | null {
  for (const s of SECTIONS) {
    if (s.id === id) return s;
    if (s.children) {
      for (const c of s.children) {
        if (c.id === id) return c;
      }
    }
  }
  return null;
}

async function renderContentBlocks(blocks: ContentBlock[]): Promise<void> {
  const lines = blocks.map((block) => {
    if (block.type === "link") {
      return {
        text: block.value,
        speed: block.typingSpeed || ("normal" as const),
        className: styleToClass(block.style),
        isLink: true,
        href: block.href || "#",
      };
    }
    return {
      text: block.value,
      speed: block.typingSpeed || ("normal" as const),
      className: styleToClass(block.style),
      isLink: false,
      href: "",
    };
  });

  for (const line of lines) {
    if (line.isLink) {
      printLink(output, line.text, line.href, line.className);
      await sleep(50);
    } else {
      const div = document.createElement("div");
      div.className = "line";
      output.appendChild(div);

      if (line.text === "") {
        await sleep(100);
      } else {
        await typeText(
          div,
          line.text,
          line.speed as "fast" | "normal" | "slow",
          line.className
        );
        await sleep(30);
      }
    }
    scrollToBottom();
  }
}

function styleToClass(style?: string): string {
  switch (style) {
    case "dim":
      return "text-dim";
    case "bright":
      return "text-bright";
    case "error":
      return "text-error";
    case "accent":
      return "text-accent";
    default:
      return "";
  }
}

async function showHelp(): Promise<void> {
  printInstant(output, "");
  if (state.currentSection === "menu") {
    printInstant(output, "  AVAILABLE COMMANDS:", "text-bright");
    for (const opt of MENU_OPTIONS) {
      printInstant(output, `    [${opt.key}] ${opt.label}`);
    }
  } else {
    const section = findSection(state.currentSection);
    if (section?.children) {
      printInstant(output, "  AVAILABLE COMMANDS:", "text-bright");
      for (const child of section.children) {
        printInstant(
          output,
          `    [${child.commands[0]}] ${child.title}`
        );
      }
      printInstant(output, "    [0] BACK");
    } else {
      printInstant(output, "  AVAILABLE COMMANDS:", "text-bright");
      printInstant(output, "    [0] BACK");
    }
  }
  printInstant(output, '    "clear" - Clear screen');
  printInstant(output, '    "help"  - Show this help');
  printInstant(output, "");
}

function updateAriaLive(text: string): void {
  if (ariaLive) {
    ariaLive.textContent = text;
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Skip on keypress / click during typing ──────────────

document.addEventListener("keydown", (e) => {
  if (state.phase === "boot" || state.phase === "typing") {
    // Don't skip on Tab (for accessibility)
    if (e.key !== "Tab") {
      requestSkip();
    }
  }
});

document.addEventListener("click", () => {
  if (state.phase === "boot" || state.phase === "typing") {
    requestSkip();
  }
  focusInput();
});

// ── Hash Change Handler ─────────────────────────────────

onHashChange(async (hash: string) => {
  if (state.phase === "transitioning") return;
  const segments = parseHashPath(hash);
  if (segments.length > 0) {
    const targetId = segments[segments.length - 1];
    if (targetId !== state.currentSection) {
      state.phase = "transitioning";
      hidePrompt();
      await glitchTransition(screen, output);
      if (targetId === "menu" || targetId === "") {
        state.history = [];
        await showWelcome();
      } else {
        await navigateToSection(targetId);
      }
    }
  }
});

// ── Init ────────────────────────────────────────────────

async function init(): Promise<void> {
  initGlobalFocus();

  const hash = getCurrentHash();

  if (hash) {
    // Deep link: skip boot, go directly to section
    const segments = parseHashPath(hash);
    const targetId = segments[segments.length - 1];
    // Set up history if navigating to a child
    if (segments.length > 1) {
      state.history.push("menu");
      state.history.push(segments[0]);
    } else {
      state.history.push("menu");
    }
    await navigateToSection(targetId);
  } else {
    // Normal flow: boot → welcome → menu
    await runBoot();
    await showWelcome();
  }
}

// Start when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

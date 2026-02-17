// ── Input Handling ──────────────────────────────────────
// Manages hidden input, visible mirror, and command dispatch.

import { scrollToBottom } from "./typewriter";

type CommandHandler = (command: string) => void;

let inputEl: HTMLInputElement | null = null;
let mirrorEl: HTMLSpanElement | null = null;
let cursorEl: HTMLSpanElement | null = null;
let inputLineEl: HTMLDivElement | null = null;
let onCommand: CommandHandler | null = null;
let inputEnabled = false;

/**
 * Create and show the input prompt.
 * Returns a promise that resolves with the user's command.
 */
export function showPrompt(container: HTMLElement): Promise<string> {
  return new Promise((resolve) => {
    // Create input line
    inputLineEl = document.createElement("div");
    inputLineEl.className = "input-line";

    const promptChar = document.createElement("span");
    promptChar.className = "prompt-char";
    promptChar.textContent = ">";

    mirrorEl = document.createElement("span");
    mirrorEl.className = "input-mirror";

    cursorEl = document.createElement("span");
    cursorEl.className = "cursor";
    cursorEl.textContent = "█";

    inputLineEl.appendChild(promptChar);
    inputLineEl.appendChild(mirrorEl);
    inputLineEl.appendChild(cursorEl);
    container.appendChild(inputLineEl);

    // Hidden input
    inputEl = document.getElementById("hidden-input") as HTMLInputElement;
    if (!inputEl) {
      inputEl = document.createElement("input");
      inputEl.id = "hidden-input";
      inputEl.type = "text";
      inputEl.autocomplete = "off";
      inputEl.autocapitalize = "off";
      inputEl.spellcheck = false;
      document.body.appendChild(inputEl);
    }
    inputEl.value = "";

    inputEnabled = true;

    onCommand = (cmd: string) => {
      inputEnabled = false;
      onCommand = null;
      resolve(cmd);
    };

    // Focus input on desktop automatically.
    // On mobile, tapping the prompt line opens the keyboard.
    if (!isMobile()) {
      inputEl.focus();
    }

    // Allow mobile users to tap the prompt line to focus the input
    inputLineEl.addEventListener("click", () => {
      if (inputEl && inputEnabled) {
        inputEl.focus();
      }
    });

    scrollToBottom();

    // Mirror keystrokes
    inputEl.addEventListener("input", handleInput);
    inputEl.addEventListener("keydown", handleKeydown);
  });
}

/**
 * Remove the input prompt from the DOM.
 */
export function hidePrompt(): void {
  inputEnabled = false;
  if (inputEl) {
    inputEl.removeEventListener("input", handleInput);
    inputEl.removeEventListener("keydown", handleKeydown);
    inputEl.value = "";
  }
  if (inputLineEl && inputLineEl.parentElement) {
    inputLineEl.remove();
  }
  inputLineEl = null;
  mirrorEl = null;
  cursorEl = null;
}

/**
 * Create tappable menu buttons (for mobile + accessibility).
 */
export function createMenuButtons(
  container: HTMLElement,
  options: Array<{ key: string; label: string; sectionId: string }>,
  handler: (sectionId: string, key: string) => void
): HTMLDivElement {
  const menuDiv = document.createElement("div");
  menuDiv.className = "menu-options";
  menuDiv.setAttribute("role", "navigation");
  menuDiv.setAttribute("aria-label", "Main menu");

  for (const opt of options) {
    const btn = document.createElement("button");
    btn.className = "menu-btn";
    btn.textContent = `  [${opt.key}] ${opt.label}`;
    btn.setAttribute("data-section", opt.sectionId);
    btn.setAttribute("data-key", opt.key);
    btn.addEventListener("click", () => {
      handler(opt.sectionId, opt.key);
    });
    menuDiv.appendChild(btn);
  }

  container.appendChild(menuDiv);
  return menuDiv;
}

/**
 * Create child menu buttons (for sub-sections like projects).
 */
export function createChildMenuButtons(
  container: HTMLElement,
  children: Array<{ commands: string[]; title: string; id: string }>,
  handler: (childId: string, key: string) => void
): HTMLDivElement {
  const menuDiv = document.createElement("div");
  menuDiv.className = "menu-options";
  menuDiv.setAttribute("role", "navigation");
  menuDiv.setAttribute("aria-label", "Sub-navigation");

  for (const child of children) {
    const key = child.commands[0];
    const btn = document.createElement("button");
    btn.className = "menu-btn";
    btn.textContent = `  [${key}] ${child.title}`;
    btn.setAttribute("data-section", child.id);
    btn.setAttribute("data-key", key);
    btn.addEventListener("click", () => {
      handler(child.id, key);
    });
    menuDiv.appendChild(btn);
  }

  container.appendChild(menuDiv);
  return menuDiv;
}

/**
 * Create a tappable back button (works on mobile and desktop).
 */
export function createBackButton(
  container: HTMLElement,
  label: string,
  handler: () => void
): void {
  const btn = document.createElement("button");
  btn.className = "menu-btn text-dim";
  btn.textContent = `  [0] ${label}`;
  btn.setAttribute("data-key", "0");
  btn.addEventListener("click", handler);
  container.appendChild(btn);
}

/**
 * Focus the hidden input (for re-focusing after clicks).
 * On desktop this is called automatically on every click.
 * On mobile we skip auto-focus to avoid popping the keyboard
 * unexpectedly, but explicit taps on the prompt line still work.
 */
export function focusInput(): void {
  if (inputEl && inputEnabled && !isMobile()) {
    inputEl.focus();
  }
}

function handleInput(): void {
  if (!mirrorEl || !inputEl) return;
  mirrorEl.textContent = inputEl.value;
  scrollToBottom();
}

function handleKeydown(e: KeyboardEvent): void {
  if (e.key === "Enter" && inputEl && onCommand) {
    const cmd = inputEl.value.trim();
    if (cmd.length > 0) {
      // Freeze the typed command in the display
      if (mirrorEl) {
        mirrorEl.textContent = cmd;
      }
      if (cursorEl) {
        cursorEl.style.display = "none";
      }
      inputEl.value = "";
      onCommand(cmd);
    }
  }
}

function isMobile(): boolean {
  return window.innerWidth <= 768 || "ontouchstart" in window;
}

/**
 * Global click handler to refocus input.
 */
export function initGlobalFocus(): void {
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    // Don't steal focus from buttons or links
    if (
      target.tagName === "BUTTON" ||
      target.tagName === "A" ||
      target.closest("button") ||
      target.closest("a")
    ) {
      return;
    }
    focusInput();
  });
}

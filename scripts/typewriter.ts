// ── Typewriter Engine ───────────────────────────────────
// Types text character-by-character with organic timing.

const SPEED = {
  fast: 12,
  normal: 35,
  slow: 70,
} as const;

const PUNCTUATION_DELAY = 100;
const PARAGRAPH_DELAY = 350;
const JITTER = 20;

let skipRequested = false;

export function requestSkip(): void {
  skipRequested = true;
}

export function isTyping(): boolean {
  return _typing;
}

let _typing = false;

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    if (skipRequested) {
      resolve();
      return;
    }
    setTimeout(resolve, ms);
  });
}

function charDelay(char: string, baseSpeed: number): number {
  if (skipRequested) return 0;
  const jitter = (Math.random() - 0.5) * 2 * JITTER;
  let ms = baseSpeed + jitter;
  if (".,:;!?".includes(char)) {
    ms += PUNCTUATION_DELAY;
  }
  return Math.max(1, ms);
}

/**
 * Type text into an element, character by character.
 * Returns a promise that resolves when typing is complete.
 */
export async function typeText(
  container: HTMLElement,
  text: string,
  speed: "fast" | "normal" | "slow" = "normal",
  className?: string
): Promise<void> {
  _typing = true;
  skipRequested = false;
  const baseSpeed = SPEED[speed];

  const span = document.createElement("span");
  if (className) span.className = className;
  container.appendChild(span);

  // Check prefers-reduced-motion
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion || skipRequested) {
    span.textContent = text;
    _typing = false;
    return;
  }

  for (let i = 0; i < text.length; i++) {
    if (skipRequested) {
      span.textContent = text;
      _typing = false;
      return;
    }
    span.textContent += text[i];
    scrollToBottom();
    await delay(charDelay(text[i], baseSpeed));
  }
  _typing = false;
}

/**
 * Type out multiple lines with proper pauses.
 */
export async function typeLines(
  container: HTMLElement,
  lines: Array<{
    text: string;
    speed?: "fast" | "normal" | "slow";
    className?: string;
  }>
): Promise<void> {
  for (const line of lines) {
    if (skipRequested) {
      // Dump remaining lines instantly
      for (const remaining of lines.slice(lines.indexOf(line))) {
        const div = document.createElement("div");
        div.className = "line";
        const span = document.createElement("span");
        if (remaining.className) span.className = remaining.className;
        span.textContent = remaining.text;
        div.appendChild(span);
        container.appendChild(div);
      }
      scrollToBottom();
      _typing = false;
      return;
    }

    const div = document.createElement("div");
    div.className = "line";
    container.appendChild(div);

    if (line.text === "") {
      // Empty line — just a paragraph pause
      await delay(PARAGRAPH_DELAY);
    } else {
      await typeText(div, line.text, line.speed || "normal", line.className);
    }
    await delay(50); // Small inter-line gap
  }
}

/**
 * Print text instantly (no animation).
 */
export function printInstant(
  container: HTMLElement,
  text: string,
  className?: string
): void {
  const div = document.createElement("div");
  div.className = "line";
  const span = document.createElement("span");
  if (className) span.className = className;
  span.textContent = text;
  div.appendChild(span);
  container.appendChild(div);
}

/**
 * Print a clickable link line.
 */
export function printLink(
  container: HTMLElement,
  text: string,
  href: string,
  className?: string
): HTMLElement {
  const div = document.createElement("div");
  div.className = "line";
  const a = document.createElement("a");
  a.className = `terminal-link ${className || ""}`.trim();
  a.textContent = text;
  a.href = href;
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  div.appendChild(a);
  container.appendChild(div);
  return div;
}

function scrollToBottom(): void {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" });
}

export { scrollToBottom };

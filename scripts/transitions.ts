// ── Transitions ─────────────────────────────────────────
// Glitch effects and screen clearing between sections.

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Run the glitch transition, clear the terminal, return.
 */
export async function glitchTransition(
  screen: HTMLElement,
  output: HTMLElement
): Promise<void> {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reducedMotion) {
    output.innerHTML = "";
    return;
  }

  // Trigger glitch CSS
  screen.classList.add("glitch-active");
  await delay(300);
  screen.classList.remove("glitch-active");

  // Brief pause then clear
  await delay(50);
  output.innerHTML = "";
}

/**
 * Simple instant clear (no glitch).
 */
export function clearScreen(output: HTMLElement): void {
  output.innerHTML = "";
}

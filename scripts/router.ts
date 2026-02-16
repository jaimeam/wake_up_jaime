// ── Hash Router ─────────────────────────────────────────
// Lightweight hash-based routing for deep linking.

type RouteHandler = (sectionId: string) => void;

let routeHandler: RouteHandler | null = null;

/**
 * Read the current hash and return the section path.
 * e.g. "#about" → "about", "#projects/cipher" → "projects/cipher"
 */
export function getCurrentHash(): string {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return hash || "";
}

/**
 * Set the hash without triggering a navigation event.
 */
export function setHash(path: string): void {
  const newHash = path ? `#${path}` : "";
  if (window.location.hash !== newHash) {
    history.replaceState(null, "", newHash || window.location.pathname);
  }
}

/**
 * Listen for hash changes (back/forward navigation).
 */
export function onHashChange(handler: RouteHandler): void {
  routeHandler = handler;
  window.addEventListener("hashchange", () => {
    const hash = getCurrentHash();
    if (routeHandler && hash) {
      routeHandler(hash);
    }
  });
}

/**
 * Parse a hash path into segments.
 * e.g. "projects/cipher" → ["projects", "cipher"]
 */
export function parseHashPath(path: string): string[] {
  return path.split("/").filter(Boolean);
}

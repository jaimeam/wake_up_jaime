// ── Data Model ──────────────────────────────────────────
// Type definitions for site content. All data is loaded from site.json.

import siteData from "./site.json";

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

export interface MenuOption {
  key: string;
  label: string;
  sectionId: string;
}

// ── JSON → Typed Exports ────────────────────────────────
// site.json is the single source of truth for all content.
// These exports cast the untyped JSON into the interfaces above.

export const BOOT_LINES: string[] = siteData.boot.lines;

export const WELCOME_CONTENT: ContentBlock[] =
  siteData.welcome.content as ContentBlock[];

export const MENU_PROMPT: ContentBlock[] =
  siteData.menuPrompt as ContentBlock[];

// Menu options are derived from top-level sections.
// Each section's first command becomes the menu key.
export const MENU_OPTIONS: MenuOption[] = siteData.sections.map((s) => ({
  key: s.commands[0],
  label: s.title,
  sectionId: s.id,
}));

export const SECTIONS: TerminalSection[] =
  siteData.sections as TerminalSection[];

export const EASTER_EGGS: Record<string, ContentBlock[]> =
  siteData.easterEggs as Record<string, ContentBlock[]>;

// ── Tree Traversal Helpers ──────────────────────────────
// These support arbitrary nesting depth in the section tree.

export interface SectionLookup {
  section: TerminalSection;
  /** Ancestor chain from root to immediate parent (empty for top-level). */
  ancestors: TerminalSection[];
}

/**
 * Recursively find a section by ID anywhere in the tree.
 * Returns the section and its ancestor path, or null if not found.
 */
export function findSectionDeep(
  id: string,
  sections: TerminalSection[] = SECTIONS,
  ancestors: TerminalSection[] = []
): SectionLookup | null {
  for (const s of sections) {
    if (s.id === id) return { section: s, ancestors };
    if (s.children) {
      const result = findSectionDeep(id, s.children, [...ancestors, s]);
      if (result) return result;
    }
  }
  return null;
}

/**
 * Build the hash path for a section (e.g. "projects/project-astra").
 * Uses the ancestor chain to construct the full path.
 */
export function buildHashPath(lookup: SectionLookup): string {
  const ids = lookup.ancestors.map((a) => a.id);
  ids.push(lookup.section.id);
  return ids.join("/");
}

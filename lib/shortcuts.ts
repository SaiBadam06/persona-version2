// ---------------------------------------------------------------------------
// Keyboard shortcut catalog + binding helpers.
// Defaults live here; user overrides are stored per-id in the app store and
// persisted to localStorage. The global key handler (in the store) matches
// keydown events against the resolved bindings and dispatches the action.
// ---------------------------------------------------------------------------

import type { ShortcutBinding, ShortcutId } from "./types";

export interface ShortcutAction {
  id: ShortcutId;
  label: string;
  desc: string;
  default: ShortcutBinding;
}

export const SHORTCUTS: ShortcutAction[] = [
  { id: "search", label: "Search", desc: "Jump to search", default: { key: "/" } },
  { id: "new-ask", label: "New / Ask", desc: "Go to the command home", default: { key: "n" } },
  { id: "open-profile", label: "Open profile", desc: "Open your persona settings", default: { key: "," } },
  { id: "switch-persona", label: "Switch persona", desc: "Cycle to the next persona", default: { key: "p" } },
  { id: "toggle-theme", label: "Toggle light / dark", desc: "Switch the theme", default: { key: "t" } },
];

export const SHORTCUTS_KEY = "personaon:shortcuts";

/** Normalize a single-character key to lowercase; leave named keys as-is. */
function normKey(key: string): string {
  return key.length === 1 ? key.toLowerCase() : key;
}

/** Build a binding from a keydown event (null for modifier-only presses). */
export function bindingFromEvent(e: KeyboardEvent): ShortcutBinding | null {
  if (!e.key || ["Shift", "Control", "Alt", "Meta"].includes(e.key)) return null;
  return {
    key: normKey(e.key),
    ctrl: e.ctrlKey || undefined,
    meta: e.metaKey || undefined,
    shift: e.shiftKey || undefined,
    alt: e.altKey || undefined,
  };
}

/** Does a keydown event match a binding exactly (incl. modifier state)? */
export function eventMatchesBinding(e: KeyboardEvent, b: ShortcutBinding): boolean {
  return (
    normKey(e.key) === b.key &&
    !!e.ctrlKey === !!b.ctrl &&
    !!e.metaKey === !!b.meta &&
    !!e.altKey === !!b.alt &&
    !!e.shiftKey === !!b.shift
  );
}

export function bindingsEqual(a?: ShortcutBinding, b?: ShortcutBinding): boolean {
  if (!a || !b) return false;
  return (
    a.key === b.key &&
    !!a.ctrl === !!b.ctrl &&
    !!a.meta === !!b.meta &&
    !!a.alt === !!b.alt &&
    !!a.shift === !!b.shift
  );
}

/** Human-readable label for a binding, e.g. "Ctrl + K" or "/". */
export function formatBinding(b: ShortcutBinding): string {
  const parts: string[] = [];
  if (b.ctrl) parts.push("Ctrl");
  if (b.meta) parts.push("⌘");
  if (b.alt) parts.push("Alt");
  if (b.shift) parts.push("Shift");
  let k = b.key;
  if (k === " ") k = "Space";
  else if (k.length === 1) k = k.toUpperCase();
  parts.push(k);
  return parts.join(" + ");
}

# General Tab — Appearance, Accessibility & Shortcuts

**Date:** 2026-06-09
**Status:** Approved design, pre-implementation
**Area:** Profile popup (`components/profile/ProfileModal.tsx`) + app-wide theming

## Summary

Add a **General** tab to the profile popup (ChatGPT-style), containing two sections:

1. **Appearance** — Theme mode (Light / Dark / System) and a per-persona Accent color picker.
2. **Accessibility** — Text size, High contrast, and a real, rebindable Keyboard-shortcuts manager.

This introduces the app's **first real dark mode** and a working theme/preference engine. Today the app is light-only, themed entirely through CSS variables, with the accent already runtime-switchable per ICP. We extend that mechanism rather than replace it.

A new **brand logo** (saved by the user to `/public`) is shown in light mode; dark mode keeps the existing inline mark.

## Goals

- A General tab matching the existing profile-tab visual language.
- Real, persisted Light / Dark / System theme switching across the **whole app**.
- A warm dark palette that keeps the brand feel (not cold black) and is legible.
- Per-persona accent override from a fixed swatch palette, defaulting to each ICP's accent.
- Accessibility: text scaling, high-contrast mode, and a functional rebindable shortcuts system.
- Swap in the user-provided logo for light mode.

## Non-Goals

- Reduce-motion and reduce-transparency toggles (deferred — not selected).
- A dark/inverted variant of the new logo (light mode only for now).
- Per-persona theme (theme is global; only the accent is per-persona).
- Backend persistence — all preferences live in `localStorage`, consistent with the existing `personaon:icp` key.

## Architecture

### Theming model (the engine)

All Tailwind v4 utilities in the app already compile to `var(--color-*)` tokens declared in the `@theme` block of [app/globals.css](../../../app/globals.css). We exploit this:

- **Light** stays the default `:root` palette.
- **Dark** is a single `html[data-theme="dark"]` block re-declaring the same `--color-*` tokens with dark values. No component markup changes — the whole app flips on the attribute.
- **High contrast** is an orthogonal `html[data-contrast="high"]` block that strengthens border/text tokens; it composes with both themes.
- **Text scale** sets `zoom` on the app root via a `--ui-scale` variable. (The UI uses fixed-px sizing, so root-`rem` scaling would not work; `zoom` scales the whole UI cleanly and has broad browser support.)

State lives in the store and is written to `<html>` as attributes/variables in an effect, then persisted. An **anti-flash inline script** in `<head>` ([app/layout.tsx](../../../app/layout.tsx)) applies the saved theme/contrast/scale before first paint.

#### Proposed dark palette (warm charcoal)

| token | light | dark |
|---|---|---|
| `--color-paper` | `#faf8f4` | `#1b1813` |
| `--color-paper-2` | `#f3efe9` | `#221e18` |
| `--color-surface` | `#ffffff` | `#232019` |
| `--color-ink` | `#1b1815` | `#f3efe9` |
| `--color-ink-soft` | `#4a443d` | `#c4bcb0` |
| `--color-muted` | `#8a8178` | `#948b7e` |
| `--color-line` | `#ebe5dd` | `#322d25` |
| `--color-line-strong` | `#ddd5ca` | `#443e34` |
| `--color-amber` | `#b4631b` | `#d08a4a` |
| `--color-positive` | `#2f8a5b` | `#4ca777` |

#### High-contrast overrides

- **Light:** `line → #cfc6b8`, `line-strong → #b3a899`, `muted → #6b6258`.
- **Dark:** `line → #4a443a`, `line-strong → #5e564a`, `muted → #b3a99c`.

#### accent-soft cleanup

Currently the store sets `--accent-soft` from each ICP's `accentSoft` (a *light* tint) as an inline style on `<html>`. On dark backgrounds that tint glows wrong, and inline styles would override any theme CSS. Fix: the store sets **only** `--accent` (and `--accent-ink`); `--accent-soft` is derived in CSS via `color-mix` per theme:

- Light: `--accent-soft: color-mix(in srgb, var(--accent) 14%, white);`
- Dark: `--accent-soft: color-mix(in srgb, var(--accent) 24%, transparent);`

`ICPS[*].accentSoft` becomes unused for theming (left in place; harmless).

### Accent override (per-persona)

- Fixed swatch palette in new `lib/accents.ts`:
  `Teal #117863 · Indigo #4f5bd5 · Violet #7a4fd6 · Blue #0f6fb0 · Green #2f6d4f · Amber #b4631b · Rose #c2456b · Slate #475569`, each `{ key, label, hex }`.
- New store state `accentOverrides: Record<IcpId, string | null>` (persisted `personaon:accents`).
- **Effective accent** for the active persona = `accentOverrides[icp] ?? ICPS[icp].accent`. The existing accent effect writes this to `--accent`.
- UI: a swatch grid plus a **"Match persona default"** chip (sets the override to `null`). The section header names the active persona (e.g. "Accent for Founders") to make the per-persona scope explicit. Changing personas shows that persona's own accent.

### Keyboard shortcuts (real & rebindable)

New `lib/shortcuts.ts`:

- **Action catalog** — stable `id`, label, and a dispatch reference resolved against store actions:
  | id | label | default key | action |
  |---|---|---|---|
  | `search` | Search | `/` | `setView("search")` |
  | `new-ask` | New / Ask | `n` | `setView("home")` |
  | `open-profile` | Open profile | `,` | `openProfile()` |
  | `switch-persona` | Switch persona | `p` | cycle `setIcp` through `ICP_ORDER` |
  | `toggle-theme` | Toggle light/dark | `t` | toggle theme light↔dark |
  - `Escape` → close modal is shown as a **fixed, non-editable system shortcut**.
- **Binding shape:** `{ key: string, ctrl?, meta?, shift?, alt? }`. Defaults are single keys; recording supports modifier combos.
- **Persistence:** `personaon:shortcuts` stores only user overrides keyed by action id; missing entries fall back to defaults.
- **Global handler:** registered in `AppProvider` via a `keydown` listener. Guards:
  - Ignore when the event target is `input`, `textarea`, `select`, or `contenteditable` (so `/`, `n`, `t` don't hijack typing), unless a non-shift modifier (Ctrl/Cmd/Alt) is held.
  - Ignore when a recording capture is active (the manager temporarily suspends dispatch).
- **Manager UI** (`components/profile/tabs/ShortcutsManager.tsx`):
  - Rows of `label` + current key rendered as `<kbd>`-style chips.
  - **Record** button per row captures the next key combo; **conflict detection** rejects a combo already bound to another action (inline error, no save).
  - **Reset to default** per row and a **Reset all** affordance.

### General tab wiring

- `lib/types.ts`: add `"general"` to `ProfileTab`; add `ThemeMode`, `TextScale`, `ContrastMode`, `AccentKey`, `ShortcutBinding`, `ShortcutId` types.
- `ProfileModal.tsx`: prepend `{ id: "general", label: "General", icon: SlidersHorizontal }` to `TABS`; render `{profileTab === "general" && <GeneralTab />}`. Opening from the user chip keeps landing on Persona; General is reachable via the rail.
- `GeneralTab.tsx`: composes the two sections from existing `Section` + new `Segmented`/`Swatch` controls in `parts.tsx`.

### Logo

- User saves the asset to `public/personaon-logo.png` (PNG/webp/SVG accepted).
- [Sidebar.tsx:64-71](../../../components/Sidebar.tsx#L64-L71) brand lockup: in **light** resolved theme, render the asset via `next/image` (height-constrained, e.g. ~22px, `priority`); in **dark**, render the existing inline waveform mark + wordmark unchanged.
- Same treatment optionally applied to any other brand lockup (none currently besides Sidebar).

## New shared controls (`components/profile/tabs/parts.tsx`)

- `Segmented({ options, value, onChange })` — pill-style segmented control matching the existing border/`bg-paper` styling, used for Theme and Text size.
- `Swatch({ hex, selected, onClick, label })` — round color swatch with selected ring (`ring-accent`), used by the accent grid.

## Store changes (`lib/store.tsx`)

New state + persistence keys:

| state | type | localStorage key |
|---|---|---|
| `theme` | `"light" \| "dark" \| "system"` | `personaon:theme` |
| `accentOverrides` | `Record<IcpId, string \| null>` | `personaon:accents` |
| `textScale` | `"comfortable" \| "large" \| "larger"` | `personaon:scale` |
| `contrast` | `"normal" \| "high"` | `personaon:contrast` |
| `shortcuts` | `Partial<Record<ShortcutId, ShortcutBinding>>` | `personaon:shortcuts` |

Effects:
- Resolve theme (`system` → `matchMedia('(prefers-color-scheme: dark)')` with a change listener) → write `data-theme` on `<html>`.
- Write `data-contrast` and `--ui-scale` on `<html>`.
- Existing accent effect updated to write the **effective** accent (override-aware) and to stop writing `--accent-soft`.
- Register the global shortcut `keydown` handler (added/removed with the provider lifecycle).

Text-scale values: `comfortable → 1.0`, `large → 1.1`, `larger → 1.22`.

## Files

**New**
- `lib/accents.ts` — swatch palette.
- `lib/shortcuts.ts` — action catalog, defaults, binding match/format helpers.
- `components/profile/tabs/GeneralTab.tsx` — the tab.
- `components/profile/tabs/ShortcutsManager.tsx` — shortcuts list + recorder.

**Edited**
- `app/globals.css` — dark palette, high-contrast block, `--ui-scale` zoom, `--accent-soft` via `color-mix`.
- `app/layout.tsx` — anti-flash inline script in `<head>`.
- `lib/store.tsx` — new state, effects, system listener, global key handler.
- `lib/types.ts` — `"general"` + new types.
- `components/profile/ProfileModal.tsx` — register the General tab.
- `components/profile/tabs/parts.tsx` — `Segmented`, `Swatch`.
- `components/Sidebar.tsx` — theme-aware logo.

## Testing / Verification

Manual (reference UI, no test runner assumed):
1. Toggle Light/Dark/System — whole app reskins; System follows OS; choice survives reload with no flash.
2. Visibility pass in dark mode across views (home, search, modal, sidebar, toggles) — text/borders legible, accent-soft surfaces read correctly.
3. Accent: change accent for one persona; switch personas → others keep defaults; "Match persona default" reverts; survives reload.
4. Text size and High contrast apply app-wide and persist.
5. Shortcuts: each default key fires its action; keys don't fire while typing in inputs; record a new combo; conflict is rejected; reset restores default; survives reload.
6. Logo: new logo shows in light mode; dark mode shows the inline mark.

## Open assumptions

- Logo asset will exist at `public/personaon-logo.png` before/at implementation; if absent, the light-mode branch falls back to the inline mark so the app never breaks.
- `zoom` is acceptable for text scaling given the px-based design (documented trade-off vs. a full rem refactor, which is out of scope).

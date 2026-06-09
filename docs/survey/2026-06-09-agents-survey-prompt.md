# Prompt — Generate the PersonaOn "Agents Discovery" Survey Web App

Paste everything in the **PROMPT** block below into your coding agent (Claude Code, v0, Cursor, etc.) in a **fresh, empty repo**. It is self-contained: it carries PersonaOn's exact theme so the survey looks like it belongs to the same product. Pair it with the companion question bank: `2026-06-09-agents-survey-questions.md` (paste that file in alongside, or inline it where the prompt says to).

---

## PROMPT

> **You are building a standalone survey web app for PersonaOn.** PersonaOn builds a personal "persona" that knows a user's context and increasingly **acts** for them via **Agents** (small-to-medium tasks: prep a brief, draft a follow-up, update a record, research a contact, etc.). This survey discovers what each audience expects from such agents, so the team can shape onboarding and roadmap.
>
> ### Goal
> A polished, mobile-friendly, multi-step survey that **branches by role**, feels like the PersonaOn product, stores responses, and lets the team export results. Keep it to a 4–6 minute experience.
>
> ### Tech stack
> - **Next.js (App Router) + React + TypeScript**, **Tailwind CSS v4** (theme via `@theme` in `globals.css`), **lucide-react** for icons.
> - Fonts: **Space Grotesk** (display/headings) and **Inter** (body) via `next/font/google`.
> - Persist responses to **one** of: Supabase table, Google Sheet (via API route), or Airtable — pick the simplest to configure and gate it behind an env var; if unset, fall back to `POST /api/responses` that appends to a local JSON file and always allow **"Download my response as JSON."** Log nothing sensitive to the console.
> - No auth. One response per session; allow "edit previous step."
>
> ### Visual theme — match PersonaOn exactly
> PersonaOn is "Warm Intelligence": a warm-paper light base with generous, ChatGPT-style whitespace, soft rounded cards, thin warm borders, and a single accent color. Support **light**, a cool **slate dark**, and an optional **deep-black** dark. Put this in `app/globals.css`:
>
> ```css
> @import "tailwindcss";
>
> @theme {
>   --color-paper: #faf8f4;
>   --color-paper-2: #f3efe9;
>   --color-surface: #ffffff;
>   --color-ink: #1b1815;
>   --color-ink-soft: #4a443d;
>   --color-muted: #8a8178;
>   --color-line: #ebe5dd;
>   --color-line-strong: #ddd5ca;
>   --color-accent: #117863;     /* PersonaOn teal */
>   --color-amber: #b4631b;
>   --color-positive: #2f8a5b;
>   --font-serif: var(--font-display), ui-sans-serif, system-ui, sans-serif;
>   --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
>   --radius-card: 16px;
> }
>
> :root {
>   --accent: #117863;
>   --accent-ink: #ffffff;
>   --accent-soft: color-mix(in srgb, var(--accent) 14%, white);
> }
>
> /* Cool slate dark */
> html[data-theme="dark"] {
>   --color-paper: #0f1216;
>   --color-paper-2: #161b22;
>   --color-surface: #1b212b;
>   --color-ink: #e8ebf1;
>   --color-ink-soft: #aeb7c4;
>   --color-muted: #79828f;
>   --color-line: #242b34;
>   --color-line-strong: #343d49;
>   --color-amber: #e0974f;
>   --color-positive: #46b083;
>   --accent-soft: color-mix(in srgb, var(--accent) 24%, transparent);
> }
> /* Optional deep black (OLED) */
> html[data-theme="dark"][data-dark="black"] {
>   --color-paper: #000000;
>   --color-paper-2: #0b0d11;
>   --color-surface: #111318;
>   --color-line: #1d222a;
>   --color-line-strong: #2b323c;
> }
>
> * { border-color: var(--color-line); }
> html, body { background: var(--color-paper); color: var(--color-ink); font-family: var(--font-sans); -webkit-font-smoothing: antialiased; }
> .font-serif { font-family: var(--font-serif); }
> .bg-accent { background-color: var(--accent); }
> .bg-accent-soft { background-color: var(--accent-soft); }
> .text-accent { color: var(--accent); }
> .border-accent { border-color: var(--accent); }
> @keyframes fade-in { from { opacity:0; transform: translateY(6px);} to {opacity:1; transform:none;} }
> .animate-fade-in { animation: fade-in .28s ease both; }
> ```
>
> **Design rules (follow these so it reads as PersonaOn):**
> - **Accent is themeable per audience.** Set `--accent` on `<html>` to the selected role's color so the survey re-tints live as the user picks their role (founder `#117863`, recruiter `#7a4fd6`, consultant `#0f6fb0`, sales `#b4631b`, investor `#2f6d4f`, executive `#475569`, influencer `#c2456b`, student `#4f5bd5`, other `#117863`). `--accent-soft` is derived in CSS — never set it inline.
> - **Cards:** `rounded-2xl border border-line bg-surface` with a soft shadow like `shadow-[0_1px_3px_rgba(0,0,0,0.03)]`.
> - **Headings** use `font-serif` (Space Grotesk), tight tracking. Body uses Inter.
> - **Options** render as large, tappable cards/pills with `bg-paper`/`bg-surface`, hover `border-line-strong`, and a selected state using the accent (`ring-1 ring-accent`, `border-accent`, or `bg-accent-soft text-accent`).
> - **Segmented controls** for scales; **toggle pills** for multi-select; an **accent swatch / radio** for single-select where it fits.
> - **Use only theme tokens** (`bg-paper`, `text-ink`, `text-muted`, `border-line`, `bg-accent-soft`, `text-accent`, `bg-positive/15 text-positive`, …). **No hardcoded hex** in components — everything must adapt across light/slate/black. Verify nothing becomes invisible in dark (e.g. don't put white text on `bg-ink`).
> - Include a small **theme switcher** (Light / Dark / System) in a corner, persisted to `localStorage`, applied pre-paint via an inline script in `<head>` (set `data-theme` before first paint to avoid flash).
> - **Progress bar** of step dots at the top that fills with the accent (PersonaOn's onboarding uses growing pills: active `w-7`, inactive `w-3`).
> - Smooth step transitions (`animate-fade-in`), keyboard accessible (Enter advances, options are real `<button>`/`<label>` with focus rings), respects `prefers-reduced-motion`.
>
> ### Structure & flow
> Build a **multi-step wizard**, one logical group per screen, with Back/Next and a final Submit + thank-you screen:
> 1. **Welcome** — one sentence on why (we're building Agents; help shape them), time estimate, privacy note.
> 2. **Role picker (Q A1)** — the branching key; selecting a role sets the live accent.
> 3. **About you** (A2–A5)
> 4. **Time & pain** (Section B)
> 5. **Expectations** (Section C)
> 6. **Agents** (Section D) — the centerpiece; give this room and good copy.
> 7. **Role-specific** (Section E) — render ONLY the block matching the chosen role.
> 8. **Onboarding & adoption** (Section F)
> 9. **Wrap-up** (Section G) — optional email for design-partner.
> 10. **Thank-you** — confirmation + offer to download their response JSON.
>
> ### Questions
> Use the exact questions, types, options, and branching in the companion doc **`2026-06-09-agents-survey-questions.md`**. Render by `type`: `single` → radio cards; `multi` → toggle pills (+ "Other" reveals a text field); `scale` → labeled segmented/slider 1–5; `text` → auto-growing textarea; `email` → validated input. Honor **[branch]** — show a section only when it matches the role from A1. Almost everything is optional except the role (A1); never hard-block progress except A1.
>
> ### Data model
> Store a single JSON object per respondent: `{ id, startedAt, completedAt, role, answers: { <questionId>: value }, userAgent }`. Use the question IDs from the doc (A1, B2, D1, E-F1, …) as keys. Provide a simple `/admin` page (no auth, but behind an env-gated flag) that lists responses and exports CSV/JSON.
>
> ### Deliverables
> - Runnable Next.js app (`npm run dev`), `npm run build` clean, no TypeScript errors.
> - `README.md` with setup, the env var for the chosen storage backend, and how to view/export results.
> - Mobile-first responsive; looks like a PersonaOn surface in light, slate dark, and deep black.
> - A short `THEME.md` noting the tokens came from PersonaOn so future screens stay consistent.
>
> Keep the copy warm, concrete, and low-friction. Build it now.

---

## Notes for you (not part of the prompt)
- The accent hexes above mirror PersonaOn's per-ICP accents (`lib/icps.ts`) plus two new ones for **influencer** (`#c2456b`, rose) and **student** (`#4f5bd5`, indigo). Adjust to taste.
- If you want the survey to write straight into the same analytics you already use, tell the agent to POST responses to **PostHog** (you already have a project) or Airtable instead of a local file.
- When results come back, the **"Mapping" table** at the end of the questions doc tells you which onboarding/roadmap decision each section informs.

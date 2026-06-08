# PersonaOn "Command" — The New Interface Direction (for leads)

**Date:** 2026-06-08
**Audience:** Product, design, and engineering leads.
**What this is:** The reasoning behind the new UI direction, what we borrowed from each
reference app and *why*, what's actually been built, and what it takes to ship it for real.
A runnable mockup accompanies this doc.

---

## 1. The ask

The CEO asked for a new interface direction "inspired by ChatGPT and Granola, with a central
command area and a streamlined product flow," resembling the functionality of **ChatGPT,
Granola, Littlebird, Replit, and Lovable** where it fits our use case.

The team added an important structural idea:

> Everything the user **does** day-to-day should live on the **main page** (chat + meetings +
> routines, like ChatGPT and Littlebird). Everything about **customizing and maintaining the
> persona** (settings, connectors, analysis) should live in the **profile**, opened as a
> **popup**.

That single sentence is the whole design. The rest of this doc is how we honor it.

---

## 2. The problem we're actually solving

From the product review (see `02-PRODUCT-LOOPHOLES.md`, P6): **the current dashboard has ~48
pages.** Users have to *go find* their work — chat is one page, meetings another, knowledge
another, sharing another, and so on. That's a steep learning curve and slow daily use.

**The new direction inverts it:**
- The **work comes to one home surface** (a command box + a "Today" view of meetings,
  commitments, and routines).
- All the **configuration collapses into one popup** you open only when you need it.

Fewer doors. One obvious place to start. Much less to learn. That is the entire value of this
redesign.

---

## 3. Two surfaces (the core structure)

| Surface | Purpose | What's on it |
|---|---|---|
| **① Command Dashboard** (the home page after login) | Everything you **do** | A central command/chat area + a "Today" view: meetings with pre-briefs, open commitments, routines, pipeline, and drafts your persona prepared |
| **② Profile popup** (opens from the user chip, bottom-left) | Everything you **maintain** | Six tabs: **Persona** (identity, voice, boundaries) · **Knowledge** (sources) · **Connectors** (calendar, CRM, apps) · **Analysis** (persona score + gaps) · **Sharing** (public page, widget, marketplace) · **Settings** (billing, notifications, API) |

The left navigation (Ask, Search, Meetings, Routines, Knowledge) switches the home surface
between focused views — but it's all *one* place, not 48 pages.

---

## 4. What we took from each reference app, and why

This is the heart of the "mix and match" instruction. Each choice is deliberate.

| Reference | What we took | Why it fits PersonaOn specifically |
|---|---|---|
| **ChatGPT** | The **central command area** (one big input as the hero of the page, with a Mode selector, mic, and send) **and settings-as-a-popup** rather than settings-as-pages | PersonaOn *is* a persona you talk to — the conversation should be the front door, not buried in a tab. And keeping settings in a popup keeps configuration out of the daily path. |
| **Granola** | **Meeting cards** that carry a short pre-brief and a one-line recap; the *meeting* is the unit of work on the home page | Our entire product loop is Prep → Capture → Compound. Meetings belong front-and-center, not three clicks deep. |
| **Littlebird** | The **overall home layout**: a left nav (New/Search/Meeting Notes/Routines), a greeting with the date, a row of app connectors under the input, and the **user chip in the bottom-left corner** | This is almost exactly the "command + meetings + routines on one page" shape the CEO described. We made the user chip the door to our Profile popup. |
| **Replit / Lovable** | The **clean, fast, single-surface feel** — minimal chrome, generous whitespace, instant feedback | PersonaOn should feel like a modern, focused tool, not a heavy enterprise dashboard. |
| **PersonaOn (our own brand)** | The **"Warm Intelligence" look** — warm off-white background, Playfair Display serif headings, a teal accent | So it's unmistakably *us*, not a clone of any one competitor. |

**The synthesis in one line:** Littlebird's *layout* + ChatGPT's *command area and
settings-popup pattern* + Granola's *meeting cards* + Replit/Lovable's *polish*, all rendered
in **PersonaOn's warm light theme with ChatGPT-style whitespace** (we deliberately did **not**
copy Littlebird's dark theme — we stayed on-brand).

---

## 5. The personalization layer — 6 ICPs from one config

PersonaOn serves six very different audiences. Rather than building six products, the same UI
**re-skins itself per audience** from a single configuration file. Switching the "Viewing as"
control changes the **accent color, the greeting, the command-box prompt, the suggestion
chips, which "Today" widgets lead, and the pipeline label.**

| ICP (audience) | Greeting | What leads on their home |
|---|---|---|
| **Founders** | "Walk in prepared" | Meetings · Commitments · Fundraise pipeline |
| **Recruiters** | "Let your persona pitch" | Meetings · Candidate pipeline · Follow-ups |
| **Consultants** | "Your expertise, always on" | Meetings · Commitments · Follow-ups |
| **Sales & Account Managers** | "Never walk into a deal cold" | Deal pipeline · Meetings · Commitments |
| **Investors** | "Remember every founder" | Meetings · Deal flow · Commitments |
| **Managers & Executives** | "Stay ahead of the day" | Meetings · Commitments · Routines |

**Why this approach:** it's the cheapest possible personalization. One codebase, one config
object per audience, no forks to maintain, and adding a 7th audience is a few lines. The
underlying product is identical — only the *presentation and language* shift.

---

## 6. What's actually been built (the mockup)

A **real, runnable Next.js app** — not a static picture — so it can be clicked through in a
demo. It builds cleanly and runs locally.

**What works today:**
- **Command dashboard** — type in the command box (or click a suggestion) and a grounded
  persona reply streams in with source chips.
- **Functional left nav** — Ask / Search / Meetings / Routines each switch the main view;
  Knowledge opens the profile popup.
- **"Today" widgets** — meetings with briefs, commitments, routines, pipeline.
- **ICP switcher** — changes the entire workspace live.
- **Profile popup** — all six tabs.
- **Streamlined onboarding** (`/onboarding`) — pick your ICP → connect LinkedIn → connect
  calendar → "building your persona…" → you're live. The ICP you choose carries into the
  dashboard.

**Important caveat:** this is a **frontend direction mockup with mock data.** It demonstrates
the *shape and feel*, not the full product. For exactly what is and isn't included, see
`04-FEATURE-COVERAGE.md`.

---

## 7. For engineering leads — how it maps to the real codebase

The mockup is deliberately structured to port cleanly into the real `app/web`:

```
lib/icps.ts        ← the 6-ICP config; the single source of personalization
lib/mock-data.ts   ← replace with real API calls (see below)
lib/store.tsx      ← app state (selected ICP, active view, profile popup)
components/         ← Sidebar, CommandArea, TodayPanel, profile/ProfileModal + 6 tabs, views/
```

**What the backend needs to make it real (no re-platforming — it sits on the existing FastAPI
+ ADK + Supabase stack):**

| New backend work | Why |
|---|---|
| `GET /v2/dashboard/today` (one aggregated response) | The home surface needs meetings + commitments + routines + drafts in **one fast call** instead of 4–5 |
| `persona_type` / `icp` field on `twins.settings` | Persist the chosen audience so the workspace tailors on load |
| `POST /v2/command` (intent router) | One endpoint behind the command box that decides: answer a question, prep a meeting, or take an action |
| Routines CRUD (`/v2/routines`) | Make routines user-visible, toggleable objects (they're implied by background jobs today) |
| `GET /v2/commitments`, `GET /v2/connectors` | Surface data that already exists in the database |

Most primitives (chat streaming, meeting briefs, commitments, voice, sharing) **already
exist** — this is mostly aggregation and two new concepts. The security fixes from
`02-PRODUCT-LOOPHOLES.md` should ride along with this work.

---

## 8. Why this is the right direction (the case for leads)

1. **It solves a real, observed problem** (navigation overload) instead of adding more surface.
2. **It matches the pivot** — meetings + routines on the home page *is* the
   Prep → Capture → Compound loop made visible.
3. **Personalization is nearly free** — six audiences from one config.
4. **It stays on-brand** — extends "Warm Intelligence," doesn't clone a competitor.
5. **It's a low backend lift** — aggregation endpoints, not new systems.

---

## 9. Suggested next steps

1. Review the mockup live (`npm run dev`) using `DEMO-SCRIPT.md`.
2. Decide which not-yet-built surfaces matter for v1 (see `04-FEATURE-COVERAGE.md`).
3. Build `GET /v2/dashboard/today` and wire the mockup to real data behind a feature flag.
4. Port `lib/icps.ts` into `app/web`.
5. Usability-test the onboarding with 2–3 people per ICP.
6. Add a ⌘K command palette (the natural Replit/Lovable-style power-user upgrade).

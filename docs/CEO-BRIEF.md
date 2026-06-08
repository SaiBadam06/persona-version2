# PersonaOn — New Interface Direction ("Command")

**Prepared for:** CEO review
**Deliverable:** Working Next.js mockup + this brief
**Date:** 2026-06-08

This covers the five asks: (1) the new interface direction, (2) onboarding analysis,
(3) backend changes needed, (4) ICP research, (5) the mockup itself.

---

## 1. The interface direction

A **single command surface** the user lands on at login, plus a **profile popup** for
everything that maintains the persona. The split the team asked for:

| | What lives here | Inspired by |
|---|---|---|
| **Command Dashboard** (home) | Everything you *do* daily — chat with your persona, prep/recap meetings, routines, open commitments, pipeline | ChatGPT command area · Granola meeting cards · Littlebird home (meetings + routines on the main page) |
| **Profile modal** (popup) | Everything you *maintain* — persona identity, voice, knowledge, connectors, analysis, sharing, billing | ChatGPT settings modal · Replit/Lovable clean overlays |

**Why this shape.** Today PersonaOn spreads daily work across ~20 dashboard routes
(`/dashboard/chat`, `/meetings`, `/knowledge`, `/studio`, `/share`, `/insights`…). Users
have to *navigate to* their work. The new direction inverts that: the work comes to one
surface (a command box + "Today"), and configuration collapses into one focused popup you
open only when you need it. Fewer routes, one obvious place to start, less to learn.

**Design language.** PersonaOn's own "Warm Intelligence" theme (light warm-paper, Playfair
serif headings) + ChatGPT's generous whitespace. The accent color **re-skins per ICP**.

---

## 2. Onboarding analysis (current flow)

**Current path** (`frontend/app/onboarding/`):

```
Sign up (Supabase: email/pw or Google/LinkedIn OAuth)
  → /onboarding  Step 1: name, headline, short intro, LinkedIn/website URL
  → Step 2: "Creating…"  — Firecrawl spark-1 runs a 5-step web research pass
            (LinkedIn → Google → social → press → personal site)
  → validate_profile_against_snapshot()  (wrong-person guard)
  → if profile rich  → status "active"      → Step 3: success + public link
     else            → status "needs_input" → gap-aware Interview (SSE Q&A)
  → Dashboard
```

### Broken / confusing points found in the code

| # | Issue | Where | Impact |
|---|-------|-------|--------|
| 1 | **Research failures are silent** | `routers/auto_create.py`, `ingestion.py` (resume enrich wrapped in non-fatal try/except) | If Firecrawl finds little or a PDF is a scanned image, the user lands on a thin persona with no explanation of *why* or what to do next. |
| 2 | **Two creation states, one confusing handoff** | `auto_create_state: active \| needs_input \| generating \| failed` | "needs_input" silently drops the user into an interview with no framing of how long it takes or why. No progress/skip affordance. |
| 3 | **Wrong-person edge cases** | `firecrawl_service.py` (needs 2 shared name tokens or last-name match) | Common names or maiden/changed names can fail the check and discard a correct profile, or pass a wrong one — with no user-facing correction step. |
| 4 | **Dead ends in nav** | `/dashboard/products`, `/dashboard/deep-research` built but unlinked; feature flags defined but **zero callers** | Built value is invisible; the nav implies completeness it doesn't have. |
| 5 | **No single "you're set up" moment** | success step | The win ("your persona is live, here's the link") competes with a 20-item dashboard. The aha is diluted. |
| 6 | **Onboarding ≠ daily use** | onboarding builds a *persona*; the new pivot is *meetings* | Onboarding never asks to connect a calendar — yet the website's promise ("Connect Google or Outlook") and the daily loop both depend on it. |

### What the new direction fixes
- **One command box** as the first thing post-onboarding → an obvious first action ("Prep my next meeting").
- **Connect-calendar becomes a first-class onboarding step** (it powers every brief).
- **Persona-completeness** moves into the profile modal's **Analysis** tab (score + named gaps + "fill via chat") instead of being a blocking interview.
- ICP is captured once at onboarding → the whole workspace tailors immediately.

---

## 3. Backend changes to support the new UI

The good news: most primitives already exist (chat stream, meetings/briefs, commitments,
memory candidates, voice, share). The new UI mostly needs **aggregation + 2 new concepts.**

| Change | Type | Detail |
|---|---|---|
| **`GET /v2/dashboard/today`** | New (aggregation) | One call returning today's meetings (with brief status), open commitments, active routines, and "drafted-for-you" items. Today the UI would need 4–5 separate calls; the command home needs one fast payload. |
| **`persona_type` / `icp` on `twins.settings`** | New field | Persists the selected ICP. Drives greeting, suggestion chips, default widgets, and brief templates. Already half-present as the architect's `pattern`; promote it to a first-class, user-settable field. |
| **`POST /v2/command`** | New (router) | A single endpoint behind the command box that classifies intent → **chat** (answer), **prep** (generate/return a brief), or **action** (draft follow-up, log commitment). Mirrors the existing persona-chat answer/edit/refuse pattern. |
| **Routines CRUD** | New | `routines` table + `GET/POST/PATCH /v2/routines`. Today routines are implied by `graph_outbox` jobs (briefs, recaps); the UI needs them as user-visible, toggleable objects. |
| **Commitments surfaced to home** | Wire existing | `meeting_commitments` + `memory_candidates` already exist (Phase 25+). Add `GET /v2/commitments?status=open` scoped to the user. |
| **Connectors status** | New (thin) | `GET /v2/connectors` returning connected/available per integration for the Connectors tab. Calendar OAuth + Recall sync already exist; this just reflects state. |
| **Profile settings aggregation** | New (aggregation) | `GET /v2/persona/overview` → identity, voice status, knowledge sources, persona score, share settings in one call for the modal. |
| **Suggestion chips per ICP** | Config/LLM | Either static per-ICP (as in this mockup) or generated from `profile_utils.generate_contextual_questions()` keyed by ICP. |

Security items already flagged in the repo audit still apply and should ride along:
wire `llm_safety` into the command/chat path, add SSRF validation on URL ingestion, move
the rate limiter off in-memory. (See `.gstack/security-reports/`.)

**Net:** ~3 small new tables/fields and ~4 aggregation endpoints. No re-platforming — the
new UI sits on top of the existing FastAPI + ADK + Supabase stack.

---

## 4. ICP research — tailoring per audience

Six ICPs, each gets a tailored command home (live in the mockup via the "Viewing as"
switcher, top-right). What changes per ICP: **accent color · greeting · command
placeholder · suggestion chips · which "Today" widgets lead · pipeline label.**

| ICP | Core pain | Greeting framing | Lead widgets | Signature suggestions |
|---|---|---|---|---|
| **Founders** | The investor circuit; context resets between rooms | "Walk in prepared" | Meetings → Commitments → Fundraise pipeline | "Prep me for my 2pm with Sequoia" |
| **Recruiters** | Same pitch 10× a day; candidates blur | "Let your persona pitch" | Meetings → Candidate pipeline → Follow-ups | "Summarize today's candidate calls" |
| **Consultants** | Selling expertise, not hours | "Your expertise, always on" | Meetings → Commitments → Follow-ups | "Scope an engagement from yesterday's call" |
| **Sales & AMs** | CRM goes thin between calls | "Never walk into a deal cold" | Deal pipeline → Meetings → Commitments | "What objections came up with Acme?" |
| **Investors** | Founder calls blur; theses get lost | "Remember every founder" | Meetings → Deal flow → Commitments | "Compare the two fintech founders I met" |
| **Managers & Execs** | Back-to-back; decisions get lost | "Stay ahead of the day" | Meetings → Commitments → Routines | "What decisions did we land in the QBR?" |

The underlying product is identical — only the **presentation, defaults, and language**
shift. One codebase, six felt experiences. This is the cheapest possible personalization:
a config object per ICP (`lib/icps.ts` in the mockup), not six different products.

---

## 5. The mockup

A real, runnable Next.js app (not a static image) so the CEO can click through it.

**Run it:**
```bash
cd "PersonaOn v2"
npm install
npm run dev      # http://localhost:3000
```

**What to try in the demo:**
1. Type in the command box (or click a suggestion chip) → a grounded persona reply streams in.
2. Switch the **"Viewing as"** dropdown (top-right) → the whole workspace re-skins per ICP.
3. Click the **user chip** (bottom-left) → the **Profile popup** opens with all 6 tabs
   (Persona, Knowledge, Connectors, Analysis, Sharing, Settings).
4. Scroll the home surface → the **"Today"** widgets (meetings with briefs, commitments,
   routines, pipeline).

**Stack:** Next.js 15 (App Router) · TypeScript · Tailwind v4 · lucide-react · mock data in
`/lib` (no backend required). Structured to map cleanly onto the real `app/web` later:
`lib/icps.ts` (the 6 ICP configs), `lib/mock-data.ts`, `components/` (Sidebar, CommandArea,
TodayPanel, profile/ProfileModal + tabs).

> This is a **frontend direction mockup** — data is mocked. Section 3 lists exactly what
> backend work makes it real.

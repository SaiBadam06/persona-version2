# PersonaOn — Loopholes, Risks & Gaps (for leads)

**Date:** 2026-06-08
**Audience:** Engineering, product, and security leads.
**What this is:** A plain-language list of the problems I found reviewing the real product
(`snsettitech/PersonaOn`), the website, and the older `persona-profile` repo. Each item says
**what it is, why it matters, and how to fix it** — so a lead can assign and prioritize it
without needing more context.

**Where these came from:** the security items are partly from the team's *own* internal
audit (`.gstack/security-reports/2026-03-27`) — I confirmed they're still present in the code.
The product/UX items are from reading the onboarding and dashboard code directly.

**How to read severity:**
🔴 Critical = could leak data or money; fix now. 🟠 High = real risk under load/abuse.
🟡 Medium = should fix. The product/UX items are about growth and trust, not breakage.

---

## 🔴 Critical — security

### 1. The app can be tricked into attacking our own cloud (SSRF)
- **What it is:** When a user asks the persona to "learn from this URL," the server fetches
  that URL. There's no check on *where* the URL points. An attacker can point it at an
  internal Google Cloud address (`169.254.169.254`) that hands back our server's credentials.
- **Why it matters:** Those credentials could give an attacker control over our cloud account.
  This is one of the most damaging web vulnerabilities (called **SSRF**).
- **The fix:** Block private/internal addresses before fetching. A validation function for
  this (`_validate_scrape_url`) **already exists in the codebase but isn't being called** on
  the ingestion path. Wire it in. **Effort: small. Priority: do this first.**

### 2. Live passwords/keys are sitting in a file on disk
- **What it is:** `backend/.env` contains real production secrets (database master key,
  Stripe, etc.), plus a weak test-account password.
- **Why it matters:** Anyone who can read that file — or if it's ever committed to git — has
  the keys to the kingdom, permanently.
- **The fix:** Rotate every key now, and load secrets from Google Secret Manager (production)
  and a developer vault (local) instead of a file. Add a pre-commit hook that blocks secrets.
  **Effort: small–medium. Priority: high.**

### 3. The "don't let users hijack the AI" filter isn't switched on for chat
- **What it is:** There's a safety module (`llm_safety`) that strips malicious instructions
  out of user input. It runs when importing documents, but **not** in the main chat path.
- **Why it matters:** Users can try "prompt injection" — tricking the persona into ignoring
  its rules or leaking another part of its data. Right now chat messages go to the model raw.
- **The fix:** Call the existing sanitizer before sending the message to the model.
  **Effort: ~1 line. Priority: high.**

---

## 🟠 High

### 4. The abuse limiter doesn't actually work at scale
- **What it is:** The cap on how often anonymous visitors can chat is stored in one server's
  memory. We run multiple servers. So the real limit is multiplied by the number of servers.
- **Why it matters:** A bot could blow past the intended limit and run up our AI bill or
  exhaust quota.
- **The fix:** Store the counter somewhere shared (Redis or the database) so all servers see
  one number. **Effort: small–medium.**

### 5. API-key checking is slow and leaks timing hints
- **What it is:** To validate an API key, the code loads *all* keys and checks them one by
  one with an expensive hash.
- **Why it matters:** It gets slower as we add customers, and the time it takes can leak
  information about valid keys to an attacker.
- **The fix:** Look up the one key directly by its hash. **Effort: small.**

### 6. A missing setting silently weakens login security
- **What it is:** If the `JWT_SECRET` config is missing, the app quietly falls back to a
  weaker token-validation path instead of refusing to start.
- **Why it matters:** A misconfiguration in production could downgrade security without anyone
  noticing.
- **The fix:** Require the secret at startup; fail loudly if it's absent. **Effort: small.**

---

## 🟡 Medium

| # | What it is | Why it matters | Fix |
|---|---|---|---|
| 7 | The embeddable website widget puts user-provided text straight into the page HTML | A malicious embedder could run scripts on a visitor's page (XSS) | Escape the text before inserting |
| 8 | Some errors return the raw internal message to the user | Leaks database/structure details to attackers | Log details server-side, return a generic message |
| 9 | No length cap on chat/edit inputs | Lets someone send huge prompts (cost / abuse) | Add sensible max lengths |

---

## 🧭 Product & UX gaps (growth and trust, not bugs)

### P1. The website promises meeting recording but has no legal pages
`/terms`, `/privacy`, and `/contact` currently return 404. For a product that **records
people's meetings**, missing Terms and Privacy is a trust and compliance problem — and a
blocker for selling to any company with a procurement process. **Fix: publish these pages.**

### P2. Onboarding fails silently
If the web research finds little, or an uploaded résumé is an unreadable scan, the code
swallows the error and the user lands on a thin, empty-feeling persona **with no explanation
and no obvious next step**. This is exactly the moment users decide whether to stay. **Fix:
detect the thin result and guide the user ("we couldn't find much — add a link or answer 3
questions").**

### P3. The "we need more info" handoff is confusing
When a persona is incomplete, the user is dropped into an AI interview with no framing — no
"this takes 2 minutes," no progress, no skip. It feels like a dead end rather than a guided
step. **Fix: frame it, show progress, allow skip.**

### P4. The "is this the right person?" check is brittle
The system guesses whether the researched person is really you by matching name tokens. Common
names, maiden/changed names, or nicknames can make it **throw away a correct profile or accept
a wrong one** — with no way for the user to correct it. **Fix: add a "is this you?" confirm
step.**

### P5. Built features are invisible
Whole pages (`/dashboard/products`, `/dashboard/deep-research`) are built but **not linked in
the menu**, and a feature-flag system exists with **no code actually using it**. We've paid to
build things users can't reach. **Fix: surface or remove them; decide.**

### P6. The dashboard has too many doors (~48 pages)
Users have to *navigate to* their work across ~20 dashboard sections. It's a lot to learn and
slows everyone down. **This is the core problem the new "Command" direction solves** (see
`03-NEW-APP-DESIGN.md`): bring the work to one home surface, push settings into one popup.

### P7. Onboarding never connects a calendar
The entire value loop (briefs before meetings, recaps after) depends on calendar access — but
onboarding never asks for it. Users only discover it later, if at all. **Fix: make
calendar-connect a first-class onboarding step** (already shown in the new mockup's onboarding).

### P8. Two web apps running in parallel
The old frontend serves the site while a new one is being built. Normal during a pivot, but
it's **double the maintenance and risks drift** until the team commits to the cutover.

---

## 🧩 Technical debt (lower urgency, worth tracking)

| # | Item | Note |
|---|------|------|
| T1 | The internal map (`CODEBASE.md`) is out of date — says "Pinecone," but the system now uses pgvector | Will mislead new engineers/agents; refresh it |
| T2 | The interview AI is rebuilt from scratch on every question | Works, but wasteful; could be cached |
| T3 | Meeting search results are re-ranked in code after the database query | Fine now, less efficient at scale |
| T4 | A fallback path can hide real AI errors | Add logging so failures are visible |
| T5 | Pricing differs between internal docs ($39) and the live site ($14.99) | Pick one source of truth |

---

## The older `persona-profile` repo (only relevant if it's still in use)

- The "published profile page" is **not real** — it ignores the URL and just shows whatever's
  cached in the current browser. No database, no real sharing between people.
- Has the same **SSRF** issue, no rate limiting, and an open CORS default.
- The frontend and a duplicate Express backend have drifted apart.
- A debug file (`g.json`) is committed that shouldn't be.

---

## Recommended order of attack

1. **SSRF fix + turn on the chat input sanitizer** (small, critical).
2. **Rotate secrets → Secret Manager.**
3. **Shared rate limiter.**
4. **Publish Terms / Privacy / Contact.**
5. **Fix the onboarding aha** (silent failures, framing, calendar-first).
6. **Refresh `CODEBASE.md`.**
7. **Plan the old-frontend → new-app cutover.**

Items 1–4 are mostly small, high-leverage fixes. Items 5–7 are the strategic ones.

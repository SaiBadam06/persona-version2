# Demo Script — PersonaOn "Command" (for the CEO walkthrough)

**Run:** `npm run dev` → open `http://localhost:3000`. ~4 minutes.

---

### 0. Frame it (15s)
> "The brief was a ChatGPT + Granola + Littlebird direction — a central command area and a
> streamlined flow. I built it as a real, clickable Next.js app. Two surfaces: one for what
> you **do** every day, one popup for everything you **maintain**. And it tailors to all six
> of our ICPs."

### 1. The Command Dashboard — "everything you do" (45s)
- Land on `/`. Point out the **central command area** (greeting + big input) — *"ChatGPT's front door."*
- Scroll to **Today**: meetings with a pre-brief, open commitments, routines, pipeline — *"Granola + Littlebird: the meeting is the unit of work, on the home page."*
- Left sidebar: New/Search/Meetings/Routines/Knowledge — *"one surface, not 20 routes."*

### 2. Talk to the persona (30s)
- Type **"Prep me for my 2pm with Sequoia"** (or click a suggestion chip) → a grounded reply streams in with source chips.
- *"Every answer traces to a real source — calendar, recaps, profile. Never invented."*

### 3. The ICP switcher — the differentiator (45s)
- Top-right **"Viewing as"** → switch **Founders → Sales → Investors**.
- *"Watch the whole workspace re-skin: accent, greeting, the prompts, which widgets lead. Same product, six felt experiences — one config file, no forks."*

### 4. The Profile popup — "everything you maintain" (45s)
- Click the **user chip** (bottom-left) → the popup opens.
- Tab through: **Persona** (identity, voice, boundaries) → **Knowledge** (sources) →
  **Connectors** (calendar/CRM) → **Analysis** (persona score + gaps) → **Sharing** → **Settings**.
- *"ChatGPT's settings-modal pattern — config stays out of your daily path."*

### 5. The streamlined onboarding (40s)
- Top-right **"View onboarding"** (or visit `/onboarding`).
- Walk the 5 steps: **pick your ICP → connect LinkedIn → connect calendar → building →
  you're live.**
- *"This fixes three onboarding problems I found in the current product: ICP is captured up
  front, calendar-connect is first-class (it powers every brief), and there's one clear
  'you're live' moment."*
- Pick an ICP, finish → **"Enter command center"** lands in a dashboard already tailored to it.

### 6. Close (20s)
> "It's a frontend direction — data is mocked. To make it real the backend needs about four
> aggregation endpoints and one new field; no re-platforming, it sits on our existing stack.
> Full write-up, onboarding analysis, backend changes, and ICP research are in the docs."

---

### If asked…
- **"Is this our theme?"** — Yes: PersonaOn's Warm Intelligence (Playfair + warm paper) with ChatGPT whitespace.
- **"How hard to ship?"** — Frontend ports into `app/web`; backend is ~4 endpoints + 1 field (see `CEO-BRIEF.md` §3).
- **"What about the other references?"** — Replit/Lovable inform the clean single-surface feel; a ⌘K command palette is the natural next add.
- **"What did you find wrong today?"** — See `02-PRODUCT-LOOPHOLES.md` (onboarding silent failures, nav overload, plus security items from the repo's own audit).

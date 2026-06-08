# What Each View Does Per ICP — the differences explained

**Date:** 2026-06-08
**Audience:** Product / design / eng leads.
**The question this answers:** "You kept different views per ICP — what's actually different
between them?"

---

## 0. The key idea first (read this)

**The *structure* is identical for all 6 ICPs.** Everyone gets the same surfaces: a command
area, the same left-nav views (Ask / Search / Meetings / Routines), the same "Today" panel,
and the same Profile popup.

**What changes per ICP is the *content and framing*, driven by one config file
(`lib/icps.ts`).** There are exactly **6 levers** that change:

| Lever | What it controls |
|---|---|
| 1. **Accent color** | The whole UI re-tints (buttons, highlights, active states) |
| 2. **Greeting** | The big headline on the home page |
| 3. **Command placeholder** | The hint text inside the main input box |
| 4. **Suggestion chips** | The 4 example prompts under the input |
| 5. **"Today" widget order** | Which cards lead on the home surface (meetings, commitments, routines, pipeline, follow-ups) |
| 6. **Pipeline label** | What the pipeline card is *called* for that audience |

On top of that, the **mock data itself is ICP-specific** — the meetings, commitments, and
routines shown are written for that audience (a founder sees investor meetings; a recruiter
sees candidate screens).

So it's not 6 different apps — it's **one app that speaks each audience's language**. That's
deliberate: it's the cheapest, most maintainable form of personalization.

---

## 1. Master comparison (all 6 ICPs, side by side)

| | Accent | Greeting | "Today" leads with | Pipeline is called |
|---|---|---|---|---|
| **Founders** | Teal | "Walk in prepared" | Meetings → Commitments → Pipeline → Routines | **Fundraise pipeline** |
| **Recruiters** | Purple | "Let your persona pitch" | Meetings → Pipeline → Follow-ups → Routines | **Candidate pipeline** |
| **Consultants** | Blue | "Your expertise, always on" | Meetings → Commitments → Follow-ups → Routines | **Engagement pipeline** |
| **Sales & AMs** | Amber | "Never walk into a deal cold" | **Pipeline** → Meetings → Commitments → Follow-ups | **Deal pipeline** |
| **Investors** | Green | "Remember every founder" | Meetings → Pipeline → Commitments → Routines | **Deal flow** |
| **Managers & Execs** | Slate | "Stay ahead of the day" | Meetings → Commitments → Routines → Follow-ups | **Team & stakeholders** |

Notice the **ordering differences**: Sales leads with the **pipeline** (their deals are the
job); Founders/Investors lead with **meetings** (the conversation is the job); Execs push
**routines** up (they live in recurring syncs).

---

## 2. What each "Today" widget shows (the building blocks)

These are the cards that get reordered per ICP:

| Widget | What it shows |
|---|---|
| **Meetings** | Today's calls — upcoming ones carry a **pre-brief**, past ones carry a **recap**. Spans the full width. |
| **Commitments** | Open promises — "you owe X" vs "they owe you Y", with who and when. |
| **Routines** | Standing automations (briefs, recaps, digests) and whether they're on. |
| **Pipeline** | A 3-bar progress view (active / waiting-on-me / closing) — **relabeled per ICP**. |
| **Follow-ups** | Drafts the persona already prepared (emails, recaps, nudges) waiting for your OK. |

Every ICP gets meetings (it's the core), but the *secondary* cards and their order reflect
what that audience cares about most.

---

## 3. Per-ICP detail

### 🟢 Founders — "Walk in prepared"
- **Who:** running the investor circuit; context resets between rooms.
- **Command hint:** "Prep a meeting, ask your persona, or draft a follow-up…"
- **Signature prompts:** *"Prep me for my 2pm with Sequoia" · "What did I commit to Acme last week?" · "Draft an update for my angels" · "Who haven't I followed up with?"*
- **Today leads with:** Meetings (investor calls with briefs) → Commitments → **Fundraise pipeline** → Routines.
- **Mock data flavor:** Sequoia/Accel meetings, "send the data room" commitments, a daily investor-brief routine.
- **Why:** founders live and die by investor conversations and what they promised in them.

### 🟣 Recruiters — "Let your persona pitch"
- **Who:** same pitch ten times a day; candidates blur together.
- **Command hint:** "Brief a candidate call, summarize a screen, or draft outreach…"
- **Signature prompts:** *"Prep me for the senior PM screen at 3pm" · "Summarize today's candidate calls" · "Draft a follow-up to the 3 strong candidates" · "Which roles am I behind on?"*
- **Today leads with:** Meetings (candidate screens) → **Candidate pipeline** → Follow-ups → Routines.
- **Mock data flavor:** PM screens, "send comp band" commitments, a pre-screen brief routine.
- **Why:** their job is volume + follow-through, so pipeline and follow-ups rank high.

### 🔵 Consultants — "Your expertise, always on"
- **Who:** selling expertise, not hours.
- **Command hint:** "Prep a discovery call, scope an engagement, or send a recap…"
- **Signature prompts:** *"Prep my discovery call with Brightline" · "What's the scope we discussed with Acme?" · "Draft a proposal recap from yesterday's call" · "Summarize open commitments across clients"*
- **Today leads with:** Meetings (discovery calls) → Commitments → Follow-ups → Routines.
- **Mock data flavor:** discovery + scope meetings, "send the SOW" commitments, a client-recap routine.
- **Why:** consultants win on scoping clarity and timely recaps; commitments per client matter most.

### 🟠 Sales & Account Managers — "Never walk into a deal cold"
- **Who:** CRM goes thin between calls.
- **Command hint:** "Prep an account, log a call, or draft the next-step email…"
- **Signature prompts:** *"Prep me for the Northwind renewal call" · "What objections came up with Acme last time?" · "Draft next steps for my 3 open deals" · "Which accounts are going quiet?"*
- **Today leads with:** **Deal pipeline** (first!) → Meetings → Commitments → Follow-ups.
- **Mock data flavor:** renewals + discovery, "book the solutions-eng call" commitments, a CRM-auto-log routine.
- **Why:** the pipeline *is* the job — so it's the first thing they see, not meetings.

### 🟩 Investors — "Remember every founder"
- **Who:** founder calls blur; theses get lost.
- **Command hint:** "Prep a founder call, compare companies, or log a thesis…"
- **Signature prompts:** *"Prep me for the seed call with Cadence Labs" · "Compare the two fintech founders I met this week" · "What did I promise to intro last meeting?" · "Summarize my pipeline by stage"*
- **Today leads with:** Meetings (founder calls) → **Deal flow** → Commitments → Routines.
- **Mock data flavor:** seed/partner-pitch meetings, "make 2 intros" commitments, a founder-brief routine.
- **Why:** memory across many founders + tracking promised intros is their pain; note the unique
  *"compare two founders"* prompt.

### ⚫ Managers & Executives — "Stay ahead of the day"
- **Who:** back-to-back meetings; decisions and context reset.
- **Command hint:** "Prep a meeting, ask across your notes, or draft a recap…"
- **Signature prompts:** *"Prep me for the leadership sync at 11" · "What decisions did we land in last week's QBR?" · "Draft a recap for my skip-level" · "What's still open from my 1:1s?"*
- **Today leads with:** Meetings → Commitments → **Routines** (pushed up) → Follow-ups.
- **Mock data flavor:** leadership syncs + 1:1s, "board one-pager" commitments, a decision-log routine.
- **Why:** execs live in recurring meetings and decisions, so routines and decision-capture rank high.

---

## 4. What is the SAME for every ICP

So expectations are clear — these do **not** change between ICPs:
- The left-nav **Search**, **Meetings**, and **Routines** views (same layout; only the data differs).
- The **Profile popup** and all 6 of its tabs (Persona, Knowledge, Connectors, Analysis, Sharing, Settings).
- The **onboarding flow** (except it remembers which ICP you picked).
- The connector row, the chat behavior, and the overall visual system.

---

## 5. Where this lives in the code

- **`lib/icps.ts`** — the 6-ICP config object. All six levers (accent, greeting, placeholder,
  suggestions, widget order, pipeline label) are here. **Edit this to change any ICP.**
- **`lib/mock-data.ts`** — the per-ICP meetings, commitments, and routines content.
- **`lib/store.tsx`** — applies the accent and remembers the selected ICP.

To add a 7th ICP: add one entry to `ICPS` in `lib/icps.ts` and one set of mock data — no new
components needed. That's the whole point of the config-driven approach.

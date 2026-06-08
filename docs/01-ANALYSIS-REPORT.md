# PersonaOn — Complete Analysis Report

**Author:** Prepared during a deep code + product review
**Date:** 2026-06-08
**Audience:** Leads (engineering, product, design) who need a single, accurate picture of
what PersonaOn is today.
**How to read this:** Sections 0–1 are for everyone. Sections 2–6 get progressively more
technical (backend, frontend, data, infra) — skim the bolded lines if you're not hands-on
with that area. Every claim here comes from reading the actual code, not marketing.

---

## 0. Executive summary (read this if nothing else)

**What PersonaOn is:** a product that builds an **AI "digital twin" of a real person** and
then puts that twin to work around **meetings**. You connect your LinkedIn/website/documents;
the system researches you and builds a persona that talks in your voice; that persona then
**briefs you before meetings, (optionally) joins and records them, and writes the recap
after** — getting smarter from every conversation. The tagline is *"Meeting prep that
compounds."*

**Three things every lead should know:**

1. **There are three separate codebases with the same name.** Confusing them causes wrong
   decisions. Only one is the real product (table below).
2. **The product is mid-pivot.** It started as "build a persona people can chat with" and is
   now becoming "a persona that runs your meeting prep." Both halves exist in the code today.
3. **It's a serious, well-built system** — FastAPI + Google's agent framework, Supabase,
   Google Cloud — with **known security gaps the team has already documented** but not all
   fixed (see the companion doc `02-PRODUCT-LOOPHOLES.md`).

| Codebase / surface | What it actually is | Status |
|---|---|---|
| **`snsettitech/PersonaOn`** | **The real product.** A monorepo containing the backend, the website, the dashboard, and a desktop app. | Live — powers personaon.com |
| `SaiBadam06/persona-profile` | A **separate, older** experiment: an AI profile-page + chat builder. Different tech (Groq), no voice, no meetings. | Standalone prototype |
| `personaon.com` | The marketing site. Served by the real product's web app. | Live |

> **Jargon note:** a *"twin"* or *"persona"* = one user's AI version of themselves. The code
> uses "twin" everywhere; the product calls it "persona."

---

## 1. The product, in plain terms

### What a user does
1. **Signs up** and connects LinkedIn (or types their details in).
2. The system **researches them across the web** (LinkedIn, Google, social, press, their own
   site) and drafts a persona — only from real, found facts; it's instructed never to invent.
3. If anything's missing, a short **AI interview** asks a few questions to fill the gaps.
4. The persona is now **live**: it can answer questions on a public page, in a website
   widget, or help the owner directly.
5. For meetings, the persona **prepares a brief** (who you're meeting, your history, what to
   raise), a **bot can join and transcribe** the call, and afterwards you get a **recap** with
   decisions and follow-ups. Over time this "compounds" into memory.

### The promise that makes it different
**"Real, not synthetic."** Every answer the persona gives must trace back to a real
source — a meeting you had, an edit you made, or a document you uploaded. If it doesn't know,
it's supposed to say so rather than make something up. This is the product's core trust claim,
and it's enforced in the code (it pulls from a verified knowledge base and is told to defer
when unsure).

### What it costs (from the live pricing page)
- **Free** — $0, 500 conversations/month, 1 persona, public page.
- **Pro — $14.99/month** — 5,000 conversations, 30 voice minutes, website widget, lead
  capture, calendar booking, branding removal. (Annual saves 17%.)
- **Business — custom** — meeting bot, custom domain, team seats with single-sign-on, CRM
  sync, API access.

The site states the AI runs on **Google Gemini + ElevenLabs** (voice), used "for inference,
not training." This matches the code.

### Who it's for (the 6 ICPs we're designing around)
Founders, Recruiters, Consultants, Sales & Account Managers, Investors, and Managers &
Executives — all people who take lots of high-stakes meetings and need to walk in prepared.

---

## 2. How the system is put together (architecture)

Think of it as four moving parts:

```
   You (browser / desktop app)
            │  secure web requests + live streaming
            ▼
   BACKEND  — the "brain". A Python service (FastAPI) using Google's Agent framework.
            │  It decides what the persona says, runs research, and orchestrates meetings.
            ▼
   DATABASE — Supabase (a hosted Postgres database) stores users, personas, meetings,
            │  and the "knowledge" the persona searches. It also stores the AI's memory as
            │  searchable vectors (see §5).
            ▼
   WORKER   — a background service that does slow jobs (processing a meeting transcript,
              re-indexing knowledge) without making the user wait.

   External services it calls: Google Gemini (the language model), ElevenLabs (voice),
   Recall.ai (the meeting-recording bot), Firecrawl (web research).
```

**The surfaces (what users actually see):**

| Surface | Built with | What it's for | Status |
|---|---|---|---|
| `frontend/` | Next.js (React) | The **current** website + full dashboard | Live, serves personaon.com |
| `app/web` | Next.js (newer) | The **new** "command / notes" home — the pivot | In progress |
| `app/desktop` | Electron (a desktop app) | **Capturing** meetings on your computer | In progress (~80%) |
| `backend/` | FastAPI + Google ADK | The brain — 28 API endpoints | Live |

> **Why two web frontends?** The team is rebuilding the experience (`app/web`) while keeping
> the old one (`frontend/`) running. This is normal during a pivot but means double
> maintenance until they switch over.

---

## 3. The backend (the brain) — how it works

This is the most important part to understand because it's where the "intelligence" lives.

### When you chat with a persona, step by step
1. **Security check** — confirms who you are and that this persona belongs to your account
   (multi-tenant isolation, so one customer can never see another's data).
2. **Memory search** — before answering, it searches that persona's knowledge for the 5 most
   relevant pieces (meeting recaps, profile facts, uploaded docs).
3. **The agent answers** — Google's **Gemini 2.5 Flash** model generates the reply, *using
   only the retrieved knowledge as context*, and streams it back word-by-word. It has "tools"
   it can call — e.g., search the knowledge base again, or capture a new fact the owner just
   told it.
4. **Save + measure** — the conversation is stored, and product analytics are logged.

> **One nice engineering detail:** the system reuses ("caches") the persona's agent between
> requests for speed, but injects the fresh per-question context separately so it never
> pollutes the cache. This is a thoughtful performance choice.

### How a persona gets created (onboarding)
A research agent (**Firecrawl "spark-1"**) runs a **5-step web sweep**: LinkedIn → Google →
social media → press/interviews → personal website. It's explicitly told **not to invent
anything**, and there's a **"wrong person" check** so it doesn't build your persona out of a
stranger with the same name. If the result is thin, a short **gap-aware interview** asks
targeted questions and saves the answers into memory.

### How meetings work (the pivot)
A **Recall.ai** bot (or the desktop app) joins/records the meeting. When it's done, the system
processes the transcript in the background: it generates a **brief** beforehand, a **recap**
afterward, identifies **who said what**, and extracts **commitments** ("you owe them X") and
**memory candidates** (facts worth remembering). Voice replies use **ElevenLabs** to sound
like the user.

---

## 4. The frontend (what users see) — feature surface

The **current** dashboard is large — roughly **48 pages**. Grouped:

- **Build your persona:** profile editor, knowledge base (upload files, add URLs, YouTube,
  podcasts, X/Twitter, raw text), "studio" (set tone and boundaries).
- **Use it:** chat with your persona, conversation history, a queue of questions visitors
  asked, and a meetings area (bookings, live room, upcoming, past, follow-up threads).
- **Share it:** a public persona page, an embeddable website widget, QR code, email
  signature, and a marketplace listing.
- **Run it:** analytics/insights, billing, API keys, integrations, settings (including voice
  cloning).

**Voice features are real:** the persona can speak replies (ElevenLabs), you can talk to it
(browser microphone), and there's an early live-voice-call capability.

**The new direction** (`app/web` + the desktop app) is the meeting-capture experience: a
notes/command home, a recordings list, and a meeting detail view (Note / Summary / Transcript)
with live transcript streaming. About 80% of the capture loop is built; the "merge my notes
with the transcript into enhanced notes" and "email me the recap" pieces are not finished yet.

---

## 5. The data (where everything is stored)

Everything lives in **Supabase (Postgres)** — 30+ tables — and each row is tagged with a
`tenant_id` so customers are strictly separated. The important groups:

- **People & personas:** `users`, `twins` (the persona, with a flexible `settings` blob),
  `connected_accounts` (LinkedIn/Google logins).
- **Knowledge:** `sources` (uploaded files/URLs), `chunks` (the searchable AI memory),
  `verified_qna` (curated answers), `citations` (proof behind answers).
- **Meetings:** `meetings`, `meeting_participants`, transcript segments, `meeting_commitments`,
  `memory_candidates`, `contacts`, plus calendar `booking_requests`.
- **Plumbing:** `graph_outbox` is a job queue for the background worker.

> **"Vector memory" explained:** the persona's knowledge is stored as **vectors** (numerical
> fingerprints of text) so the system can find *meaning-similar* content, not just keyword
> matches. The team recently moved this from a separate service (Pinecone) into the database
> itself (pgvector) — a simplification. *Note: one internal doc still says "Pinecone"; it's
> out of date.*

---

## 6. Infrastructure & how it ships

- Runs on **Google Cloud Run** (three services: the API, the web app, the worker).
- **Deploys automatically** when code is merged, via GitHub Actions, using keyless cloud
  authentication (no long-lived secrets in the pipeline — good practice).
- **Automated checks** on every change: no banned dependencies, no leaked secrets, database-
  migration hygiene, type-checking, and tests.
- **Paid services wired in:** Stripe (billing), Resend (email), PostHog (analytics),
  ElevenLabs, Recall.ai, Firecrawl.

**Engineering discipline is high:** strict file-size limits, mandatory ownership checks on
every endpoint, a design-system-only UI rule, and feature flags on new work. For a small team
this is unusually disciplined and is a real asset.

---

## 7. Where the product is headed

- **Done:** persona creation, chat, marketplace, a brand refresh ("Warm Intelligence").
- **In progress:** finishing the meeting-intelligence experience (the new web + desktop apps),
  and a behind-the-scenes upgrade to the memory/citation system.
- **Watch-outs:** the marketing site promises meeting prep, but the legal pages
  (Terms/Privacy/Contact) currently 404 — a gap for a product that records meetings. Pricing
  also differs between internal docs ($39) and the live site ($14.99).

---

## 8. What to do with this

- **Product/leadership:** the strategy is sound and the pivot is real and mostly built. The
  biggest near-term risks are *trust/compliance* (legal pages, security fixes) and *focus*
  (two frontends, lots of half-surfaced features).
- **Engineering:** prioritize the security fixes in `02-PRODUCT-LOOPHOLES.md`, finish the
  meeting "compound" layer, and plan the cutover from the old frontend to the new one.
- **Design:** the navigation is overloaded (~48 routes) — the new "Command" direction (see
  `03-NEW-APP-DESIGN.md`) is the proposed fix.

**Companion documents:**
`02-PRODUCT-LOOPHOLES.md` (risks & fixes) · `03-NEW-APP-DESIGN.md` (the new interface) ·
`04-FEATURE-COVERAGE.md` (what the mockup does/doesn't include) · `CEO-BRIEF.md` · `DEMO-SCRIPT.md`.

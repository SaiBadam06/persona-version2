# PersonaOn — Documentation

A complete, self-contained set of documents covering the product analysis, the issues found,
and the new interface direction. Written so leads who weren't part of the review can read them
standalone — no prior context needed. Every claim comes from reading the actual code.

## Reading guide — who should read what

| If you are… | Start with | Then |
|---|---|---|
| **Leadership / founder** | `01-ANALYSIS-REPORT.md` §0 (exec summary) → `03-NEW-APP-DESIGN.md` §1–5 | `02-PRODUCT-LOOPHOLES.md` (risks) |
| **Product lead** | `03-NEW-APP-DESIGN.md` → `04-FEATURE-COVERAGE.md` | `02-PRODUCT-LOOPHOLES.md` (P-items) |
| **Engineering lead** | `01-ANALYSIS-REPORT.md` §2–6 → `02-PRODUCT-LOOPHOLES.md` | `03-NEW-APP-DESIGN.md` §7 (implementation) |
| **Design lead** | `03-NEW-APP-DESIGN.md` §3–6 | run the mockup + `DEMO-SCRIPT.md` |
| **Security** | `02-PRODUCT-LOOPHOLES.md` 🔴/🟠 sections | — |

## The documents

| Doc | What's in it |
|-----|--------------|
| [01-ANALYSIS-REPORT.md](01-ANALYSIS-REPORT.md) | **The complete picture** — what PersonaOn is, the three codebases, the architecture, backend brain, frontend surfaces, data, infrastructure, and roadmap. Plain-language with an exec summary up top. |
| [02-PRODUCT-LOOPHOLES.md](02-PRODUCT-LOOPHOLES.md) | **Every issue found** — security (SSRF, secrets, sanitizer, rate limiter), product/UX gaps (legal pages, onboarding, navigation), and tech debt. Each item: what it is, why it matters, how to fix, in priority order. |
| [03-NEW-APP-DESIGN.md](03-NEW-APP-DESIGN.md) | **The new interface** — the reasoning, what we took from ChatGPT/Granola/Littlebird/Replit/Lovable and why, the 6-ICP personalization, what's built, and how engineering ships it for real. |
| [04-FEATURE-COVERAGE.md](04-FEATURE-COVERAGE.md) | **Honest scope** — exactly which product features the mockup does and doesn't include. |
| [05-ICP-VIEWS.md](05-ICP-VIEWS.md) | **Per-ICP differences** — what changes between the 6 audiences (and what stays the same), lever by lever. |
| [06-AUDIT.md](06-AUDIT.md) | **Mockup audit** — feature parity matrix (real product vs. mockup) + a does-every-button-work functional check. |
| [CEO-BRIEF.md](CEO-BRIEF.md) | The CEO's 5 asks answered: interface direction · onboarding analysis · backend changes · ICP research · the mockup. |
| [DEMO-SCRIPT.md](DEMO-SCRIPT.md) | A ~4-minute click-through script for presenting the mockup live. |

## The mockup

A runnable Next.js app demonstrating the new direction.

```bash
npm install
npm run dev      # http://localhost:3000   (and /onboarding)
```

- **Command dashboard** at `/` — left nav (Ask/Search/Meetings/Routines) all functional;
  Knowledge opens the profile popup.
- **"Viewing as"** (top-right) — switch between the 6 ICPs and watch the workspace re-skin.
- **User chip** (bottom-left) — opens the profile popup (6 tabs).
- **`/onboarding`** — the streamlined sign-up flow.

Frontend-only with mock data. `03-NEW-APP-DESIGN.md` §7 lists the backend work to make it real.

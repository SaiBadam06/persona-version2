# PersonaOn — "Command" interface mockup

A new interface direction for PersonaOn, inspired by **ChatGPT** (central command area +
settings popup), **Granola / Littlebird** (meetings + routines on the home surface), and
**Replit / Lovable** (clean, fast product feel) — in PersonaOn's own warm light theme.

Two surfaces:
- **Command Dashboard** — everything you *do* (chat, meetings, routines, commitments) on one page.
- **Profile popup** — everything you *maintain* (persona, knowledge, connectors, analysis, sharing, settings).

Tailors live for **6 ICPs**: Founders · Recruiters · Consultants · Sales & Account Managers ·
Investors · Managers & Executives (switch via "Viewing as", top-right).

## Run

```bash
npm install
npm run dev      # http://localhost:3000
```

Frontend-only — all data is mocked in `lib/`. No backend required.

## Try in a demo
1. Type in the command box (or click a suggestion) → grounded persona reply streams in.
2. Switch **"Viewing as"** (top-right) → the workspace re-skins per ICP.
3. Click the **user chip** (bottom-left) → the **Profile popup** with 6 tabs.
4. Scroll → the **"Today"** widgets (meetings, commitments, routines, pipeline).

## Structure
```
app/            layout, globals.css (theme tokens), page.tsx (dashboard)
lib/
  icps.ts       the 6 ICP configs (accent, greeting, chips, widgets)
  mock-data.ts  meetings, commitments, routines, connectors, knowledge
  store.tsx     ICP + profile-modal state
components/
  Sidebar · TopBar · IcpSwitcher · CommandArea · TodayPanel
  profile/ProfileModal + tabs/{Persona,Knowledge,Connectors,Analysis,Sharing,Settings}
docs/CEO-BRIEF.md   onboarding analysis · backend changes · ICP research
```

See **`docs/CEO-BRIEF.md`** for the full write-up.

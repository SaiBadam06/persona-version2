# Feature Coverage — Mockup vs. Real Product

**Date:** 2026-06-08
**Question:** Does the generated webapp contain all the features from personaon.com and the
`snsettitech/PersonaOn` repo?

> **Update (v2):** Coverage was expanded so that **every feature visible in the real
> PersonaOn frontend and in the reference apps now has a home in the mockup** (placement/size
> may differ). Newly added: **Conversations + Queued questions**, **Actions / Triggers /
> Approval inbox**, **Insights / Analytics**, **Marketplace**, **Projects**, a **Meeting
> Detail** view (Brief/Transcript/Recap/Actions), **Draft previews**, plus reference-app
> touches (New chat, Share, Voice, "Context enabled", embed code, Team, YouTube/podcast/X
> sources). The table below is the original first-pass coverage; the matching rows are now
> built. Still mock data — no backend.

**Short answer:** This is a **UI direction mockup** (the new command-dashboard + profile-popup
concept the CEO asked for), with **mock data and no backend**. As of v2 it now *represents the
full breadth* of the product — every major surface and button has a suitable place — but the
data is mocked and the depth is illustrative.

Legend: ✅ represented in the mockup (UI present, mocked) · ◐ partially / hinted · ❌ not built

---

## Core persona & chat

| Feature (real product) | In mockup? | Notes |
|---|---|---|
| Talk-to-your-persona chat | ◐ | Command area streams a **mock** reply with source chips. Not wired to `/v2/chat`. |
| Grounded answers + citations | ◐ | Source chips shown ("Calendar, Recaps, LinkedIn") but not real retrieval. |
| Owner / widget / public chat modes | ❌ | Only the owner view exists. |
| Suggested questions | ✅ | Per-ICP suggestion chips. |
| Conversation history page | ❌ | Not built. |
| Queued visitor questions | ❌ | Not built. |

## Onboarding & persona creation

| Feature | In mockup? | Notes |
|---|---|---|
| Sign-up / auth | ❌ | No auth — mockup starts logged in. |
| LinkedIn / manual onboarding | ✅ | `/onboarding` step shows both. |
| Firecrawl web-research "building" screen | ✅ | Animated, **simulated**. |
| Gap-aware interview | ❌ | Replaced by the Analysis-tab "fill via chat" idea. |
| Calendar connect in onboarding | ✅ | Added as a first-class step (a fix vs. today). |
| ICP selection | ✅ | **New** — not in the real product. |

## Meetings (the pivot)

| Feature | In mockup? | Notes |
|---|---|---|
| Today's meetings with pre-briefs | ✅ | "Today" widget, mock cards. |
| Past meetings with recaps | ✅ | Mock recap cards. |
| Open commitments (you owe / they owe) | ✅ | "Today" widget, mock. |
| Routines | ✅ | "Today" widget, mock, per-ICP. |
| Recall.ai bot / desktop capture | ❌ | Not in mockup (it's backend + Electron). |
| Live transcript view | ❌ | Not built. |
| Recap editing (tldr/topics/action items) | ❌ | Recaps shown read-only. |
| Calendar booking flow | ❌ | Connect shown; booking flow not built. |

## Knowledge

| Feature | In mockup? | Notes |
|---|---|---|
| Knowledge sources list | ✅ | Knowledge tab (LinkedIn, resume, site, meetings, files). |
| Upload file / add URL / manual | ◐ | Buttons present, non-functional. |
| YouTube / podcast / X ingestion | ❌ | Not represented. |
| Studio (tone / boundaries training) | ◐ | Boundaries + tone live in the Persona tab; no full studio. |

## Voice

| Feature | In mockup? | Notes |
|---|---|---|
| Voice clone status | ✅ | Shown as a card in Persona tab. |
| TTS playback per message | ❌ | Not in mock chat. |
| Mic / voice input | ◐ | Mic button shown, non-functional. |
| Live voice calls (Gemini Live) | ❌ | Not built. |

## Sharing & distribution

| Feature | In mockup? | Notes |
|---|---|---|
| Public persona page link | ✅ | Sharing tab + onboarding success. |
| Embed widget | ◐ | Button present, no embed code generator. |
| QR code | ◐ | Button present, not generated. |
| Email signature | ◐ | Button present. |
| Marketplace listing | ◐ | Toggle present; **no marketplace browse page**. |

## Connectors & actions

| Feature | In mockup? | Notes |
|---|---|---|
| Calendar (Google/Outlook) | ✅ | Connectors tab + onboarding. |
| CRM (HubSpot/Salesforce) | ✅ | Connectors tab (shown disconnected). |
| Zoom/Meet/Teams/Slack/Notion | ✅ | Connectors tab + command-area icon row. |
| Actions / triggers / approval inbox | ❌ | Not built. |
| Lead capture | ◐ | Boundary toggle in Persona tab; no lead inbox. |

## Analytics, billing, admin

| Feature | In mockup? | Notes |
|---|---|---|
| Persona score + gaps | ✅ | Analysis tab. |
| Usage stats | ◐ | 3 mock stats; no full insights dashboard. |
| Billing / plan | ✅ | Settings tab (Pro $14.99, mock). |
| API keys | ◐ | Shown in Settings, non-functional. |
| Notifications prefs | ✅ | Settings tab toggles. |
| Privacy / data controls | ◐ | Link present, no page. |
| Team / access groups / governance | ❌ | Not built. |
| Admin section | ❌ | Not built. |

## New (not in the real product)

| Feature | Notes |
|---|---|
| **Single command dashboard** | The core new direction — everything-you-do on one surface. |
| **Profile popup** (6 tabs) | Customization as an overlay, not 20 routes. |
| **6-ICP live re-skin** | Config-driven personalization. |

---

## Bottom line

The mockup deliberately covers the product's **breadth at the surface level** (so the new
shape feels complete and on-brand) while building **depth only where it sells the direction**
— the command area, the Today widgets, the profile popup, and the ICP switcher. Whole
functional surfaces that exist in the real product — **marketplace browse, actions/triggers,
conversations & queued-questions, live meeting capture/transcript, voice calls, team/admin**
— are **not** in this mockup.

### If you want a fuller version
Tell me which of these to flesh out and I'll add them (in rough order of demo value):
1. **Meeting detail** page (brief → live transcript → recap, Granola-style tabs)
2. **Marketplace** browse + persona detail
3. **Actions** inbox (triggers + approvals)
4. **Conversations / queued questions** surfaces
5. **Functional** widget embed + QR generator
6. Real backend wiring (replace mock data with `GET /v2/dashboard/today`)

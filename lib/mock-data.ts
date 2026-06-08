import type {
  Commitment,
  Connector,
  DraftPayload,
  IcpId,
  KnowledgeSource,
  Meeting,
  Routine,
} from "./types";

// ---------------------------------------------------------------------------
// Mock data - enough to make the dashboard feel live. Per-ICP where it matters.
// ---------------------------------------------------------------------------

export const USER = {
  name: "Sai",
  fullName: "Sai Deekshith Badam",
  initials: "SD",
  plan: "Pro",
  role: "Founder & Product",
};

const MEETINGS: Record<IcpId, Meeting[]> = {
  founder: [
    {
      id: "m1",
      title: "Series A - Sequoia",
      withWhom: "Priya Nair · Sequoia",
      time: "2:00 PM",
      state: "upcoming",
      brief:
        "Warm intro via Anand. Priya cares about retention math - lead with your 118% NRR and the design-partner pipeline.",
      tags: ["Fundraise", "Notes ready"],
      initials: "PN",
    },
    {
      id: "m2",
      title: "Follow-up - Accel",
      withWhom: "Marcus Lee · Accel",
      time: "4:30 PM",
      state: "upcoming",
      brief:
        "You owe Marcus the updated data room + the GTM slide. He flagged CAC payback as the open question.",
      tags: ["Fundraise"],
      initials: "ML",
    },
    {
      id: "m3",
      title: "Angel sync - Acme Ventures",
      withWhom: "Dana Cho",
      time: "9:30 AM",
      state: "recap",
      brief:
        "Dana committed to 2 customer intros. You agreed to send the hiring plan by Friday. Sentiment: strongly positive.",
      tags: ["Recap", "2 commitments"],
      initials: "DC",
    },
  ],
  recruiter: [
    {
      id: "m1",
      title: "Senior PM Screen - Northwind",
      withWhom: "Alex Chen",
      time: "3:00 PM",
      state: "upcoming",
      brief:
        "Alex is at a Series B, open to move for scope. Lead with the 0→1 mandate and comp band. Probe on relocation.",
      tags: ["Screen", "Notes ready"],
      initials: "AC",
    },
    {
      id: "m2",
      title: "Debrief - Staff Eng loop",
      withWhom: "Hiring panel",
      time: "1:00 PM",
      state: "recap",
      brief:
        "Panel leaning yes on Maya. You owe the panel a written summary + reference checks by EOD.",
      tags: ["Recap", "1 commitment"],
      initials: "HP",
    },
  ],
  consultant: [
    {
      id: "m1",
      title: "Discovery - Brightline",
      withWhom: "Jordan Reyes · Brightline",
      time: "11:00 AM",
      state: "upcoming",
      brief:
        "First call. They're stuck on pricing for a new SKU. Qualify budget + timeline, steer to a 2-week pricing sprint.",
      tags: ["Discovery", "Notes ready"],
      initials: "JR",
    },
    {
      id: "m2",
      title: "Recap - Acme scope",
      withWhom: "Sam Patel · Acme",
      time: "Yesterday",
      state: "recap",
      brief:
        "Agreed scope: fractional product lead, 3 days/wk, 8 weeks. You owe the SOW. They owe data-room access.",
      tags: ["Recap", "2 commitments"],
      initials: "SP",
    },
  ],
  sales: [
    {
      id: "m1",
      title: "Renewal - Northwind",
      withWhom: "Riley Okafor",
      time: "10:30 AM",
      state: "upcoming",
      brief:
        "Renewal at risk - they raised seat-price last QBR. Lead with the new analytics they asked for. Bring the ROI one-pager.",
      tags: ["Renewal", "Notes ready"],
      initials: "RO",
    },
    {
      id: "m2",
      title: "Discovery - Atlas Corp",
      withWhom: "Taylor Kim",
      time: "2:00 PM",
      state: "upcoming",
      brief:
        "Inbound from the webinar. Champion is Taylor, but budget sits with the VP. Map the buying committee.",
      tags: ["New deal"],
      initials: "TK",
    },
    {
      id: "m3",
      title: "Recap - Cadence call",
      withWhom: "Jamie Fox",
      time: "Yesterday",
      state: "recap",
      brief:
        "Objection: integration timeline. You committed to a solutions-eng call. They'll loop in security.",
      tags: ["Recap", "1 commitment"],
      initials: "JF",
    },
  ],
  investor: [
    {
      id: "m1",
      title: "Seed - Cadence Labs",
      withWhom: "Maya Rao · Cadence",
      time: "1:30 PM",
      state: "upcoming",
      brief:
        "Bootstrapped to $1.2M ARR in 14 months. Probe on retention + why raise now. You met her co-founder at YC demo day.",
      tags: ["Seed", "Notes ready"],
      initials: "MR",
    },
    {
      id: "m2",
      title: "Partner pitch - Helios",
      withWhom: "Devon Wu · Helios",
      time: "4:00 PM",
      state: "upcoming",
      brief:
        "Second meeting. Partners want the market-size case. You owe Devon the cohort data from last call.",
      tags: ["Diligence"],
      initials: "DW",
    },
    {
      id: "m3",
      title: "Recap - Fintech founder",
      withWhom: "Priya Anand",
      time: "Yesterday",
      state: "recap",
      brief:
        "Strong technical founder, thin GTM. You promised 2 intros to design partners. Pass for now, revisit at seed+.",
      tags: ["Recap", "2 commitments"],
      initials: "PA",
    },
  ],
  executive: [
    {
      id: "m1",
      title: "Leadership Sync",
      withWhom: "Exec team",
      time: "11:00 AM",
      state: "upcoming",
      brief:
        "Decision needed on the pricing change. Last week you parked the EU rollout - it's back on the agenda.",
      tags: ["Decision", "Notes ready"],
      initials: "ET",
    },
    {
      id: "m2",
      title: "1:1 - Priya (Eng lead)",
      withWhom: "Priya Nair",
      time: "3:30 PM",
      state: "upcoming",
      brief:
        "Priya flagged burnout on the platform team last 1:1. You owe her a decision on the backfill req.",
      tags: ["1:1"],
      initials: "PN",
    },
    {
      id: "m3",
      title: "Recap - QBR",
      withWhom: "Revenue org",
      time: "Yesterday",
      state: "recap",
      brief:
        "Landed Q3 targets. Open: hiring freeze exception for sales. You owe the board a one-pager by Thursday.",
      tags: ["Recap", "1 commitment"],
      initials: "RO",
    },
  ],
};

export function meetingsFor(icp: IcpId): Meeting[] {
  return MEETINGS[icp];
}

const COMMITMENTS: Record<IcpId, Commitment[]> = {
  founder: [
    { id: "c1", text: "Send updated data room to Accel", direction: "you_owe", who: "Marcus Lee", due: "Today", done: false },
    { id: "c2", text: "Hiring plan to Dana (Acme)", direction: "you_owe", who: "Dana Cho", due: "Fri", done: false },
    { id: "c3", text: "2 customer intros", direction: "they_owe", who: "Dana Cho", due: "This week", done: false },
  ],
  recruiter: [
    { id: "c1", text: "Written summary + ref checks for Maya", direction: "you_owe", who: "Hiring panel", due: "Today", done: false },
    { id: "c2", text: "Send comp band to Alex", direction: "you_owe", who: "Alex Chen", due: "Today", done: false },
    { id: "c3", text: "Portfolio links", direction: "they_owe", who: "Alex Chen", due: "Tomorrow", done: false },
  ],
  consultant: [
    { id: "c1", text: "Draft + send SOW to Acme", direction: "you_owe", who: "Sam Patel", due: "Today", done: false },
    { id: "c2", text: "Data-room access", direction: "they_owe", who: "Sam Patel", due: "This week", done: false },
  ],
  sales: [
    { id: "c1", text: "Book solutions-eng call for Cadence", direction: "you_owe", who: "Jamie Fox", due: "Today", done: false },
    { id: "c2", text: "ROI one-pager for Northwind", direction: "you_owe", who: "Riley Okafor", due: "Today", done: false },
    { id: "c3", text: "Loop in security review", direction: "they_owe", who: "Jamie Fox", due: "This week", done: false },
  ],
  investor: [
    { id: "c1", text: "2 design-partner intros for Priya", direction: "you_owe", who: "Priya Anand", due: "This week", done: false },
    { id: "c2", text: "Cohort data to Devon (Helios)", direction: "you_owe", who: "Devon Wu", due: "Today", done: false },
  ],
  executive: [
    { id: "c1", text: "Board one-pager on Q3 targets", direction: "you_owe", who: "Board", due: "Thu", done: false },
    { id: "c2", text: "Decision on platform backfill req", direction: "you_owe", who: "Priya Nair", due: "Today", done: false },
  ],
};

export function commitmentsFor(icp: IcpId): Commitment[] {
  return COMMITMENTS[icp];
}

const ROUTINES: Record<IcpId, Routine[]> = {
  founder: [
    { id: "r1", name: "Daily investor notes", cadence: "Every morning · 8:00 AM", detail: "Notes for every investor meeting on today's calendar", enabled: true },
    { id: "r2", name: "Weekly investor update", cadence: "Fridays · 4:00 PM", detail: "Draft an update from this week's meetings + metrics", enabled: true },
    { id: "r3", name: "Follow-up nudge", cadence: "When a meeting ends", detail: "Draft the follow-up + log commitments to your CRM", enabled: false },
  ],
  recruiter: [
    { id: "r1", name: "Pre-screen notes", cadence: "30 min before each call", detail: "Candidate notes from LinkedIn + prior calls", enabled: true },
    { id: "r2", name: "End-of-day debrief", cadence: "Daily · 6:00 PM", detail: "Summarize every candidate call + next steps", enabled: true },
    { id: "r3", name: "Pipeline chase", cadence: "Mondays", detail: "Flag candidates gone quiet > 5 days", enabled: false },
  ],
  consultant: [
    { id: "r1", name: "Discovery prep", cadence: "Before each new call", detail: "Research the company + draft qualifying questions", enabled: true },
    { id: "r2", name: "Client recap", cadence: "When a meeting ends", detail: "Send a branded recap + log scope changes", enabled: true },
    { id: "r3", name: "Weekly utilization", cadence: "Fridays", detail: "Summarize hours + open commitments per client", enabled: false },
  ],
  sales: [
    { id: "r1", name: "Account notes", cadence: "Before each call", detail: "Pull CRM history + last objections + next step", enabled: true },
    { id: "r2", name: "CRM auto-log", cadence: "When a call ends", detail: "Write the call notes + update the stage", enabled: true },
    { id: "r3", name: "Going-quiet alert", cadence: "Daily", detail: "Flag deals with no touch in 7 days", enabled: true },
  ],
  investor: [
    { id: "r1", name: "Founder notes", cadence: "Before each call", detail: "Research founder + company + your thesis notes", enabled: true },
    { id: "r2", name: "Pipeline digest", cadence: "Mondays · 9:00 AM", detail: "Deal flow by stage + what needs a decision", enabled: true },
    { id: "r3", name: "Intro tracker", cadence: "When you promise an intro", detail: "Track promised intros to close the loop", enabled: false },
  ],
  executive: [
    { id: "r1", name: "Meeting notes", cadence: "Before each meeting", detail: "Context, prior decisions, and what's open", enabled: true },
    { id: "r2", name: "Decision log", cadence: "When a meeting ends", detail: "Capture decisions + owners + due dates", enabled: true },
    { id: "r3", name: "Weekly digest", cadence: "Fridays", detail: "What moved, what's blocked, what's next", enabled: false },
  ],
};

export function routinesFor(icp: IcpId): Routine[] {
  return ROUTINES[icp];
}

// Shared across ICPs in this mock - the persona's connected apps.
export const CONNECTORS: Connector[] = [
  { id: "gcal", name: "Google Calendar", connected: true, hint: "calendar" },
  { id: "gmail", name: "Gmail", connected: true, hint: "mail" },
  { id: "zoom", name: "Zoom", connected: true, hint: "video" },
  { id: "meet", name: "Google Meet", connected: true, hint: "video" },
  { id: "teams", name: "Microsoft Teams", connected: false, hint: "video" },
  { id: "hubspot", name: "HubSpot CRM", connected: false, hint: "crm" },
  { id: "salesforce", name: "Salesforce", connected: false, hint: "crm" },
  { id: "linkedin", name: "LinkedIn", connected: true, hint: "social" },
  { id: "notion", name: "Notion", connected: false, hint: "docs" },
  { id: "slack", name: "Slack", connected: true, hint: "chat" },
];

export const KNOWLEDGE: KnowledgeSource[] = [
  { id: "k1", name: "LinkedIn profile", kind: "linkedin", status: "synced", detail: "Imported · 42 facts extracted" },
  { id: "k2", name: "Resume_2026.pdf", kind: "resume", status: "synced", detail: "8 roles · 6 projects" },
  { id: "k3", name: "personal site - about + writing", kind: "website", status: "synced", detail: "12 pages crawled" },
  { id: "k4", name: "Meeting recaps", kind: "meeting", status: "processing", detail: "37 meetings · 2 indexing now" },
  { id: "k5", name: "Pitch deck v9.pdf", kind: "file", status: "synced", detail: "Uploaded 2 days ago" },
];

export const SUGGESTED_MORE = [
  "Summarize everything I know about this person",
  "What should I not bring up?",
  "Turn my last meeting into a follow-up email",
  "What's my best next action right now?",
];

// --- Meeting detail (brief / transcript / recap / actions) ---------------------

export interface TranscriptLine {
  speaker: string;
  me: boolean;
  text: string;
  t: string;
}

export interface MeetingDetail {
  briefPoints: string[];
  transcript: TranscriptLine[];
  recapTldr: string;
  decisions: string[];
  actions: { text: string; owner: string }[];
}

function counterpartName(withWhom: string): string {
  return withWhom.split("·")[0].trim().split(" ")[0];
}

/** Build believable detail content for any meeting card. */
export function buildMeetingDetail(m: Meeting): MeetingDetail {
  const them = counterpartName(m.withWhom);
  return {
    briefPoints: [
      m.brief,
      `You've spoken with ${them} before - pick up the open thread, don't restart.`,
      `Lead with the one metric they cared about last time; have the number ready.`,
      `Soft close: propose a concrete next step before the call ends.`,
    ],
    transcript: [
      { speaker: them, me: false, t: "00:02", text: `Thanks for making the time - excited to dig in on ${m.title.toLowerCase()}.` },
      { speaker: "You", me: true, t: "00:09", text: "Likewise. Before we start - anything changed on your side since we last spoke?" },
      { speaker: them, me: false, t: "00:21", text: "A bit. The main thing we want to understand is the traction and how repeatable it is." },
      { speaker: "You", me: true, t: "00:34", text: "Totally fair. Let me walk you through the numbers and where they come from." },
      { speaker: them, me: false, t: "01:12", text: "That's helpful. What would the next step look like from here?" },
      { speaker: "You", me: true, t: "01:20", text: "I'll send over the detail this week, and we can reconnect once you've had a look." },
    ],
    recapTldr: m.state === "recap"
      ? m.brief
      : `Strong conversation with ${them}. Clear interest; the open question is repeatability. Agreed to exchange detail and reconnect.`,
    decisions: [
      `Move forward to a follow-up conversation with ${them}.`,
      `Share the supporting detail before the next call.`,
    ],
    actions: [
      { text: `Send ${them} the detail discussed`, owner: "You" },
      { text: `Reconnect once reviewed`, owner: "You" },
      { text: `Loop in their team`, owner: them },
    ],
  };
}

// --- Draft templates (the persona-written documents) ---------------------------

export function followupDraft(m: Meeting): DraftPayload {
  const them = counterpartName(m.withWhom);
  return {
    title: `Follow-up - ${m.title}`,
    kind: "email",
    to: m.withWhom,
    body: `Hi ${them},

Thanks for the conversation today - really enjoyed it. As promised, I'll get the detail we discussed over to you this week so you have everything in one place.

To recap what we landed on:
• I'll send through the supporting numbers and context.
• You'll take a look and we'll reconnect from there.

Anything else useful in the meantime, just say the word.

Best,
Sai`,
  };
}

export function recapDraft(m: Meeting): DraftPayload {
  const d = buildMeetingDetail(m);
  return {
    title: `Recap - ${m.title}`,
    kind: "recap",
    body: `TL;DR
${d.recapTldr}

Decisions
${d.decisions.map((x) => `• ${x}`).join("\n")}

Action items
${d.actions.map((x) => `• ${x.text} - ${x.owner}`).join("\n")}`,
  };
}

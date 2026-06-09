import type { IcpConfig, IcpId } from "./types";

// ---------------------------------------------------------------------------
// The 6 ICPs. Each one re-skins the command dashboard: accent color, greeting,
// command placeholder, suggestion chips, and which "Today" widgets lead.
// ---------------------------------------------------------------------------

export const ICPS: Record<IcpId, IcpConfig> = {
  founder: {
    id: "founder",
    label: "Founders",
    blurb: "Running the investor circuit",
    accent: "#117863",
    accentSoft: "#e3f1ec",
    greeting: "Walk in prepared, {name}",
    subline: "3 investor meetings today · your persona has notes ready for each",
    commandPlaceholder: "Prep a meeting, ask your persona, or draft a follow-up…",
    suggestions: [
      "Prep me for my 2pm with Sequoia",
      "What did I commit to Acme last week?",
      "Draft an update for my angels",
      "Who on my calendar haven't I followed up with?",
    ],
    widgets: ["meetings", "commitments", "pipeline", "routines"],
    pipelineLabel: "Fundraise pipeline",
  },
  recruiter: {
    id: "recruiter",
    label: "Recruiters",
    blurb: "Same pitch, ten times a day",
    accent: "#7a4fd6",
    accentSoft: "#efe9fb",
    greeting: "Let your persona pitch, {name}",
    subline: "5 candidate calls today · your persona qualifies and follows up for you",
    commandPlaceholder: "Prep a candidate call, summarize a screen, or draft outreach…",
    suggestions: [
      "Prep me for the senior PM screen at 3pm",
      "Summarize today's candidate calls",
      "Draft a follow-up to the 3 strong candidates",
      "Which roles am I behind on?",
    ],
    widgets: ["meetings", "pipeline", "followups", "routines"],
    pipelineLabel: "Candidate pipeline",
  },
  consultant: {
    id: "consultant",
    label: "Consultants",
    blurb: "Selling expertise, not hours",
    accent: "#0f6fb0",
    accentSoft: "#e4f0f8",
    greeting: "Your expertise, always on, {name}",
    subline: "2 discovery calls today · your persona qualifies scope and books the next step",
    commandPlaceholder: "Prep a discovery call, scope an engagement, or send a recap…",
    suggestions: [
      "Prep my discovery call with Brightline",
      "What's the scope we discussed with Acme?",
      "Draft a proposal recap from yesterday's call",
      "Summarize open commitments across clients",
    ],
    widgets: ["meetings", "commitments", "followups", "routines"],
    pipelineLabel: "Engagement pipeline",
  },
  sales: {
    id: "sales",
    label: "Sales & Account Managers",
    blurb: "CRM goes thin between calls",
    accent: "#b4631b",
    accentSoft: "#f7ece1",
    greeting: "Never walk into a deal cold, {name}",
    subline: "6 account calls today · your persona preps each and keeps the CRM honest",
    commandPlaceholder: "Prep an account, log a call, or draft the next-step email…",
    suggestions: [
      "Prep me for the Northwind renewal call",
      "What objections came up with Acme last time?",
      "Draft next steps for my 3 open deals",
      "Which accounts are going quiet?",
    ],
    widgets: ["pipeline", "meetings", "commitments", "followups"],
    pipelineLabel: "Deal pipeline",
  },
  investor: {
    id: "investor",
    label: "Investors",
    blurb: "Founder calls blur together",
    accent: "#2f6d4f",
    accentSoft: "#e6f1ea",
    greeting: "Remember every founder, {name}",
    subline: "4 founder calls today · your persona preps you and tracks every thesis",
    commandPlaceholder: "Prep a founder call, compare companies, or log a thesis…",
    suggestions: [
      "Prep me for the seed call with Cadence Labs",
      "Compare the two fintech founders I met this week",
      "What did I promise to intro last meeting?",
      "Summarize my pipeline by stage",
    ],
    widgets: ["meetings", "pipeline", "commitments", "routines"],
    pipelineLabel: "Deal flow",
  },
  executive: {
    id: "executive",
    label: "Managers & Executives",
    blurb: "Back-to-back, context resets",
    accent: "#475569",
    accentSoft: "#eaeef3",
    greeting: "Stay ahead of the day, {name}",
    subline: "7 meetings today · your persona preps you and captures every decision",
    commandPlaceholder: "Prep a meeting, ask across your notes, or draft a recap…",
    suggestions: [
      "Prep me for the leadership sync at 11",
      "What decisions did we land in last week's QBR?",
      "Draft a recap for my skip-level",
      "What's still open from my 1:1s?",
    ],
    widgets: ["meetings", "commitments", "routines", "followups"],
    pipelineLabel: "Team & stakeholders",
  },
};

export const ICP_ORDER: IcpId[] = [
  "founder",
  "recruiter",
  "consultant",
  "sales",
  "investor",
  "executive",
];

export const GOALS = [
  { id: "manage_pipeline", label: "Manage deal pipeline" },
  { id: "prep_investors", label: "Prep for investor pitches" },
  { id: "screen_candidates", label: "Screen candidates efficiently" },
  { id: "scope_engagements", label: "Scope client engagements" },
  { id: "track_dealflow", label: "Track deal flow and theses" },
  { id: "stay_ahead", label: "Stay ahead of back-to-back meetings" },
];

/** Evaluates the user's input to determine their Ideal Customer Profile */
export function evaluateIcp(role: string, goal: string): IcpId {
  const lowerRole = role.toLowerCase();
  
  if (lowerRole.includes("founder") || lowerRole.includes("ceo")) return "founder";
  if (lowerRole.includes("recruit") || lowerRole.includes("talent") || lowerRole.includes("hr")) return "recruiter";
  if (lowerRole.includes("consultant") || lowerRole.includes("freelance") || lowerRole.includes("agency")) return "consultant";
  if (lowerRole.includes("sales") || lowerRole.includes("account") || lowerRole.includes("ae") || lowerRole.includes("bd")) return "sales";
  if (lowerRole.includes("investor") || lowerRole.includes("vc") || lowerRole.includes("partner") || lowerRole.includes("angel")) return "investor";
  if (lowerRole.includes("manager") || lowerRole.includes("executive") || lowerRole.includes("vp") || lowerRole.includes("director") || lowerRole.includes("chief") || lowerRole.includes("lead") || lowerRole.includes("head")) return "executive";

  if (goal === "manage_pipeline") return "sales";
  if (goal === "prep_investors") return "founder";
  if (goal === "screen_candidates") return "recruiter";
  if (goal === "scope_engagements") return "consultant";
  if (goal === "track_dealflow") return "investor";
  if (goal === "stay_ahead") return "executive";

  return "executive";
}

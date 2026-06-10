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

// ---------------------------------------------------------------------------
// Onboarding questions, tailored per ICP. The role chosen in step 0 maps
// directly to an IcpId, so the Goal / Challenge / Tools steps branch on it.
// ---------------------------------------------------------------------------

export interface OnbOption {
  id: string;
  label: string;
}
export interface OnbQuestionSet {
  goals: OnbOption[];
  challenges: OnbOption[];
  tools: OnbOption[];
}

export const ONBOARDING_QUESTIONS: Record<IcpId, OnbQuestionSet> = {
  founder: {
    goals: [
      { id: "raise_round", label: "Raise the next round" },
      { id: "keep_investors_updated", label: "Keep investors updated" },
      { id: "recruit_hires", label: "Recruit key hires" },
      { id: "track_commitments", label: "Stay on top of commitments" },
    ],
    challenges: [
      { id: "investor_prep", label: "Prepping investor meetings" },
      { id: "remember_promises", label: "Remembering what I promised" },
      { id: "context", label: "Context switching" },
      { id: "recruiting", label: "Recruiting outreach" },
    ],
    tools: [
      { id: "investor_crm", label: "Investor tracker / CRM" },
      { id: "docs", label: "Docs (Notion/Google)" },
      { id: "email", label: "Email (Gmail)" },
      { id: "calendar", label: "Calendar" },
    ],
  },
  recruiter: {
    goals: [
      { id: "screen_faster", label: "Screen candidates faster" },
      { id: "warm_pipeline", label: "Keep my pipeline warm" },
      { id: "candidate_experience", label: "Improve candidate experience" },
      { id: "close_roles", label: "Close roles faster" },
    ],
    challenges: [
      { id: "screen_prep", label: "Prepping candidate screens" },
      { id: "chase_feedback", label: "Chasing hiring-manager feedback" },
      { id: "scheduling", label: "Scheduling interviews" },
      { id: "repeating_pitch", label: "Repeating the same pitch" },
    ],
    tools: [
      { id: "ats", label: "ATS (Greenhouse/Lever)" },
      { id: "linkedin", label: "LinkedIn" },
      { id: "email", label: "Email" },
      { id: "calendar", label: "Calendar" },
    ],
  },
  consultant: {
    goals: [
      { id: "win_engagements", label: "Win more engagements" },
      { id: "scope_faster", label: "Scope projects faster" },
      { id: "calls_to_deliverables", label: "Turn calls into deliverables" },
      { id: "keep_clients_updated", label: "Keep clients updated" },
    ],
    challenges: [
      { id: "discovery_prep", label: "Prepping discovery calls" },
      { id: "proposals", label: "Writing proposals & recaps" },
      { id: "track_commitments", label: "Tracking client commitments" },
      { id: "follow_up", label: "Following up to book next steps" },
    ],
    tools: [
      { id: "crm", label: "CRM" },
      { id: "docs", label: "Docs (Notion/Google)" },
      { id: "email", label: "Email" },
      { id: "calendar", label: "Calendar" },
    ],
  },
  sales: {
    goals: [
      { id: "manage_pipeline", label: "Manage my pipeline" },
      { id: "crm_honest", label: "Keep the CRM honest" },
      { id: "never_miss_followup", label: "Never miss a follow-up" },
      { id: "research_accounts", label: "Research accounts" },
    ],
    challenges: [
      { id: "account_prep", label: "Account & deal prep" },
      { id: "crm_hygiene", label: "CRM hygiene" },
      { id: "quiet_accounts", label: "Accounts going quiet" },
      { id: "next_steps", label: "Drafting next-step emails" },
    ],
    tools: [
      { id: "crm", label: "CRM (Salesforce/HubSpot)" },
      { id: "email", label: "Email" },
      { id: "chat", label: "Chat (Slack/Teams)" },
      { id: "calendar", label: "Calendar" },
    ],
  },
  investor: {
    goals: [
      { id: "track_dealflow", label: "Track deal flow & theses" },
      { id: "remember_founders", label: "Remember every founder" },
      { id: "make_intros", label: "Make warm intros" },
      { id: "portfolio_updated", label: "Keep portfolio updated" },
    ],
    challenges: [
      { id: "founder_prep", label: "Prepping founder calls" },
      { id: "track_theses", label: "Tracking theses" },
      { id: "compare_companies", label: "Comparing companies" },
      { id: "intro_followup", label: "Following up on intros" },
    ],
    tools: [
      { id: "deal_tracker", label: "Deal tracker (Affinity)" },
      { id: "docs", label: "Docs (Notion)" },
      { id: "email", label: "Email" },
      { id: "calendar", label: "Calendar" },
    ],
  },
  executive: {
    goals: [
      { id: "stay_ahead", label: "Stay ahead of meetings" },
      { id: "capture_decisions", label: "Capture decisions" },
      { id: "followup_1on1s", label: "Follow up on 1:1s" },
      { id: "align_team", label: "Keep my team aligned" },
    ],
    challenges: [
      { id: "meeting_prep", label: "Prepping back-to-backs" },
      { id: "context", label: "Context switching" },
      { id: "decisions", label: "Capturing decisions" },
      { id: "followups", label: "1:1 follow-ups" },
    ],
    tools: [
      { id: "docs", label: "Docs (Notion/Google)" },
      { id: "chat", label: "Chat (Slack/Teams)" },
      { id: "email", label: "Email" },
      { id: "calendar", label: "Calendar" },
    ],
  },
};

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

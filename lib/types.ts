// ---------------------------------------------------------------------------
// PersonaOn Command — shared types for the mockup
// ---------------------------------------------------------------------------

export type IcpId =
  | "founder"
  | "recruiter"
  | "consultant"
  | "sales"
  | "investor"
  | "executive";

/** Per-ICP configuration that re-skins the command dashboard. */
export interface IcpConfig {
  id: IcpId;
  label: string;
  /** Short audience descriptor shown in the switcher. */
  blurb: string;
  /** Accent color (hex) used across the UI for this ICP. */
  accent: string;
  accentSoft: string;
  /** Hero greeting verb/line, personalized at render with the user's name. */
  greeting: string;
  /** One-line value framing under the greeting. */
  subline: string;
  /** Placeholder shown in the central command input. */
  commandPlaceholder: string;
  /** Suggestion chips under the command input. */
  suggestions: string[];
  /** Which "Today" widgets to emphasise, in order. */
  widgets: WidgetKind[];
  /** Label for the primary recurring object this ICP cares about. */
  pipelineLabel: string;
}

export type WidgetKind =
  | "meetings"
  | "commitments"
  | "routines"
  | "pipeline"
  | "followups";

export type MeetingState = "upcoming" | "live" | "recap";

export interface Meeting {
  id: string;
  title: string;
  /** Counterpart / company shown on the card. */
  withWhom: string;
  time: string;
  state: MeetingState;
  /** One-line pre-brief (upcoming) or recap summary (recap). */
  brief: string;
  tags: string[];
  /** Avatar initials for the counterpart. */
  initials: string;
}

export interface Commitment {
  id: string;
  text: string;
  direction: "you_owe" | "they_owe";
  who: string;
  due: string;
  done: boolean;
}

export interface Routine {
  id: string;
  name: string;
  cadence: string;
  detail: string;
  enabled: boolean;
}

export interface Connector {
  id: string;
  name: string;
  connected: boolean;
  /** lucide icon name handled in the component. */
  hint: string;
}

export interface KnowledgeSource {
  id: string;
  name: string;
  kind: "linkedin" | "resume" | "website" | "file" | "meeting";
  status: "synced" | "processing";
  detail: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  sources?: string[];
}

export type ProfileTab =
  | "persona"
  | "knowledge"
  | "connectors"
  | "analysis"
  | "sharing"
  | "settings";

/** Which main-area view the left nav is showing. */
export type View = "home" | "search" | "meetings" | "routines";

"use client";

import {
  MessageSquarePlus,
  Search,
  CalendarClock,
  RefreshCw,
  MessagesSquare,
  Zap,
  BarChart3,
  Store,
  BookOpen,
  Folder,
  FolderPlus,
  Gift,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { USER } from "@/lib/mock-data";
import { ICPS } from "@/lib/icps";
import type { View } from "@/lib/types";
import { Avatar } from "./ui/Avatar";
import { useToast } from "./ui/Toast";
import { cn } from "@/lib/utils";

const PRIMARY: { id: View; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "New / Ask", icon: MessageSquarePlus },
  { id: "search", label: "Search", icon: Search },
];

const WORKSPACE: { id: View; label: string; icon: LucideIcon }[] = [
  { id: "meetings", label: "Meetings", icon: CalendarClock },
  { id: "routines", label: "Routines", icon: RefreshCw },
  { id: "conversations", label: "Conversations", icon: MessagesSquare },
  { id: "actions", label: "Actions", icon: Zap },
  { id: "insights", label: "Insights", icon: BarChart3 },
];

const PROJECTS = ["Fundraise Q3", "GTM launch"];

const RECENT = [
  "Prep — Sequoia Series A",
  "Follow-up draft · Accel",
  "What did Acme commit to?",
];

export function Sidebar() {
  const { icp, view, setView, openProfile } = useApp();
  const toast = useToast();
  const cfg = ICPS[icp];

  function NavButton({ item }: { item: { id: View; label: string; icon: LucideIcon } }) {
    const Icon = item.icon;
    const active = view === item.id;
    return (
      <button
        onClick={() => setView(item.id)}
        className={cn(
          "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14px] transition",
          active
            ? "bg-surface font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-line"
            : "text-ink-soft hover:bg-paper-2"
        )}
      >
        <Icon size={17} className={active ? "text-accent" : "text-muted"} />
        {item.label}
      </button>
    );
  }

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-line bg-paper">
      {/* Brand */}
      <div className="flex items-center gap-2 px-5 pb-2 pt-5">
        <span className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--accent-ink)]" style={{ background: "var(--accent)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 18V8a4 4 0 0 1 8 0 4 4 0 0 0 6 3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </span>
        <span className="font-serif text-[19px] font-semibold tracking-tight">PersonaOn</span>
      </div>

      {/* Scrollable nav */}
      <div className="mt-3 flex-1 overflow-y-auto px-3">
        <div className="space-y-0.5">
          {PRIMARY.map((item) => <NavButton key={item.id} item={item} />)}
        </div>

        <p className="px-3 pb-1 pt-4 text-[11px] font-medium uppercase tracking-wider text-muted">Workspace</p>
        <div className="space-y-0.5">
          {WORKSPACE.map((item) => <NavButton key={item.id} item={item} />)}
          {/* Knowledge = maintenance → opens the profile popup */}
          <button onClick={() => openProfile("knowledge")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14px] text-ink-soft transition hover:bg-paper-2">
            <BookOpen size={17} className="text-muted" /> Knowledge
          </button>
        </div>

        <p className="px-3 pb-1 pt-4 text-[11px] font-medium uppercase tracking-wider text-muted">Discover</p>
        <NavButton item={{ id: "marketplace", label: "Marketplace", icon: Store }} />

        <p className="px-3 pb-1 pt-4 text-[11px] font-medium uppercase tracking-wider text-muted">Projects</p>
        <div className="space-y-0.5">
          {PROJECTS.map((p) => (
            <button key={p} onClick={() => toast(`Opening "${p}" (mock)`, "info")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] text-ink-soft transition hover:bg-paper-2">
              <Folder size={16} className="text-muted" /> {p}
            </button>
          ))}
          <button onClick={() => toast("New project (mock)", "info")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] text-muted transition hover:bg-paper-2">
            <FolderPlus size={16} /> New project
          </button>
        </div>

        <p className="px-3 pb-1 pt-4 text-[11px] font-medium uppercase tracking-wider text-muted">Recent</p>
        <div className="space-y-0.5 pb-2">
          {RECENT.map((r) => (
            <button key={r} onClick={() => setView("home")} className="block w-full truncate rounded-lg px-3 py-1.5 text-left text-[13px] text-ink-soft hover:bg-paper-2">
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Context indicator (Littlebird-style) */}
      <button onClick={() => openProfile("connectors")} className="mx-3 mb-2 flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-[12px] transition hover:border-line-strong">
        <span className="h-2 w-2 rounded-full bg-[#2f8a5b] animate-pulse-dot" />
        <span className="text-ink-soft">Context enabled · 6 apps</span>
      </button>

      {/* Referral */}
      <button onClick={() => toast("Invite link copied — share it to earn credit")} className="mx-3 mb-2 flex items-center gap-2 rounded-xl bg-paper-2 px-3 py-2.5 text-left text-[13px] text-ink-soft transition hover:bg-line">
        <Gift size={15} className="text-accent" />
        <span>Invite a peer — get 1 month free</span>
      </button>

      {/* Persona status → Analysis */}
      <button onClick={() => openProfile("analysis")} className="mx-3 mb-2 flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-[12px] transition hover:border-line-strong">
        <span className="h-2 w-2 rounded-full bg-accent" />
        <span className="text-ink-soft">Persona live ·</span>
        <span className="font-medium text-accent">{cfg.label}</span>
      </button>

      {/* User chip → profile popup */}
      <button onClick={() => openProfile("persona")} className="m-3 mt-0 flex items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2.5 text-left transition hover:border-line-strong">
        <Avatar initials={USER.initials} size={34} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] font-medium">{USER.fullName}</span>
          <span className="block text-[12px] text-muted">{USER.plan} · Edit persona</span>
        </span>
        <ChevronRight size={16} className="text-muted" />
      </button>
    </aside>
  );
}

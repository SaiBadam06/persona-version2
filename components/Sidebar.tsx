"use client";

import {
  MessageSquarePlus,
  Search,
  CalendarClock,
  RefreshCw,
  BookOpen,
  Gift,
  ChevronRight,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { USER } from "@/lib/mock-data";
import { ICPS } from "@/lib/icps";
import { Avatar } from "./ui/Avatar";
import { useToast } from "./ui/Toast";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "home", label: "New / Ask", icon: MessageSquarePlus },
  { id: "search", label: "Search", icon: Search },
  { id: "meetings", label: "Meetings", icon: CalendarClock },
  { id: "routines", label: "Routines", icon: RefreshCw },
] as const;

const RECENT = [
  "Prep — Sequoia Series A",
  "Follow-up draft · Accel",
  "What did Acme commit to?",
  "Weekly investor update",
];

export function Sidebar() {
  const { icp, view, setView, openProfile } = useApp();
  const toast = useToast();
  const cfg = ICPS[icp];

  return (
    <aside className="flex h-full w-[260px] shrink-0 flex-col border-r border-line bg-paper">
      {/* Brand */}
      <div className="flex items-center gap-2 px-5 pb-2 pt-5">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--accent-ink)]"
          style={{ background: "var(--accent)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 18V8a4 4 0 0 1 8 0 4 4 0 0 0 6 3.5"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </span>
        <span className="font-serif text-[19px] font-semibold tracking-tight">
          PersonaOn
        </span>
      </div>

      {/* Primary nav */}
      <nav className="mt-3 space-y-0.5 px-3">
        {NAV.map((item) => {
          const Icon = item.icon;
          const active = view === item.id;
          return (
            <button
              key={item.id}
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
        })}
        {/* Knowledge is "maintenance" — it opens the profile popup, like the brief intends */}
        <button
          onClick={() => openProfile("knowledge")}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[14px] text-ink-soft transition hover:bg-paper-2"
        >
          <BookOpen size={17} className="text-muted" />
          Knowledge
        </button>
      </nav>

      {/* Recent */}
      <div className="mt-6 px-5">
        <p className="text-[11px] font-medium uppercase tracking-wider text-muted">
          Recent
        </p>
      </div>
      <div className="mt-1 space-y-0.5 overflow-y-auto px-3">
        {RECENT.map((r) => (
          <button
            key={r}
            onClick={() => setView("home")}
            className="block w-full truncate rounded-lg px-3 py-1.5 text-left text-[13px] text-ink-soft hover:bg-paper-2"
          >
            {r}
          </button>
        ))}
      </div>

      <div className="flex-1" />

      {/* Promo */}
      <button
        onClick={() => toast("Invite link copied — share it to earn credit")}
        className="mx-3 mb-2 flex items-center gap-2 rounded-xl bg-paper-2 px-3 py-2.5 text-left text-[13px] text-ink-soft transition hover:bg-line"
      >
        <Gift size={15} className="text-accent" />
        <span>Invite a peer — get 1 month free</span>
      </button>

      {/* Persona status → opens Analysis */}
      <button
        onClick={() => openProfile("analysis")}
        className="mx-3 mb-2 flex items-center gap-2 rounded-xl border border-line bg-surface px-3 py-2 text-[12px] transition hover:border-line-strong"
      >
        <span className="h-2 w-2 rounded-full bg-[#2f8a5b] animate-pulse-dot" />
        <span className="text-ink-soft">Persona live ·</span>
        <span className="font-medium text-accent">{cfg.label}</span>
      </button>

      {/* User chip → opens profile modal */}
      <button
        onClick={() => openProfile("persona")}
        className="m-3 mt-0 flex items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2.5 text-left transition hover:border-line-strong"
      >
        <Avatar initials={USER.initials} size={34} />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13.5px] font-medium">
            {USER.fullName}
          </span>
          <span className="block text-[12px] text-muted">{USER.plan} · Edit persona</span>
        </span>
        <ChevronRight size={16} className="text-muted" />
      </button>
    </aside>
  );
}

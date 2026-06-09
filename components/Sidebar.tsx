"use client";

import {
  MessageSquarePlus,
  Search,
  CalendarClock,
  RefreshCw,
  MessagesSquare,
  BarChart3,
  Store,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { USER } from "@/lib/mock-data";
import type { View } from "@/lib/types";
import { Avatar } from "./ui/Avatar";
import { cn } from "@/lib/utils";

const PRIMARY: { id: View; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "New / Ask", icon: MessageSquarePlus },
  { id: "search", label: "Search", icon: Search },
];

const WORKSPACE: { id: View; label: string; icon: LucideIcon }[] = [
  { id: "meetings", label: "Meetings", icon: CalendarClock },
  { id: "routines", label: "Routines", icon: RefreshCw },
  { id: "conversations", label: "Conversations", icon: MessagesSquare },
  { id: "insights", label: "Insights", icon: BarChart3 },
  { id: "marketplace", label: "Marketplace", icon: Store },
];

const RECENT = [
  "Prep - Sequoia Series A",
  "Follow-up draft · Accel",
  "What did Acme commit to?",
];

export function Sidebar() {
  const { view, setView, openProfile, resolvedTheme } = useApp();

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
    <aside className="flex h-full w-[252px] shrink-0 flex-col border-r border-line bg-paper">
      {/* Brand — theme-aware logo (black on light, white on dark) */}
      <div className="flex items-center px-5 pb-3 pt-5">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={resolvedTheme === "dark" ? "/personaon_white.png" : "/personaon_black.png"}
          alt="PersonaOn"
          className="h-7 w-auto"
        />
      </div>

      {/* Scrollable nav */}
      <div className="flex-1 overflow-y-auto px-3">
        <div className="space-y-0.5">
          {PRIMARY.map((item) => <NavButton key={item.id} item={item} />)}
        </div>

        <p className="px-3 pb-1 pt-5 text-[11px] font-medium uppercase tracking-wider text-muted">Workspace</p>
        <div className="space-y-0.5">
          {WORKSPACE.map((item) => <NavButton key={item.id} item={item} />)}
        </div>

        <p className="px-3 pb-1 pt-5 text-[11px] font-medium uppercase tracking-wider text-muted">Recent</p>
        <div className="space-y-0.5 pb-2">
          {RECENT.map((r) => (
            <button key={r} onClick={() => setView("home")} className="block w-full truncate rounded-lg px-3 py-1.5 text-left text-[13px] text-ink-soft hover:bg-paper-2">
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Slim status line */}
      <button onClick={() => openProfile("connectors")} className="mx-3 mb-2 flex items-center gap-2 rounded-lg px-2 py-1.5 text-[12px] text-muted transition hover:bg-paper-2">
        <span className="h-2 w-2 rounded-full bg-[#2f8a5b]" />
        Context enabled · 6 apps
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

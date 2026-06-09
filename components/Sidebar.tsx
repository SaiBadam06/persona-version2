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
  PanelLeftClose,
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
  const { view, setView, openProfile, resolvedTheme, sidebarCollapsed, toggleSidebar } =
    useApp();

  const mark = resolvedTheme === "dark" ? "/pictorial_white.png" : "/pictorial_black.png";
  const wordmark = resolvedTheme === "dark" ? "/personaon_white.png" : "/personaon_black.png";

  function NavButton({ item }: { item: { id: View; label: string; icon: LucideIcon } }) {
    const Icon = item.icon;
    const active = view === item.id;
    return (
      <button
        onClick={() => setView(item.id)}
        title={sidebarCollapsed ? item.label : undefined}
        className={cn(
          "flex w-full items-center rounded-lg text-[14.5px] transition",
          sidebarCollapsed ? "justify-center px-0 py-3" : "gap-3.5 px-3 py-2.5",
          active
            ? "bg-surface font-medium text-ink shadow-[0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-line"
            : "text-ink-soft hover:bg-paper-2"
        )}
      >
        <Icon size={20} className={active ? "text-accent" : "text-muted"} />
        {!sidebarCollapsed && item.label}
      </button>
    );
  }

  return (
    <aside
      className={cn(
        "flex h-full shrink-0 flex-col border-r border-line bg-paper transition-[width] duration-200 ease-out",
        sidebarCollapsed ? "w-[68px]" : "w-[252px]"
      )}
    >
      {/* Brand + collapse toggle */}
      {sidebarCollapsed ? (
        <div className="flex flex-col items-center px-2 pb-3 pt-4">
          <button
            onClick={toggleSidebar}
            title="Expand sidebar"
            className="flex h-12 w-12 items-center justify-center rounded-lg transition hover:bg-paper-2"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mark} alt="PersonaOn" className="h-10 w-auto object-contain" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between gap-2 px-4 pb-3 pt-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={wordmark} alt="PersonaOn" className="h-9 w-auto max-w-[172px] object-contain" />
          <button
            onClick={toggleSidebar}
            title="Collapse sidebar"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-paper-2"
          >
            <PanelLeftClose size={20} />
          </button>
        </div>
      )}

      {/* Scrollable nav */}
      <div className={cn("flex-1 overflow-y-auto", sidebarCollapsed ? "px-2" : "px-3")}>
        <div className="space-y-0.5">
          {PRIMARY.map((item) => <NavButton key={item.id} item={item} />)}
        </div>

        {!sidebarCollapsed && (
          <p className="px-3 pb-1 pt-5 text-[11px] font-medium uppercase tracking-wider text-muted">
            Workspace
          </p>
        )}
        <div className={cn("space-y-0.5", sidebarCollapsed && "mt-2")}>
          {WORKSPACE.map((item) => <NavButton key={item.id} item={item} />)}
        </div>

        {!sidebarCollapsed && (
          <>
            <p className="px-3 pb-1 pt-5 text-[11px] font-medium uppercase tracking-wider text-muted">
              Recent
            </p>
            <div className="space-y-0.5 pb-2">
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
          </>
        )}
      </div>

      {/* Slim status line */}
      <button
        onClick={() => openProfile("connectors")}
        title={sidebarCollapsed ? "Context enabled · 6 apps" : undefined}
        className={cn(
          "mb-2 flex items-center rounded-lg text-[12px] text-muted transition hover:bg-paper-2",
          sidebarCollapsed ? "mx-2 justify-center px-0 py-2" : "mx-3 gap-2 px-2 py-1.5"
        )}
      >
        <span className="h-2 w-2 shrink-0 rounded-full bg-positive" />
        {!sidebarCollapsed && "Context enabled · 6 apps"}
      </button>

      {/* User chip → profile popup */}
      <button
        onClick={() => openProfile("persona")}
        title={sidebarCollapsed ? USER.fullName : undefined}
        className={cn(
          "flex items-center rounded-xl border border-line bg-surface text-left transition hover:border-line-strong",
          sidebarCollapsed ? "mx-2 mb-3 justify-center px-0 py-2" : "m-3 mt-0 gap-3 px-3 py-2.5"
        )}
      >
        <Avatar initials={USER.initials} size={sidebarCollapsed ? 30 : 34} />
        {!sidebarCollapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13.5px] font-medium">{USER.fullName}</span>
              <span className="block text-[12px] text-muted">{USER.plan} · Edit persona</span>
            </span>
            <ChevronRight size={16} className="text-muted" />
          </>
        )}
      </button>
    </aside>
  );
}

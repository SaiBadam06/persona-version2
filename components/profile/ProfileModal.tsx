"use client";

import { useEffect } from "react";
import {
  X,
  SlidersHorizontal,
  UserRound,
  BookOpen,
  Plug,
  Zap,
  BarChart3,
  Share2,
  Settings2,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { USER } from "@/lib/mock-data";
import type { ProfileTab } from "@/lib/types";
import { Avatar } from "../ui/Avatar";
import { cn } from "@/lib/utils";
import { PersonaTab } from "./tabs/PersonaTab";
import { KnowledgeTab } from "./tabs/KnowledgeTab";
import { ConnectorsTab } from "./tabs/ConnectorsTab";
import { AnalysisTab } from "./tabs/AnalysisTab";
import { SharingTab } from "./tabs/SharingTab";
import { SettingsTab } from "./tabs/SettingsTab";
import { GeneralTab } from "./tabs/GeneralTab";
import { ActionsView } from "../views/ActionsView";

const TABS: { id: ProfileTab; label: string; icon: typeof UserRound }[] = [
  { id: "general", label: "General", icon: SlidersHorizontal },
  { id: "persona", label: "Persona", icon: UserRound },
  { id: "knowledge", label: "Knowledge", icon: BookOpen },
  { id: "connectors", label: "Connectors", icon: Plug },
  { id: "actions", label: "Actions", icon: Zap },
  { id: "analysis", label: "Analysis", icon: BarChart3 },
  { id: "sharing", label: "Sharing", icon: Share2 },
  { id: "settings", label: "Settings", icon: Settings2 },
];

export function ProfileModal() {
  const { profileOpen, profileTab, setProfileTab, closeProfile } = useApp();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeProfile();
    }
    if (profileOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [profileOpen, closeProfile]);

  if (!profileOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        onClick={closeProfile}
      />
      <div className="relative flex h-[660px] max-h-[92vh] w-full max-w-[940px] animate-scale-in overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/20">
        {/* Left rail */}
        <div className="flex w-[230px] shrink-0 flex-col border-r border-line bg-paper p-3">
          <div className="flex items-center gap-3 px-2 py-3">
            <Avatar initials={USER.initials} size={40} />
            <div className="min-w-0">
              <p className="truncate text-[14px] font-semibold">{USER.fullName}</p>
              <p className="truncate text-[12px] text-muted">{USER.role}</p>
            </div>
          </div>
          <div className="mt-2 space-y-0.5">
            {TABS.map((t) => {
              const Icon = t.icon;
              const active = t.id === profileTab;
              return (
                <button
                  key={t.id}
                  onClick={() => setProfileTab(t.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13.5px] transition",
                    active
                      ? "bg-surface font-medium text-ink ring-1 ring-line"
                      : "text-ink-soft hover:bg-paper-2"
                  )}
                >
                  <Icon size={16} className={active ? "text-accent" : "text-muted"} />
                  {t.label}
                </button>
              );
            })}
          </div>
          <div className="mt-auto rounded-xl bg-accent-soft px-3 py-2.5 text-[12px] text-accent">
            Everything here shapes how your persona answers, notes, and acts.
          </div>
        </div>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 className="font-serif text-[19px] tracking-tight">
              {TABS.find((t) => t.id === profileTab)?.label}
            </h2>
            <button
              onClick={closeProfile}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-paper-2"
            >
              <X size={18} />
            </button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
            {profileTab === "general" && <GeneralTab />}
            {profileTab === "persona" && <PersonaTab />}
            {profileTab === "knowledge" && <KnowledgeTab />}
            {profileTab === "connectors" && <ConnectorsTab />}
            {profileTab === "actions" && <ActionsView />}
            {profileTab === "analysis" && <AnalysisTab />}
            {profileTab === "sharing" && <SharingTab />}
            {profileTab === "settings" && <SettingsTab />}
          </div>
        </div>
      </div>
    </div>
  );
}

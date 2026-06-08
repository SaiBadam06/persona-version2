"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ICPS } from "./icps";
import type { IcpId, ProfileTab, View, DraftPayload } from "./types";

interface AppState {
  icp: IcpId;
  setIcp: (id: IcpId) => void;
  view: View;
  setView: (v: View) => void;
  profileOpen: boolean;
  profileTab: ProfileTab;
  openProfile: (tab?: ProfileTab) => void;
  closeProfile: () => void;
  setProfileTab: (tab: ProfileTab) => void;
  // Meeting detail modal
  detailMeetingId: string | null;
  openMeeting: (id: string) => void;
  closeMeeting: () => void;
  // Draft preview modal
  draft: DraftPayload | null;
  openDraft: (d: DraftPayload) => void;
  closeDraft: () => void;
  // Command box → seeded from "fill via chat" etc.
  seededPrompt: string | null;
  seedPrompt: (p: string) => void;
  clearSeed: () => void;
}

const Ctx = createContext<AppState | null>(null);

const ICP_KEY = "personaon:icp";

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [icp, setIcp] = useState<IcpId>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(ICP_KEY);
      if (saved && saved in ICPS) return saved as IcpId;
    }
    return "founder";
  });
  const [view, setView] = useState<View>("home");
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<ProfileTab>("persona");
  const [detailMeetingId, setDetailMeetingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftPayload | null>(null);
  const [seededPrompt, setSeededPrompt] = useState<string | null>(null);

  useEffect(() => {
    const cfg = ICPS[icp];
    const root = document.documentElement;
    root.style.setProperty("--accent", cfg.accent);
    root.style.setProperty("--accent-soft", cfg.accentSoft);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ICP_KEY, icp);
    }
  }, [icp]);

  const value = useMemo<AppState>(
    () => ({
      icp,
      setIcp,
      view,
      setView,
      profileOpen,
      profileTab,
      openProfile: (tab) => {
        if (tab) setProfileTab(tab);
        setProfileOpen(true);
      },
      closeProfile: () => setProfileOpen(false),
      setProfileTab,
      detailMeetingId,
      openMeeting: (id) => setDetailMeetingId(id),
      closeMeeting: () => setDetailMeetingId(null),
      draft,
      openDraft: (d) => setDraft(d),
      closeDraft: () => setDraft(null),
      seededPrompt,
      seedPrompt: (p) => {
        setSeededPrompt(p);
        setView("home");
      },
      clearSeed: () => setSeededPrompt(null),
    }),
    [icp, view, profileOpen, profileTab, detailMeetingId, draft, seededPrompt]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

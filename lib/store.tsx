"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ICPS } from "./icps";
import type { IcpId, ProfileTab, View } from "./types";

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
}

const Ctx = createContext<AppState | null>(null);

const ICP_KEY = "personaon:icp";

export function AppProvider({ children }: { children: React.ReactNode }) {
  // Initialise from the ICP chosen during onboarding (persisted in localStorage).
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

  // Drive the live accent CSS variables off the selected ICP, and persist it.
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
    }),
    [icp, view, profileOpen, profileTab]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

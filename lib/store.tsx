"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ICPS, ICP_ORDER } from "./icps";
import { ACCENTS_KEY } from "./accents";
import {
  SHORTCUTS,
  SHORTCUTS_KEY,
  eventMatchesBinding,
} from "./shortcuts";
import type {
  IcpId,
  ProfileTab,
  View,
  DraftPayload,
  ThemeMode,
  ResolvedTheme,
  TextScale,
  ContrastMode,
  ShortcutId,
  ShortcutBinding,
} from "./types";

type AccentOverrides = Partial<Record<IcpId, string>>;
type ShortcutOverrides = Partial<Record<ShortcutId, ShortcutBinding>>;

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
  // Sidebar collapse (ChatGPT-style)
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (v: boolean) => void;
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
  // Appearance
  theme: ThemeMode;
  setTheme: (t: ThemeMode) => void;
  resolvedTheme: ResolvedTheme;
  effectiveAccent: string;
  accentOverrides: AccentOverrides;
  setAccentForIcp: (hex: string | null) => void;
  // Accessibility
  textScale: TextScale;
  setTextScale: (s: TextScale) => void;
  contrast: ContrastMode;
  setContrast: (c: ContrastMode) => void;
  // Shortcuts
  bindings: Record<ShortcutId, ShortcutBinding>;
  setShortcut: (id: ShortcutId, b: ShortcutBinding) => void;
  resetShortcut: (id: ShortcutId) => void;
}

const Ctx = createContext<AppState | null>(null);

const ICP_KEY = "personaon:icp";
const SIDEBAR_KEY = "personaon:sidebar";
const THEME_KEY = "personaon:theme";
const SCALE_KEY = "personaon:scale";
const CONTRAST_KEY = "personaon:contrast";

const SCALE_VALUE: Record<TextScale, number> = {
  comfortable: 1,
  large: 1.1,
  larger: 1.22,
};

function readJSON<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [icp, setIcp] = useState<IcpId>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(ICP_KEY);
      if (saved && saved in ICPS) return saved as IcpId;
    }
    return "founder";
  });
  const [view, setView] = useState<View>("home");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return window.localStorage.getItem(SIDEBAR_KEY) === "1";
    }
    return false;
  });
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<ProfileTab>("persona");
  const [detailMeetingId, setDetailMeetingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftPayload | null>(null);
  const [seededPrompt, setSeededPrompt] = useState<string | null>(null);

  // Appearance / accessibility preferences
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== "undefined") {
      const t = window.localStorage.getItem(THEME_KEY);
      if (t === "light" || t === "dark" || t === "system") return t;
    }
    return "system";
  });
  const [systemDark, setSystemDark] = useState(false);
  const [accentOverrides, setAccentOverrides] = useState<AccentOverrides>(() =>
    readJSON<AccentOverrides>(ACCENTS_KEY, {})
  );
  const [textScale, setTextScale] = useState<TextScale>(() => {
    if (typeof window !== "undefined") {
      const s = window.localStorage.getItem(SCALE_KEY);
      if (s === "comfortable" || s === "large" || s === "larger") return s;
    }
    return "comfortable";
  });
  const [contrast, setContrast] = useState<ContrastMode>(() => {
    if (typeof window !== "undefined") {
      const c = window.localStorage.getItem(CONTRAST_KEY);
      if (c === "high") return "high";
    }
    return "normal";
  });
  const [shortcutOverrides, setShortcutOverrides] = useState<ShortcutOverrides>(
    () => readJSON<ShortcutOverrides>(SHORTCUTS_KEY, {})
  );

  const resolvedTheme: ResolvedTheme =
    theme === "system" ? (systemDark ? "dark" : "light") : theme;
  const effectiveAccent = accentOverrides[icp] ?? ICPS[icp].accent;

  const bindings = useMemo(() => {
    const out = {} as Record<ShortcutId, ShortcutBinding>;
    for (const s of SHORTCUTS) out[s.id] = shortcutOverrides[s.id] ?? s.default;
    return out;
  }, [shortcutOverrides]);

  // Watch OS color-scheme for "system" mode.
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Apply theme + persist.
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
    window.localStorage.setItem(THEME_KEY, theme);
  }, [resolvedTheme, theme]);

  // Apply contrast + persist.
  useEffect(() => {
    document.documentElement.setAttribute("data-contrast", contrast);
    window.localStorage.setItem(CONTRAST_KEY, contrast);
  }, [contrast]);

  // Apply text scale + persist.
  useEffect(() => {
    document.documentElement.style.setProperty(
      "--ui-scale",
      String(SCALE_VALUE[textScale])
    );
    window.localStorage.setItem(SCALE_KEY, textScale);
  }, [textScale]);

  // Apply the effective (override-aware) accent + persist icp.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent", effectiveAccent);
    root.style.setProperty("--accent-ink", "#ffffff");
    window.localStorage.setItem(ICP_KEY, icp);
  }, [icp, effectiveAccent]);

  // Persist sidebar collapse.
  useEffect(() => {
    window.localStorage.setItem(SIDEBAR_KEY, sidebarCollapsed ? "1" : "0");
  }, [sidebarCollapsed]);

  // Persist accent overrides.
  useEffect(() => {
    window.localStorage.setItem(ACCENTS_KEY, JSON.stringify(accentOverrides));
  }, [accentOverrides]);

  // Persist shortcut overrides.
  useEffect(() => {
    window.localStorage.setItem(SHORTCUTS_KEY, JSON.stringify(shortcutOverrides));
  }, [shortcutOverrides]);

  // Global keyboard-shortcut handler. Disabled while the profile modal is open
  // (so rebinding there never collides), and while typing in a field.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (profileOpen) return;
      const t = e.target as HTMLElement | null;
      if (t) {
        const tag = t.tagName;
        const typing =
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          t.isContentEditable;
        if (typing && !e.ctrlKey && !e.metaKey && !e.altKey) return;
      }
      for (const s of SHORTCUTS) {
        const b = shortcutOverrides[s.id] ?? s.default;
        if (!eventMatchesBinding(e, b)) continue;
        e.preventDefault();
        switch (s.id) {
          case "search":
            setView("search");
            break;
          case "new-ask":
            setView("home");
            break;
          case "open-profile":
            setProfileOpen(true);
            break;
          case "switch-persona": {
            const idx = ICP_ORDER.indexOf(icp);
            setIcp(ICP_ORDER[(idx + 1) % ICP_ORDER.length]);
            break;
          }
          case "toggle-theme":
            setTheme(resolvedTheme === "dark" ? "light" : "dark");
            break;
        }
        break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [profileOpen, shortcutOverrides, icp, resolvedTheme]);

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
      sidebarCollapsed,
      toggleSidebar: () => setSidebarCollapsed((v) => !v),
      setSidebarCollapsed,
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
      theme,
      setTheme,
      resolvedTheme,
      effectiveAccent,
      accentOverrides,
      setAccentForIcp: (hex) =>
        setAccentOverrides((prev) => {
          const next = { ...prev };
          if (hex === null) delete next[icp];
          else next[icp] = hex;
          return next;
        }),
      textScale,
      setTextScale,
      contrast,
      setContrast,
      bindings,
      setShortcut: (id, b) =>
        setShortcutOverrides((prev) => ({ ...prev, [id]: b })),
      resetShortcut: (id) =>
        setShortcutOverrides((prev) => {
          const next = { ...prev };
          delete next[id];
          return next;
        }),
    }),
    [
      icp,
      view,
      sidebarCollapsed,
      profileOpen,
      profileTab,
      detailMeetingId,
      draft,
      seededPrompt,
      theme,
      resolvedTheme,
      effectiveAccent,
      accentOverrides,
      textScale,
      contrast,
      bindings,
    ]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

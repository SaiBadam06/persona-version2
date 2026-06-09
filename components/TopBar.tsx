"use client";

import { Sparkles, MessageSquarePlus, Share2, AudioLines } from "lucide-react";
import Link from "next/link";
import { useApp } from "@/lib/store";
import { useToast } from "./ui/Toast";
import { IcpSwitcher } from "./IcpSwitcher";

const VIEW_LABEL: Record<string, string> = {
  home: "Command",
  search: "Search",
  meetings: "Meetings",
  routines: "Routines",
  conversations: "Conversations",
  actions: "Actions",
  insights: "Insights",
  marketplace: "Marketplace",
};

export function TopBar() {
  const { view, setView } = useApp();
  const toast = useToast();

  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-paper/80 px-6 py-3 backdrop-blur-md">
      <div className="flex items-center gap-2 text-[13px] text-muted">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-soft text-accent">
          <Sparkles size={13} />
        </span>
        {VIEW_LABEL[view] ?? "Command"}
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <button
          onClick={() => setView("home")}
          className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] text-ink-soft transition hover:bg-paper-2"
          title="New chat"
        >
          <MessageSquarePlus size={15} /> <span className="hidden sm:inline">New</span>
        </button>
        <button
          onClick={() => toast("Starting voice session… (mock)", "info")}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-paper-2"
          title="Talk to your persona"
        >
          <AudioLines size={16} />
        </button>
        <button
          onClick={() => toast("Share link copied")}
          className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-paper-2"
          title="Share"
        >
          <Share2 size={16} />
        </button>
        <Link
          href="/onboarding"
          className="hidden rounded-full px-3 py-1.5 text-[13px] text-muted transition hover:bg-paper-2 md:block"
        >
          Onboarding
        </Link>
        {process.env.NODE_ENV === "development" && <IcpSwitcher />}
      </div>
    </header>
  );
}

"use client";

import { Sparkles } from "lucide-react";
import Link from "next/link";
import { IcpSwitcher } from "./IcpSwitcher";

export function TopBar() {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line bg-paper/80 px-6 py-3 backdrop-blur-md">
      <div className="flex items-center gap-2 text-[13px] text-muted">
        <span className="flex h-6 w-6 items-center justify-center rounded-md bg-accent-soft text-accent">
          <Sparkles size={13} />
        </span>
        Command
      </div>
      <div className="ml-auto flex items-center gap-2">
        <Link
          href="/onboarding"
          className="hidden rounded-full px-3 py-1.5 text-[13px] text-muted transition hover:bg-paper-2 sm:block"
        >
          View onboarding
        </Link>
        <IcpSwitcher />
      </div>
    </header>
  );
}

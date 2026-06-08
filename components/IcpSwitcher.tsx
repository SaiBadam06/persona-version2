"use client";

import { useState } from "react";
import { ChevronDown, Check, Users } from "lucide-react";
import { useApp } from "@/lib/store";
import { ICPS, ICP_ORDER } from "@/lib/icps";
import { cn } from "@/lib/utils";

export function IcpSwitcher() {
  const { icp, setIcp } = useApp();
  const [open, setOpen] = useState(false);
  const cfg = ICPS[icp];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-[13px] font-medium shadow-[0_1px_2px_rgba(0,0,0,0.03)] transition hover:border-line-strong"
      >
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ background: cfg.accent }}
        />
        <span className="text-muted">Viewing as</span>
        <span>{cfg.label}</span>
        <ChevronDown size={15} className="text-muted" />
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-20"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 z-30 mt-2 w-[280px] animate-scale-in rounded-2xl border border-line bg-surface p-1.5 shadow-xl shadow-black/5">
            <div className="flex items-center gap-2 px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-muted">
              <Users size={13} /> Tailor the workspace
            </div>
            {ICP_ORDER.map((id) => {
              const c = ICPS[id];
              const active = id === icp;
              return (
                <button
                  key={id}
                  onClick={() => {
                    setIcp(id);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition hover:bg-paper-2",
                    active && "bg-paper-2"
                  )}
                >
                  <span
                    className="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ background: c.accent }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13.5px] font-medium">
                      {c.label}
                    </span>
                    <span className="block text-[12px] text-muted">
                      {c.blurb}
                    </span>
                  </span>
                  {active && <Check size={15} style={{ color: c.accent }} />}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

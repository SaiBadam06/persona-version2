"use client";

import { useState } from "react";
import { RefreshCw, Plus } from "lucide-react";
import { useApp } from "@/lib/store";
import { routinesFor } from "@/lib/mock-data";
import { useToast } from "../ui/Toast";
import { cn } from "@/lib/utils";

export function RoutinesView() {
  const { icp } = useApp();
  const toast = useToast();
  const initial = routinesFor(icp);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(initial.map((r) => [r.id, r.enabled]))
  );

  return (
    <div className="mx-auto w-full max-w-[820px] px-6 py-9 animate-fade-in">
      <div className="mb-1 flex items-center gap-2">
        <RefreshCw size={20} className="text-accent" />
        <h1 className="font-serif text-[26px] tracking-tight">Routines</h1>
      </div>
      <p className="text-[14px] text-muted">
        Standing instructions your persona runs automatically - on a schedule or when something
        happens.
      </p>

      <div className="mt-5 space-y-2.5">
        {initial.map((r) => {
          const on = enabled[r.id];
          return (
            <div
              key={r.id}
              className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4"
            >
              <div className="min-w-0 flex-1">
                <p className="text-[14.5px] font-medium">{r.name}</p>
                <p className="text-[12.5px] text-accent">{r.cadence}</p>
                <p className="mt-1 text-[13px] text-ink-soft">{r.detail}</p>
              </div>
              <button
                onClick={() => setEnabled((e) => ({ ...e, [r.id]: !e[r.id] }))}
                className={cn(
                  "relative h-6 w-11 shrink-0 rounded-full transition",
                  on ? "" : "bg-line-strong"
                )}
                style={on ? { background: "var(--accent)" } : undefined}
                aria-label={`Toggle ${r.name}`}
              >
                <span
                  className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                    on ? "left-[22px]" : "left-0.5"
                  )}
                />
              </button>
            </div>
          );
        })}

        <button
          onClick={() => toast("Describe a new routine in plain English (mock)", "info")}
          className="flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-line-strong px-4 py-3.5 text-[13.5px] font-medium text-muted transition hover:border-accent hover:text-accent"
        >
          <Plus size={16} /> New routine
        </button>
      </div>
    </div>
  );
}

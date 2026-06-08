"use client";

import { TrendingUp, AlertCircle, CheckCircle2 } from "lucide-react";
import { Section } from "./parts";
import { useApp } from "@/lib/store";

export function AnalysisTab() {
  const { seedPrompt, closeProfile } = useApp();
  function fill(topic: string) {
    seedPrompt(`Let's fill a gap in my persona - ask me about: ${topic}`);
    closeProfile();
  }
  return (
    <div className="animate-fade-in">
      <Section title="Persona score" desc="How complete and grounded your persona is.">
        <div className="flex items-center gap-5 rounded-2xl border border-line bg-paper p-5">
          <div className="relative flex h-24 w-24 items-center justify-center">
            <svg viewBox="0 0 36 36" className="h-24 w-24 -rotate-90">
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="var(--color-line)" strokeWidth="3" />
              <circle
                cx="18"
                cy="18"
                r="15.9"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="3"
                strokeDasharray="82 100"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[22px] font-semibold">82</span>
          </div>
          <div className="flex-1">
            <p className="text-[14px] font-medium">Strong - ready to represent you</p>
            <p className="mt-1 text-[12.5px] text-muted">
              Add 2 more meeting recaps and a case study to reach 90+.
            </p>
          </div>
        </div>
      </Section>

      <Section title="What it knows well">
        <div className="space-y-2">
          {["Your background & experience", "Services & pricing approach", "Past meetings & commitments"].map(
            (t) => (
              <div key={t} className="flex items-center gap-2.5 text-[13.5px]">
                <CheckCircle2 size={16} className="text-positive" />
                {t}
              </div>
            )
          )}
        </div>
      </Section>

      <Section title="Gaps to fill" desc="Fill these and your persona gets noticeably sharper.">
        <div className="space-y-2">
          {["Recent wins with metrics", "How you handle objections", "Your point of view on the market"].map(
            (t) => (
              <div
                key={t}
                className="flex items-center gap-2.5 rounded-lg border border-line bg-paper px-3 py-2 text-[13.5px]"
              >
                <AlertCircle size={16} className="text-amber" />
                <span className="flex-1">{t}</span>
                <button onClick={() => fill(t)} className="text-[12px] font-medium text-accent">
                  Fill via chat
                </button>
              </div>
            )
          )}
        </div>
      </Section>

      <Section title="Usage" desc="Last 30 days.">
        <div className="grid grid-cols-3 gap-3">
          {[
            { k: "Conversations", v: "1,284" },
            { k: "Meetings prepped", v: "37" },
            { k: "Leads captured", v: "12" },
          ].map((s) => (
            <div key={s.k} className="rounded-xl border border-line bg-paper p-3 text-center">
              <p className="flex items-center justify-center gap-1 text-[20px] font-semibold">
                <TrendingUp size={15} className="text-accent" />
                {s.v}
              </p>
              <p className="mt-0.5 text-[12px] text-muted">{s.k}</p>
            </div>
          ))}
        </div>
      </Section>
    </div>
  );
}

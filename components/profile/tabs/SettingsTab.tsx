"use client";

import { CreditCard, KeyRound, Bell, ShieldCheck } from "lucide-react";
import { Section, Toggle } from "./parts";

export function SettingsTab() {
  return (
    <div className="animate-fade-in">
      <Section title="Plan & billing">
        <div className="flex items-center gap-4 rounded-2xl border border-line bg-paper p-4">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-soft text-accent">
            <CreditCard size={18} />
          </span>
          <div className="flex-1">
            <p className="text-[14px] font-semibold">Pro · $14.99 / month</p>
            <p className="text-[12.5px] text-muted">
              5,000 conversations · 30 voice min · renews Jul 8
            </p>
          </div>
          <button className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[12.5px] font-medium transition hover:bg-paper-2">
            Manage
          </button>
        </div>
      </Section>

      <Section title="Notifications">
        <Toggle label="Pre-meeting briefs" desc="Email a brief before each meeting." defaultOn />
        <Toggle label="Post-meeting recaps" desc="Recap + commitments to your inbox." defaultOn />
        <Toggle label="Weekly digest" desc="What moved, what's open." />
      </Section>

      <Section title="Developer">
        <div className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3.5 py-3">
          <KeyRound size={16} className="text-muted" />
          <span className="flex-1 font-mono text-[13px] text-ink-soft">pk_live_••••••••••3a9f</span>
          <button className="text-[12.5px] font-medium text-accent">Roll key</button>
        </div>
      </Section>

      <Section title="Account">
        <div className="space-y-2">
          {[
            { icon: ShieldCheck, label: "Privacy & data controls" },
            { icon: Bell, label: "Email preferences" },
          ].map((o) => {
            const Icon = o.icon;
            return (
              <button
                key={o.label}
                className="flex w-full items-center gap-3 rounded-xl border border-line bg-paper px-3.5 py-3 text-left text-[13.5px] transition hover:border-line-strong"
              >
                <Icon size={16} className="text-muted" />
                {o.label}
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

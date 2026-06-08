"use client";

import { CreditCard, KeyRound, Bell, ShieldCheck, UserPlus } from "lucide-react";
import { Section, Toggle } from "./parts";
import { useToast } from "../../ui/Toast";

export function SettingsTab() {
  const toast = useToast();
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
          <button
            onClick={() => toast("Opening billing portal… (mock)", "info")}
            className="rounded-lg border border-line bg-surface px-3 py-1.5 text-[12.5px] font-medium transition hover:bg-paper-2"
          >
            Manage
          </button>
        </div>
      </Section>

      <Section title="Notifications">
        <Toggle label="Pre-meeting notes" desc="Email notes before each meeting." defaultOn />
        <Toggle label="Post-meeting recaps" desc="Recap + commitments to your inbox." defaultOn />
        <Toggle label="Weekly digest" desc="What moved, what's open." />
      </Section>

      <Section title="Team" desc="Invite teammates to share personas and seats.">
        <div className="space-y-2">
          {[
            { name: "Sai Deekshith Badam", role: "Owner", initials: "SD" },
            { name: "Priya Nair", role: "Editor", initials: "PN" },
          ].map((m) => (
            <div key={m.name} className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3.5 py-2.5">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-paper-2 text-[12px] font-medium text-ink-soft ring-1 ring-line">
                {m.initials}
              </span>
              <span className="flex-1 text-[13.5px] font-medium">{m.name}</span>
              <span className="rounded-full bg-paper-2 px-2.5 py-0.5 text-[11px] text-muted">{m.role}</span>
            </div>
          ))}
          <button
            onClick={() => toast("Invite sent (mock)")}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong px-3.5 py-2.5 text-[13px] font-medium text-muted transition hover:border-accent hover:text-accent"
          >
            <UserPlus size={15} /> Invite teammate
          </button>
        </div>
      </Section>

      <Section title="Developer">
        <div className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3.5 py-3">
          <KeyRound size={16} className="text-muted" />
          <span className="flex-1 font-mono text-[13px] text-ink-soft">pk_live_••••••••••3a9f</span>
          <button onClick={() => toast("New API key generated")} className="text-[12.5px] font-medium text-accent">
            Roll key
          </button>
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
                onClick={() => toast(`${o.label} - mock`, "info")}
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

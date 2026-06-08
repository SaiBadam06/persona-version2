"use client";

import { useState } from "react";
import {
  Zap,
  Inbox,
  Check,
  X,
  CalendarPlus,
  Mail,
  UserPlus,
  Plus,
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";

type PendingAction = {
  id: string;
  icon: typeof CalendarPlus;
  title: string;
  detail: string;
};

const PENDING: PendingAction[] = [
  {
    id: "a1",
    icon: CalendarPlus,
    title: "Send booking link to Alex Chen",
    detail: "Requested a 30-min intro call · acme.com",
  },
  {
    id: "a2",
    icon: Mail,
    title: "Send follow-up email to Marcus (Accel)",
    detail: "No reply in 4 days · re: Series A deck",
  },
  {
    id: "a3",
    icon: UserPlus,
    title: "Capture lead — jane@acme.com",
    detail: "Asked about enterprise pricing on the site",
  },
];

const TRIGGERS: { id: string; rule: string }[] = [
  { id: "t1", rule: "When a visitor asks about pricing → share the pricing one-pager" },
  { id: "t2", rule: "When someone books a meeting → send them a prep email" },
  { id: "t3", rule: "When a hot lead is detected → notify me in Slack" },
  { id: "t4", rule: "When a meeting ends → log it to the CRM" },
];

export function ActionsView() {
  const toast = useToast();
  const [pending, setPending] = useState<PendingAction[]>(PENDING);
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    t1: true,
    t2: true,
    t3: false,
    t4: true,
  });

  return (
    <div className="mx-auto w-full max-w-[820px] px-6 py-9 animate-fade-in">
      <div className="mb-1 flex items-center gap-2">
        <Zap size={20} className="text-accent" />
        <h1 className="font-serif text-[26px] tracking-tight">Actions</h1>
      </div>
      <p className="text-[14px] text-muted">
        What your persona can do on your behalf — and what&apos;s waiting for your approval.
      </p>

      {/* Approval inbox */}
      <div className="mt-7 mb-2 flex items-center gap-2">
        <Inbox size={17} className="text-ink-soft" />
        <h2 className="font-serif text-[18px] tracking-tight">Approval inbox</h2>
      </div>
      <div className="space-y-2.5">
        {pending.length === 0 ? (
          <p className="rounded-xl border border-line bg-surface p-4 text-[13px] text-muted">
            All caught up ✓
          </p>
        ) : (
          pending.map((a) => {
            const Icon = a.icon;
            return (
              <div
                key={a.id}
                className="flex items-center gap-3.5 rounded-xl border border-line bg-surface p-3.5"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft">
                  <Icon size={17} className="text-accent" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-medium">{a.title}</p>
                  <p className="text-[12.5px] text-muted">{a.detail}</p>
                </div>
                <button
                  onClick={() => {
                    setPending((p) => p.filter((x) => x.id !== a.id));
                    toast("Action approved");
                  }}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[13px] font-medium text-[var(--accent-ink)]"
                  style={{ background: "var(--accent)" }}
                >
                  <Check size={14} /> Approve
                </button>
                <button
                  onClick={() => {
                    setPending((p) => p.filter((x) => x.id !== a.id));
                    toast("Dismissed", "info");
                  }}
                  aria-label="Dismiss"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-line text-muted transition hover:border-line-strong hover:text-ink"
                >
                  <X size={15} />
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Automations */}
      <div className="mt-8 mb-2 flex items-center gap-2">
        <Zap size={17} className="text-ink-soft" />
        <h2 className="font-serif text-[18px] tracking-tight">Automations</h2>
      </div>
      <div className="space-y-2.5">
        {TRIGGERS.map((t) => {
          const on = enabled[t.id];
          return (
            <div
              key={t.id}
              className="flex items-center gap-4 rounded-xl border border-line bg-surface p-3.5"
            >
              <p className="min-w-0 flex-1 text-[13.5px] text-ink-soft">{t.rule}</p>
              <button
                onClick={() => setEnabled((e) => ({ ...e, [t.id]: !e[t.id] }))}
                aria-label={`Toggle automation`}
                className={`relative h-6 w-11 shrink-0 rounded-full transition ${
                  on ? "" : "bg-line-strong"
                }`}
                style={on ? { background: "var(--accent)" } : undefined}
              >
                <span
                  className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    on ? "left-[22px]" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          );
        })}

        <button
          onClick={() => toast("Describe an automation in plain English (mock)", "info")}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-line-strong px-4 py-3.5 text-[13.5px] font-medium text-muted transition hover:border-accent hover:text-accent"
        >
          <Plus size={16} /> New automation
        </button>
      </div>
    </div>
  );
}

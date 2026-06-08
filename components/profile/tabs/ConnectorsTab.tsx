"use client";

import {
  Calendar,
  Mail,
  Video,
  Briefcase,
  Linkedin,
  MessageSquare,
} from "lucide-react";
import { CONNECTORS } from "@/lib/mock-data";
import { Section } from "./parts";

const ICON: Record<string, typeof Calendar> = {
  calendar: Calendar,
  mail: Mail,
  video: Video,
  crm: Briefcase,
  social: Linkedin,
  chat: MessageSquare,
  docs: Briefcase,
};

export function ConnectorsTab() {
  return (
    <div className="animate-fade-in">
      <Section
        title="Connected apps"
        desc="Calendar powers briefs. CRM keeps your accounts honest. The more it sees, the sharper it gets."
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {CONNECTORS.map((c) => {
            const Icon = ICON[c.hint] ?? Briefcase;
            return (
              <div
                key={c.id}
                className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3.5 py-3"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-ink-soft ring-1 ring-line">
                  <Icon size={16} />
                </span>
                <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium">
                  {c.name}
                </span>
                {c.connected ? (
                  <span className="flex items-center gap-1.5 text-[12px] font-medium text-positive">
                    <span className="h-1.5 w-1.5 rounded-full bg-positive" />
                    Connected
                  </span>
                ) : (
                  <button
                    className="rounded-lg px-3 py-1.5 text-[12.5px] font-medium text-[var(--accent-ink)]"
                    style={{ background: "var(--accent)" }}
                  >
                    Connect
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

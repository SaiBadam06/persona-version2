"use client";

import { useState } from "react";
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
import { useToast } from "../../ui/Toast";

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
  const toast = useToast();
  const [connected, setConnected] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(CONNECTORS.map((c) => [c.id, c.connected]))
  );

  return (
    <div className="animate-fade-in">
      <Section
        title="Connected apps"
        desc="Calendar powers briefs. CRM keeps your accounts honest. The more it sees, the sharper it gets."
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {CONNECTORS.map((c) => {
            const Icon = ICON[c.hint] ?? Briefcase;
            const isOn = connected[c.id];
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
                {isOn ? (
                  <button
                    onClick={() => {
                      setConnected((s) => ({ ...s, [c.id]: false }));
                      toast(`${c.name} disconnected`, "info");
                    }}
                    className="flex items-center gap-1.5 text-[12px] font-medium text-positive"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-positive" />
                    Connected
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setConnected((s) => ({ ...s, [c.id]: true }));
                      toast(`${c.name} connected`);
                    }}
                    className="rounded-lg px-3 py-1.5 text-[12.5px] font-medium text-[var(--accent-ink)] transition hover:opacity-90"
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

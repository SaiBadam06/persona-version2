"use client";

import {
  Linkedin,
  FileText,
  Globe,
  CalendarClock,
  Upload,
  Plus,
  Youtube,
  Podcast,
  Twitter,
} from "lucide-react";
import { KNOWLEDGE } from "@/lib/mock-data";
import { Section } from "./parts";
import { useToast } from "../../ui/Toast";

const ICON = {
  linkedin: Linkedin,
  resume: FileText,
  website: Globe,
  file: FileText,
  meeting: CalendarClock,
} as const;

export function KnowledgeTab() {
  const toast = useToast();
  return (
    <div className="animate-fade-in">
      <Section
        title="Sources"
        desc="Everything your persona knows. Grounded answers cite these."
      >
        <div className="space-y-2">
          {KNOWLEDGE.map((k) => {
            const Icon = ICON[k.kind];
            return (
              <div
                key={k.id}
                className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3.5 py-3"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-ink-soft ring-1 ring-line">
                  <Icon size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium">{k.name}</p>
                  <p className="truncate text-[12px] text-muted">{k.detail}</p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                    k.status === "synced"
                      ? "bg-positive/15 text-positive"
                      : "bg-accent-soft text-accent"
                  }`}
                >
                  {k.status === "synced" ? "Synced" : "Processing"}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => toast("Uploading… your persona will index it (mock)", "info")}
            className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3.5 py-2 text-[13px] font-medium transition hover:border-accent hover:text-accent"
          >
            <Upload size={15} /> Upload file
          </button>
          <button
            onClick={() => toast("Crawling the URL… (mock)", "info")}
            className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3.5 py-2 text-[13px] font-medium transition hover:border-accent hover:text-accent"
          >
            <Globe size={15} /> Add URL
          </button>
          <button
            onClick={() => toast("Add a fact manually (mock)", "info")}
            className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3.5 py-2 text-[13px] font-medium transition hover:border-accent hover:text-accent"
          >
            <Plus size={15} /> Add manually
          </button>
        </div>

        <p className="mt-4 mb-2 text-[12px] font-medium uppercase tracking-wider text-muted">
          Pull from
        </p>
        <div className="flex flex-wrap gap-2">
          {[
            { icon: Youtube, label: "YouTube" },
            { icon: Podcast, label: "Podcast" },
            { icon: Twitter, label: "X / Twitter" },
          ].map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={() => toast(`Importing from ${s.label}… (mock)`, "info")}
                className="flex items-center gap-2 rounded-lg border border-line bg-paper px-3.5 py-2 text-[13px] font-medium text-ink-soft transition hover:border-accent hover:text-accent"
              >
                <Icon size={15} /> {s.label}
              </button>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

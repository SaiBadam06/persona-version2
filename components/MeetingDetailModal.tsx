"use client";

import { useEffect, useState } from "react";
import {
  X,
  FileText,
  MessagesSquare,
  ClipboardList,
  CheckSquare,
  Sparkles,
  Send,
  Circle,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { meetingsFor, buildMeetingDetail, followupDraft, recapDraft } from "@/lib/mock-data";
import { useToast } from "./ui/Toast";
import { Avatar } from "./ui/Avatar";
import { Tag } from "./ui/Tag";
import { cn } from "@/lib/utils";

const TABS = [
  { id: "brief", label: "Notes", icon: FileText },
  { id: "transcript", label: "Transcript", icon: MessagesSquare },
  { id: "recap", label: "Recap", icon: ClipboardList },
  { id: "actions", label: "Actions", icon: CheckSquare },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function MeetingDetailModal() {
  const { icp, detailMeetingId, closeMeeting, openDraft } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState<TabId>("brief");
  const [checked, setChecked] = useState<Record<number, boolean>>({});

  const meeting = detailMeetingId
    ? meetingsFor(icp).find((m) => m.id === detailMeetingId)
    : null;

  useEffect(() => {
    if (detailMeetingId) {
      setTab(meeting?.state === "recap" ? "recap" : "brief");
      setChecked({});
    }
  }, [detailMeetingId, meeting?.state]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeMeeting();
    }
    if (detailMeetingId) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [detailMeetingId, closeMeeting]);

  if (!meeting) return null;
  const d = buildMeetingDetail(meeting);
  const upcoming = meeting.state === "upcoming";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" onClick={closeMeeting} />
      <div className="relative flex h-[680px] max-h-[92vh] w-full max-w-[760px] animate-scale-in flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/20">
        {/* Header */}
        <div className="flex items-start gap-3 border-b border-line px-6 py-4">
          <Avatar initials={meeting.initials} size={42} />
          <div className="min-w-0 flex-1">
            <h2 className="font-serif text-[20px] leading-tight tracking-tight">{meeting.title}</h2>
            <p className="text-[13px] text-muted">{meeting.withWhom} · {meeting.time}</p>
            <div className="mt-1.5 flex gap-1.5">
              {meeting.tags.map((t) => (
                <Tag key={t} tone={t.includes("Notes") ? "accent" : "neutral"}>{t}</Tag>
              ))}
            </div>
          </div>
          <button onClick={closeMeeting} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-paper-2">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-line px-4">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-2 border-b-2 px-3 py-2.5 text-[13.5px] transition",
                  active ? "border-accent font-medium text-accent" : "border-transparent text-muted hover:text-ink"
                )}
              >
                <Icon size={15} /> {t.label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">
          {tab === "brief" && (
            <div className="animate-fade-in space-y-3">
              <div className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-wider text-accent">
                <Sparkles size={14} /> Your persona prepped this
              </div>
              {d.briefPoints.map((p, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-[14px] leading-relaxed">
                  <span className="mt-0.5 font-serif text-accent">{i + 1}</span>
                  <span>{p}</span>
                </div>
              ))}
            </div>
          )}

          {tab === "transcript" && (
            <div className="animate-fade-in space-y-4">
              {upcoming && (
                <p className="rounded-lg bg-paper-2 px-3 py-2 text-[12.5px] text-muted">
                  Sample transcript - your persona records and transcribes live once the meeting starts.
                </p>
              )}
              {d.transcript.map((line, i) => (
                <div key={i} className="flex gap-3">
                  <span className="w-10 shrink-0 pt-0.5 text-[11px] text-muted">{line.t}</span>
                  <div className="min-w-0">
                    <p className={cn("text-[12.5px] font-medium", line.me ? "text-accent" : "text-ink")}>{line.speaker}</p>
                    <p className="text-[14px] leading-relaxed text-ink-soft">{line.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "recap" && (
            <div className="animate-fade-in space-y-5">
              <div>
                <p className="mb-1 text-[12px] font-medium uppercase tracking-wider text-muted">TL;DR</p>
                <p className="text-[14.5px] leading-relaxed">{d.recapTldr}</p>
              </div>
              <div>
                <p className="mb-2 text-[12px] font-medium uppercase tracking-wider text-muted">Decisions</p>
                <ul className="space-y-1.5">
                  {d.decisions.map((x, i) => (
                    <li key={i} className="flex gap-2 text-[14px]"><span className="text-accent">•</span>{x}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 text-[12px] font-medium uppercase tracking-wider text-muted">Action items</p>
                <ul className="space-y-1.5">
                  {d.actions.map((x, i) => (
                    <li key={i} className="flex items-center gap-2 text-[14px]">
                      <span className="rounded bg-paper-2 px-1.5 py-0.5 text-[11px] text-muted">{x.owner}</span>
                      {x.text}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tab === "actions" && (
            <div className="animate-fade-in space-y-2">
              {d.actions.map((x, i) => (
                <button
                  key={i}
                  onClick={() => setChecked((c) => ({ ...c, [i]: !c[i] }))}
                  className="flex w-full items-center gap-3 rounded-xl border border-line bg-paper px-4 py-3 text-left transition hover:border-line-strong"
                >
                  {checked[i] ? <CheckCircle2 size={18} className="text-positive" /> : <Circle size={18} className="text-muted" />}
                  <span className={cn("flex-1 text-[14px]", checked[i] && "text-muted line-through")}>{x.text}</span>
                  <span className="rounded bg-surface px-2 py-0.5 text-[11px] text-muted ring-1 ring-line">{x.owner}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="flex items-center gap-2 border-t border-line px-6 py-3">
          <button
            onClick={() => { openDraft(followupDraft(meeting)); }}
            className="flex items-center gap-2 rounded-lg border border-line px-3.5 py-2 text-[13px] font-medium transition hover:border-accent hover:text-accent"
          >
            <Sparkles size={14} /> Draft follow-up
          </button>
          <button
            onClick={() => { openDraft(recapDraft(meeting)); }}
            className="flex items-center gap-2 rounded-lg border border-line px-3.5 py-2 text-[13px] font-medium transition hover:border-accent hover:text-accent"
          >
            <ClipboardList size={14} /> Open recap
          </button>
          <button
            onClick={() => toast(upcoming ? "Notes sent to your inbox" : "Recap shared")}
            className="ml-auto flex items-center gap-2 rounded-lg px-3.5 py-2 text-[13px] font-medium text-[var(--accent-ink)] transition"
            style={{ background: "var(--accent)" }}
          >
            <Send size={14} /> {upcoming ? "Email me these notes" : "Share recap"}
          </button>
        </div>
      </div>
    </div>
  );
}

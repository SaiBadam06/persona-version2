"use client";

import {
  CalendarClock,
  CheckCircle2,
  Circle,
  RefreshCw,
  ArrowUpRight,
  ArrowDownLeft,
  TrendingUp,
  FileText,
  Play,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { ICPS } from "@/lib/icps";
import {
  meetingsFor,
  commitmentsFor,
  routinesFor,
} from "@/lib/mock-data";
import type { Meeting, WidgetKind } from "@/lib/types";
import { Avatar } from "./ui/Avatar";
import { Tag } from "./ui/Tag";

export function TodayPanel() {
  const { icp } = useApp();
  const cfg = ICPS[icp];

  return (
    <div className="mx-auto w-full max-w-[760px] px-6 pb-16 pt-10">
      <div className="mb-3 flex items-center gap-2">
        <h2 className="font-serif text-[20px] tracking-tight">Today</h2>
        <span className="text-[13px] text-muted">· your persona did the prep</span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {cfg.widgets.map((w) => (
          <Widget key={w} kind={w} />
        ))}
      </div>
    </div>
  );
}

function Widget({ kind }: { kind: WidgetKind }) {
  const { icp } = useApp();
  const cfg = ICPS[icp];

  if (kind === "meetings") {
    const meetings = meetingsFor(icp);
    return (
      <Card title="Meetings" icon={CalendarClock} span2>
        <div className="space-y-2.5">
          {meetings.map((m) => (
            <MeetingRow key={m.id} m={m} />
          ))}
        </div>
      </Card>
    );
  }

  if (kind === "commitments") {
    const items = commitmentsFor(icp);
    return (
      <Card title="Open commitments" icon={CheckCircle2}>
        <div className="space-y-2">
          {items.map((c) => (
            <div key={c.id} className="flex items-start gap-2.5">
              <Circle size={16} className="mt-0.5 shrink-0 text-muted" />
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] leading-snug">{c.text}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-[12px] text-muted">
                  {c.direction === "you_owe" ? (
                    <ArrowUpRight size={12} className="text-amber" />
                  ) : (
                    <ArrowDownLeft size={12} className="text-positive" />
                  )}
                  {c.direction === "you_owe" ? "You" : c.who} · due {c.due}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (kind === "routines") {
    const items = routinesFor(icp);
    return (
      <Card title="Routines" icon={RefreshCw}>
        <div className="space-y-2.5">
          {items.map((r) => (
            <div key={r.id} className="flex items-start gap-2.5">
              <span
                className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                  r.enabled ? "bg-positive" : "bg-line-strong"
                }`}
              />
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-medium leading-snug">{r.name}</p>
                <p className="text-[12px] text-muted">{r.cadence}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (kind === "pipeline") {
    return (
      <Card title={cfg.pipelineLabel} icon={TrendingUp}>
        <div className="space-y-3">
          {[
            { stage: "Active", n: 7, w: "70%" },
            { stage: "Waiting on me", n: 3, w: "32%" },
            { stage: "Closing this week", n: 2, w: "22%" },
          ].map((s) => (
            <div key={s.stage}>
              <div className="mb-1 flex items-center justify-between text-[12.5px]">
                <span className="text-ink-soft">{s.stage}</span>
                <span className="font-medium text-muted">{s.n}</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-paper-2">
                <span
                  className="block h-full rounded-full"
                  style={{ width: s.w, background: "var(--accent)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  // followups
  return (
    <Card title="Drafted for you" icon={FileText}>
      <div className="space-y-2.5">
        {[
          "Follow-up email · ready to review",
          "Recap for your last call · drafted",
          "Next-step nudge · waiting on your OK",
        ].map((t) => (
          <div
            key={t}
            className="flex items-center gap-2.5 rounded-lg border border-line bg-paper px-3 py-2 text-[13px]"
          >
            <Sparkles size={14} className="text-accent" />
            <span className="flex-1">{t}</span>
            <button className="text-[12px] font-medium text-accent">Open</button>
          </div>
        ))}
      </div>
    </Card>
  );
}

function MeetingRow({ m }: { m: Meeting }) {
  const upcoming = m.state === "upcoming";
  return (
    <div className="rounded-xl border border-line bg-paper p-3 transition hover:border-line-strong">
      <div className="flex items-start gap-3">
        <Avatar initials={m.initials} size={34} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-[14px] font-medium">{m.title}</p>
            <span className="ml-auto shrink-0 text-[12px] text-muted">{m.time}</span>
          </div>
          <p className="truncate text-[12.5px] text-muted">{m.withWhom}</p>
          <p className="mt-1.5 text-[13px] leading-snug text-ink-soft">{m.brief}</p>
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {m.tags.map((t) => (
              <Tag key={t} tone={t.includes("Brief") ? "accent" : "neutral"}>
                {t}
              </Tag>
            ))}
            <button className="ml-auto flex items-center gap-1 text-[12px] font-medium text-accent">
              {upcoming ? (
                <>
                  <Play size={12} /> Open brief
                </>
              ) : (
                <>
                  <ArrowUpRight size={12} /> View recap
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({
  title,
  icon: Icon,
  children,
  span2,
}: {
  title: string;
  icon: typeof CalendarClock;
  children: React.ReactNode;
  span2?: boolean;
}) {
  return (
    <section
      className={`rounded-2xl border border-line bg-surface p-4 shadow-[0_1px_3px_rgba(0,0,0,0.03)] ${
        span2 ? "md:col-span-2" : ""
      }`}
    >
      <div className="mb-3 flex items-center gap-2">
        <Icon size={16} className="text-accent" />
        <h3 className="text-[14px] font-semibold">{title}</h3>
      </div>
      {children}
    </section>
  );
}

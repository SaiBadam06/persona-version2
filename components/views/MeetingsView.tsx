"use client";

import { useState } from "react";
import { CalendarClock, Play, ArrowUpRight } from "lucide-react";
import { useApp } from "@/lib/store";
import { meetingsFor } from "@/lib/mock-data";
import { Avatar } from "../ui/Avatar";
import { Tag } from "../ui/Tag";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Upcoming", "Recaps"] as const;

export function MeetingsView() {
  const { icp, openMeeting } = useApp();
  const all = meetingsFor(icp);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const list = all.filter((m) =>
    filter === "All"
      ? true
      : filter === "Upcoming"
        ? m.state === "upcoming"
        : m.state === "recap"
  );

  return (
    <div className="mx-auto w-full max-w-[820px] px-6 py-9 animate-fade-in">
      <div className="mb-1 flex items-center gap-2">
        <CalendarClock size={20} className="text-accent" />
        <h1 className="font-serif text-[26px] tracking-tight">Meetings</h1>
      </div>
      <p className="text-[14px] text-muted">
        Your persona preps every one of these - notes before, recaps after.
      </p>

      <div className="mt-5 flex gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "rounded-full px-3.5 py-1.5 text-[13px] transition",
              filter === f
                ? "bg-accent-soft font-medium text-accent"
                : "text-ink-soft hover:bg-paper-2"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        {list.map((m) => {
          const upcoming = m.state === "upcoming";
          return (
            <button
              key={m.id}
              onClick={() => openMeeting(m.id)}
              className="block w-full rounded-2xl border border-line bg-surface p-4 text-left transition hover:border-line-strong"
            >
              <div className="flex items-start gap-3">
                <Avatar initials={m.initials} size={40} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-[15px] font-medium">{m.title}</p>
                    <span className="ml-auto shrink-0 text-[12.5px] text-muted">
                      {m.time}
                    </span>
                  </div>
                  <p className="text-[13px] text-muted">{m.withWhom}</p>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                    {m.brief}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    {m.tags.map((t) => (
                      <Tag key={t} tone={t.includes("Notes") ? "accent" : "neutral"}>
                        {t}
                      </Tag>
                    ))}
                    <span className="ml-auto flex items-center gap-1 text-[12.5px] font-medium text-accent">
                      {upcoming ? (
                        <>
                          <Play size={13} /> Open notes
                        </>
                      ) : (
                        <>
                          <ArrowUpRight size={13} /> View recap
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

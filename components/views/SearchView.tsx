"use client";

import { useMemo, useState } from "react";
import { Search, CalendarClock, BookOpen, UserRound } from "lucide-react";
import { useApp } from "@/lib/store";
import { meetingsFor, KNOWLEDGE } from "@/lib/mock-data";

export function SearchView() {
  const { icp } = useApp();
  const [q, setQ] = useState("");

  const meetings = meetingsFor(icp);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    const m = meetings
      .filter((x) =>
        !term
          ? true
          : (x.title + x.withWhom + x.brief).toLowerCase().includes(term)
      )
      .map((x) => ({
        icon: CalendarClock,
        title: x.title,
        sub: x.withWhom + " · " + x.time,
      }));
    const k = KNOWLEDGE.filter((x) =>
      !term ? true : (x.name + x.detail).toLowerCase().includes(term)
    ).map((x) => ({ icon: BookOpen, title: x.name, sub: x.detail }));
    const people = [
      { icon: UserRound, title: "Priya Nair", sub: "Met 3× · last week" },
      { icon: UserRound, title: "Marcus Lee", sub: "Met 1× · owes you the data room" },
    ].filter((x) => (!term ? true : x.title.toLowerCase().includes(term)));
    return { m, k, people };
  }, [q, meetings]);

  return (
    <div className="mx-auto w-full max-w-[760px] px-6 py-9 animate-fade-in">
      <h1 className="mb-3 font-serif text-[26px] tracking-tight">Search everything</h1>
      <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.03)] focus-within:border-accent">
        <Search size={18} className="text-muted" />
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search meetings, people, knowledge…"
          className="w-full bg-transparent text-[15px] outline-none placeholder:text-muted"
        />
      </div>

      <div className="mt-6 space-y-6">
        <Group label="Meetings" items={results.m} />
        <Group label="People" items={results.people} />
        <Group label="Knowledge" items={results.k} />
      </div>
    </div>
  );
}

function Group({
  label,
  items,
}: {
  label: string;
  items: { icon: typeof Search; title: string; sub: string }[];
}) {
  if (!items.length) return null;
  return (
    <div>
      <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-muted">
        {label}
      </p>
      <div className="space-y-1.5">
        {items.map((it) => {
          const Icon = it.icon;
          return (
            <button
              key={it.title}
              className="flex w-full items-center gap-3 rounded-xl border border-line bg-surface px-3.5 py-3 text-left transition hover:border-accent"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-paper-2 text-ink-soft">
                <Icon size={16} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium">{it.title}</span>
                <span className="block truncate text-[12.5px] text-muted">{it.sub}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

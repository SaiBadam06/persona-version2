"use client";

import { useToast } from "@/components/ui/Toast";
import {
  TrendingUp,
  MessagesSquare,
  Users,
  CalendarClock,
  Clock,
  ArrowUpRight,
} from "lucide-react";

const STATS = [
  { icon: MessagesSquare, value: "1,284", label: "Conversations", delta: "+12%" },
  { icon: Users, value: "12", label: "Leads captured", delta: "+3%" },
  { icon: CalendarClock, value: "37", label: "Meetings prepped", delta: "+8%" },
  { icon: Clock, value: "1.2s", label: "Avg response", delta: "+5%" },
];

const WEEK = [
  { day: "Mon", pct: 40 },
  { day: "Tue", pct: 65 },
  { day: "Wed", pct: 52 },
  { day: "Thu", pct: 80 },
  { day: "Fri", pct: 72 },
  { day: "Sat", pct: 48 },
  { day: "Sun", pct: 30 },
];

const QUESTIONS = [
  { q: "What's your pricing for teams?", count: "48" },
  { q: "Do you integrate with Slack?", count: "41" },
  { q: "Can I book a demo this week?", count: "33" },
  { q: "How does onboarding work?", count: "27" },
  { q: "Is there a free trial?", count: "19" },
];

const LEADS = [
  { name: "Ava Mitchell", meta: "ava@northwind.io · Website", time: "2h ago", dot: "#22c55e" },
  { name: "Leo Park", meta: "leo@brightlab.co · LinkedIn", time: "5h ago", dot: "#3b82f6" },
  { name: "Mira Chen", meta: "mira@orbital.dev · Referral", time: "1d ago", dot: "#a855f7" },
];

export function InsightsView() {
  const toast = useToast();

  return (
    <div className="mx-auto w-full max-w-[820px] px-6 py-9 animate-fade-in">
      <header className="mb-7 flex items-start gap-3">
        <TrendingUp className="mt-1 h-6 w-6 text-accent" />
        <div>
          <h1 className="font-serif text-[26px] tracking-tight text-ink">Insights</h1>
          <p className="text-sm text-muted">
            How your persona is performing · last 30 days
          </p>
        </div>
      </header>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {STATS.map(({ icon: Icon, value, label, delta }) => (
          <div key={label} className="rounded-2xl border border-line bg-surface p-4">
            <Icon className="mb-2 h-4 w-4 text-accent" />
            <div className="text-[22px] font-semibold text-ink">{value}</div>
            <div className="text-xs text-muted">{label}</div>
            <div className="mt-1 flex items-center gap-0.5 text-[11px] text-positive">
              <ArrowUpRight className="h-3 w-3" />
              {delta}
            </div>
          </div>
        ))}
      </div>

      {/* Weekly bar chart */}
      <section className="mt-3 rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-4 font-serif text-[17px] text-ink">Conversations this week</h2>
        <div className="flex h-[120px] items-end justify-between gap-2">
          {WEEK.map(({ day, pct }) => (
            <div key={day} className="flex flex-1 flex-col items-center gap-2">
              <div
                className="w-[28px] rounded-t"
                style={{ height: `${pct}%`, background: "var(--accent)" }}
              />
              <span className="text-[11px] text-muted">{day}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Top questions */}
      <section className="mt-3 rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-3 font-serif text-[17px] text-ink">What people ask most</h2>
        <ul className="divide-y divide-line">
          {QUESTIONS.map(({ q, count }) => (
            <li key={q} className="flex items-center gap-3 py-2.5">
              <span className="flex-1 text-sm text-ink">{q}</span>
              <span className="rounded-full bg-accent-soft px-2 py-0.5 text-[11px] text-muted">
                {count}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Recent leads */}
      <section className="mt-3 rounded-2xl border border-line bg-surface p-4">
        <h2 className="mb-3 font-serif text-[17px] text-ink">Recent leads</h2>
        <ul className="divide-y divide-line">
          {LEADS.map(({ name, meta, time, dot }) => (
            <li key={name} className="flex items-center gap-3 py-3">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: dot }}
              />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-ink">{name}</div>
                <div className="truncate text-xs text-muted">{meta}</div>
              </div>
              <span className="hidden text-xs text-muted sm:block">{time}</span>
              <button
                type="button"
                onClick={() => toast("Opening lead… (mock)", "info")}
                className="rounded-lg border border-line px-2.5 py-1 text-xs text-ink-soft hover:bg-paper-2"
              >
                View
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

"use client";

import { useState } from "react";
import { MessagesSquare, Inbox, Check, Sparkles } from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import { Avatar } from "@/components/ui/Avatar";
import { Tag } from "@/components/ui/Tag";

type Channel = "Owner" | "Public" | "Widget";

const QUEUED = [
  {
    id: "q1",
    initials: "RM",
    question: "Does your persona handle pricing questions for enterprise plans?",
    name: "Rachel Mehta",
    channel: "Widget",
    ago: "12m ago",
  },
  {
    id: "q2",
    initials: "DK",
    question: "Can I book time with you directly from the public profile?",
    name: "Daniel Cho",
    channel: "Public",
    ago: "1h ago",
  },
  {
    id: "q3",
    initials: "AO",
    question: "What integrations do you support out of the box?",
    name: "Amara Okafor",
    channel: "Widget",
    ago: "3h ago",
  },
];

const FILTERS = ["All", "Owner", "Public", "Widget"] as const;

const CONVERSATIONS: {
  id: string;
  initials: string;
  name: string;
  snippet: string;
  channel: Channel;
  time: string;
}[] = [
  { id: "c1", initials: "RM", name: "Rachel Mehta", snippet: "Thanks - that pricing breakdown was exactly what I needed.", channel: "Widget", time: "12m" },
  { id: "c2", initials: "DC", name: "Daniel Cho", snippet: "Could you walk me through the onboarding flow once more?", channel: "Public", time: "1h" },
  { id: "c3", initials: "SS", name: "You (notes)", snippet: "Draft answer about roadmap priorities for Q3.", channel: "Owner", time: "2h" },
  { id: "c4", initials: "AO", name: "Amara Okafor", snippet: "Got it, the Slack integration covers our use case.", channel: "Widget", time: "5h" },
  { id: "c5", initials: "LB", name: "Liam Byrne", snippet: "Loved the public profile - shared it with my team.", channel: "Public", time: "1d" },
  { id: "c6", initials: "PN", name: "Priya Nair", snippet: "When is the next office-hours session?", channel: "Public", time: "2d" },
];

export function ConversationsView() {
  const toast = useToast();
  const [queue, setQueue] = useState(QUEUED);
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>("All");

  const list = CONVERSATIONS.filter((c) => filter === "All" || c.channel === filter);

  return (
    <div className="mx-auto w-full max-w-[820px] px-6 py-9 animate-fade-in">
      <div className="mb-1 flex items-center gap-2">
        <MessagesSquare size={20} className="text-accent" />
        <h1 className="font-serif text-[26px] tracking-tight">Conversations</h1>
      </div>
      <p className="text-[14px] text-muted">
        Everything your persona has handled - plus the questions still waiting on you.
      </p>

      <div className="mt-5 rounded-2xl border border-line bg-surface p-4">
        <div className="mb-3 flex items-center gap-2">
          <Inbox size={16} className="text-accent" />
          <h2 className="text-[14px] font-medium">Questions waiting for you</h2>
          {queue.length > 0 && <Tag tone="accent">{queue.length}</Tag>}
        </div>
        {queue.length === 0 ? (
          <p className="py-3 text-[13px] text-muted">All caught up - nothing in the queue.</p>
        ) : (
          <div className="space-y-3">
            {queue.map((q) => (
              <div key={q.id} className="flex items-start gap-3">
                <Avatar initials={q.initials} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] leading-snug text-ink">{q.question}</p>
                  <p className="mt-0.5 text-[12.5px] text-muted">
                    asked by {q.name} · via {q.channel} · {q.ago}
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => {
                        setQueue((list) => list.filter((x) => x.id !== q.id));
                        toast("Answer sent");
                      }}
                      className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-[12.5px] font-medium text-[var(--accent-ink)]"
                      style={{ background: "var(--accent)" }}
                    >
                      <Check size={13} /> Answer
                    </button>
                    <button
                      onClick={() => toast("Saved to your persona")}
                      className="inline-flex items-center gap-1 rounded-full border border-line px-3 py-1 text-[12.5px] font-medium text-ink-soft transition hover:border-line-strong"
                    >
                      <Sparkles size={13} /> Teach
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex gap-1.5">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={
              "rounded-full px-3.5 py-1.5 text-[13px] transition " +
              (filter === f
                ? "bg-accent-soft font-medium text-accent"
                : "text-ink-soft hover:bg-paper-2")
            }
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {list.map((c) => (
          <button
            key={c.id}
            onClick={() => toast("Opening conversation… (mock)", "info")}
            className="flex w-full items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3 text-left transition hover:border-line-strong"
          >
            <Avatar initials={c.initials} size={36} />
            <div className="min-w-0 flex-1">
              <p className="text-[14px] font-medium text-ink">{c.name}</p>
              <p className="truncate text-[13px] text-muted">{c.snippet}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Tag tone={c.channel === "Owner" ? "positive" : c.channel === "Public" ? "accent" : "neutral"}>
                {c.channel}
              </Tag>
              <span className="text-[12.5px] text-muted">{c.time}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

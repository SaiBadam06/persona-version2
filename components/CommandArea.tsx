"use client";

import { useEffect, useState } from "react";
import {
  Plus,
  Mic,
  ArrowUp,
  Sparkles,
  ChevronDown,
  Calendar,
  Mail,
  Video,
  Briefcase,
  Linkedin,
  MessageSquare,
  NotebookText,
  Upload,
  Link2,
  Check,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { ICPS } from "@/lib/icps";
import { USER, CONNECTORS, SUGGESTED_MORE } from "@/lib/mock-data";
import type { ChatMessage } from "@/lib/types";
import { Avatar } from "./ui/Avatar";
import { useToast } from "./ui/Toast";
import { cn } from "@/lib/utils";

const MODES = ["Auto", "Deep dive", "Casual", "Technical", "Professional", "Friendly"];

const CONNECTOR_ICON: Record<string, typeof Calendar> = {
  calendar: Calendar,
  mail: Mail,
  video: Video,
  crm: Briefcase,
  social: Linkedin,
  chat: MessageSquare,
  docs: NotebookText,
};

// One connector per category - distinct icons, no repeats in the row.
const ROW_CONNECTORS = CONNECTORS.filter(
  (c, i, arr) => arr.findIndex((x) => x.hint === c.hint) === i
);

function todayLabel() {
  return new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

export function CommandArea() {
  const { icp, openProfile, seededPrompt, clearSeed } = useApp();
  const cfg = ICPS[icp];
  const toast = useToast();
  const [value, setValue] = useState("");
  const [thread, setThread] = useState<ChatMessage[]>([]);
  const [thinking, setThinking] = useState(false);
  const [mode, setMode] = useState("Auto");
  const [modeOpen, setModeOpen] = useState(false);
  const [attachOpen, setAttachOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [showMore, setShowMore] = useState(false);

  // Prefill the box when something elsewhere seeds a prompt ("fill via chat").
  useEffect(() => {
    if (seededPrompt) {
      setValue(seededPrompt);
      clearSeed();
    }
  }, [seededPrompt, clearSeed]);

  function send(text: string) {
    const q = text.trim();
    if (!q) return;
    const userMsg: ChatMessage = { id: `u${Date.now()}`, role: "user", text: q };
    setThread((t) => [...t, userMsg]);
    setValue("");
    setThinking(true);
    setTimeout(() => {
      const reply: ChatMessage = {
        id: `a${Date.now()}`,
        role: "assistant",
        text: mockReply(q, cfg.label),
        sources: ["Calendar", "Meeting recaps", "LinkedIn"],
      };
      setThread((t) => [...t, reply]);
      setThinking(false);
    }, 850);
  }

  const started = thread.length > 0;

  return (
    <div className="mx-auto w-full max-w-[760px] px-6">
      {/* Greeting */}
      {!started && (
        <div className="pt-10 pb-6 animate-fade-in">
          <h1 className="font-serif text-[34px] leading-tight tracking-tight">
            {cfg.greeting.replace("{name}", USER.name)}
          </h1>
          <p className="mt-1.5 text-[14px] text-muted">{todayLabel()}</p>
          <p className="mt-3 max-w-[560px] text-[15px] text-ink-soft">
            {cfg.subline}
          </p>
        </div>
      )}

      {/* Thread */}
      {started && (
        <div className="space-y-5 pt-8">
          {thread.map((m) => (
            <div
              key={m.id}
              className={cn(
                "animate-fade-in",
                m.role === "user" ? "flex justify-end" : "flex gap-3"
              )}
            >
              {m.role === "assistant" && (
                <Avatar initials={USER.initials} size={30} accent />
              )}
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-4 py-2.5 text-[14.5px] leading-relaxed",
                  m.role === "user"
                    ? "bg-accent-soft text-ink"
                    : "border border-line bg-surface"
                )}
              >
                {m.text}
                {m.sources && (
                  <div className="mt-2 flex flex-wrap gap-1.5 border-t border-line pt-2">
                    {m.sources.map((s) => (
                      <span
                        key={s}
                        className="rounded-full bg-paper-2 px-2 py-0.5 text-[11px] text-muted"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex gap-3">
              <Avatar initials={USER.initials} size={30} accent />
              <div className="flex items-center gap-1 rounded-2xl border border-line bg-surface px-4 py-3">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-muted animate-pulse-dot"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Command input */}
      <div className="sticky top-0 z-10 mt-5">
        <div className="rounded-[20px] border border-line bg-surface p-2 shadow-[0_2px_10px_rgba(0,0,0,0.04)] focus-within:border-line-strong">
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send(value);
              }
            }}
            rows={2}
            placeholder={cfg.commandPlaceholder}
            className="block w-full resize-none bg-transparent px-3 py-2 text-[15px] outline-none placeholder:text-muted"
          />
          <div className="flex items-center justify-between px-1">
            {/* Attach menu */}
            <div className="relative">
              <button
                onClick={() => { setAttachOpen((o) => !o); setModeOpen(false); }}
                className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition hover:bg-paper-2"
              >
                <Plus size={19} />
              </button>
              {attachOpen && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setAttachOpen(false)} />
                  <div className="absolute bottom-11 left-0 z-30 w-52 animate-scale-in rounded-xl border border-line bg-surface p-1.5 shadow-xl shadow-black/5">
                    {[
                      { icon: Upload, label: "Upload a file" },
                      { icon: Link2, label: "Add a link" },
                      { icon: Video, label: "Record a meeting" },
                    ].map((o) => {
                      const Icon = o.icon;
                      return (
                        <button
                          key={o.label}
                          onClick={() => { setAttachOpen(false); toast(`${o.label} - mock`, "info"); }}
                          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[13.5px] transition hover:bg-paper-2"
                        >
                          <Icon size={15} className="text-muted" /> {o.label}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <div className="flex items-center gap-1">
              {/* Mode menu */}
              <div className="relative">
                <button
                  onClick={() => { setModeOpen((o) => !o); setAttachOpen(false); }}
                  className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] text-ink-soft transition hover:bg-paper-2"
                >
                  <Sparkles size={15} className="text-accent" />
                  {mode === "Auto" ? "Mode" : mode}
                  <ChevronDown size={14} className="text-muted" />
                </button>
                {modeOpen && (
                  <>
                    <div className="fixed inset-0 z-20" onClick={() => setModeOpen(false)} />
                    <div className="absolute bottom-10 right-0 z-30 w-44 animate-scale-in rounded-xl border border-line bg-surface p-1.5 shadow-xl shadow-black/5">
                      {MODES.map((mo) => (
                        <button
                          key={mo}
                          onClick={() => { setMode(mo); setModeOpen(false); }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13.5px] transition hover:bg-paper-2"
                        >
                          <span className="flex-1">{mo}</span>
                          {mode === mo && <Check size={14} className="text-accent" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={() => {
                  setListening((l) => !l);
                  toast(listening ? "Stopped listening" : "Listening… (mock)", "info");
                }}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full transition",
                  listening ? "bg-accent-soft text-accent" : "text-muted hover:bg-paper-2"
                )}
              >
                <Mic size={18} />
              </button>
              <button
                onClick={() => send(value)}
                className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--accent-ink)] transition disabled:opacity-40"
                style={{ background: "var(--accent)" }}
                disabled={!value.trim()}
              >
                <ArrowUp size={18} />
              </button>
            </div>
          </div>

          {/* Connector row */}
          <div className="mt-1 flex items-center gap-2 border-t border-line px-2 pt-2">
            <span className="text-[12px] text-muted">
              Connect your apps for sharper answers
            </span>
            <button
              onClick={() => openProfile("connectors")}
              className="ml-auto flex items-center gap-1"
              title="Manage connectors"
            >
              {ROW_CONNECTORS.map((c) => {
                const Icon = CONNECTOR_ICON[c.hint] ?? Briefcase;
                return (
                  <span
                    key={c.id}
                    title={c.name}
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-lg border text-[12px] transition hover:scale-105",
                      c.connected
                        ? "border-line bg-paper-2 text-ink-soft"
                        : "border-dashed border-line-strong text-muted opacity-60"
                    )}
                  >
                    <Icon size={14} />
                  </span>
                );
              })}
            </button>
          </div>
        </div>

        {/* Suggestion chips */}
        {!started && (
          <div className="mt-3 flex flex-wrap gap-2 animate-fade-in">
            {cfg.suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full border border-line bg-surface px-3.5 py-2 text-[13px] text-ink-soft transition hover:border-accent hover:text-accent"
              >
                {s}
              </button>
            ))}
            {showMore &&
              SUGGESTED_MORE.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="rounded-full border border-line bg-surface px-3.5 py-2 text-[13px] text-ink-soft transition hover:border-accent hover:text-accent"
                >
                  {s}
                </button>
              ))}
            {!showMore && (
              <button
                onClick={() => setShowMore(true)}
                className="flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-2 text-[13px] text-muted transition hover:bg-paper-2"
              >
                <Sparkles size={14} /> More suggestions
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function mockReply(q: string, icpLabel: string): string {
  const lower = q.toLowerCase();
  if (lower.includes("prep")) {
    return "Here are your notes: you have the context from 3 prior conversations and their public profile. Lead with the retention numbers, and avoid re-litigating the pricing thread from last time - they were sensitive about it. I've drafted 3 opening questions and flagged one open commitment you owe them.";
  }
  if (lower.includes("commit") || lower.includes("owe")) {
    return "You have 2 open commitments from that thread: send the updated data room (due today) and the hiring plan (due Friday). They owe you 2 customer intros. Want me to draft the nudge?";
  }
  if (lower.includes("draft") || lower.includes("follow")) {
    return "Drafted - in your voice, grounded in what was actually said in the meeting. It references the 2 decisions you landed and proposes a concrete next step. Review and send, or tell me what to change.";
  }
  return `On it. As your ${icpLabel} persona, I pulled from your calendar, meeting recaps, and profile to answer that - everything traces back to a real source, nothing invented. Want me to turn this into an action?`;
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  Linkedin,
  Calendar,
  Sparkles,
  Loader2,
  Globe,
  FileText,
} from "lucide-react";
import { ICPS, ICP_ORDER } from "@/lib/icps";
import type { IcpId } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = ["You", "Identity", "Calendar", "Building", "Live"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [icp, setIcp] = useState<IcpId | null>(null);
  const [research, setResearch] = useState(0);

  // Live-tint the page to the chosen ICP, and remember it for the dashboard.
  useEffect(() => {
    if (!icp) return;
    const c = ICPS[icp];
    document.documentElement.style.setProperty("--accent", c.accent);
    document.documentElement.style.setProperty("--accent-soft", c.accentSoft);
    window.localStorage.setItem("personaon:icp", icp);
  }, [icp]);

  // Fake the research pass on the "Building" step, then advance.
  useEffect(() => {
    if (step !== 3) return;
    setResearch(0);
    const t = setInterval(() => {
      setResearch((r) => {
        if (r >= RESEARCH_STEPS.length - 1) {
          clearInterval(t);
          setTimeout(() => setStep(4), 700);
          return r;
        }
        return r + 1;
      });
    }, 750);
    return () => clearInterval(t);
  }, [step]);

  return (
    <div className="flex min-h-screen flex-col bg-paper">
      {/* Header + progress */}
      <header className="flex items-center gap-3 px-6 py-5">
        <span
          className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--accent-ink)]"
          style={{ background: "var(--accent)" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 18V8a4 4 0 0 1 8 0 4 4 0 0 0 6 3.5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          </svg>
        </span>
        <span className="font-serif text-[18px] font-semibold">PersonaOn</span>
        <div className="ml-auto flex items-center gap-1.5">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={cn(
                "h-1.5 rounded-full transition-all",
                i <= step ? "w-7" : "w-3"
              )}
              style={{ background: i <= step ? "var(--accent)" : "var(--color-line-strong)" }}
            />
          ))}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-[720px] flex-1 flex-col justify-center px-6 pb-16">
        {/* Step 0 - pick ICP */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-[30px] tracking-tight">Who are you here as?</h1>
            <p className="mt-1.5 text-[15px] text-muted">
              We&apos;ll tailor your whole workspace - notes, prompts, and what shows on your home - to this.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {ICP_ORDER.map((id) => {
                const c = ICPS[id];
                const active = icp === id;
                return (
                  <button
                    key={id}
                    onClick={() => setIcp(id)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border bg-surface px-4 py-3.5 text-left transition",
                      active ? "border-accent ring-1 ring-accent" : "border-line hover:border-line-strong"
                    )}
                  >
                    <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: c.accent }} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[14.5px] font-medium">{c.label}</span>
                      <span className="block text-[12.5px] text-muted">{c.blurb}</span>
                    </span>
                    {active && <Check size={17} style={{ color: c.accent }} />}
                  </button>
                );
              })}
            </div>
            <Footer onNext={() => setStep(1)} disabled={!icp} />
          </div>
        )}

        {/* Step 1 - identity */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-[30px] tracking-tight">Let&apos;s find the real you</h1>
            <p className="mt-1.5 text-[15px] text-muted">
              Connect LinkedIn so your persona is grounded in real, verified facts - never invented.
            </p>
            <div className="mt-6 space-y-3">
              <button className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface px-4 py-3.5 transition hover:border-accent">
                <Linkedin size={18} className="text-accent" />
                <span className="flex-1 text-left text-[14.5px] font-medium">Connect LinkedIn</span>
                <span className="text-[12px] text-muted">Recommended</span>
              </button>
              <div className="flex items-center gap-3 text-[12px] text-muted">
                <span className="h-px flex-1 bg-line" /> or enter manually <span className="h-px flex-1 bg-line" />
              </div>
              <input placeholder="Full name" className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-[14px] outline-none focus:border-accent" />
              <input placeholder="LinkedIn or website URL" className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-[14px] outline-none focus:border-accent" />
            </div>
            <Footer onNext={() => setStep(2)} onBack={() => setStep(0)} />
          </div>
        )}

        {/* Step 2 - calendar (the fix: calendar-first, powers every brief) */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-[30px] tracking-tight">Connect your calendar</h1>
            <p className="mt-1.5 text-[15px] text-muted">
              This powers every pre-meeting note and recap. It&apos;s the core of the loop.
            </p>
            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {[
                { label: "Google Calendar", sub: "Gmail / Workspace" },
                { label: "Outlook", sub: "Microsoft 365" },
              ].map((o) => (
                <button key={o.label} className="flex flex-col items-start gap-2 rounded-2xl border border-line bg-surface px-4 py-4 transition hover:border-accent">
                  <Calendar size={18} className="text-accent" />
                  <span className="text-[14.5px] font-medium">{o.label}</span>
                  <span className="text-[12.5px] text-muted">{o.sub}</span>
                </button>
              ))}
            </div>
            <button onClick={() => setStep(3)} className="mt-4 text-[13px] text-muted underline-offset-2 hover:underline">
              I&apos;ll connect later
            </button>
            <Footer onNext={() => setStep(3)} onBack={() => setStep(1)} nextLabel="Build my persona" />
          </div>
        )}

        {/* Step 3 - building */}
        {step === 3 && (
          <div className="animate-fade-in text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <Sparkles size={26} />
            </div>
            <h1 className="mt-5 font-serif text-[28px] tracking-tight">Building your persona…</h1>
            <p className="mt-1.5 text-[14px] text-muted">Researching you across the web - only real, sourced facts.</p>
            <div className="mx-auto mt-7 max-w-[420px] space-y-2.5 text-left">
              {RESEARCH_STEPS.map((s, i) => {
                const done = i < research;
                const active = i === research;
                return (
                  <div key={s} className="flex items-center gap-3 text-[14px]">
                    {done ? (
                      <Check size={17} className="text-positive" />
                    ) : active ? (
                      <Loader2 size={17} className="animate-spin text-accent" />
                    ) : (
                      <span className="h-[17px] w-[17px] rounded-full border border-line-strong" />
                    )}
                    <span className={done || active ? "text-ink" : "text-muted"}>{s}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 4 - live */}
        {step === 4 && icp && (
          <div className="animate-fade-in text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft text-accent">
              <Check size={30} />
            </div>
            <h1 className="mt-5 font-serif text-[30px] tracking-tight">Your persona is live 🎉</h1>
            <p className="mt-2 text-[15px] text-ink-soft">
              Tailored for <span className="font-medium text-accent">{ICPS[icp].label}</span>. It&apos;s already prepped your day.
            </p>
            <div className="mx-auto mt-5 flex max-w-[440px] items-center gap-2 rounded-xl border border-line bg-surface px-4 py-3">
              <Globe size={15} className="text-muted" />
              <span className="flex-1 truncate text-left font-mono text-[13px] text-ink-soft">personaon.com/p/sai-badam</span>
              <span className="rounded-md bg-paper-2 px-2 py-0.5 text-[11px] text-muted">Copy</span>
            </div>
            <Link
              href="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14.5px] font-medium text-[var(--accent-ink)] transition"
              style={{ background: "var(--accent)" }}
            >
              Enter command center <ArrowRight size={17} />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

const RESEARCH_STEPS = [
  "Reading your LinkedIn profile",
  "Searching the web for you",
  "Finding your writing & talks",
  "Extracting verified facts",
  "Composing your persona",
];

function Footer({
  onNext,
  onBack,
  disabled,
  nextLabel = "Continue",
}: {
  onNext: () => void;
  onBack?: () => void;
  disabled?: boolean;
  nextLabel?: string;
}) {
  return (
    <div className="mt-8 flex items-center gap-3">
      {onBack && (
        <button onClick={onBack} className="rounded-full px-4 py-2.5 text-[14px] text-muted transition hover:bg-paper-2">
          Back
        </button>
      )}
      <button
        onClick={onNext}
        disabled={disabled}
        className="ml-auto inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-[14px] font-medium text-[var(--accent-ink)] transition disabled:opacity-40"
        style={{ background: "var(--accent)" }}
      >
        {nextLabel} <ArrowRight size={16} />
      </button>
    </div>
  );
}

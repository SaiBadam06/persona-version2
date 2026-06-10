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
import { ICPS, ONBOARDING_QUESTIONS, evaluateIcp } from "@/lib/icps";
import type { IcpId } from "@/lib/types";
import { cn } from "@/lib/utils";

const STEPS = ["Role", "Goal", "Challenges", "Tools", "Identity", "Calendar", "Building", "Live"];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [icp, setIcp] = useState<IcpId | null>(null);
  const [research, setResearch] = useState(0);
  const [role, setRole] = useState("");
  const [goal, setGoal] = useState("");
  const [challenge, setChallenge] = useState("");
  const [toolsStr, setToolsStr] = useState("");
  const [isParsingLinkedIn, setIsParsingLinkedIn] = useState(false);
  // Onboarding lives outside AppProvider; read the theme the anti-flash script set.
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    const sync = () => setIsDark(root.getAttribute("data-theme") === "dark");
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(root, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  const handleLinkedInDetect = () => {
    setIsParsingLinkedIn(true);
    // Simulate AI parsing of LinkedIn data
    setTimeout(() => {
      setRole("sales"); // Example simulated detection
      setIsParsingLinkedIn(false);
    }, 1500);
  };

  // The role chosen in step 0 is an IcpId, which drives the branched questions.
  const selectedIcp = role && role in ICPS ? (role as IcpId) : null;
  const questions = selectedIcp ? ONBOARDING_QUESTIONS[selectedIcp] : null;

  // Clear branched answers when the role changes so stale selections don't linger.
  useEffect(() => {
    setGoal("");
    setChallenge("");
    setToolsStr("");
  }, [role]);

  // Live-tint the page to the chosen ICP, and remember it for the dashboard.
  useEffect(() => {
    if (!icp) return;
    const c = ICPS[icp];
    document.documentElement.style.setProperty("--accent", c.accent);
    // --accent-soft is derived from --accent in CSS (color-mix), so it adapts per theme.
    window.localStorage.setItem("personaon:icp", icp);
  }, [icp]);

  // Fake the research pass on the "Building" step, then advance.
  useEffect(() => {
    if (step !== 6) return;
    setResearch(0);
    const t = setInterval(() => {
      setResearch((r) => {
        if (r >= RESEARCH_STEPS.length - 1) {
          clearInterval(t);
          setTimeout(() => setStep(7), 700);
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={isDark ? "/personaon_white.png" : "/personaon_black.png"}
          alt="PersonaOn"
          className="h-8 w-auto object-contain"
        />
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
        {/* Step 0 - assessment */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-[30px] tracking-tight">Tell us about your work</h1>
            <p className="mt-1.5 text-[15px] text-muted">
              We&apos;ll tailor your workspace to how you actually spend your time.
            </p>
            <div className="mt-6 space-y-4">
              {/* LinkedIn AI Auto-detect */}
              <button 
                onClick={handleLinkedInDetect}
                disabled={isParsingLinkedIn}
                className="group flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3.5 text-[14.5px] font-medium transition disabled:opacity-70"
                style={{ 
                  borderColor: "var(--accent)", 
                  backgroundColor: isParsingLinkedIn ? "var(--accent)" : "transparent",
                  color: isParsingLinkedIn ? "white" : "var(--accent)"
                }}
              >
                {isParsingLinkedIn ? (
                  <Loader2 size={18} className="animate-spin text-white" />
                ) : (
                  <Linkedin size={18} className="text-accent group-hover:text-white transition" style={{ color: "var(--accent)" }} />
                )}
                <span className="transition" style={{ color: isParsingLinkedIn ? "white" : "var(--accent)" }}>
                  {isParsingLinkedIn ? "Analyzing profile..." : "Auto-detect with LinkedIn"}
                </span>
                {/* Embedded hover styles since inline hover is hard */}
                <style dangerouslySetInnerHTML={{__html: `
                  .group:hover { background-color: var(--accent) !important; color: white !important; }
                  .group:hover span, .group:hover svg { color: white !important; }
                `}} />
              </button>

              <div className="flex items-center gap-3 text-[12px] text-muted pt-2 pb-1">
                <span className="h-px flex-1 bg-line" /> or select manually <span className="h-px flex-1 bg-line" />
              </div>

              <div>
                <label className="block text-[13.5px] font-medium text-ink mb-2">Your role</label>
                <div className="relative">
                  <select 
                    autoFocus
                    className={cn(
                      "w-full appearance-none rounded-xl border border-line bg-surface px-4 py-3 pr-10 text-[14px] outline-none focus:border-accent transition",
                      role === "" ? "text-muted" : "text-ink"
                    )}
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="" disabled>Select your role...</option>
                    <option value="founder">Founder / CEO</option>
                    <option value="recruiter">Recruiter / Talent</option>
                    <option value="consultant">Consultant / Agency</option>
                    <option value="sales">Sales & Account Manager</option>
                    <option value="investor">Investor / VC</option>
                    <option value="executive">Manager & Executive</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-muted">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m6 9 6 6 6-6"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <Footer onNext={() => setStep(1)} disabled={!role.trim()} />
          </div>
        )}

        {/* Step 1 - Goal */}
        {step === 1 && questions && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-[30px] tracking-tight">Tell us about your work</h1>
            <p className="mt-1.5 text-[15px] text-muted">
              Tailoring for <span className="font-medium text-accent">{ICPS[selectedIcp!].label}</span> — what matters most to you?
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-[13.5px] font-medium text-ink mb-2">What&apos;s your primary goal?</label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {questions.goals.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setGoal(g.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border bg-surface px-4 py-3.5 text-left transition text-[13.5px]",
                        goal === g.id ? "border-accent ring-1 ring-accent text-[var(--accent-ink)]" : "border-line hover:border-line-strong text-ink-soft"
                      )}
                      style={goal === g.id ? { background: "var(--accent)" } : undefined}
                    >
                      <span className="flex-1 font-medium">{g.label}</span>
                      {goal === g.id && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Footer 
              onBack={() => setStep(0)} 
              onNext={() => setStep(2)} 
              disabled={!goal} 
            />
          </div>
        )}

        {/* Step 2 - Challenges */}
        {step === 2 && questions && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-[30px] tracking-tight">Tell us about your work</h1>
            <p className="mt-1.5 text-[15px] text-muted">
              We&apos;ll tailor your workspace to how you actually spend your time.
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-[13.5px] font-medium text-ink mb-2">What&apos;s your biggest daily challenge?</label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {questions.challenges.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setChallenge(g.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border bg-surface px-4 py-3.5 text-left transition text-[13.5px]",
                        challenge === g.id ? "border-accent ring-1 ring-accent text-[var(--accent-ink)]" : "border-line hover:border-line-strong text-ink-soft"
                      )}
                      style={challenge === g.id ? { background: "var(--accent)" } : undefined}
                    >
                      <span className="flex-1 font-medium">{g.label}</span>
                      {challenge === g.id && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Footer 
              onBack={() => setStep(1)} 
              onNext={() => setStep(3)} 
              disabled={!challenge} 
            />
          </div>
        )}

        {/* Step 3 - Tools */}
        {step === 3 && questions && (
          <div className="animate-fade-in">
            <h1 className="font-serif text-[30px] tracking-tight">Tell us about your work</h1>
            <p className="mt-1.5 text-[15px] text-muted">
              We&apos;ll tailor your workspace to how you actually spend your time.
            </p>
            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-[13.5px] font-medium text-ink mb-2">What tools do you rely on most?</label>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {questions.tools.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => setToolsStr(g.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-2xl border bg-surface px-4 py-3.5 text-left transition text-[13.5px]",
                        toolsStr === g.id ? "border-accent ring-1 ring-accent text-[var(--accent-ink)]" : "border-line hover:border-line-strong text-ink-soft"
                      )}
                      style={toolsStr === g.id ? { background: "var(--accent)" } : undefined}
                    >
                      <span className="flex-1 font-medium">{g.label}</span>
                      {toolsStr === g.id && <Check size={16} />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <Footer 
              onBack={() => setStep(2)} 
              onNext={() => {
                setIcp(evaluateIcp(role, goal));
                setStep(4);
              }} 
              disabled={!toolsStr} 
            />
          </div>
        )}

        {/* Step 4 - identity */}
        {step === 4 && (
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
              <input placeholder="Website or portfolio URL" className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-[14px] outline-none focus:border-accent" />
            </div>
            <Footer onNext={() => setStep(5)} onBack={() => setStep(3)} />
          </div>
        )}

        {/* Step 5 - calendar (the fix: calendar-first, powers every brief) */}
        {step === 5 && (
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
            <button onClick={() => setStep(6)} className="mt-4 text-[13px] text-muted underline-offset-2 hover:underline">
              I&apos;ll connect later
            </button>
            <Footer onNext={() => setStep(6)} onBack={() => setStep(4)} nextLabel="Build my persona" />
          </div>
        )}

        {/* Step 6 - building */}
        {step === 6 && (
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

        {/* Step 7 - live */}
        {step === 7 && icp && (
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

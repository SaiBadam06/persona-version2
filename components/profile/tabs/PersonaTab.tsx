"use client";

import { Mic, Volume2 } from "lucide-react";
import { Section, Field, Toggle, Pill } from "./parts";

const TONES = ["Professional", "Warm", "Direct", "Technical", "Concise"];

export function PersonaTab() {
  return (
    <div className="animate-fade-in">
      <Section title="Identity" desc="How your persona introduces itself.">
        <Field label="Name" defaultValue="Sai Deekshith Badam" />
        <Field label="Headline" defaultValue="Founder & Product — building PersonaOn" />
        <Field
          label="Short bio"
          textarea
          defaultValue="I help teams turn meetings into momentum. Building an always-on persona that preps you before every conversation and remembers every commitment."
        />
      </Section>

      <Section title="Voice & tone" desc="Pick how it sounds. Used in chat, briefs, and recaps.">
        <div className="mb-3 flex flex-wrap gap-2">
          {TONES.map((t, i) => (
            <button
              key={t}
              className={`rounded-full border px-3 py-1.5 text-[12.5px] transition ${
                i === 0
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-line bg-paper text-ink-soft hover:border-line-strong"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3.5 py-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent">
            <Volume2 size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-[13.5px] font-medium">Voice clone · active</p>
            <p className="text-[12px] text-muted">ElevenLabs · 0:42 sample · sounds like you</p>
          </div>
          <button className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-[12.5px] font-medium transition hover:bg-paper-2">
            <Mic size={13} /> Re-record
          </button>
        </div>
      </Section>

      <Section title="Boundaries" desc="What it should and shouldn't do on your behalf.">
        <Toggle
          label="Answer only from verified sources"
          desc="Never invent facts — defer when it doesn't know."
          defaultOn
        />
        <Toggle
          label="Decline off-topic questions"
          desc="Politely redirect anything not about you or your work."
          defaultOn
        />
        <Toggle
          label="Capture leads in chat"
          desc="Offer to collect contact details when a visitor shows intent."
        />
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-[12px] text-muted">Never discuss:</span>
          <Pill>Pricing specifics</Pill>
          <Pill>Unannounced roadmap</Pill>
          <Pill>+ add</Pill>
        </div>
      </Section>
    </div>
  );
}

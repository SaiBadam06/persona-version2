"use client";

import { Link2, Code2, QrCode, Store, Copy } from "lucide-react";
import { Section, Toggle } from "./parts";
import { useToast } from "../../ui/Toast";

export function SharingTab() {
  const toast = useToast();
  async function copyLink() {
    try {
      await navigator.clipboard.writeText("https://personaon.com/p/sai-badam");
      toast("Public link copied");
    } catch {
      toast("Copied", "info");
    }
  }
  return (
    <div className="animate-fade-in">
      <Section title="Public page" desc="A shareable page where anyone can chat with your persona.">
        <div className="flex items-center gap-2 rounded-xl border border-line bg-paper px-3.5 py-2.5">
          <Link2 size={16} className="text-muted" />
          <span className="flex-1 truncate font-mono text-[13px] text-ink-soft">
            personaon.com/p/sai-badam
          </span>
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-[12.5px] font-medium transition hover:bg-paper-2"
          >
            <Copy size={13} /> Copy
          </button>
        </div>
      </Section>

      <Section title="Where to put it">
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {[
            { icon: Code2, label: "Embed widget", desc: "Add to your website" },
            { icon: QrCode, label: "QR code", desc: "Slides, business cards" },
            { icon: Store, label: "Marketplace", desc: "List in the directory" },
            { icon: Link2, label: "Email signature", desc: "One-line link" },
          ].map((o) => {
            const Icon = o.icon;
            return (
              <button
                key={o.label}
                onClick={() => toast(`${o.label} - mock`, "info")}
                className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3.5 py-3 text-left transition hover:border-accent"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-accent ring-1 ring-line">
                  <Icon size={16} />
                </span>
                <span>
                  <span className="block text-[13.5px] font-medium">{o.label}</span>
                  <span className="block text-[12px] text-muted">{o.desc}</span>
                </span>
              </button>
            );
          })}
        </div>
      </Section>

      <Section title="Embed on your site" desc="Drop this snippet anywhere - a chat bubble appears in your voice.">
        <div className="rounded-xl border border-line bg-surface p-3.5">
          <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[11.5px] leading-relaxed text-ink-soft">{`<script src="https://personaon.com/widget.js"
  data-persona="sai-badam"
  data-mode="bubble"></script>`}</pre>
        </div>
        <button
          onClick={() => {
            navigator.clipboard?.writeText('<script src="https://personaon.com/widget.js" data-persona="sai-badam" data-mode="bubble"></script>').then(() => toast("Embed code copied")).catch(() => toast("Copied", "info"));
          }}
          className="mt-2 flex items-center gap-1.5 rounded-lg border border-line bg-surface px-3 py-1.5 text-[12.5px] font-medium transition hover:bg-paper-2"
        >
          <Copy size={13} /> Copy embed code
        </button>
      </Section>

      <Section title="Controls">
        <Toggle label="Persona is public" desc="Anyone with the link can chat." defaultOn />
        <Toggle label="Show in marketplace" desc="Discoverable in the directory." />
        <Toggle label="Remove PersonaOn branding" desc="Pro feature." />
      </Section>
    </div>
  );
}

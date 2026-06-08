"use client";

import { useEffect, useState } from "react";
import { X, Copy, Send, Sparkles, RefreshCw } from "lucide-react";
import { useApp } from "@/lib/store";
import { useToast } from "./ui/Toast";

const KIND_LABEL: Record<string, string> = {
  email: "Email draft",
  recap: "Meeting recap",
  update: "Update draft",
  note: "Note",
};

export function DraftPreviewModal() {
  const { draft, closeDraft } = useApp();
  const toast = useToast();
  const [body, setBody] = useState("");

  useEffect(() => {
    if (draft) setBody(draft.body);
  }, [draft]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeDraft();
    }
    if (draft) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [draft, closeDraft]);

  if (!draft) return null;

  async function copy() {
    try {
      await navigator.clipboard.writeText(body);
      toast("Copied to clipboard");
    } catch {
      toast("Copied", "info");
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink/30 backdrop-blur-[2px]" onClick={closeDraft} />
      <div className="relative flex h-[600px] max-h-[90vh] w-full max-w-[620px] animate-scale-in flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl shadow-black/20">
        <div className="flex items-center gap-3 border-b border-line px-6 py-4">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-soft text-accent">
            <Sparkles size={16} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="truncate font-serif text-[18px] tracking-tight">{draft.title}</h2>
            <p className="text-[12px] text-muted">
              {KIND_LABEL[draft.kind]} · drafted by your persona{draft.to ? ` · to ${draft.to}` : ""}
            </p>
          </div>
          <button onClick={closeDraft} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted transition hover:bg-paper-2">
            <X size={18} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="h-full min-h-[360px] w-full resize-none rounded-xl border border-line bg-paper px-4 py-3 font-sans text-[14px] leading-relaxed outline-none focus:border-accent"
          />
        </div>

        <div className="flex items-center gap-2 border-t border-line px-6 py-3">
          <button
            onClick={() => { setBody(draft.body); toast("Regenerated", "info"); }}
            className="flex items-center gap-2 rounded-lg border border-line px-3.5 py-2 text-[13px] font-medium transition hover:border-accent hover:text-accent"
          >
            <RefreshCw size={14} /> Regenerate
          </button>
          <button
            onClick={copy}
            className="flex items-center gap-2 rounded-lg border border-line px-3.5 py-2 text-[13px] font-medium transition hover:border-accent hover:text-accent"
          >
            <Copy size={14} /> Copy
          </button>
          <button
            onClick={() => { toast(draft.kind === "email" ? "Sent" : "Saved"); closeDraft(); }}
            className="ml-auto flex items-center gap-2 rounded-lg px-4 py-2 text-[13px] font-medium text-[var(--accent-ink)] transition"
            style={{ background: "var(--accent)" }}
          >
            <Send size={14} /> {draft.kind === "email" ? "Send" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

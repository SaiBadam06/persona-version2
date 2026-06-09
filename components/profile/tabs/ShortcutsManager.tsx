"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";
import { useApp } from "@/lib/store";
import {
  SHORTCUTS,
  formatBinding,
  bindingFromEvent,
  bindingsEqual,
} from "@/lib/shortcuts";
import type { ShortcutId } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ShortcutsManager() {
  const { bindings, setShortcut, resetShortcut } = useApp();
  const [recording, setRecording] = useState<ShortcutId | null>(null);
  const [error, setError] = useState<string | null>(null);

  function capture(e: React.KeyboardEvent, id: ShortcutId) {
    e.preventDefault();
    e.stopPropagation();
    if (e.key === "Escape") {
      setRecording(null);
      setError(null);
      return;
    }
    const b = bindingFromEvent(e.nativeEvent);
    if (!b) return; // modifier-only press — keep waiting
    const conflict = SHORTCUTS.find(
      (s) => s.id !== id && bindingsEqual(bindings[s.id], b)
    );
    if (conflict) {
      setError(`Already used by "${conflict.label}"`);
      return;
    }
    setShortcut(id, b);
    setRecording(null);
    setError(null);
  }

  return (
    <div className="space-y-2">
      {SHORTCUTS.map((s) => {
        const rec = recording === s.id;
        return (
          <div
            key={s.id}
            className="flex items-center gap-3 rounded-xl border border-line bg-paper px-3.5 py-2.5"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[13.5px] font-medium">{s.label}</span>
              <span className="block text-[12px] text-muted">{s.desc}</span>
            </span>
            {rec && error && (
              <span className="text-[11px] font-medium text-amber">{error}</span>
            )}
            <button
              onClick={() => {
                setError(null);
                setRecording(rec ? null : s.id);
              }}
              onKeyDown={rec ? (e) => capture(e, s.id) : undefined}
              className={cn(
                "min-w-[84px] rounded-lg border px-2.5 py-1 text-center font-mono text-[12px] transition",
                rec
                  ? "border-accent text-accent ring-1 ring-accent"
                  : "border-line text-ink-soft hover:border-line-strong"
              )}
            >
              {rec ? "Press keys…" : formatBinding(bindings[s.id])}
            </button>
            <button
              onClick={() => {
                resetShortcut(s.id);
                setRecording(null);
                setError(null);
              }}
              title="Reset to default"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted transition hover:bg-paper-2 hover:text-ink-soft"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        );
      })}
      <p className="px-1 pt-1 text-[12px] text-muted">
        <span className="font-mono text-ink-soft">Esc</span> closes dialogs — a
        system shortcut, not editable.
      </p>
    </div>
  );
}

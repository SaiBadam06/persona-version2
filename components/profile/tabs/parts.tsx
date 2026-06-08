"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function Section({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-7">
      <h3 className="text-[14px] font-semibold">{title}</h3>
      {desc && <p className="mt-0.5 text-[12.5px] text-muted">{desc}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

export function Field({
  label,
  defaultValue,
  textarea,
  placeholder,
}: {
  label: string;
  defaultValue?: string;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="mb-3 block">
      <span className="mb-1 block text-[12px] font-medium text-muted">
        {label}
      </span>
      {textarea ? (
        <textarea
          defaultValue={defaultValue}
          placeholder={placeholder}
          rows={3}
          className="w-full resize-none rounded-lg border border-line bg-paper px-3 py-2 text-[13.5px] outline-none focus:border-accent"
        />
      ) : (
        <input
          defaultValue={defaultValue}
          placeholder={placeholder}
          className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-[13.5px] outline-none focus:border-accent"
        />
      )}
    </label>
  );
}

export function Toggle({
  label,
  desc,
  defaultOn = false,
}: {
  label: string;
  desc?: string;
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className="mb-2 flex w-full items-center gap-3 rounded-xl border border-line bg-paper px-3.5 py-2.5 text-left transition hover:border-line-strong"
    >
      <span className="min-w-0 flex-1">
        <span className="block text-[13.5px] font-medium">{label}</span>
        {desc && <span className="block text-[12px] text-muted">{desc}</span>}
      </span>
      <span
        className={cn(
          "relative h-5 w-9 shrink-0 rounded-full transition",
          on ? "" : "bg-line-strong"
        )}
        style={on ? { background: "var(--accent)" } : undefined}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all",
            on ? "left-[18px]" : "left-0.5"
          )}
        />
      </span>
    </button>
  );
}

export function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[12.5px]">
      {children}
    </span>
  );
}

import { cn } from "@/lib/utils";

export function Avatar({
  initials,
  size = 36,
  accent = false,
  className,
}: {
  initials: string;
  size?: number;
  accent?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full font-medium",
        accent ? "text-[var(--accent-ink)]" : "text-ink-soft",
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
        background: accent
          ? "var(--accent)"
          : "linear-gradient(135deg,var(--color-paper-2),var(--color-line-strong))",
        border: "1px solid var(--color-line)",
      }}
    >
      {initials}
    </span>
  );
}

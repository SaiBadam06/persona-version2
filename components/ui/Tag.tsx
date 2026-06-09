import { cn } from "@/lib/utils";

export function Tag({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "positive";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-medium leading-5",
        tone === "neutral" && "bg-paper-2 text-muted",
        tone === "accent" && "bg-accent-soft text-accent",
        tone === "positive" && "bg-positive/15 text-positive",
        className
      )}
    >
      {children}
    </span>
  );
}

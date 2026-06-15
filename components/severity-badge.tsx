import type { ReactNode } from "react";

export type Severity = "critical" | "high" | "medium" | "low" | "info";

const STYLES: Record<Severity, string> = {
  critical:
    "border-rose-500/40 bg-rose-500/10 text-rose-300 shadow-[0_0_18px_rgba(244,63,94,0.18)]",
  high: "border-rose-400/40 bg-rose-400/10 text-rose-200",
  medium: "border-amber-400/40 bg-amber-400/10 text-amber-200",
  low: "border-yellow-400/40 bg-yellow-400/10 text-yellow-200",
  info: "border-veritas-electric/40 bg-veritas-electric/10 text-veritas-arc",
};

const LABELS: Record<Severity, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
  info: "Info",
};

export function SeverityBadge({
  severity,
  children,
  size = "md",
}: {
  severity: Severity;
  children?: ReactNode;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wider ${
        STYLES[severity]
      } ${
        size === "sm"
          ? "px-1.5 py-0.5 text-[9px]"
          : "px-2.5 py-1 text-[10px]"
      }`}
    >
      <span
        className={`inline-block rounded-full ${
          severity === "critical"
            ? "bg-rose-400"
            : severity === "high"
              ? "bg-rose-300"
              : severity === "medium"
                ? "bg-amber-300"
                : severity === "low"
                  ? "bg-yellow-300"
                  : "bg-veritas-electric"
        } ${size === "sm" ? "h-1 w-1" : "h-1.5 w-1.5"}`}
      />
      {children ?? LABELS[severity]}
    </span>
  );
}

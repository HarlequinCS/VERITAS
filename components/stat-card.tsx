import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";

type Trend = "up" | "down" | "flat";

export function StatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  trend = "flat",
  trendValue,
  accent = "cyan",
  spark,
}: {
  label: string;
  value: string | number;
  sublabel?: string;
  icon: LucideIcon;
  trend?: Trend;
  trendValue?: string;
  accent?: "cyan" | "purple" | "rose" | "amber";
  spark?: number[];
}) {
  const accentMap = {
    cyan: "text-veritas-electric bg-veritas-electric/10 ring-veritas-electric/20",
    purple: "text-veritas-arc bg-veritas-arc/10 ring-veritas-arc/20",
    rose: "text-rose-300 bg-rose-400/10 ring-rose-400/20",
    amber: "text-amber-300 bg-amber-400/10 ring-amber-400/20",
  } as const;

  const trendColor =
    trend === "down"
      ? "text-emerald-300"
      : trend === "up"
        ? "text-rose-300"
        : "text-slate-400";
  const TrendIcon =
    trend === "down" ? ArrowDownRight : trend === "up" ? ArrowUpRight : Minus;

  return (
    <article className="glass group relative flex flex-col overflow-hidden rounded-2xl p-5 transition hover:border-veritas-electric/30 hover:shadow-card">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            {label}
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-white">
            {value}
          </p>
        </div>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${accentMap[accent]}`}
        >
          <Icon className="h-5 w-5" strokeWidth={1.6} />
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between gap-2">
        <span className={`inline-flex items-center gap-1 text-xs font-medium ${trendColor}`}>
          <TrendIcon className="h-3.5 w-3.5" />
          {trendValue ?? "stable"}
        </span>
        {sublabel && (
          <span className="truncate text-xs text-slate-500">{sublabel}</span>
        )}
      </div>

      {spark && spark.length > 1 && <Spark data={spark} />}
    </article>
  );
}

function Spark({ data }: { data: number[] }) {
  const w = 100;
  const h = 24;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const points = data
    .map((v, i) => `${(i * step).toFixed(1)},${(h - ((v - min) / range) * h).toFixed(1)}`)
    .join(" ");
  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="mt-3 h-6 w-full"
      preserveAspectRatio="none"
      aria-hidden
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgb(34 211 238)" stopOpacity="0.35" />
          <stop offset="100%" stopColor="rgb(34 211 238)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={`0,${h} ${points} ${w},${h}`}
        fill="url(#spark-fill)"
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke="rgb(34 211 238)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

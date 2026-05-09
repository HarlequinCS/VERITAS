type SecurityScoreRingProps = {
  score: number;
  max?: number;
  label: string;
  sublabel: string;
};

export function SecurityScoreRing({
  score,
  max = 10,
  label,
  sublabel,
}: SecurityScoreRingProps) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  const r = 52;
  const c = 2 * Math.PI * r;
  const dash = c * (1 - pct / 100);

  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start sm:gap-10">
      <div className="relative h-36 w-36 shrink-0">
        <svg
          className="h-full w-full -rotate-90"
          viewBox="0 0 120 120"
          aria-hidden
        >
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="rgb(38 38 38)"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke="url(#veritas-score-ring-gradient)"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={dash}
            className="transition-[stroke-dashoffset] duration-700 ease-out"
          />
          <defs>
            <linearGradient
              id="veritas-score-ring-gradient"
              x1="0"
              y1="0"
              x2="1"
              y2="1"
            >
              <stop offset="0%" stopColor="rgb(251 113 133)" />
              <stop offset="100%" stopColor="rgb(251 191 36)" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-2xl font-semibold tracking-tight text-white tabular-nums">
            {score}
            <span className="text-base font-normal text-neutral-500">
              /{max}
            </span>
          </span>
        </div>
      </div>
      <div className="max-w-xl text-center sm:text-left">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
          Security posture
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {label}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-400 sm:text-base">
          {sublabel}
        </p>
      </div>
    </div>
  );
}

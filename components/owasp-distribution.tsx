const DEFAULT_DATA = [
  { id: "A01", label: "Broken Access Control", count: 14, severity: "critical" as const },
  { id: "A02", label: "Cryptographic Failures", count: 6, severity: "high" as const },
  { id: "A03", label: "Injection", count: 9, severity: "high" as const },
  { id: "A04", label: "Insecure Design", count: 4, severity: "medium" as const },
  { id: "A05", label: "Security Misconfiguration", count: 11, severity: "medium" as const },
  { id: "A06", label: "Vulnerable Components", count: 7, severity: "medium" as const },
  { id: "A07", label: "Authentication Failures", count: 5, severity: "high" as const },
  { id: "A08", label: "Software & Data Integrity", count: 2, severity: "low" as const },
  { id: "A09", label: "Logging Failures", count: 3, severity: "low" as const },
  { id: "A10", label: "Server-Side Request Forgery", count: 1, severity: "low" as const },
];

const SEV_COLOR: Record<string, string> = {
  critical: "#F43F5E",
  high: "#FB7185",
  medium: "#F59E0B",
  low: "#FACC15",
};

export interface OwaspItem {
  id: string;
  label: string;
  count: number;
  severity: "critical" | "high" | "medium" | "low";
}

export function OwaspDistribution({ data }: { data?: OwaspItem[] }) {
  const OWASP_DATA = data && data.length > 0 ? data : DEFAULT_DATA;
  const total = OWASP_DATA.reduce((acc, d) => acc + d.count, 0);
  let cumulative = 0;
  const r = 56;
  const c = 2 * Math.PI * r;
  const top = OWASP_DATA.reduce((a, b) => (b.count > a.count ? b : a));

  return (
    <section className="glass flex flex-col rounded-2xl p-5 sm:p-6">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white">OWASP Top 10 distribution</h3>
          <p className="text-[11px] text-slate-500">Across all active targets</p>
        </div>
        <span className="rounded-full border border-veritas-border-subtle bg-veritas-surface/60 px-2 py-1 text-[10px] font-semibold text-veritas-electric">
          {total} findings
        </span>
      </header>

      <div className="mt-5 flex flex-col items-center gap-6 sm:flex-row sm:items-center">
        <div className="relative h-44 w-44 shrink-0">
          <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
            <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(148,163,184,0.10)" strokeWidth="14" />
            {OWASP_DATA.map((d) => {
              const pct = d.count / total;
              const dash = c * pct;
              const offset = c * (1 - cumulative);
              cumulative += pct;
              return (
                <circle
                  key={d.id}
                  cx="70"
                  cy="70"
                  r={r}
                  fill="none"
                  stroke={SEV_COLOR[d.severity]}
                  strokeWidth="14"
                  strokeDasharray={`${dash} ${c}`}
                  strokeDashoffset={offset}
                  className="transition-all duration-700 ease-out"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-[10px] uppercase tracking-wider text-slate-500">Top category</p>
            <p className="mt-1 text-xs font-semibold text-white">{top.id}</p>
            <p className="text-[10px] text-slate-400">{top.count} findings</p>
          </div>
        </div>

        <ul className="flex-1 space-y-1.5">
          {OWASP_DATA.map((d) => (
            <li
              key={d.id}
              className="group flex items-center gap-2.5 rounded-md px-1.5 py-1 transition hover:bg-veritas-surface/60"
            >
              <span
                aria-hidden
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: SEV_COLOR[d.severity] }}
              />
              <span className="font-mono text-[10px] text-slate-500">{d.id}</span>
              <span className="flex-1 truncate text-[11px] text-slate-300">{d.label}</span>
              <span className="font-mono text-xs tabular-nums text-white">{d.count}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

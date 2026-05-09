import { ChevronRight, Crosshair, FileCode } from "lucide-react";
import Link from "next/link";

const SESSIONS = [
  {
    id: "sess-2098",
    target: "app.acme.io",
    mode: "Black Box",
    started: "12 min ago",
    duration: "8m 14s",
    findings: { c: 1, h: 3, m: 6, l: 4 },
    status: "Running",
  },
  {
    id: "sess-2097",
    target: "billing.acme.io/admin",
    mode: "White Box",
    started: "1h ago",
    duration: "12m 02s",
    findings: { c: 2, h: 1, m: 4, l: 7 },
    status: "Completed",
  },
  {
    id: "sess-2096",
    target: "api-staging.acme.io",
    mode: "Black Box",
    started: "3h ago",
    duration: "6m 51s",
    findings: { c: 0, h: 2, m: 3, l: 2 },
    status: "Completed",
  },
  {
    id: "sess-2095",
    target: "auth.acme.io",
    mode: "Black Box",
    started: "Yesterday",
    duration: "9m 30s",
    findings: { c: 0, h: 0, m: 5, l: 3 },
    status: "Completed",
  },
  {
    id: "sess-2094",
    target: "vault.acme.io",
    mode: "White Box",
    started: "Yesterday",
    duration: "14m 08s",
    findings: { c: 1, h: 2, m: 2, l: 1 },
    status: "Failed",
  },
] as const;

function statusBadge(s: string) {
  if (s === "Running")
    return "border-cyan-400/40 bg-cyan-400/10 text-cyan-300";
  if (s === "Completed")
    return "border-emerald-400/40 bg-emerald-400/10 text-emerald-300";
  return "border-rose-400/40 bg-rose-400/10 text-rose-300";
}

export function ScanSessionTable() {
  return (
    <section className="glass overflow-hidden rounded-2xl">
      <header className="flex items-center justify-between gap-3 border-b border-veritas-border-subtle/70 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Recent scan sessions</h3>
          <p className="text-[11px] text-slate-500">Last 24 hours · all targets</p>
        </div>
        <Link
          href="/scans/live"
          className="flex items-center gap-1 rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400/40 hover:text-white"
        >
          View all
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
            <tr className="border-b border-veritas-border-subtle/70">
              <th className="px-5 py-3 font-semibold">Target</th>
              <th className="px-3 py-3 font-semibold">Mode</th>
              <th className="px-3 py-3 font-semibold">Started</th>
              <th className="px-3 py-3 font-semibold">Duration</th>
              <th className="px-3 py-3 font-semibold">Findings</th>
              <th className="px-3 py-3 font-semibold">Status</th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {SESSIONS.map((s) => (
              <tr
                key={s.id}
                className="group border-b border-veritas-border-subtle/60 last:border-0 transition hover:bg-veritas-surface/40"
              >
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-veritas-surface ring-1 ring-veritas-border-strong">
                      {s.mode === "White Box" ? (
                        <FileCode className="h-3.5 w-3.5 text-purple-300" />
                      ) : (
                        <Crosshair className="h-3.5 w-3.5 text-cyan-300" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-xs text-white truncate max-w-[220px]">
                        {s.target}
                      </p>
                      <p className="text-[10px] text-slate-500">{s.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3 text-xs text-slate-400">{s.mode}</td>
                <td className="px-3 py-3 text-xs text-slate-400">{s.started}</td>
                <td className="px-3 py-3 font-mono text-xs text-slate-300">
                  {s.duration}
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-1">
                    <FindingPill n={s.findings.c} color="rose" />
                    <FindingPill n={s.findings.h} color="orange" />
                    <FindingPill n={s.findings.m} color="amber" />
                    <FindingPill n={s.findings.l} color="yellow" />
                  </div>
                </td>
                <td className="px-3 py-3">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${statusBadge(
                      s.status,
                    )}`}
                  >
                    {s.status === "Running" && (
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400/60" />
                        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
                      </span>
                    )}
                    {s.status}
                  </span>
                </td>
                <td className="px-3 py-3 text-right">
                  <Link
                    href="/vulnerabilities/cwe-285"
                    className="inline-flex items-center gap-1 rounded-md border border-transparent px-2 py-1 text-xs text-slate-400 opacity-0 transition group-hover:opacity-100 hover:border-cyan-400/40 hover:text-cyan-200"
                  >
                    Open
                    <ChevronRight className="h-3 w-3" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function FindingPill({
  n,
  color,
}: {
  n: number;
  color: "rose" | "orange" | "amber" | "yellow";
}) {
  if (n === 0) return null;
  const map = {
    rose: "bg-rose-500/15 text-rose-300 ring-rose-500/30",
    orange: "bg-orange-500/15 text-orange-300 ring-orange-500/30",
    amber: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
    yellow: "bg-yellow-500/15 text-yellow-300 ring-yellow-500/30",
  } as const;
  return (
    <span
      className={`inline-flex h-5 min-w-5 items-center justify-center rounded-md px-1 font-mono text-[10px] font-semibold ring-1 ${map[color]}`}
    >
      {n}
    </span>
  );
}

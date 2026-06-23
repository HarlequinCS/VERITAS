import { ChevronRight, Crosshair, FileCode, Radar } from "lucide-react";
import Link from "next/link";

export interface ScanSession {
  id: string;
  target: string;
  mode: "Black Box" | "White Box";
  started: string;
  duration: string;
  findings: { c: number; h: number; m: number; l: number };
  status: "Running" | "Completed" | "Failed";
}

function statusBadge(s: string) {
  if (s === "Running")
    return "border-veritas-electric/40 bg-veritas-electric/10 text-veritas-electric";
  if (s === "Completed")
    return "border-emerald-400/40 bg-emerald-400/10 text-emerald-300";
  return "border-rose-400/40 bg-rose-400/10 text-rose-300";
}

export function ScanSessionTable({
  sessions,
}: {
  sessions: ScanSession[];
}) {
  const isEmpty = sessions.length === 0;

  return (
    <section className="glass overflow-hidden rounded-2xl">
      <header className="flex items-center justify-between gap-3 border-b border-veritas-border-subtle/70 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Recent scan sessions</h3>
          <p className="text-[11px] text-slate-500">
            {isEmpty ? "No scans yet" : "Latest activity across all targets"}
          </p>
        </div>
        {!isEmpty && (
          <Link
            href="/scans/live"
            className="flex items-center gap-1 rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-2.5 py-1.5 text-xs font-medium text-slate-300 transition hover:border-veritas-electric/40 hover:text-white"
          >
            View all
            <ChevronRight className="h-3.5 w-3.5" />
          </Link>
        )}
      </header>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center gap-4 px-5 py-14">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-veritas-surface ring-1 ring-veritas-border-strong">
            <Radar className="h-6 w-6 text-veritas-electric" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-white">Start your first scan</p>
            <p className="mt-1 max-w-[280px] text-xs text-slate-500">
              Discover vulnerabilities across your attack surface. No agents required.
            </p>
          </div>
          <Link
            href="/targets/new"
            className="rounded-lg bg-electric-mix px-4 py-2 text-xs font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110"
          >
            + New scan
          </Link>
        </div>
      ) : (
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
              {sessions.map((s) => (
                <tr
                  key={s.id}
                  className="group border-b border-veritas-border-subtle/60 last:border-0 transition hover:bg-veritas-surface/40"
                >
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-md bg-veritas-surface ring-1 ring-veritas-border-strong">
                        {s.mode === "White Box" ? (
                          <FileCode className="h-3.5 w-3.5 text-veritas-arc" />
                        ) : (
                          <Crosshair className="h-3.5 w-3.5 text-veritas-electric" />
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
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-veritas-electric/60" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-veritas-electric" />
                        </span>
                      )}
                      {s.status}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <Link
                      href="/vulnerabilities/cwe-285"
                      className="inline-flex items-center gap-1 rounded-md border border-transparent px-2 py-1 text-xs text-slate-400 opacity-0 transition group-hover:opacity-100 hover:border-veritas-electric/40 hover:text-veritas-arc"
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
      )}
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

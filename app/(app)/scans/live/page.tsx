import { HttpTraceFeed } from "@/components/http-trace-feed";
import { LiveTerminal } from "@/components/live-terminal";
import { PhaseTracker, type Phase } from "@/components/phase-tracker";
import { TelemetryStrip } from "@/components/telemetry-strip";
import {
  Crosshair,
  Pause,
  Play,
  Square,
} from "lucide-react";
import Link from "next/link";

const PHASES: Phase[] = [
  { id: 1, name: "Static / Dynamic Triage", status: "done" },
  { id: 2, name: "AI Exploit Generation", status: "active", progress: 64 },
  { id: 3, name: "Playwright Simulation", status: "pending" },
  { id: 4, name: "AI Analysis", status: "pending" },
];

const AGENTS = [
  { name: "Triage", state: "done", tone: "emerald" },
  { name: "Exploiter", state: "active", tone: "cyan" },
  { name: "Playwright", state: "queued", tone: "slate" },
  { name: "Analyst", state: "queued", tone: "slate" },
] as const;

export default function LiveScanPage() {
  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
            Live scan
          </p>
          <h1 className="mt-1.5 flex items-center gap-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            <Crosshair className="h-6 w-6 text-cyan-300" />
            <span className="font-mono">app.acme.io</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Session{" "}
            <span className="font-mono text-cyan-300">sess-2098</span> · started 12 minutes ago · phase 2 of 4
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-3 text-xs font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-veritas-surface"
          >
            <Pause className="h-3.5 w-3.5" /> Pause
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-3 text-xs font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-veritas-surface"
          >
            <Play className="h-3.5 w-3.5" /> Resume
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 text-xs font-medium text-rose-200 transition hover:bg-rose-500/15"
          >
            <Square className="h-3.5 w-3.5" /> Abort
          </button>
        </div>
      </div>

      {/* Phase tracker */}
      <PhaseTracker phases={PHASES} />

      {/* Body grid */}
      <div className="mt-6 grid gap-4 xl:grid-cols-5 xl:gap-5">
        <div className="xl:col-span-3 xl:h-[640px]">
          <LiveTerminal />
        </div>

        <div className="flex flex-col gap-4 xl:col-span-2">
          {/* Agents */}
          <section className="glass rounded-2xl p-4">
            <header className="mb-3 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-white">Agent status</h3>
              <span className="text-[10px] text-slate-500">heartbeat · 1s</span>
            </header>
            <ul className="grid grid-cols-2 gap-2">
              {AGENTS.map((a) => (
                <li
                  key={a.name}
                  className={`rounded-lg border p-3 ${
                    a.state === "active"
                      ? "border-cyan-400/40 bg-cyan-400/5"
                      : a.state === "done"
                        ? "border-emerald-400/30 bg-emerald-400/5"
                        : "border-veritas-border-subtle bg-veritas-surface/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-white">{a.name}</p>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider ${
                        a.state === "active"
                          ? "text-cyan-300"
                          : a.state === "done"
                            ? "text-emerald-300"
                            : "text-slate-500"
                      }`}
                    >
                      {a.state === "active" && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400/60" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
                        </span>
                      )}
                      {a.state}
                    </span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-veritas-border-subtle">
                    <div
                      className={`h-full rounded-full ${
                        a.state === "active"
                          ? "bg-cyan-400"
                          : a.state === "done"
                            ? "bg-emerald-400"
                            : "bg-slate-700"
                      }`}
                      style={{
                        width:
                          a.state === "active"
                            ? "62%"
                            : a.state === "done"
                              ? "100%"
                              : "8%",
                      }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <HttpTraceFeed />
          <TelemetryStrip />
        </div>
      </div>

      {/* Timeline */}
      <section className="glass mt-6 rounded-2xl p-5">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Real-time scan timeline</h3>
            <p className="text-[11px] text-slate-500">scrub to replay any moment</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-3 rounded bg-emerald-400" /> phase done
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-3 rounded bg-cyan-400" /> active
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-3 rounded bg-rose-400" /> finding
            </span>
          </div>
        </header>

        <div className="relative h-12 rounded-xl bg-veritas-surface/40 ring-1 ring-veritas-border-subtle">
          {/* Phase bands */}
          <div className="absolute inset-y-2 left-[2%] w-[22%] rounded-md bg-emerald-400/30" />
          <div className="absolute inset-y-2 left-[26%] w-[34%] rounded-md bg-cyan-400/30 ring-1 ring-cyan-400/50" />
          <div className="absolute inset-y-2 left-[62%] w-[20%] rounded-md bg-veritas-border-subtle" />
          <div className="absolute inset-y-2 left-[84%] w-[12%] rounded-md bg-veritas-border-subtle" />
          {/* Findings markers */}
          {[18, 32, 48].map((p) => (
            <span
              key={p}
              className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-400 ring-2 ring-rose-400/40"
              style={{ left: `${p}%` }}
              title="Finding"
            />
          ))}
          {/* Playhead */}
          <span
            className="absolute top-0 h-12 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.6)]"
            style={{ left: "44%" }}
          />
          {/* Time labels */}
          <div className="absolute -bottom-5 left-0 right-0 flex justify-between font-mono text-[10px] text-slate-500">
            <span>00:00</span>
            <span>03:00</span>
            <span>06:00</span>
            <span>09:00</span>
            <span>12:00 (live)</span>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between gap-3">
          <p className="text-[11px] text-slate-500">
            3 findings discovered ·{" "}
            <Link href="/vulnerabilities/cwe-285" className="text-cyan-300 hover:text-cyan-200">
              jump to first error →
            </Link>
          </p>
          <Link
            href="/vulnerabilities/cwe-285"
            className="rounded-lg bg-neon-mix px-3 py-1.5 text-xs font-semibold text-veritas-bg shadow-glow-cyan transition hover:brightness-110"
          >
            Open analysis workspace
          </Link>
        </div>
      </section>
    </main>
  );
}

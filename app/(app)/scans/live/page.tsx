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
  { id: 1, name: "Session queued", status: "done" },
  { id: 2, name: "Playwright simulation", status: "active", progress: 64 },
  { id: 3, name: "Evidence capture", status: "pending" },
  { id: 4, name: "AI patch loop", status: "pending" },
];

const AGENTS = [
  { name: "Worker", state: "done", tone: "emerald" },
  { name: "Playwright", state: "active", tone: "cyan" },
  { name: "Classifier", state: "queued", tone: "slate" },
  { name: "Validator", state: "queued", tone: "slate" },
] as const;

export default function LiveScanPage() {
  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-veritas-electric/80">
            Live scan
          </p>
          <h1 className="mt-1.5 flex items-center gap-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            <Crosshair className="h-6 w-6 text-veritas-electric" />
            <span className="font-mono">app.acme.io</span>
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Session{" "}
            <span className="font-mono text-veritas-electric">sess-2098</span> · status Processing · ephemeral browser context active
          </p>
        </div>

        <div id="controls" className="flex items-center gap-2">
          <Link
            href="/scans/live#timeline"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-3 text-xs font-medium text-slate-200 transition hover:border-veritas-electric/40 hover:bg-veritas-surface"
          >
            <Pause className="h-3.5 w-3.5" /> Pause
          </Link>
          <Link
            href="/scans/live#timeline"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-3 text-xs font-medium text-slate-200 transition hover:border-veritas-electric/40 hover:bg-veritas-surface"
          >
            <Play className="h-3.5 w-3.5" /> Resume
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 text-xs font-medium text-rose-200 transition hover:bg-rose-500/15"
          >
            <Square className="h-3.5 w-3.5" /> Abort
          </Link>
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
              <h3 className="text-xs font-semibold text-white">Worker / agent status</h3>
              <span className="text-[10px] text-slate-500">heartbeat · 1s</span>
            </header>
            <ul className="grid grid-cols-2 gap-2">
              {AGENTS.map((a) => (
                <li
                  key={a.name}
                  className={`rounded-lg border p-3 ${
                    a.state === "active"
                      ? "border-veritas-electric/40 bg-veritas-electric/5"
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
                          ? "text-veritas-electric"
                          : a.state === "done"
                            ? "text-emerald-300"
                            : "text-slate-500"
                      }`}
                    >
                      {a.state === "active" && (
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-veritas-electric/60" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-veritas-electric" />
                        </span>
                      )}
                      {a.state}
                    </span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-veritas-border-subtle">
                    <div
                      className={`h-full rounded-full ${
                        a.state === "active"
                          ? "bg-veritas-electric"
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
      <section id="timeline" className="glass mt-6 rounded-2xl p-5">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Real-time scan timeline</h3>
            <p className="text-[11px] text-slate-500">scan states, traces, and evidence capture</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] text-slate-500">
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-3 rounded bg-emerald-400" /> phase done
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-3 rounded bg-veritas-electric" /> active
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-3 rounded bg-rose-400" /> finding
            </span>
          </div>
        </header>

        <div className="relative h-12 rounded-xl bg-veritas-surface/40 ring-1 ring-veritas-border-subtle">
          {/* Phase bands */}
          <div className="absolute inset-y-2 left-[2%] w-[22%] rounded-md bg-emerald-400/30" />
          <div className="absolute inset-y-2 left-[26%] w-[34%] rounded-md bg-veritas-electric/30 ring-1 ring-veritas-electric/50" />
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
            3 traces stored · 1 exploit successful ·{" "}
            <Link href="/vulnerabilities/cwe-285" className="text-veritas-electric hover:text-veritas-arc">
              jump to first error →
            </Link>
          </p>
          <Link
            href="/vulnerabilities/cwe-285"
            className="rounded-lg bg-electric-mix px-3 py-1.5 text-xs font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110"
          >
            Open analysis workspace
          </Link>
        </div>
      </section>
    </main>
  );
}

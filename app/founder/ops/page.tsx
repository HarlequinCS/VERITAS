"use client";

import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  Cpu,
  Database,
  Gauge,
  HardDrive,
  Mail,
  Server,
  ShieldCheck,
  Timer,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

const SERVERS = [
  { name: "fastapi-gateway-01", status: "online", cpu: 38, mem: 42, region: "us-east-1", uptime: "14d 7h" },
  { name: "celery-worker-pool", status: "online", cpu: 71, mem: 64, region: "us-east-1", uptime: "6d 22h" },
  { name: "redis-broker", status: "online", cpu: 24, mem: 31, region: "us-east-1", uptime: "21d 3h" },
  { name: "playwright-runners", status: "degraded", cpu: 86, mem: 79, region: "us-east-1", uptime: "2d 14h" },
];

const ENQUIRIES = [
  { name: "Aisha Tan", company: "Fintech startup", intent: "Team plan demo", time: "4m ago", priority: "high" },
  { name: "Omar Lewis", company: "Solo developer", intent: "Scanner beta access", time: "18m ago", priority: "medium" },
  { name: "Priya Shah", company: "Enterprise SOC", intent: "Private deployment", time: "41m ago", priority: "high" },
];

const METRICS_HISTORY = [21, 24, 19, 27, 25, 30, 27];

export default function FounderOpsPage() {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  const secondsSinceUpdate = Math.floor((Date.now() - now) / 1000) + 5;

  return (
    <main className="min-h-dvh bg-veritas-bg px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-7xl">
        {/* ── Header ── */}
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            <div>
              <p className="flex items-center gap-2 font-label text-xs uppercase tracking-[0.2em] text-veritas-electric">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-veritas-success opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-veritas-success" />
                </span>
                Private Founder Console
              </p>
              <h1 className="mt-2 font-display text-4xl font-bold text-white">VERITAS SaaS operations</h1>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-400">
                Hidden monitoring dashboard for the SaaS founder. This console is separate from the
                customer scanner and contains no scanning tools.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[11px] text-slate-600">
              updated {secondsSinceUpdate}s ago
            </span>
            <Link
              href="/"
              className="rounded-lg border border-veritas-border-subtle px-4 py-2 text-sm text-slate-300 hover:border-veritas-electric/40 hover:text-white"
            >
              Return to site
            </Link>
          </div>
        </div>

        {/* ── Top metric cards ── */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <Metric icon={Activity} label="Running scans" value="27" detail="live Celery tasks" live />
          <Metric icon={Users} label="Active workspaces" value="184" detail="last 24h" />
          <Metric icon={Mail} label="Open enquiries" value="12" detail="3 high intent" />
          <Metric icon={Database} label="Redis queue" value="43" detail="avg wait 18s" />
          <Metric icon={Zap} label="Token usage (24h)" value="86.4K" detail="of 500K limit" />
          <Metric icon={Gauge} label="Avg latency" value="142ms" detail="p95 · 0.2% err" />
        </div>

        {/* ── Main grid: Servers + Token panel ── */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Server status — expanded */}
          <section className="glass rounded-2xl p-5 lg:col-span-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <Server className="h-4 w-4 text-veritas-electric" /> Server performance
            </h2>
            <div className="mt-4 space-y-3">
              {SERVERS.map((s) => (
                <div
                  key={s.name}
                  className="rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-mono text-sm text-white">{s.name}</p>
                        <LiveDot status={s.status as "online" | "degraded"} />
                      </div>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {s.region} · up {s.uptime}
                      </p>
                    </div>
                    <StatusBadge status={s.status as "online" | "degraded"} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <ProgressBar label="CPU" value={s.cpu} />
                    <ProgressBar label="MEM" value={s.mem} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Token & rate limit panel */}
          <section className="glass rounded-2xl p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <Zap className="h-4 w-4 text-veritas-electric" /> Token & rate usage
            </h2>
            <div className="mt-4 space-y-4">
              <div className="rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-400">Daily limit</span>
                  <span className="font-mono text-white">86.4K / 500K</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-veritas-border-subtle">
                  <div
                    className="h-full rounded-full bg-electric-mix transition-all"
                    style={{ width: "17.3%" }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600">Reset in 6h 14m</span>
                  <span className="font-mono text-veritas-electric">17.3%</span>
                </div>
              </div>

              <div className="rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 p-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-400">Rate limit</span>
                  <span className="font-mono text-white">142 / 500 req/s</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-veritas-border-subtle">
                  <div
                    className="h-full rounded-full bg-arc-mix transition-all"
                    style={{ width: "28.4%" }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-[11px]">
                  <span className="text-slate-600">Burst allowed</span>
                  <span className="font-mono text-veritas-arc">28.4%</span>
                </div>
              </div>

              <div className="rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 p-3">
                <p className="text-[11px] font-medium text-slate-400">Top consumers</p>
                <ul className="mt-2 space-y-1.5">
                  {[
                    { name: "scan-engine", tokens: "41.2K" },
                    { name: "remediation-agent", tokens: "22.8K" },
                    { name: "report-gen", tokens: "12.3K" },
                  ].map((c) => (
                    <li key={c.name} className="flex items-center justify-between text-xs">
                      <span className="font-mono text-slate-400">{c.name}</span>
                      <span className="font-mono text-white">{c.tokens}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* ── Enquiries ── */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <section className="glass rounded-2xl p-5 lg:col-span-2">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <Mail className="h-4 w-4 text-veritas-electric" /> User enquiries
            </h2>
            <div className="mt-4 space-y-3">
              {ENQUIRIES.map((item) => (
                <div
                  key={item.name}
                  className="rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 p-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-white">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.company} · {item.time}</p>
                    </div>
                    {item.priority === "high" && (
                      <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 font-label text-[10px] uppercase tracking-wider text-amber-300">
                        High intent
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-veritas-electric">{item.intent}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Platform health */}
          <section className="glass rounded-2xl p-5">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <Activity className="h-4 w-4 text-veritas-electric" /> Platform health
            </h2>
            <div className="mt-4 space-y-3">
              <HealthRow icon={Cpu} label="CPU" value="47%" sub="8-core avg" />
              <HealthRow icon={HardDrive} label="Memory" value="6.2 GB" sub="of 16 GB" />
              <HealthRow icon={Database} label="Disk" value="342 GB" sub="of 500 GB" />
              <HealthRow icon={Timer} label="Uptime" value="23d 11h" sub="since last deploy" />
              <HealthRow icon={TrendingUp} label="Error rate" value="0.18%" sub="last 24h" />
              <HealthRow icon={ShieldCheck} label="Last deploy" value="v2.4.1" sub="12h ago" />
            </div>
          </section>
        </div>

        {/* ── Platform controls ── */}
        <section className="glass mt-6 rounded-2xl p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
            <ShieldCheck className="h-4 w-4 text-veritas-electric" /> Remote platform controls
          </h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              { label: "Scale Celery worker pool", detail: "+2 workers available" },
              { label: "Restart Playwright runner group", detail: "4 runners affected" },
              { label: "Inspect failed scan sessions", detail: "7 sessions in dead-letter" },
            ].map((control) => (
              <Link
                key={control.label}
                href="/founder/ops#server-status"
                className="group rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 p-4 transition hover:border-veritas-electric/40"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-300 group-hover:text-white">{control.label}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-600 group-hover:text-veritas-electric" />
                </div>
                <p className="mt-1 text-xs text-slate-600">{control.detail}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Scan throughput mini chart ── */}
        <section className="glass mt-6 rounded-2xl p-5">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
            <Activity className="h-4 w-4 text-veritas-electric" /> Scan throughput (last 7 intervals)
          </h2>
          <div className="mt-4 flex items-end gap-2">
            {METRICS_HISTORY.map((val, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="font-mono text-[10px] text-slate-500">{val}</span>
                <div
                  className="w-full rounded-t-sm bg-electric-mix transition-all"
                  style={{
                    height: `${(val / 30) * 80}px`,
                    opacity: 0.5 + (val / 30) * 0.5,
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

/* ── Sub-components ── */

function Metric({
  icon: Icon,
  label,
  value,
  detail,
  live = false,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  detail: string;
  live?: boolean;
}) {
  return (
    <div className="glass rounded-2xl p-5 transition hover:border-veritas-electric/20">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-veritas-electric" />
        {live && <LiveDot status="online" />}
      </div>
      <p className="mt-3 font-label text-[10px] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{detail}</p>
    </div>
  );
}

function LiveDot({ status }: { status: "online" | "degraded" }) {
  const colorMap = { online: "bg-veritas-success", degraded: "bg-amber-400" };
  const color = colorMap[status];
  return (
    <span className="relative flex h-2 w-2">
      <span
        className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${color}`}
      />
      <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`} />
    </span>
  );
}

function StatusBadge({ status }: { status: "online" | "degraded" }) {
  const style =
    status === "online"
      ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-300"
      : "border-amber-400/30 bg-amber-400/10 text-amber-300";
  return (
    <span
      className={`shrink-0 rounded-full border px-2 py-1 text-[10px] font-semibold uppercase tracking-wider ${style}`}
    >
      {status}
    </span>
  );
}

function ProgressBar({ label, value }: { label: string; value: number }) {
  const colorClass = value > 80 ? "bg-amber-400" : value > 60 ? "bg-veritas-arc" : "bg-veritas-electric";
  return (
    <div>
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-medium text-slate-500">{label}</span>
        <span className="font-mono text-white">{value}%</span>
      </div>
      <div className="mt-1 h-1.5 rounded-full bg-veritas-border-subtle">
        <div
          className={`h-full rounded-full transition-all ${colorClass}`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}

function HealthRow({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: typeof Cpu;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-veritas-border-subtle bg-veritas-surface/30 px-3 py-2">
      <Icon className="h-3.5 w-3.5 shrink-0 text-veritas-electric" />
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-medium text-slate-400">{label}</p>
        <p className="font-mono text-sm text-white">{value}</p>
      </div>
      <span className="shrink-0 text-[10px] text-slate-600">{sub}</span>
    </div>
  );
}

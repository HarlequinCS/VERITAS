import { AgentStatusGrid } from "@/components/agent-status-grid";
import { LiveActivityRail } from "@/components/live-activity-rail";
import { OwaspDistribution } from "@/components/owasp-distribution";
import { ScanSessionTable } from "@/components/scan-session-table";
import { StatCard } from "@/components/stat-card";
import { ThreatHeatmap } from "@/components/threat-heatmap";
import {
  AlertTriangle,
  ScanLine,
  ShieldAlert,
  Target,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
            Command Center
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Welcome back, Maya
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            2 scans running · 14 critical findings need triage
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/reports"
            className="rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-cyan-400/40 hover:text-white"
          >
            Generate report
          </Link>
          <Link
            href="/targets/new"
            className="rounded-lg bg-neon-mix px-3.5 py-2 text-xs font-semibold text-veritas-bg shadow-glow-cyan transition hover:brightness-110"
          >
            + New target
          </Link>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total targets"
          value={247}
          sublabel="+12 this week"
          icon={Target}
          accent="cyan"
          trend="down"
          trendValue="+5.4%"
          spark={[12, 18, 14, 22, 19, 27, 26]}
        />
        <StatCard
          label="Completed scans"
          value="1,832"
          sublabel="last 30 days"
          icon={ScanLine}
          accent="purple"
          trend="down"
          trendValue="+6.2%"
          spark={[80, 92, 110, 96, 124, 132, 148]}
        />
        <StatCard
          label="Critical vulns"
          value={14}
          sublabel="−3 vs last week"
          icon={ShieldAlert}
          accent="rose"
          trend="down"
          trendValue="−17.6%"
          spark={[24, 21, 19, 18, 17, 15, 14]}
        />
        <StatCard
          label="Medium vulns"
          value={92}
          sublabel="stable"
          icon={AlertTriangle}
          accent="amber"
          trend="flat"
          trendValue="0.0%"
          spark={[88, 90, 91, 89, 92, 93, 92]}
        />
      </div>

      {/* Charts row */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <OwaspDistribution />
        </div>
        <ThreatHeatmap />
      </div>

      {/* Table + side rail */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ScanSessionTable />
        </div>
        <LiveActivityRail />
      </div>

      {/* Agents row */}
      <div className="mt-6">
        <AgentStatusGrid />
      </div>
    </main>
  );
}

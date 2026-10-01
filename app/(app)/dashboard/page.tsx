import { createClient } from "@/utils/supabase/server";
import { AgentStatusGrid } from "@/components/agent-status-grid";
import { LiveActivityRail } from "@/components/live-activity-rail";
import { OwaspDistribution } from "@/components/owasp-distribution";
import type { OwaspItem } from "@/components/owasp-distribution";
import { ProfileSetupForm } from "@/components/profile-setup-form";
import { ScanSessionTable } from "@/components/scan-session-table";
import type { ScanSession } from "@/components/scan-session-table";
import { StatCard } from "@/components/stat-card";
import { ThreatHeatmap } from "@/components/threat-heatmap";
import {
  AlertTriangle,
  ScanLine,
  ShieldAlert,
  Target,
} from "lucide-react";
import Link from "next/link";

function fmtRelative(d: Date): string {
  const now = Date.now();
  const then = d.getTime();
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return "just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)} min ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 172800) return "Yesterday";
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)} days ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default async function DashboardPage() {
  const supabase = await createClient();

  let username = "Analyst";
  let userEmail = "";
  let authError: string | null = null;
  let needsProfileSetup = false;

  try {
    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();

    if (userErr || !user) {
      authError = "Unauthenticated. Please sign in.";
    } else {
      userEmail = user.email ?? "";
      const { data: profile } = await supabase
        .from("users")
        .select("username")
        .eq("user_id", user.id)
        .single();
      if (profile?.username) username = profile.username;

      // Show profile form if user hasn't completed onboarding
      needsProfileSetup = user.user_metadata?.onboarded !== true;
    }
  } catch {
    authError = "Unable to verify session.";
  }

  let sessions: ScanSession[] = [];
  let scanError: string | null = null;

  try {
    const { data: rows, error: scansErr } = await supabase
      .from("scan_sessions")
      .select(
        "session_id, scan_status, scan_mode, start_time, end_time, created_at, target_applications(target_url)"
      )
      .order("created_at", { ascending: false })
      .limit(5);

    if (scansErr) {
      scanError = scansErr.message;
    } else if (rows && rows.length > 0) {
      const sessionIds = rows.map((r) => r.session_id);

      // Fetch severity breakdown per session
      const { data: vulns } = await supabase
        .from("detected_vulnerabilities")
        .select("session_id, severity_level")
        .in("session_id", sessionIds)
        .eq("is_false_positive", false);

      const findingsMap = new Map<
        string,
        { c: number; h: number; m: number; l: number }
      >();
      vulns?.forEach((v) => {
        const curr = findingsMap.get(v.session_id) ?? { c: 0, h: 0, m: 0, l: 0 };
        if (v.severity_level === "Critical") curr.c++;
        else if (v.severity_level === "High") curr.h++;
        else if (v.severity_level === "Medium") curr.m++;
        else if (v.severity_level === "Low") curr.l++;
        findingsMap.set(v.session_id, curr);
      });

      sessions = rows.map((r) => {
        const start = r.start_time ? new Date(r.start_time) : null;
        const end = r.end_time ? new Date(r.end_time) : null;
        let duration = "—";
        if (start && end) {
          const sec = Math.floor((end.getTime() - start.getTime()) / 1000);
          if (sec < 60) duration = `${sec}s`;
          else if (sec < 3600)
            duration = `${Math.floor(sec / 60)}m ${sec % 60}s`;
          else
            duration = `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
        } else if (start) {
          const sec = Math.floor((Date.now() - start.getTime()) / 1000);
          if (sec < 60) duration = `${sec}s`;
          else if (sec < 3600)
            duration = `${Math.floor(sec / 60)}m ${sec % 60}s`;
          else
            duration = `${Math.floor(sec / 3600)}h ${Math.floor((sec % 3600) / 60)}m`;
        }

        const taArr = (r.target_applications ?? []) as { target_url: string }[];
        const ta = taArr[0];
        return {
          id: (r.session_id as string).slice(0, 8),
          target: ta?.target_url ?? "Unknown",
          mode: (r.scan_mode ?? "Black Box") as "Black Box" | "White Box",
          started: fmtRelative(new Date(r.created_at)),
          duration,
          findings: findingsMap.get(r.session_id as string) ?? {
            c: 0,
            h: 0,
            m: 0,
            l: 0,
          },
          status: r.scan_status as "Running" | "Completed" | "Failed",
        };
      });
    }
  } catch {
    scanError = "Unable to load scan history.";
  }

  const totalScans = sessions.length;
  const completedScans = sessions.filter((s) => s.status === "Completed").length;
  const totalCritical = sessions.reduce((sum, s) => sum + s.findings.c, 0);
  const openTickets = sessions.filter(
    (s) => s.status === "Running" || s.status === "Failed"
  ).length;

  // Fetch OWASP category distribution
  let owaspData: OwaspItem[] = [];
  try {
    const { data: catRows } = await supabase
      .from("detected_vulnerabilities")
      .select("owasp_category, severity_level")
      .eq("is_false_positive", false);

    if (catRows) {
      const catMap = new Map<string, { count: number; severity: string }>();
      catRows.forEach((r) => {
        const cat = r.owasp_category ?? "Unknown";
        const existing = catMap.get(cat);
        if (existing) {
          existing.count++;
          // Upgrade severity if higher
          const sevRank: Record<string, number> = { critical: 4, high: 3, medium: 2, low: 1 };
          if ((sevRank[r.severity_level?.toLowerCase() ?? "low"] ?? 0) > (sevRank[existing.severity] ?? 0)) {
            existing.severity = r.severity_level?.toLowerCase() ?? "low";
          }
        } else {
          catMap.set(cat, { count: 1, severity: r.severity_level?.toLowerCase() ?? "low" });
        }
      });
      owaspData = Array.from(catMap.entries()).map(([label, v], i) => ({
        id: `A${(i + 1).toString().padStart(2, "0")}`,
        label,
        count: v.count,
        severity: v.severity as "critical" | "high" | "medium" | "low",
      }));
    }
  } catch {
    // leave owaspData empty → component falls back to default
  }

  return needsProfileSetup ? (
    <ProfileSetupForm currentUsername={username} email={userEmail} />
  ) : (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Global error banner */}
      {(authError || scanError) && (
        <div
          role="alert"
          className="mb-6 flex items-start gap-2.5 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
        >
          <span className="mt-0.5 shrink-0 text-rose-400">⚠</span>
          {authError ?? scanError}
        </div>
      )}

      {/* Page header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-veritas-electric/80">
            Command Center
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Welcome back, {username}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            {totalScans > 0
              ? `${sessions.filter((s) => s.status === "Running").length} scan${sessions.filter((s) => s.status === "Running").length === 1 ? "" : "s"} processing · ${openTickets} open ticket${openTickets === 1 ? "" : "s"}`
              : "No active scans. Start your first vulnerability assessment."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/reports"
            className="rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-veritas-electric/40 hover:text-white"
          >
            Build report
          </Link>
          <Link
            href="/targets/new"
            className="rounded-lg bg-electric-mix px-3.5 py-2 text-xs font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110"
          >
            + Start scan
          </Link>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="animate-fade-up" style={{ animationDelay: "40ms" }}>
          <StatCard
            label="Registered targets"
            value={totalScans}
            sublabel="solo + team workspaces"
            icon={Target}
            accent="cyan"
            trend="flat"
            trendValue="0.0%"
            spark={[totalScans]}
          />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "80ms" }}>
          <StatCard
            label="Completed sessions"
            value={completedScans}
            sublabel="Pending → Processing → Done"
            icon={ScanLine}
            accent="purple"
            trend="flat"
            trendValue="0.0%"
            spark={[completedScans]}
          />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "120ms" }}>
          <StatCard
            label="Critical findings"
            value={totalCritical}
            sublabel="Across all scans"
            icon={ShieldAlert}
            accent="rose"
            trend="flat"
            trendValue="0.0%"
            spark={[totalCritical]}
          />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "160ms" }}>
          <StatCard
            label="Open tickets"
            value={openTickets}
            sublabel="dev review queue"
            icon={AlertTriangle}
            accent="amber"
            trend="flat"
            trendValue="0.0%"
            spark={[openTickets]}
          />
        </div>
      </div>

      {/* Charts row */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="animate-fade-up xl:col-span-2" style={{ animationDelay: "200ms" }}>
          <OwaspDistribution data={owaspData} />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "240ms" }}>
          <ThreatHeatmap />
        </div>
      </div>

      {/* Table + side rail */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="animate-fade-up xl:col-span-2" style={{ animationDelay: "280ms" }}>
          <ScanSessionTable sessions={sessions} />
        </div>
        <div className="animate-fade-up" style={{ animationDelay: "320ms" }}>
          <LiveActivityRail />
        </div>
      </div>

      {/* Agents row */}
      <div className="mt-6 animate-fade-up" style={{ animationDelay: "360ms" }}>
        <AgentStatusGrid />
      </div>
    </main>
  );
}

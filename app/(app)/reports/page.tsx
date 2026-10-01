"use client";

import { SeverityBadge } from "@/components/severity-badge";
import {
  Calendar,
  CheckCircle2,
  ChevronDown,
  Download,
  FileJson,
  FileText,
  GripVertical,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const ICON_SRC = "https://saifuliqbal.dev/veritasicon.png";

type Audience = "Executive" | "Engineering" | "Auditor";

const SECTIONS = [
  { id: "exec", label: "Executive summary", default: true },
  { id: "scope", label: "Scope & methodology", default: true },
  { id: "findings", label: "Findings by severity", default: true },
  { id: "compliance", label: "Compliance mapping", default: true },
  { id: "remediation", label: "Remediation plan", default: true },
  { id: "appendix", label: "Appendix · Evidence", default: true },
];

const EMPTY_FINDINGS: FindingItem[] = [
  { sev: "critical", label: "Critical vulnerabilities", count: 0 },
  { sev: "high", label: "High severity findings", count: 0 },
  { sev: "medium", label: "Medium severity issues", count: 0 },
  { sev: "low", label: "Low or informational", count: 0 },
];

type FindingItem = { sev: "critical" | "high" | "medium" | "low"; label: string; count: number };

export default function ReportStudioPage() {
  const [audience, setAudience] = useState<Audience>("Executive");
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.map((s) => [s.id, s.default])),
  );
  const [findings, setFindings] = useState<FindingItem[]>(EMPTY_FINDINGS);
  const [findingsLoading, setFindingsLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("detected_vulnerabilities")
      .select("severity_level")
      .eq("is_false_positive", false)
      .then(({ data, error }) => {
        if (error || !data) {
          setFindings(EMPTY_FINDINGS);
          setFindingsLoading(false);
          return;
        }
        const counts: Record<string, number> = {};
        data.forEach((v) => {
          const sev = (v.severity_level ?? "low").toLowerCase();
          counts[sev] = (counts[sev] || 0) + 1;
        });
        setFindings([
          { sev: "critical", label: "Critical Vulnerabilities", count: counts["critical"] || 0 },
          { sev: "high", label: "High Severity Findings", count: counts["high"] || 0 },
          { sev: "medium", label: "Medium Severity Issues", count: counts["medium"] || 0 },
          { sev: "low", label: "Low / Informational", count: counts["low"] || 0 + (counts["info"] || 0) },
        ]);
        setFindingsLoading(false);
      });
  }, []);

  function toggle(id: string) {
    setEnabled((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-veritas-electric/80">
            Report studio
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Q3 External Web App Assessment
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Report{" "}
            <span className="font-mono text-veritas-electric">VR-2026-Q3-019</span> ·
            draft · last edited 2 minutes ago
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/report"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-3 text-xs font-medium text-slate-200 transition hover:border-veritas-electric/40 hover:bg-veritas-surface"
          >
            <FileJson className="h-3.5 w-3.5" /> Export JSON
          </Link>
          <Link
            href="/report"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-3 text-xs font-medium text-slate-200 transition hover:border-veritas-electric/40 hover:bg-veritas-surface"
          >
            <FileText className="h-3.5 w-3.5" /> SARIF
          </Link>
          <Link
            href="/report"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-electric-mix px-3.5 text-xs font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110"
          >
            <Download className="h-3.5 w-3.5" /> Download PDF
          </Link>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        {/* LEFT: Configurator */}
        <aside className="space-y-5 xl:col-span-4">
          {/* Session picker */}
          <section className="glass rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white">Scan session</h2>
            <Link
              href="/scans/live"
              className="mt-3 flex w-full items-center justify-between gap-2 rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 px-3 py-2.5 text-left text-xs transition hover:border-veritas-electric/40"
            >
              <span className="flex min-w-0 items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-veritas-electric" />
                <span className="text-slate-200">No scan session yet</span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            </Link>
            <p className="mt-2 text-sm text-slate-300">
              A report can be built after this workspace has a completed scan.
            </p>
          </section>

          {/* Audience preset */}
          <section id="branding" className="glass rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white">Audience preset</h2>
            <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl border border-veritas-border-subtle bg-veritas-surface/30 p-1">
              {(["Executive", "Engineering", "Auditor"] as Audience[]).map(
                (a) => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => setAudience(a)}
                    className={`rounded-lg px-2 py-2 text-[11px] font-semibold transition ${
                      audience === a
                        ? "bg-veritas-surface text-white shadow-card ring-1 ring-veritas-border-strong"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {a}
                  </button>
                ),
              )}
            </div>
            <p className="mt-2 text-[11px] text-slate-500">
              {audience === "Executive"
                ? "High-level summary, charts, and risk index. Minimal jargon."
                : audience === "Engineering"
                  ? "Full payloads, traces, and patches per finding."
                  : "Compliance-heavy with evidence pinned per control."}
            </p>
          </section>

          {/* Sections */}
          <section className="glass rounded-2xl p-5">
            <header className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Sections</h2>
              <span className="text-[10px] text-slate-500">drag to reorder</span>
            </header>
            <ul className="mt-3 space-y-1.5">
              {SECTIONS.map((s) => (
                <li
                  key={s.id}
                  className="group flex items-center gap-2 rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-2.5 py-2 transition hover:border-veritas-electric/30"
                >
                  <GripVertical className="h-3.5 w-3.5 cursor-grab text-slate-600" />
                  <label className="flex flex-1 items-center gap-2 text-xs text-slate-200">
                    <input
                      type="checkbox"
                      checked={!!enabled[s.id]}
                      onChange={() => toggle(s.id)}
                      className="h-3.5 w-3.5 accent-veritas-electric"
                    />
                    {s.label}
                  </label>
                </li>
              ))}
            </ul>
          </section>

          {/* Branding */}
          <section className="glass rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white">Branding</h2>
            <div className="mt-3 space-y-3">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-dashed border-veritas-border-strong bg-veritas-surface/40 text-slate-500">
                  <ImageIcon className="h-4 w-4" />
                </span>
                <div className="flex-1">
                  <p className="text-xs font-medium text-slate-200">
                    Client logo
                  </p>
                  <p className="text-[10px] text-slate-500">PNG · max 2 MB</p>
                </div>
                <Link
                  href="/settings"
                  className="rounded-md border border-veritas-border-subtle bg-veritas-bg/60 px-2 py-1 text-[10px] font-semibold text-slate-300 hover:text-white"
                >
                  Upload
                </Link>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-300">Accent color</p>
                <div className="mt-2 flex gap-1.5">
                  {["#22D3EE", "#8B5CF6", "#10B981", "#F59E0B", "#F43F5E"].map(
                    (c) => (
                      <Link
                        href="/reports#branding"
                        key={c}
                        className="h-6 w-6 rounded-md ring-1 ring-veritas-border-strong transition hover:scale-110"
                        style={{ background: c }}
                        aria-label={`accent ${c}`}
                      />
                    ),
                  )}
                </div>
              </div>
              <textarea
                rows={2}
                placeholder="Footer note (e.g. Confidential — Acme Inc.)"
                className="w-full rounded-lg border border-veritas-border-subtle bg-veritas-bg/60 p-2 text-[11px] text-white outline-none placeholder:text-slate-600 focus:border-veritas-electric/40"
              />
            </div>
          </section>
        </aside>

        {/* RIGHT: Preview */}
        <section className="xl:col-span-8">
          <div className="glass overflow-hidden rounded-2xl">
            <header className="flex items-center justify-between border-b border-veritas-border-subtle bg-veritas-surface/40 px-4 py-2.5">
              <p className="text-xs font-semibold text-white">Live preview</p>
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <span>page</span>
                <span className="rounded-md border border-veritas-border-subtle bg-veritas-bg/60 px-1.5 py-0.5 font-mono text-veritas-electric">
                  1
                </span>
                <span>of 12</span>
              </div>
            </header>

            {/* Paper canvas */}
            <div className="bg-[#070b18] p-4 sm:p-6 lg:p-8">
              <article className="mx-auto max-w-[760px] space-y-6 rounded-xl bg-veritas-bg/85 p-6 ring-1 ring-veritas-border-subtle sm:p-8">
                {/* Cover */}
                <div className="border-b border-veritas-border-subtle pb-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Image
                        src={ICON_SRC}
                        alt=""
                        width={36}
                        height={36}
                        className="opacity-90"
                      />
                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-veritas-electric/80">
                        VERITAS Security Assessment
                      </p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">
                        Q3 External Web App Assessment
                      </h2>
                      <p className="mt-1 text-xs text-slate-400">
                        Prepared for{" "}
                        <span className="text-white">Acme Corp.</span> ·
                        September 2026
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-wider text-slate-500">
                        Report ID
                      </p>
                      <p className="mt-1 font-mono text-xs text-veritas-electric">
                        VR-2026-Q3-019
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-amber-200">
                        Draft
                      </span>
                    </div>
                  </div>
                </div>

                {/* Executive KPIs */}
                <section>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Executive summary
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <KpiTile label="Findings" value={String(findings.reduce((s, f) => s + f.count, 0))} delta="—" />
                    <KpiTile label="Risk index" value="6.2" delta="−0.8" tone="amber" />
                    <KpiTile label="Mean TTR" value="34h" delta="+6h" tone="rose" />
                    <KpiTile label="Coverage" value="92%" delta="+4%" tone="emerald" />
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-slate-300">
                    Assessment surfaced{" "}
                    <span className="text-rose-300">{findings.find((f) => f.sev === "critical")?.count ?? 0} critical</span> and{" "}
                    <span className="text-amber-300">{findings.find((f) => f.sev === "high")?.count ?? 0} high</span> findings.
                    Engineering review is recommended within 48 hours.
                  </p>
                </section>

                {/* Findings */}
                <section>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Findings by severity
                  </p>
                  {findingsLoading ? (
                    <p className="mt-3 text-xs text-slate-500">Loading findings…</p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {findings.map((f, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-3 rounded-lg border border-veritas-border-subtle bg-veritas-surface/30 px-3 py-2"
                        >
                          <SeverityBadge severity={f.sev} size="sm" />
                          <p className="flex-1 text-xs text-slate-200">{f.label}</p>
                          <span className="font-mono text-xs text-white">
                            ×{f.count}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>

                {/* Compliance */}
                <section>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Compliance checklist
                  </p>
                  <p className="mt-3 text-base leading-relaxed text-slate-300">
                    Compliance scores are not available. This workspace does not map findings to ISO, SOC 2, PCI, or GDPR.
                  </p>
                </section>

                {/* AI exec summary */}
                <section className="rounded-xl border border-veritas-arc/25 bg-veritas-arc/5 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-400/15 ring-1 ring-veritas-arc/30">
                      <Sparkles className="h-3.5 w-3.5 text-veritas-arc" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-veritas-arc">
                        ✦ AI executive narrative
                      </p>
                      <p className="mt-1.5 text-base leading-relaxed text-slate-300">
                        No narrative is generated until this workspace has findings from a completed scan.
                      </p>
                    </div>
                  </div>
                </section>

                <footer className="flex items-center justify-between border-t border-veritas-border-subtle pt-4 text-xs text-slate-300">
                  <span>No report has been generated.</span>
                  <span className="inline-flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-300" />
                    Confidential — Acme Inc.
                  </span>
                </footer>
              </article>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function KpiTile({
  label,
  value,
  delta,
  tone = "cyan",
}: {
  label: string;
  value: string;
  delta: string;
  tone?: "cyan" | "amber" | "rose" | "emerald";
}) {
  const tones = {
    cyan: "text-veritas-electric",
    amber: "text-amber-300",
    rose: "text-rose-300",
    emerald: "text-emerald-300",
  } as const;
  return (
    <div className="rounded-xl border border-veritas-border-subtle bg-veritas-surface/30 p-3">
      <p className="text-[10px] uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
      <p className={`text-[10px] ${tones[tone]}`}>{delta} vs prev</p>
    </div>
  );
}

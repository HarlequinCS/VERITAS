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
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

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

const COMPLIANCE = [
  { framework: "ISO 27001", pass: 38, fail: 2, na: 6 },
  { framework: "SOC 2 Type II", pass: 41, fail: 3, na: 4 },
  { framework: "PCI-DSS v4", pass: 22, fail: 4, na: 12 },
  { framework: "GDPR", pass: 18, fail: 1, na: 9 },
] as const;

const FINDINGS = [
  { sev: "critical" as const, label: "Broken Access Control", count: 3 },
  { sev: "high" as const, label: "Authentication Failures", count: 5 },
  { sev: "medium" as const, label: "Security Misconfiguration", count: 11 },
  { sev: "low" as const, label: "Logging Failures", count: 4 },
];

export default function ReportStudioPage() {
  const [audience, setAudience] = useState<Audience>("Executive");
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(SECTIONS.map((s) => [s.id, s.default])),
  );

  function toggle(id: string) {
    setEnabled((s) => ({ ...s, [id]: !s[id] }));
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
            Report studio
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Q3 External Web App Assessment
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Report{" "}
            <span className="font-mono text-cyan-300">VR-2026-Q3-019</span> ·
            draft · last edited 2 minutes ago
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-3 text-xs font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-veritas-surface"
          >
            <FileJson className="h-3.5 w-3.5" /> Export JSON
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-3 text-xs font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-veritas-surface"
          >
            <FileText className="h-3.5 w-3.5" /> SARIF
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-neon-mix px-3.5 text-xs font-semibold text-veritas-bg shadow-glow-cyan transition hover:brightness-110"
          >
            <Download className="h-3.5 w-3.5" /> Download PDF
          </button>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-12">
        {/* LEFT: Configurator */}
        <aside className="space-y-5 xl:col-span-4">
          {/* Session picker */}
          <section className="glass rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white">Scan session</h2>
            <button
              type="button"
              className="mt-3 flex w-full items-center justify-between gap-2 rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 px-3 py-2.5 text-left text-xs transition hover:border-cyan-400/40"
            >
              <span className="flex min-w-0 items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-cyan-300" />
                <span className="font-mono text-cyan-200">sess-2098</span>
                <span className="truncate text-slate-400">· app.acme.io</span>
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
            </button>
            <p className="mt-2 text-[11px] text-slate-500">
              Includes 23 findings · 3 critical · 5 high
            </p>
          </section>

          {/* Audience preset */}
          <section className="glass rounded-2xl p-5">
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
                  className="group flex items-center gap-2 rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-2.5 py-2 transition hover:border-cyan-400/30"
                >
                  <GripVertical className="h-3.5 w-3.5 cursor-grab text-slate-600" />
                  <label className="flex flex-1 items-center gap-2 text-xs text-slate-200">
                    <input
                      type="checkbox"
                      checked={!!enabled[s.id]}
                      onChange={() => toggle(s.id)}
                      className="h-3.5 w-3.5 accent-cyan-400"
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
                <button
                  type="button"
                  className="rounded-md border border-veritas-border-subtle bg-veritas-bg/60 px-2 py-1 text-[10px] font-semibold text-slate-300 hover:text-white"
                >
                  Upload
                </button>
              </div>
              <div>
                <p className="text-xs font-medium text-slate-300">Accent color</p>
                <div className="mt-2 flex gap-1.5">
                  {["#22D3EE", "#8B5CF6", "#10B981", "#F59E0B", "#F43F5E"].map(
                    (c) => (
                      <button
                        type="button"
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
                className="w-full rounded-lg border border-veritas-border-subtle bg-veritas-bg/60 p-2 text-[11px] text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/40"
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
                <span className="rounded-md border border-veritas-border-subtle bg-veritas-bg/60 px-1.5 py-0.5 font-mono text-cyan-300">
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
                      <p className="mt-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
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
                      <p className="mt-1 font-mono text-xs text-cyan-300">
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
                    <KpiTile label="Findings" value="23" delta="−4" />
                    <KpiTile label="Risk index" value="6.2" delta="−0.8" tone="amber" />
                    <KpiTile label="Mean TTR" value="34h" delta="+6h" tone="rose" />
                    <KpiTile label="Coverage" value="92%" delta="+4%" tone="emerald" />
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-slate-300">
                    The Q3 assessment surfaced{" "}
                    <span className="text-rose-300">3 critical</span> and{" "}
                    <span className="text-amber-300">5 high</span> findings,
                    with a primary concentration in access-control gaps in
                    administrative routes. Patch drafts are attached for the
                    top 8 findings; engineering review is recommended within
                    48 hours.
                  </p>
                </section>

                {/* Findings */}
                <section>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Findings by severity
                  </p>
                  <ul className="mt-3 space-y-2">
                    {FINDINGS.map((f, i) => (
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
                </section>

                {/* Compliance */}
                <section>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    Compliance checklist
                  </p>
                  <div className="mt-3 overflow-hidden rounded-lg border border-veritas-border-subtle">
                    <table className="w-full text-xs">
                      <thead className="bg-veritas-surface/40 text-[10px] uppercase tracking-wider text-slate-500">
                        <tr>
                          <th className="px-3 py-2 text-left">Framework</th>
                          <th className="px-3 py-2 text-right">Pass</th>
                          <th className="px-3 py-2 text-right">Fail</th>
                          <th className="px-3 py-2 text-right">N/A</th>
                          <th className="px-3 py-2 text-right">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {COMPLIANCE.map((c) => {
                          const total = c.pass + c.fail + c.na;
                          const score = Math.round((c.pass / total) * 100);
                          return (
                            <tr
                              key={c.framework}
                              className="border-t border-veritas-border-subtle/70 text-slate-200"
                            >
                              <td className="px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-300" />
                                  <span>{c.framework}</span>
                                </div>
                              </td>
                              <td className="px-3 py-2 text-right text-emerald-300">
                                {c.pass}
                              </td>
                              <td className="px-3 py-2 text-right text-rose-300">
                                {c.fail}
                              </td>
                              <td className="px-3 py-2 text-right text-slate-400">
                                {c.na}
                              </td>
                              <td className="px-3 py-2 text-right font-mono text-white">
                                {score}%
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* AI exec summary */}
                <section className="rounded-xl border border-purple-400/25 bg-purple-400/5 p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-7 w-7 items-center justify-center rounded-md bg-purple-400/15 ring-1 ring-purple-400/30">
                      <Sparkles className="h-3.5 w-3.5 text-purple-300" />
                    </span>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-purple-300">
                        ✦ AI executive narrative
                      </p>
                      <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                        Posture improved 12% versus Q2. The remaining critical
                        risk is concentrated in legacy admin tooling. Closing
                        the top 3 access-control findings would reduce
                        residual risk to{" "}
                        <span className="text-emerald-300">low</span>.
                      </p>
                    </div>
                  </div>
                </section>

                <footer className="flex items-center justify-between border-t border-veritas-border-subtle pt-4 text-[10px] text-slate-500">
                  <span className="font-mono">VR-2026-Q3-019 · page 1 / 12</span>
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
    cyan: "text-cyan-300",
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

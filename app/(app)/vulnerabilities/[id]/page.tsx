import { DiffViewer } from "@/components/diff-viewer";
import { PoCViewer } from "@/components/poc-viewer";
import { SeverityBadge } from "@/components/severity-badge";
import {
  ChevronDown,
  Clock,
  Code,
  Download,
  ExternalLink,
  FileText,
  ShieldAlert,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";

const TABS = [
  { id: "analysis", label: "Analysis" },
  { id: "payload", label: "Payload" },
  { id: "evidence", label: "Evidence" },
  { id: "fix", label: "Fix Recommendation" },
] as const;

export default function VulnerabilityWorkspacePage() {
  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Sub-header */}
      <header className="glass mb-5 rounded-2xl p-4 sm:p-5">
        <div className="flex flex-wrap items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 ring-1 ring-rose-400/30">
            <ShieldAlert className="h-5 w-5 text-rose-300" />
          </span>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <SeverityBadge severity="critical" />
              <span className="rounded-md border border-veritas-border-subtle bg-veritas-bg/60 px-2 py-0.5 font-mono text-[10px] text-veritas-electric">
                CWE-285
              </span>
              <span className="rounded-md border border-veritas-border-subtle bg-veritas-bg/60 px-2 py-0.5 font-mono text-[10px] text-veritas-arc">
                OWASP A01
              </span>
              <span className="rounded-md border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
                Verified by simulation
              </span>
            </div>
            <h1 className="mt-2 text-xl font-semibold tracking-tight text-white sm:text-2xl">
              Broken Access Control on{" "}
              <span className="font-mono text-veritas-arc">/admin/users</span>
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Authenticated users can reach administrative routes without an
              admin role. Server-side authorization is missing on protected
              endpoints.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/tickets"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-3 text-xs font-medium text-slate-200 transition hover:border-veritas-electric/40 hover:bg-veritas-surface"
            >
              <User className="h-3.5 w-3.5" /> Assign to developer
            </Link>
            <Link
              href="/tickets"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-3 text-xs font-medium text-slate-200 transition hover:border-veritas-electric/40 hover:bg-veritas-surface"
            >
              <Clock className="h-3.5 w-3.5" /> Pending Verification
              <ChevronDown className="h-3 w-3 text-slate-500" />
            </Link>
            <Link
              href="/reports"
              className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-3 text-xs font-medium text-slate-200 transition hover:border-veritas-electric/40 hover:bg-veritas-surface"
            >
              <Download className="h-3.5 w-3.5" /> Export evidence
            </Link>
          </div>
        </div>
      </header>

      {/* Split layout */}
      <div className="grid gap-5 xl:grid-cols-12">
        {/* LEFT: Evidence */}
        <section className="space-y-5 xl:col-span-5">
          {/* Metadata */}
          <div className="glass rounded-2xl p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Detected vulnerability record</h2>
              <a
                href="https://cwe.mitre.org/data/definitions/285.html"
                className="inline-flex items-center gap-1 text-[11px] text-veritas-electric hover:text-veritas-arc"
              >
                View on MITRE
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
              <Meta label="CWE ID" value="CWE-285" mono />
              <Meta label="OWASP" value="A01:2021" mono />
              <Meta label="Endpoint" value="/admin/users" mono />
              <Meta label="Method" value="GET" mono />
              <Meta label="Parameter" value="—" mono />
              <Meta label="CVSS" value="8.6 (High)" />
            </dl>

            <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 p-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Vector
                </p>
                <p className="mt-1 text-xs font-medium text-white">Network</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Auth
                </p>
                <p className="mt-1 text-xs font-medium text-white">Required</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">
                  Impact
                </p>
                <p className="mt-1 text-xs font-medium text-rose-300">Privilege escalation</p>
              </div>
            </div>

            {/* Exploit successful banner */}
            <div className="mt-4 flex items-center gap-2.5 rounded-xl border border-rose-400/40 bg-rose-500/10 px-3 py-2.5 shadow-glow-danger">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-rose-500/20 ring-1 ring-rose-400/40">
                <ShieldAlert className="h-3.5 w-3.5 text-rose-300" />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-rose-200">
                  Exploit successful
                </p>
                <p className="text-[11px] text-rose-200/70">
                  Reproduced in an isolated Playwright context · 4 frames captured · context torn down
                </p>
              </div>
            </div>
          </div>

          {/* PoC */}
          <div>
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-white">Visual proof of concept</h2>
              <span className="font-mono text-[10px] text-slate-500">
                playwright · chromium 124
              </span>
            </div>
            <PoCViewer />
          </div>

          {/* Evidence timeline */}
          <div className="glass rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-white">Evidence timeline</h2>
            <ol className="mt-3 space-y-2">
              {[
                { t: "00:00", desc: "Triage agent mapped /admin/* (12 routes)" },
                { t: "00:08", desc: "Sent GET /admin/users with non-admin session" },
                { t: "00:09", desc: "Server returned 200 with admin payload" },
                { t: "00:10", desc: "Captured frame_004 — admin table visible" },
                { t: "00:14", desc: "AI loop: classified, synthesized patch, validator approved schema" },
              ].map((row, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-3 py-2"
                >
                  <span className="mt-0.5 inline-flex h-5 w-12 shrink-0 items-center justify-center rounded-md border border-veritas-border-strong bg-veritas-bg/60 font-mono text-[10px] text-veritas-electric">
                    {row.t}
                  </span>
                  <p className="text-[11.5px] text-slate-300">{row.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* RIGHT: Intelligence */}
        <section className="space-y-5 xl:col-span-7">
          {/* Tabs */}
          <div className="glass overflow-hidden rounded-2xl">
            <nav
              role="tablist"
              aria-label="Analysis tabs"
              className="flex items-center gap-1 border-b border-veritas-border-subtle bg-veritas-surface/40 px-2 py-2"
            >
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={i === 0}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                    i === 0
                      ? "bg-veritas-bg text-white shadow-card ring-1 ring-veritas-border-strong"
                      : "text-slate-400 hover:bg-veritas-surface hover:text-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            <div className="space-y-5 p-5">
              {/* AI Root cause */}
              <div className="rounded-2xl border border-veritas-arc/25 bg-veritas-arc/5 p-5">
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-veritas-arc/15 ring-1 ring-veritas-arc/30">
                    <Sparkles className="h-4 w-4 text-veritas-arc" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-veritas-arc">
                        AI root cause analysis · Agent 1
                      </p>
                      <span className="rounded-full bg-veritas-bg/60 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                        confidence 96%
                      </span>
                    </div>
                    <p className="mt-2.5 text-sm leading-relaxed text-slate-200">
                      The application authorizes administrative pages on the
                      client. The Next.js middleware passes any authenticated
                      request through to <span className="font-mono text-veritas-arc">/admin/*</span>{" "}
                      without inspecting the user&apos;s role claim. The UI hides
                      these routes from non-admin users, but a direct request
                      still resolves successfully.
                    </p>
                    <ul className="mt-3 space-y-1.5 text-xs text-slate-400">
                      <li className="flex gap-2">
                        <span className="text-veritas-arc">▸</span>
                        UI-only access checks treat &quot;logged in&quot; as &quot;authorized&quot;.
                      </li>
                      <li className="flex gap-2">
                        <span className="text-veritas-arc">▸</span>
                        No server-side guard exists on{" "}
                        <span className="font-mono">app/admin/middleware.ts</span>.
                      </li>
                      <li className="flex gap-2">
                        <span className="text-veritas-arc">▸</span>
                        Session contains{" "}
                        <span className="font-mono">roles[]</span> but it is
                        never read in the request path.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Strategy */}
              <div className="rounded-2xl border border-veritas-border-subtle bg-veritas-surface/40 p-5">
                <header className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-white">Remediation strategy · Agent 2 + Validator</h3>
                  <span className="rounded-full bg-veritas-electric/10 px-2 py-0.5 text-[10px] font-semibold text-veritas-electric ring-1 ring-veritas-electric/30">
                    effort: low
                  </span>
                </header>
                <ol className="mt-3 space-y-2 text-sm">
                  {[
                    "Read session and roles in middleware before forwarding admin routes.",
                    "Redirect unauthorized users to /login (or /403) with no information leak.",
                    "Add unit tests for non-admin and unauthenticated cases.",
                    "Emit audit log entries on denied access attempts.",
                  ].map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-veritas-electric/10 font-mono text-[10px] font-semibold text-veritas-electric ring-1 ring-veritas-electric/30">
                        {i + 1}
                      </span>
                      <span className="text-slate-300">{s}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Diff viewer */}
              <div>
                <header className="mb-2 flex items-center justify-between">
                  <h3 className="flex items-center gap-2 text-sm font-semibold text-white">
                    <Code className="h-4 w-4 text-veritas-electric" />
                    Interactive code diff
                  </h3>
                  <span className="font-mono text-[10px] text-slate-500">
                    main · 1 file changed
                  </span>
                </header>
                <DiffViewer />
              </div>

              {/* Footer actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-veritas-border-subtle pt-4">
                <p className="text-[11px] text-slate-500">
                  Ticket status: Open · suggested SLA 48h · assignable by Lead
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Link
                    href="/reports"
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-veritas-border-subtle bg-veritas-surface/40 px-3 text-xs font-medium text-slate-200 transition hover:border-veritas-electric/40"
                  >
                    <FileText className="h-3.5 w-3.5" /> Export remediation
                  </Link>
                  <Link
                    href="/tickets"
                    className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-electric-mix px-3 text-xs font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110"
                  >
                    Mark fixed / request verification
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function Meta({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
      <p
        className={`mt-1 text-xs font-medium text-white ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

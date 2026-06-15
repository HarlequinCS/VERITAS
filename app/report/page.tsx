import {
  Camera,
  Crosshair,
  Lock,
  Radar,
  ServerCrash,
  ShieldAlert,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { PatchTerminal } from "@/components/patch-terminal";
import { ReportTopBar } from "@/components/report-top-bar";
import { SecurityScoreRing } from "@/components/security-score-ring";

export default function ReportPage() {
  return (
    <div className="min-h-dvh bg-[#030712] text-neutral-100">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.12),transparent_35%),radial-gradient(circle_at_85%_10%,rgba(239,68,68,0.14),transparent_35%),linear-gradient(180deg,rgba(2,6,23,0.7),rgba(2,6,23,0.95))]"
      />
      <ReportTopBar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <section className="rounded-3xl border border-veritas-border-subtle/80 bg-[#071124]/80 p-6 shadow-[0_0_0_1px_rgba(8,47,73,0.35),0_30px_80px_rgba(0,0,0,0.55)] backdrop-blur-md sm:p-8 md:p-10">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-veritas-border-subtle/70 pb-5">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-400/80">
                Veritas Security Operations Report
              </p>
              <h1 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
                Broken Access Control Incident Overview
              </h1>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-red-400/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-200">
              <ShieldAlert className="h-3.5 w-3.5" aria-hidden />
              Critical Exposure
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <SecurityScoreRing
              score={3.5}
              label="Critical Risk - 3.5/10"
              sublabel="One high-severity issue should be addressed soon. The sections below summarize impact in plain language and include a suggested patch for engineering review."
            />
            <div className="flex-1 rounded-2xl border border-cyan-950 bg-[#030b18]/90 p-5 shadow-inner shadow-black/20 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-veritas-electric/60">
                  Primary finding
                </p>
                <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-red-200">
                  Severity: High
                </span>
              </div>
              <p className="mt-2 text-lg font-semibold text-white sm:text-xl">
                Vulnerability Detected: OWASP Broken Access Control
              </p>
              <p className="mt-3 text-sm leading-relaxed text-neutral-300">
                In plain terms: authenticated users could open administrative
                pages without holding an administrator role. Access checks
                existed at the UI layer but not consistently on the server for
                protected routes.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-veritas-border-subtle/80 bg-[#07162a]/80 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-veritas-electric/55">
                    Attack vector
                  </p>
                  <p className="mt-1 text-sm font-medium text-cyan-100">
                    Direct URL access
                  </p>
                </div>
                <div className="rounded-lg border border-veritas-border-subtle/80 bg-[#07162a]/80 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-veritas-electric/55">
                    Potential impact
                  </p>
                  <p className="mt-1 text-sm font-medium text-cyan-100">
                    Privilege escalation
                  </p>
                </div>
                <div className="rounded-lg border border-veritas-border-subtle/80 bg-[#07162a]/80 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-veritas-electric/55">
                    Confidence
                  </p>
                  <p className="mt-1 text-sm font-medium text-emerald-300">
                    Verified by simulation
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-veritas-border-subtle/80 bg-[#030b18]/90 p-4">
              <div className="flex items-center gap-2 text-veritas-arc">
                <Radar className="h-4 w-4" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-veritas-electric/80">
                  Detection source
                </p>
              </div>
              <p className="mt-2 text-sm text-neutral-300">
                Automated browser exploit simulation and route probe.
              </p>
            </div>
            <div className="rounded-xl border border-veritas-border-subtle/80 bg-[#030b18]/90 p-4">
              <div className="flex items-center gap-2 text-veritas-arc">
                <ServerCrash className="h-4 w-4" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-veritas-electric/80">
                  Affected layer
                </p>
              </div>
              <p className="mt-2 text-sm text-neutral-300">
                Server-side authorization middleware and protected APIs.
              </p>
            </div>
            <div className="rounded-xl border border-veritas-border-subtle/80 bg-[#030b18]/90 p-4">
              <div className="flex items-center gap-2 text-veritas-arc">
                <Lock className="h-4 w-4" aria-hidden />
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-veritas-electric/80">
                  Compliance risk
                </p>
              </div>
              <p className="mt-2 text-sm text-neutral-300">
                Potential violation of least privilege and audit controls.
              </p>
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-10">
          <section className="flex flex-col rounded-2xl border border-cyan-950/90 bg-[#071124]/70 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.4)] sm:p-6">
            <div className="flex items-center justify-between gap-3 border-b border-veritas-border-subtle/80 pb-4">
              <h2 className="text-sm font-semibold tracking-tight text-white sm:text-base">
                Exploit Simulation (Visual PoC)
              </h2>
              <span className="rounded-full border border-cyan-900/70 bg-[#030b18] px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-veritas-arc/70">
                Playwright
              </span>
            </div>

            <div className="mt-5 flex flex-1 flex-col overflow-hidden rounded-xl border border-veritas-border-subtle/80 bg-[#020817] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-2 border-b border-veritas-border-subtle/80 bg-[#091427] px-3 py-2">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
                  <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                </div>
                <div className="ml-2 flex min-w-0 flex-1 items-center gap-2 rounded-md border border-cyan-950 bg-[#020817] px-3 py-1.5">
                  <Crosshair
                    className="h-3.5 w-3.5 shrink-0 text-veritas-electric/70"
                    aria-hidden
                  />
                  <span className="truncate font-mono text-[11px] text-veritas-arc/60">
                    https://app.example.com/admin/users
                  </span>
                </div>
              </div>
              <div className="relative flex min-h-[280px] flex-1 flex-col items-center justify-center bg-[#020617] p-6 sm:min-h-[320px]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/30 via-transparent to-transparent" />
                <div className="relative w-full max-w-sm space-y-3">
                  <div className="h-3 w-3/4 rounded bg-cyan-950/90" />
                  <div className="h-3 w-full rounded bg-cyan-950/70" />
                  <div className="h-3 w-5/6 rounded bg-cyan-950/60" />
                  <div className="mt-6 rounded-lg border border-cyan-950/90 bg-[#081327]/80 p-4">
                    <div className="h-2 w-1/2 rounded bg-cyan-900/70" />
                    <div className="mt-3 h-20 rounded-md bg-cyan-950/70" />
                  </div>
                </div>
                <div className="relative mt-8 flex flex-wrap items-center justify-center gap-2 rounded-full border border-cyan-900/80 bg-[#081327]/90 px-4 py-2 text-xs text-cyan-100/75">
                  <Image
                    src="https://saifuliqbal.dev/veritasicon.png"
                    alt=""
                    width={18}
                    height={18}
                    className="opacity-80"
                  />
                  <Camera className="h-3.5 w-3.5" aria-hidden />
                  <Crosshair className="h-3.5 w-3.5" aria-hidden />
                  <span>Captured evidence (simulation frame)</span>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col rounded-2xl border border-cyan-950/90 bg-[#071124]/70 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.4)] sm:p-6">
            <h2 className="border-b border-veritas-border-subtle/80 pb-4 text-sm font-semibold tracking-tight text-white sm:text-base">
              AI Intelligence &amp; Remediation
            </h2>

            <div className="mt-5 flex flex-1 flex-col gap-6">
              <div className="rounded-xl border border-veritas-border-subtle/80 bg-[#030b18]/90 p-5 shadow-inner shadow-black/20">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-cyan-950/90 bg-[#091427]">
                    <Sparkles
                      className="h-4 w-4 text-veritas-arc/90"
                      aria-hidden
                    />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-veritas-electric/70">
                      AI Analysis
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-300">
                      The system allowed unauthorized access because it treated
                      &quot;logged in&quot; as sufficient for admin-only pages.
                      Role checks were missing on the server, so anyone with a
                      valid session could request privileged URLs directly.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-cyan-100/70">
                      Recommended remediation: enforce authorization on the
                      server for every sensitive route, and keep UI controls as
                      a secondary signal only.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-veritas-border-subtle/80 bg-[#030b18]/90 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-veritas-electric/70">
                  Remediation checklist
                </p>
                <div className="mt-3 grid gap-2 text-sm text-neutral-300">
                  <p className="rounded-md border border-veritas-border-subtle/80 bg-[#081327]/70 px-3 py-2">
                    1) Enforce role validation on every admin endpoint.
                  </p>
                  <p className="rounded-md border border-veritas-border-subtle/80 bg-[#081327]/70 px-3 py-2">
                    2) Add middleware unit tests for unauthorized roles.
                  </p>
                  <p className="rounded-md border border-veritas-border-subtle/80 bg-[#081327]/70 px-3 py-2">
                    3) Add route-level audit logs for denied access attempts.
                  </p>
                </div>
              </div>

              <PatchTerminal />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

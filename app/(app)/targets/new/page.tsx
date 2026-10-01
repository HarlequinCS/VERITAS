"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AlertTriangle,
  ChevronDown,
  Eye,
  EyeOff,
  Globe,
  Info,
  Rocket,
  ScanSearch,
  ShieldCheck,
  Sparkles,
  Workflow,
} from "lucide-react";

type Env = "Development" | "Staging" | "Production";
type Intensity = "Light" | "Standard" | "Aggressive";

const PHASES = [
  {
    id: 1,
    name: "Create scan session",
    detail: "Validates request, creates a Pending session, and queues the job in Redis.",
    eta: "≈ 90s",
  },
  {
    id: 2,
    name: "Playwright simulation",
    detail: "Launches an isolated Chromium context, injects auth state, and executes test payloads.",
    eta: "≈ 2m",
  },
  {
    id: 3,
    name: "Trace and evidence capture",
    detail: "Stores response snippets, DOM changes, exploit status, and visual PoC screenshots.",
    eta: "≈ 3m",
  },
  {
    id: 4,
    name: "AI analysis and ticketing",
    detail: "Classifies CWE/OWASP, drafts a patch, validates the output, and prepares assignment.",
    eta: "≈ 90s",
  },
];

export default function TargetSetupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [env, setEnv] = useState<Env>("Staging");
  const [intensity, setIntensity] = useState<Intensity>("Standard");
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const [showToken, setShowToken] = useState(false);
  const [token, setToken] = useState("");
  const [cookies, setCookies] = useState("");

  const reachability =
    url.length === 0
      ? "idle"
      : url.startsWith("http") && url.includes(".")
        ? "ok"
        : "checking";

  const danger = env === "Production" && intensity === "Aggressive";

  function handleStart() {
    router.push("/scans/live");
  }

  return (
    <main className="mx-auto w-full max-w-[1280px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <header className="mb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-veritas-electric/80">
          New target
        </p>
        <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          Configure scan target
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Define a web app target and launch an asynchronous Hybrid DAST scan.
          Solo users get patch guidance; teams get assignable remediation work.
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Form */}
        <section className="glass rounded-2xl p-5 sm:p-6 lg:col-span-8">
          <div className="space-y-5">
            <Field label="Target name" hint="A friendly identifier for this scan target">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="My SaaS Staging App"
                className="h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 px-3.5 text-sm text-white outline-none placeholder:text-slate-600 focus:border-veritas-electric/50 focus:shadow-glow-electric"
              />
            </Field>

            <Field
              label="Target URL"
              hint="Must be reachable from VERITAS edge. Add an allow-list rule if private."
            >
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 pl-10 pr-12 font-mono text-sm text-white outline-none placeholder:text-slate-600 focus:border-veritas-electric/50 focus:shadow-glow-electric"
                />
                <span
                  className={`absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                    reachability === "ok"
                      ? "bg-emerald-400/10 text-emerald-300 ring-1 ring-emerald-400/30"
                      : reachability === "checking"
                        ? "bg-amber-400/10 text-amber-300 ring-1 ring-amber-400/30"
                        : "bg-veritas-surface text-slate-500 ring-1 ring-veritas-border-subtle"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      reachability === "ok"
                        ? "bg-emerald-400"
                        : reachability === "checking"
                          ? "bg-amber-400"
                          : "bg-slate-600"
                    }`}
                  />
                  {reachability === "ok"
                    ? "Reachable"
                    : reachability === "checking"
                      ? "Probing"
                      : "Idle"}
                </span>
              </div>
            </Field>

            <div>
              <span className="mb-1.5 block text-xs font-medium text-slate-400">
                Environment
              </span>
              <div className="grid grid-cols-3 gap-2 rounded-xl border border-veritas-border-subtle bg-veritas-surface/30 p-1">
                {(["Development", "Staging", "Production"] as Env[]).map((e) => (
                  <button
                    type="button"
                    key={e}
                    onClick={() => setEnv(e)}
                    className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                      env === e
                        ? e === "Production"
                          ? "bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/40"
                          : "bg-veritas-surface text-white shadow-card"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {e}
                  </button>
                ))}
              </div>
              {env === "Production" && (
                <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] text-rose-300">
                  <AlertTriangle className="h-3 w-3" />
                  Production targets require admin approval and a typed
                  hostname confirmation before launch.
                </p>
              )}
            </div>

            {/* Advanced */}
            <div className="rounded-xl border border-veritas-border-subtle bg-veritas-surface/20">
              <button
                type="button"
                onClick={() => setAdvancedOpen((s) => !s)}
                className="flex w-full items-center justify-between gap-2 px-4 py-3 text-left"
                aria-expanded={advancedOpen}
              >
                <span className="text-sm font-semibold text-white">
                  Advanced settings
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-slate-500 transition ${
                    advancedOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {advancedOpen && (
                <div className="border-t border-veritas-border-subtle px-4 py-5 space-y-5 animate-fade-up">
                  <Field
                    label="Auth token"
                    hint="JWT or bearer token injected into the ephemeral browser context."
                  >
                    <div className="relative">
                      <input
                        type={showToken ? "text" : "password"}
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIs..."
                        className="h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-bg/60 pr-10 pl-3.5 font-mono text-xs text-white outline-none placeholder:text-slate-600 focus:border-veritas-electric/50"
                      />
                      <button
                        type="button"
                        onClick={() => setShowToken((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 transition hover:bg-veritas-surface hover:text-slate-200"
                        aria-label="Toggle token visibility"
                      >
                        {showToken ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </Field>

                  <Field
                    label="Cookies / session"
                    hint="Session cookies are scoped to this scan and discarded after teardown."
                  >
                    <textarea
                      value={cookies}
                      onChange={(e) => setCookies(e.target.value)}
                      placeholder="session=eyJhbGciOiJIUzI1NiJ9...; theme=dark"
                      rows={4}
                      className="w-full rounded-xl border border-veritas-border-subtle bg-veritas-bg/60 p-3 font-mono text-xs text-white outline-none placeholder:text-slate-600 focus:border-veritas-electric/50"
                    />
                  </Field>

                  <div>
                    <span className="mb-1.5 block text-xs font-medium text-slate-400">
                      Scan intensity
                    </span>
                    <div className="grid grid-cols-3 gap-2 rounded-xl border border-veritas-border-subtle bg-veritas-surface/30 p-1">
                      {(["Light", "Standard", "Aggressive"] as Intensity[]).map(
                        (i) => (
                          <button
                            type="button"
                            key={i}
                            onClick={() => setIntensity(i)}
                            className={`rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                              intensity === i
                                ? i === "Aggressive"
                                  ? "bg-rose-500/15 text-rose-200 ring-1 ring-rose-400/40"
                                  : i === "Standard"
                                    ? "bg-amber-500/15 text-amber-200 ring-1 ring-amber-400/40"
                                    : "bg-veritas-electric/15 text-veritas-arc ring-1 ring-veritas-electric/40"
                                : "text-slate-400 hover:text-white"
                            }`}
                          >
                            {i}
                          </button>
                        ),
                      )}
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">
                      {intensity === "Light"
                        ? "Read-mostly probing, ≈ 4 minutes"
                        : intensity === "Standard"
                          ? "Balanced exploitation depth, ≈ 7 minutes"
                          : "Deep adversarial fuzzing, ≈ 14 minutes — use only with non-production data"}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {danger && (
              <div className="flex items-start gap-3 rounded-xl border border-rose-400/40 bg-rose-500/10 p-4 shadow-glow-danger">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-300" />
                <div className="text-xs text-rose-200">
                  <p className="font-semibold">High-impact configuration</p>
                  <p className="mt-1 text-rose-200/80">
                    Aggressive scanning against Production may trigger rate
                    limits, lock accounts, or affect users. A confirm modal
                    will appear and require typing the hostname.
                  </p>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={handleStart}
              className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-electric-mix font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110"
            >
              <Rocket className="h-4 w-4" />
              Start hybrid scan
            </button>
          </div>
        </section>

        {/* Phases panel */}
        <aside className="lg:col-span-4">
          <div className="glass sticky top-20 rounded-2xl p-5">
            <header className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-veritas-arc/10 ring-1 ring-veritas-arc/30">
                <Workflow className="h-3.5 w-3.5 text-veritas-arc" />
              </span>
              <h2 className="text-sm font-semibold text-white">Scan phases</h2>
            </header>

            <ol className="mt-4 space-y-3">
              {PHASES.map((p) => (
                <li
                  key={p.id}
                  className="rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="flex items-center gap-2 text-xs font-semibold text-white">
                      <span className="font-mono text-[10px] text-veritas-electric">
                        {p.id.toString().padStart(2, "0")}
                      </span>
                      {p.name}
                    </p>
                    <span className="rounded-full bg-veritas-bg/60 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                      {p.eta}
                    </span>
                  </div>
                  <p className="mt-1.5 text-[11px] leading-relaxed text-slate-400">
                    {p.detail}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-4 rounded-xl border border-veritas-electric/20 bg-veritas-electric/5 p-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-veritas-electric">
                <Sparkles className="h-3.5 w-3.5" />
                Estimated total
              </div>
              <p className="mt-1 text-2xl font-semibold text-white">
                ≈ 7m <span className="text-sm font-normal text-slate-500">/ 12 credits</span>
              </p>
            </div>

            <div className="mt-4 flex items-start gap-2 text-[11px] text-slate-500">
              <Info className="mt-0.5 h-3 w-3 shrink-0 text-slate-500" />
              <p>
                You can pause, resume, or abort a scan at any time from the
                Live Scan tracker.
              </p>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-400/20 bg-emerald-400/5 px-3 py-2 text-[11px] text-emerald-300">
              <ShieldCheck className="h-3 w-3" />
              Browser context is destroyed after every scan
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-[11px] text-slate-500">
            <span className="font-mono">state: Pending → Processing → Completed/Failed</span>
            <span className="inline-flex items-center gap-1 text-veritas-electric">
              <ScanSearch className="h-3 w-3" /> view policy
            </span>
          </div>
        </aside>
      </div>
    </main>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-400">{label}</span>
        {hint && <span className="hidden text-slate-600 sm:block">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

"use client";

import { useMockAuth } from "@/components/mock-auth-provider";
import {
  ArrowRight,
  Code2,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  Mail,
  ShieldCheck,
  ShieldHalf,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ICON_SRC = "https://saifuliqbal.dev/veritasicon.png";

type Role = "admin" | "developer";

export default function AuthPage() {
  const router = useRouter();
  const { signIn } = useMockAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    signIn();
    setTimeout(() => router.push("/dashboard"), 600);
  }

  return (
    <div className="relative isolate flex min-h-dvh items-stretch">
      {/* Animated backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 grid-bg animate-drift-grid opacity-60"
        style={{
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-cyan-500/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-purple-500/20 blur-[120px]"
      />

      {/* Left: Form */}
      <main className="flex w-full items-center justify-center px-4 py-10 sm:px-8 lg:w-[55%]">
        <div className="w-full max-w-[420px] animate-fade-up">
          <div className="mb-10">
            <BrandLogo variant="hero" href="/" />
          </div>

          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
              Sign in
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Enter the command center
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Authenticate with your enterprise identity to access live scans,
              findings, and remediation tooling.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-400">
                Username or email
              </span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="maya.khoury@acme.com"
                  className="h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:shadow-glow-cyan"
                  autoComplete="username"
                />
              </div>
            </label>

            {/* Password */}
            <label className="block">
              <span className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-400">Password</span>
                <button
                  type="button"
                  className="text-cyan-300/80 transition hover:text-cyan-200"
                >
                  Forgot?
                </button>
              </span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:shadow-glow-cyan"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 transition hover:bg-veritas-surface hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-3.5 w-3.5" />
                  ) : (
                    <Eye className="h-3.5 w-3.5" />
                  )}
                </button>
              </div>
            </label>

            {/* Role selector */}
            <div>
              <span className="mb-1.5 block text-xs font-medium text-slate-400">
                Role
              </span>
              <div className="grid grid-cols-2 gap-2 rounded-xl border border-veritas-border-subtle bg-veritas-surface/30 p-1">
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                    role === "admin"
                      ? "bg-veritas-surface text-white shadow-card"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <ShieldHalf
                    className={`h-3.5 w-3.5 ${
                      role === "admin" ? "text-cyan-300" : "text-slate-500"
                    }`}
                  />
                  Admin
                </button>
                <button
                  type="button"
                  onClick={() => setRole("developer")}
                  className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                    role === "developer"
                      ? "bg-veritas-surface text-white shadow-card"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Code2
                    className={`h-3.5 w-3.5 ${
                      role === "developer" ? "text-purple-300" : "text-slate-500"
                    }`}
                  />
                  Developer
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-slate-500">
                {role === "admin"
                  ? "Full access to scans, findings, audit logs, and policies."
                  : "Patch authoring, code review, and read-only audit views."}
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-neon-mix font-semibold text-veritas-bg shadow-glow-cyan transition hover:brightness-110 disabled:opacity-70"
            >
              {submitting ? "Authenticating..." : "Authenticate"}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>

            <button
              type="button"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 text-sm font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-veritas-surface"
            >
              <Fingerprint className="h-4 w-4 text-cyan-300" />
              Continue with SSO
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500">
            No account?{" "}
            <Link href="/" className="text-cyan-300 hover:text-cyan-200">
              Request enterprise access
            </Link>
          </p>
        </div>
      </main>

      {/* Right: Illustration / brand panel */}
      <aside className="relative hidden flex-1 items-center justify-center overflow-hidden border-l border-veritas-border-subtle/70 bg-veritas-surface/30 px-10 lg:flex">
        <div
          aria-hidden
          className="absolute inset-0 grid-bg opacity-60"
          style={{
            maskImage:
              "radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)",
            WebkitMaskImage:
              "radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)",
          }}
        />
        <div className="relative max-w-md">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              SOC 2 Type II
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
              <ShieldCheck className="h-3 w-3" />
              ISO 27001
            </span>
          </div>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white">
            Detect. Prove. Patch.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            VERITAS pairs autonomous AI agents with controlled exploit
            simulation to surface real risk — not noise — and ship the patch
            beside the finding.
          </p>

          <div className="glass mt-8 rounded-2xl p-5">
            <div className="mb-3 flex items-center gap-2">
              <Image
                src={ICON_SRC}
                alt=""
                width={20}
                height={20}
                className="opacity-90"
              />
              <p className="font-mono text-[11px] text-cyan-200/80">
                veritas.live · 02:41 UTC
              </p>
            </div>
            <ul className="space-y-2 font-mono text-[11px] text-slate-300">
              <li className="flex gap-3">
                <span className="text-emerald-300">✓</span>
                <span>Triage agent: 248 routes mapped</span>
              </li>
              <li className="flex gap-3">
                <span className="text-cyan-300">●</span>
                <span>Exploit agent: simulating /admin/users</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-300">✦</span>
                <span>Analyst agent: drafting remediation</span>
              </li>
              <li className="flex gap-3">
                <span className="text-rose-300">!</span>
                <span>1 critical finding · CWE-285</span>
              </li>
            </ul>
          </div>

          <p className="mt-6 text-[11px] font-mono uppercase tracking-[0.22em] text-slate-500">
            Build 2026.05.09 · region us-east-1
          </p>
        </div>
      </aside>
    </div>
  );
}

"use client";

import { useMockAuth } from "@/components/mock-auth-provider";
import {
  ArrowRight,
  Apple,
  Eye,
  EyeOff,
  Fingerprint,
  Github,
  Chrome,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const ICON_SRC = "https://saifuliqbal.dev/veritasicon.png";

export default function AuthPage() {
  const router = useRouter();
  const { signIn } = useMockAuth();
  const [showPassword, setShowPassword] = useState(false);
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
        className="pointer-events-none absolute -left-32 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-veritas-electric/20 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-0 -z-10 h-[420px] w-[420px] rounded-full bg-veritas-electric/15 blur-[120px]"
      />

      {/* Left: Form */}
      <main className="flex w-full items-center justify-center px-4 py-10 sm:px-8 lg:w-[55%]">
        <div className="w-full max-w-[420px] animate-fade-up">
          <div className="mb-10">
            <BrandLogo variant="hero" href="/" />
          </div>

          <div className="mb-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-veritas-electric/80">
              Sign in
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Sign in to VERITAS
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Access your scanner workspace to run scans, inspect evidence, and
              manage remediation. Authentication provider can be wired later to
              Firebase, Supabase, Auth.js, or another SaaS identity layer.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <SocialAuthButton href="/dashboard" icon={Chrome} label="Continue with Google" primary />
              <div className="grid grid-cols-2 gap-2">
                <SocialAuthButton href="/dashboard" icon={Apple} label="Apple" />
                <SocialAuthButton href="/dashboard" icon={Github} label="GitHub" />
              </div>
            </div>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center" aria-hidden>
                <div className="w-full border-t border-veritas-border-subtle" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-veritas-bg px-3 font-label text-[10px] uppercase tracking-[0.18em] text-slate-600">
                  Or use email
                </span>
              </div>
            </div>

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
                  className="h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-veritas-electric/50 focus:shadow-glow-electric"
                  autoComplete="username"
                />
              </div>
            </label>

            {/* Password */}
            <label className="block">
              <span className="mb-1.5 flex items-center justify-between text-xs">
                <span className="font-medium text-slate-400">Password</span>
                <Link
                  href="/forgot-password"
                  className="text-veritas-electric/80 transition hover:text-veritas-arc"
                >
                  Forgot?
                </Link>
              </span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-veritas-electric/50 focus:shadow-glow-electric"
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

            <div className="rounded-xl border border-veritas-border-subtle bg-veritas-surface/30 p-3">
              <p className="text-xs font-semibold text-white">
                Scanner workspace login
              </p>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-500">
                Access level is assigned by the workspace owner. Founder/admin
                operations use a separate private console and are not exposed on
                this public login screen.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-electric-mix font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110 disabled:opacity-70"
            >
              {submitting ? "Authenticating..." : "Authenticate"}
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
            </button>

            <Link
              href="/dashboard"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 text-sm font-medium text-slate-200 transition hover:border-veritas-electric/40 hover:bg-veritas-surface"
            >
              <Fingerprint className="h-4 w-4 text-veritas-electric" />
              Continue with workspace SSO
            </Link>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500">
            No account?{" "}
            <Link href="/" className="text-veritas-electric hover:text-veritas-arc">
              Start from the landing page
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
            <span className="inline-flex items-center gap-1.5 rounded-full border border-veritas-electric/30 bg-veritas-electric/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-veritas-electric">
              <ShieldCheck className="h-3 w-3" />
              ISO 27001
            </span>
          </div>

          <h2 className="mt-6 text-3xl font-semibold tracking-tight text-white">
            Detect. Prove. Patch.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-400">
            VERITAS pairs asynchronous scan workers, Playwright evidence, and a
            3-agent AI remediation loop so one developer can fix quickly, and a
            team can assign and verify cleanly.
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
              <p className="font-mono text-[11px] text-veritas-arc/80">
                veritas.live · 02:41 UTC
              </p>
            </div>
            <ul className="space-y-2 font-mono text-[11px] text-slate-300">
              <li className="flex gap-3">
                <span className="text-emerald-300">✓</span>
                <span>Scan session: Pending → Processing</span>
              </li>
              <li className="flex gap-3">
                <span className="text-veritas-electric">●</span>
                <span>Playwright: simulating /admin/users</span>
              </li>
              <li className="flex gap-3">
                <span className="text-veritas-arc">✦</span>
                <span>AI loop: classify → synthesize → validate</span>
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

function SocialAuthButton({
  href,
  icon: Icon,
  label,
  primary = false,
}: {
  href: string;
  icon: typeof Chrome;
  label: string;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex h-11 items-center justify-center gap-2 rounded-xl text-sm font-semibold transition ${
        primary
          ? "bg-white text-veritas-bg hover:bg-slate-200"
          : "border border-veritas-border-subtle bg-veritas-surface/40 text-slate-200 hover:border-veritas-electric/40 hover:bg-veritas-surface"
      }`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

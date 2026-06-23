"use client";

import { useActionState, useState, useTransition, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Turnstile } from "@marsidev/react-turnstile";
import { signInUser, signInWithProvider } from "@/app/actions/auth";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Fingerprint,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import Image from "next/image";
import Link from "next/link";

// ---------------------------------------------------------------------------
// OAuth error surfaced from URL ?error= param (needs Suspense boundary)
// ---------------------------------------------------------------------------
function OAuthErrorBanner() {
  const params = useSearchParams()
  const err = params.get('error')
  if (!err) return null
  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
      <span className="mt-0.5 shrink-0 text-rose-400">⚠</span>
      {decodeURIComponent(err)}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Google SVG icon
// ---------------------------------------------------------------------------
const GoogleIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden={true}>
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
)

// ---------------------------------------------------------------------------
// GitHub SVG icon
// ---------------------------------------------------------------------------
const GitHubIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden={true}>
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
  </svg>
)

const ICON_SRC = "https://saifuliqbal.dev/veritasicon.png";
const initialState = { error: null };

export default function AuthPage() {
  const [state, formAction, isPending] = useActionState(signInUser, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

  // Separate transitions for each OAuth provider — independent loading states
  const [googlePending, startGoogle] = useTransition()
  const [githubPending, startGitHub] = useTransition()

  function handleOAuth(provider: 'google' | 'github') {
    if (provider === 'google') {
      startGoogle(() => signInWithProvider('google'))
    } else {
      startGitHub(() => signInWithProvider('github'))
    }
  }

  return (
    <div className="relative isolate flex min-h-dvh items-stretch">
      {/* Animated backdrop */}
      <div
        aria-hidden={true}
        className="pointer-events-none absolute inset-0 -z-10 grid-bg animate-drift-grid opacity-60"
        style={{
          maskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)",
        }}
      />
      <div
        aria-hidden={true}
        className="pointer-events-none absolute -left-32 top-10 -z-10 h-[420px] w-[420px] rounded-full bg-veritas-electric/20 blur-[120px]"
      />
      <div
        aria-hidden={true}
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
              manage remediation.
            </p>
          </div>

          {/* ── OAuth error from redirect ───────────────────────── */}
          <Suspense>
            <OAuthErrorBanner />
          </Suspense>

          {/* ── OAuth buttons ───────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3">
            <button
              id="login-google"
              type="button"
              disabled={googlePending || githubPending}
              onClick={() => handleOAuth('google')}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 text-sm font-medium text-slate-200 transition hover:border-veritas-electric/40 hover:bg-veritas-surface disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googlePending
                ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-veritas-bg/30 border-t-veritas-bg" />
                : GoogleIcon}
              <span>{googlePending ? 'Redirecting…' : 'Google'}</span>
            </button>

            <button
              id="login-github"
              type="button"
              disabled={googlePending || githubPending}
              onClick={() => handleOAuth('github')}
              className="flex h-11 items-center justify-center gap-2 rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 text-sm font-medium text-slate-200 transition hover:border-veritas-electric/40 hover:bg-veritas-surface disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {githubPending
                ? <span className="h-4 w-4 animate-spin rounded-full border-2 border-veritas-bg/30 border-t-veritas-bg" />
                : GitHubIcon}
              <span>{githubPending ? 'Redirecting…' : 'GitHub'}</span>
            </button>
          </div>

          {/* ── Divider ─────────────────────────────────────────── */}
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs text-slate-500">or continue with email</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <form action={formAction} className="space-y-4" noValidate>
            {/* Hidden Turnstile token */}
            <input
              type="hidden"
              name="cf-turnstile-response"
              value={turnstileToken}
            />

            {/* Email */}
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-400">
                Email address
              </span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="auth-email"
                  type="email"
                  name="email"
                  placeholder="maya.khoury@acme.com"
                  required
                  className="h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-veritas-electric/50 focus:shadow-glow-electric"
                  autoComplete="email"
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
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••••••"
                  required
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

            {/* Cloudflare Turnstile */}
            <div className="pt-1">
              <Turnstile
                siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY!}
                onSuccess={(token) => setTurnstileToken(token)}
                onExpire={() => setTurnstileToken("")}
                onError={() => setTurnstileToken("")}
                options={{ theme: "dark", size: "flexible" }}
              />
            </div>

            {/* Error message */}
            {state?.error && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
              >
                <span className="mt-0.5 shrink-0 text-rose-400">⚠</span>
                {state.error}
              </div>
            )}

            {/* Submit */}
            <button
              id="auth-submit"
              type="submit"
              disabled={isPending || !turnstileToken}
              className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-electric-mix font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-veritas-bg/30 border-t-veritas-bg" />
                  Authenticating…
                </>
              ) : (
                <>
                  Authenticate
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            <Link
              href="/register"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 text-sm font-medium text-slate-200 transition hover:border-veritas-electric/40 hover:bg-veritas-surface"
            >
              <Fingerprint className="h-4 w-4 text-veritas-electric" />
              Create an account
            </Link>
          </form>
        </div>
      </main>

      {/* Right: Brand panel */}
      <aside className="relative hidden flex-1 items-center justify-center overflow-hidden border-l border-veritas-border-subtle/70 bg-veritas-surface/30 px-10 lg:flex">
        <div
          aria-hidden={true}
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

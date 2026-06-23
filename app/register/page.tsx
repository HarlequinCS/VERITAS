"use client";

import { useActionState, useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { signUpUser } from "@/app/actions/auth";
import { ArrowRight, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import Image from "next/image";
import Link from "next/link";

const ICON_SRC = "https://saifuliqbal.dev/veritasicon.png";
const initialState = { error: null };

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(signUpUser, initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");

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
              Create account
            </p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Join VERITAS
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Start scanning for vulnerabilities. No credit card required.
            </p>
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
                  id="reg-email"
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  required
                  className="h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-veritas-electric/50 focus:shadow-glow-electric"
                  autoComplete="email"
                />
              </div>
            </label>

            {/* Username */}
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-400">
                Username
              </span>
              <div className="relative">
                <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="reg-username"
                  type="text"
                  name="username"
                  placeholder="yourhandle"
                  required
                  className="h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-veritas-electric/50 focus:shadow-glow-electric"
                  autoComplete="username"
                />
              </div>
            </label>

            {/* Password */}
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-400">
                Password
              </span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 characters"
                  required
                  minLength={8}
                  className="h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 pl-10 pr-10 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-veritas-electric/50 focus:shadow-glow-electric"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-500 transition hover:bg-veritas-surface hover:text-slate-200"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "🙈" : "👁"}
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

            {/* Error */}
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
              id="reg-submit"
              type="submit"
              disabled={isPending || !turnstileToken}
              className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-electric-mix font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-veritas-bg/30 border-t-veritas-bg" />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </>
              )}
            </button>

            <p className="text-center text-xs text-slate-500">
              Already have an account?{" "}
              <Link
                href="/auth"
                className="text-veritas-electric/80 transition hover:text-veritas-arc"
              >
                Sign in
              </Link>
            </p>
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
              <Image src={ICON_SRC} alt="" width={20} height={20} className="opacity-90" />
              <p className="font-mono text-[11px] text-veritas-arc/80">veritas.live · secure signup</p>
            </div>
            <ul className="space-y-2 font-mono text-[11px] text-slate-300">
              <li className="flex gap-3"><span className="text-emerald-300">✓</span><span>End-to-end encrypted</span></li>
              <li className="flex gap-3"><span className="text-veritas-electric">●</span><span>Supabase Auth · row-level security</span></li>
              <li className="flex gap-3"><span className="text-veritas-arc">✦</span><span>Cloudflare Turnstile bot protection</span></li>
              <li className="flex gap-3"><span className="text-emerald-300">✓</span><span>No credit card required</span></li>
            </ul>
          </div>
        </div>
      </aside>
    </div>
  );
}

"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, CheckCircle, Eye, EyeOff, Lock } from "lucide-react";
import { updatePassword } from "@/app/actions/auth";
import { BrandLogo } from "@/components/brand-logo";

const initialState = { error: "" as string, success: false as boolean };

export default function ResetPasswordPage() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    updatePassword,
    initialState
  );
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!state?.success) return;
    const t = setTimeout(() => router.push("/auth"), 2500);
    return () => clearTimeout(t);
  }, [state?.success, router]);

  return (
    <div className="relative isolate flex min-h-dvh flex-col items-center justify-center bg-veritas-bg px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 grid-bg animate-drift-grid opacity-40"
        style={{
          maskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)",
          WebkitMaskImage:
            "radial-gradient(ellipse 60% 50% at 50% 50%, black, transparent)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-veritas-electric/10 blur-[100px]"
      />

      <div className="glass-strong relative mx-auto w-full max-w-md animate-fade-up rounded-2xl p-8">
        {state?.success ? (
          <div className="text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-veritas-success/15">
              <CheckCircle className="h-7 w-7 text-veritas-success" />
            </div>
            <h1 className="mt-5 font-display text-xl font-bold text-white">
              Password updated
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Your password has been changed. Redirecting you to sign in…
            </p>
            <Link
              href="/auth"
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-electric-mix font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110"
            >
              Go to sign in
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        ) : (
          <>
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-veritas-electric/15">
              <Lock className="h-6 w-6 text-veritas-electric" />
            </div>
            <h1 className="mt-5 text-center font-display text-xl font-bold text-white">
              Set a new password
            </h1>
            <p className="mt-2 text-center text-sm text-slate-400">
              Choose a strong password you haven&apos;t used before.
            </p>

            <form action={formAction} className="mt-8 space-y-5" noValidate>
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-medium text-slate-400"
                >
                  New password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Min. 8 characters"
                    autoComplete="new-password"
                    className="h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-surface/50 pl-10 pr-10 text-sm text-white placeholder-slate-500 outline-none transition focus:border-veritas-electric/50 focus:ring-1 focus:ring-veritas-electric/30"
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
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-1.5 block text-xs font-medium text-slate-400"
                >
                  Confirm password
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={8}
                    placeholder="Re-enter password"
                    autoComplete="new-password"
                    className="h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-surface/50 pl-10 pr-3.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-veritas-electric/50 focus:ring-1 focus:ring-veritas-electric/30"
                  />
                </div>
              </div>

              {state?.error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
                >
                  <span className="mt-0.5 shrink-0 text-rose-400">⚠</span>
                  {state.error}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="group inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-electric-mix font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110 disabled:pointer-events-none disabled:opacity-50"
              >
                {isPending ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-veritas-bg border-t-transparent" />
                ) : (
                  <>
                    Update password
                    <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          </>
        )}

        <div className="mt-8 border-t border-veritas-border-subtle/60 pt-6">
          <BrandLogo variant="compact" />
        </div>
      </div>
    </div>
  );
}

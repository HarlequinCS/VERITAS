"use client";

import { Suspense, useActionState, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Mail } from "lucide-react";
import { requestPasswordReset } from "@/app/actions/auth";

const initialState = { error: "" as string, success: false as boolean };

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}

function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(
    requestPasswordReset,
    initialState
  );
  const searchParams = useSearchParams();
  const [linkError, setLinkError] = useState("");

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) setLinkError(err);
  }, [searchParams]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-24">
      <section className="glass w-full max-w-md rounded-2xl p-6">
        {state?.success ? (
          <>
            <CheckCircle className="h-8 w-8 text-veritas-success" />
            <h1 className="mt-5 text-2xl font-semibold text-white">
              Check your inbox
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              If an account exists for that email, we&apos;ve sent a secure link
              to reset your password. The link expires shortly, so use it soon.
            </p>
            <Link
              href="/auth"
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-electric-mix font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </>
        ) : (
          <>
            <Mail className="h-8 w-8 text-veritas-electric" />
            <h1 className="mt-5 text-2xl font-semibold text-white">
              Reset workspace access
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">
              Enter your workspace email and VERITAS will send a secure reset
              link. This is for scanner users only; founder console access is
              separate.
            </p>

            <form action={formAction} className="mt-6 space-y-4" noValidate>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="developer@company.com"
                  autoComplete="email"
                  className="h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 pl-10 pr-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-veritas-electric/50 focus:shadow-glow-electric"
                />
              </div>

              {(state?.error || linkError) && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
                >
                  <span className="mt-0.5 shrink-0 text-rose-400">⚠</span>
                  {state?.error || linkError}
                </div>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-electric-mix font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-veritas-bg/30 border-t-veritas-bg" />
                    Sending link…
                  </>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>

            <Link
              href="/auth"
              className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-slate-300"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </>
        )}
      </section>
    </main>
  );
}

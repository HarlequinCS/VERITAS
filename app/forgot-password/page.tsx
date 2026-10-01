"use client";

import { Suspense, useActionState, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle, Lock, Mail } from "lucide-react";
import { finishPasswordReset, requestPasswordReset, verifyResetCode } from "@/app/actions/auth";

const initialState = { error: "" as string, success: false as boolean };
const inputClass =
  "h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-veritas-electric/50 focus:shadow-glow-electric";

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}

function ForgotPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [requestState, requestAction, requestPending] = useActionState(
    requestPasswordReset,
    initialState
  );
  const [codeState, codeAction, codePending] = useActionState(
    verifyResetCode,
    initialState
  );
  const [passwordState, passwordAction, passwordPending] = useActionState(
    finishPasswordReset,
    initialState
  );
  const [email, setEmail] = useState("");
  const [linkError, setLinkError] = useState("");
  const codeSent = Boolean(requestState?.success);
  const codeVerified = Boolean(codeState?.success);

  useEffect(() => {
    const err = searchParams.get("error");
    if (err) setLinkError(err);
  }, [searchParams]);

  useEffect(() => {
    if (!passwordState?.success) return;
    const timer = setTimeout(() => router.push("/auth"), 2000);
    return () => clearTimeout(timer);
  }, [passwordState?.success, router]);

  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-24">
      <section className="glass w-full max-w-md rounded-2xl p-6">
        {passwordState?.success ? (
          <>
            <CheckCircle className="h-8 w-8 text-veritas-success" />
            <h1 className="mt-5 text-2xl font-semibold text-white">Password updated</h1>
            <p className="mt-2 text-base leading-relaxed text-slate-300">
              Sign in with your new password.
            </p>
            <Link
              href="/auth"
              className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-electric-mix font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to sign in
            </Link>
          </>
        ) : codeVerified ? (
          <>
            <Lock className="h-8 w-8 text-veritas-electric" />
            <h1 className="mt-5 text-2xl font-semibold text-white">Choose a new password</h1>
            <p className="mt-2 text-base leading-relaxed text-slate-300">
              Your code is confirmed. If the two passwords do not match, correct them here. You do not need the code again.
            </p>
            <form action={passwordAction} className="mt-6 space-y-4">
              <input
                name="password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="New password"
                className={inputClass}
              />
              <input
                name="confirmPassword"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Confirm new password"
                className={inputClass}
              />
              {passwordState?.error && <Alert message={passwordState.error} />}
              <button
                type="submit"
                disabled={passwordPending}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-electric-mix font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {passwordPending ? "Updating…" : "Update password"}
              </button>
            </form>
          </>
        ) : codeSent ? (
          <>
            <Lock className="h-8 w-8 text-veritas-electric" />
            <h1 className="mt-5 text-2xl font-semibold text-white">Enter your code</h1>
            <p className="mt-2 text-base leading-relaxed text-slate-300">
              We sent a verification code to {email}. The code is checked once, before you choose a password.
            </p>
            <form action={codeAction} className="mt-6 space-y-4">
              <input type="hidden" name="email" value={email} />
              <input
                name="code"
                inputMode="numeric"
                autoComplete="one-time-code"
                required
                minLength={6}
                maxLength={10}
                placeholder="Verification code"
                className={inputClass}
              />
              {codeState?.error && <Alert message={codeState.error} />}
              <button
                type="submit"
                disabled={codePending}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-electric-mix font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {codePending ? "Checking…" : "Continue"}
              </button>
            </form>
            <Link href="/auth" className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-slate-300">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </>
        ) : (
          <>
            <Mail className="h-8 w-8 text-veritas-electric" />
            <h1 className="mt-5 text-2xl font-semibold text-white">Reset workspace access</h1>
            <p className="mt-2 text-base leading-relaxed text-slate-300">
              Enter your workspace email. VERITAS will send a verification code so you can set a new password.
            </p>
            <form action={requestAction} className="mt-6 space-y-4" noValidate>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="developer@company.com"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={`${inputClass} pl-10`}
                />
              </div>
              {(requestState?.error || linkError) && <Alert message={requestState?.error || linkError} />}
              <button
                type="submit"
                disabled={requestPending}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-electric-mix font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {requestPending ? "Sending code…" : "Send verification code"}
              </button>
            </form>
            <Link href="/auth" className="mt-4 inline-flex items-center gap-1.5 text-xs text-slate-500 transition hover:text-slate-300">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to sign in
            </Link>
          </>
        )}
      </section>
    </main>
  );
}

function Alert({ message }: { message: string }) {
  return (
    <div role="alert" className="flex items-start gap-2.5 rounded-xl border border-rose-500/25 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
      <span className="mt-0.5 shrink-0 text-rose-400">⚠</span>
      {message}
    </div>
  );
}

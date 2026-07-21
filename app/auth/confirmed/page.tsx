"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { sendWelcomeAction } from "@/app/actions/send-welcome";
import { ArrowRight, CheckCircle, ShieldCheck } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

const LOADING_STEPS = [
  "Validating your verification link",
  "Confirming account credentials",
  "Activating your workspace",
] as const;

function VerifyingLoader() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((current) => (current + 1) % LOADING_STEPS.length);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex h-28 w-28 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-veritas-electric/20" />
        <span className="absolute inset-2 rounded-full border border-veritas-arc/15" />
        <span className="absolute inset-0 animate-pulse-ring rounded-full border border-veritas-electric/40" />
        <span className="absolute inset-0 animate-pulse-ring rounded-full border border-veritas-arc/30 [animation-delay:750ms]" />
        <span className="absolute inset-3 animate-spin rounded-full border-2 border-transparent border-t-veritas-electric border-r-veritas-arc" />
        <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-veritas-electric/10 shadow-glow-electric">
          <ShieldCheck className="h-7 w-7 text-veritas-electric" />
        </span>
      </div>

      <h1 className="mt-8 font-display text-2xl font-bold tracking-tight text-white">
        Verifying your email
      </h1>

      <p className="mt-2 flex items-center gap-1 text-sm text-slate-400">
        {LOADING_STEPS[stepIndex]}
        <span className="inline-flex w-5" aria-hidden>
          <span className="animate-blink-cursor">.</span>
          <span className="animate-blink-cursor [animation-delay:200ms]">.</span>
          <span className="animate-blink-cursor [animation-delay:400ms]">.</span>
        </span>
      </p>

      <div className="mt-8 w-full max-w-xs">
        <div className="h-1 overflow-hidden rounded-full bg-veritas-border-subtle/80">
          <div className="h-full animate-loader-progress rounded-full bg-electric-mix shadow-glow-electric" />
        </div>
        <p className="mt-3 text-center text-[11px] uppercase tracking-[0.18em] text-slate-500">
          Secure verification in progress
        </p>
      </div>
    </div>
  );
}

function SuccessState({
  username,
  email,
  error,
  onSignIn,
}: {
  username: string;
  email: string;
  error: string;
  onSignIn: () => void;
}) {
  return (
    <div className="flex flex-col items-center animate-fade-up">
      <div className="animate-success-pop">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-veritas-success/15 ring-1 ring-veritas-success/30">
          <CheckCircle className="h-10 w-10 text-veritas-success" />
        </div>
      </div>

      <h1 className="mt-6 font-display text-2xl font-bold text-white">
        You&apos;re all set!
      </h1>

      <p className="mt-3 max-w-sm text-sm leading-relaxed text-slate-400">
        Welcome to VERITAS, {username}! Your email{" "}
        <span className="text-slate-300">{email}</span> has been verified and
        your account is ready.
      </p>

      {error && (
        <p className="mt-3 text-xs text-amber-400">
          A welcome email could not be sent, but your account is active.
        </p>
      )}

      <button
        onClick={onSignIn}
        className="group mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-electric-mix font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110"
      >
        Sign in to your workspace
        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}

export default function ConfirmedPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const doneRef = useRef(false);

  useEffect(() => {
    if (doneRef.current) return;
    doneRef.current = true;

    async function init() {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth");
        return;
      }

      const uname =
        (user.user_metadata?.username as string) ??
        user.email?.split("@")[0] ??
        "there";
      setUsername(uname);
      setEmail(user.email ?? "");

      const result = await sendWelcomeAction({
        email: user.email!,
        username: uname,
        method: "Email & Password",
      });

      if (result.ok) {
        setSent(true);
      } else {
        setError(result.error ?? "Could not send welcome email.");
        setSent(true);
      }
    }

    init();
  }, [router]);

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
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-veritas-electric/10 blur-[100px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-veritas-arc/8 blur-[80px]"
      />

      <div
        className={`glass-strong relative mx-auto w-full max-w-md rounded-2xl p-8 text-center transition-all duration-500 ${
          sent ? "shadow-glow-electric" : "shadow-card"
        }`}
        role="status"
        aria-live="polite"
        aria-busy={!sent}
      >
        {sent ? (
          <SuccessState
            username={username}
            email={email}
            error={error}
            onSignIn={() => router.push("/auth")}
          />
        ) : (
          <VerifyingLoader />
        )}

        <div className="mt-8 border-t border-veritas-border-subtle/60 pt-6">
          <BrandLogo variant="compact" />
        </div>
      </div>
    </div>
  );
}

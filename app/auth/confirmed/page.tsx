"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { sendWelcomeAction } from "@/app/actions/send-welcome";
import { ArrowRight, CheckCircle, Sparkles } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";

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
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-veritas-electric/10 blur-[100px]"
      />

      <div className="glass-strong relative mx-auto w-full max-w-md animate-fade-up rounded-2xl p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-veritas-electric/15">
          {sent ? (
            <CheckCircle className="h-8 w-8 text-veritas-success" />
          ) : (
            <Sparkles className="h-8 w-8 text-veritas-electric" />
          )}
        </div>

        <h1 className="mt-6 font-display text-2xl font-bold text-white">
          {sent ? "You're all set!" : "Verifying your email..."}
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          {sent
            ? `Welcome to VERITAS, ${username}! A confirmation has been sent to ${email}.`
            : "Please wait a moment while we confirm your account."}
        </p>

        {error && (
          <p className="mt-3 text-xs text-amber-400">
            A welcome email could not be sent, but your account is active.
          </p>
        )}

        {sent && (
          <button
            onClick={() => router.push("/auth")}
            className="group mt-8 inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-electric-mix font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110"
          >
            Sign in to your workspace
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </button>
        )}

        <div className="mt-8 border-t border-veritas-border-subtle/60 pt-6">
          <BrandLogo variant="compact" />
        </div>
      </div>
    </div>
  );
}

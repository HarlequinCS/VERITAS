import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check your email | VERITAS",
};

export default function VerifyEmailPage() {
  return (
    <div className="relative isolate flex min-h-dvh items-center justify-center px-4">
      <div
        aria-hidden={true}
        className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40"
        style={{
          maskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)",
        }}
      />
      <div
        aria-hidden={true}
        className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-veritas-electric/15 blur-[100px]"
      />

      <div className="glass w-full max-w-md rounded-2xl p-10 text-center animate-fade-up">
        <div className="mb-6 flex justify-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full border border-veritas-electric/30 bg-veritas-electric/10 text-3xl">
            📬
          </span>
        </div>

        <h1 className="text-2xl font-semibold tracking-tight text-white">
          Check your inbox
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-400">
          We sent a verification link to your email address. Click it to activate
          your VERITAS account before signing in.
        </p>

        <div className="mt-8 space-y-3">
          <Link
            href="/auth"
            className="flex h-11 w-full items-center justify-center rounded-xl bg-electric-mix font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  );
}

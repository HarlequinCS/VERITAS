import Link from "next/link";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-24">
      <section className="glass w-full max-w-md rounded-2xl p-6">
        <Mail className="h-8 w-8 text-veritas-electric" />
        <h1 className="mt-5 text-2xl font-semibold text-white">
          Reset workspace access
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          Enter your workspace email and VERITAS will send a secure reset link.
          This is for scanner users only; founder console access is separate.
        </p>
        <input
          placeholder="developer@company.com"
          className="mt-6 h-11 w-full rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-veritas-electric/50"
        />
        <Link
          href="/auth"
          className="mt-4 inline-flex h-11 w-full items-center justify-center rounded-xl bg-electric-mix font-semibold text-veritas-bg shadow-glow-electric"
        >
          Send reset link
        </Link>
      </section>
    </main>
  );
}

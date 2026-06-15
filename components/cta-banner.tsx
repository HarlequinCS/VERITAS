import Link from "next/link";

export function CtaBanner() {
  return (
    <section className="relative overflow-hidden border-t border-veritas-border-subtle/60 px-4 py-24 sm:px-6 lg:px-8">
      {/* Glow background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-veritas-electric/8 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-[1.1]">
          Scan your app like an attacker, then fix it like an engineer.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400">
          Start as a solo developer. Add leads, developers, tickets, and
          verification when your workflow grows.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/auth"
            className="inline-flex items-center rounded-lg bg-electric-mix px-8 py-3.5 font-label text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-glow-electric transition hover:opacity-90"
          >
            Launch Mock Scanner
          </Link>
          <Link
            href="/tickets"
            className="inline-flex items-center rounded-lg border border-veritas-border-subtle px-8 py-3.5 font-label text-xs font-semibold uppercase tracking-[0.12em] text-slate-300 transition hover:border-veritas-electric/40 hover:text-white"
          >
            View Team Workflow
          </Link>
        </div>
      </div>
    </section>
  );
}

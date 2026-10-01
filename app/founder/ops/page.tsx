import Link from "next/link";

export default function FounderOpsPage() {
  return (
    <main className="min-h-dvh bg-veritas-bg px-4 py-8 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-veritas-electric">
          Private console
        </p>
        <h1 className="mt-2 max-w-[40rem] text-4xl font-semibold text-white">
          Operations are not connected on this server.
        </h1>
        <p className="mt-4 max-w-[40rem] text-base leading-relaxed text-slate-300">
          This page does not read live worker, queue, or customer counts. Use the workspace dashboard for scan sessions that belong to a signed-in account.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex h-11 items-center rounded-lg border border-veritas-border-subtle px-4 text-base text-slate-200 hover:border-veritas-electric/40 hover:text-white"
        >
          Return to site
        </Link>
      </section>
    </main>
  );
}

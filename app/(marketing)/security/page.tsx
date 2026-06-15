import { ShieldCheck } from "lucide-react";

export default function SecurityPage() {
  return (
    <main className="min-h-dvh px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl">
        <ShieldCheck className="h-9 w-9 text-veritas-electric" />
        <h1 className="mt-5 font-display text-4xl font-bold text-white">Security model</h1>
        <p className="mt-5 text-base leading-relaxed text-slate-400">
          VERITAS mockups separate customer scanner workspaces from founder operations.
          Scan execution is modeled around isolated browser contexts, background workers,
          strict task states, and auditable evidence records.
        </p>
      </section>
    </main>
  );
}

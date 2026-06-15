import Link from "next/link";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-dvh px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <section className="glass mx-auto max-w-2xl rounded-2xl p-6">
        <Mail className="h-8 w-8 text-veritas-electric" />
        <h1 className="mt-5 font-display text-4xl font-bold text-white">Contact VERITAS</h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          For the mockup, enquiries route to the hidden founder operations console
          where inbound demo and beta requests can be monitored.
        </p>
        <Link href="/auth" className="mt-6 inline-flex rounded-lg bg-electric-mix px-5 py-3 font-label text-xs font-semibold uppercase tracking-[0.12em] text-veritas-bg">
          Request Access
        </Link>
      </section>
    </main>
  );
}

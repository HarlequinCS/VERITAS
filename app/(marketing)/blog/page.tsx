import Link from "next/link";
import { ArrowRight, Bug, FileText, ShieldAlert } from "lucide-react";

const POSTS = [
  {
    icon: ShieldAlert,
    tag: "Threat Intel",
    title: "What CISA KEV tells us about exploited vulnerabilities",
    body: "How VERITAS uses public exploited-CVE signals to contextualize scan findings and severity.",
  },
  {
    icon: Bug,
    tag: "Hybrid DAST",
    title: "Why visual proof beats noisy scanner output",
    body: "A walkthrough of headless browser simulation, DOM mutation capture, and screenshot-backed evidence.",
  },
  {
    icon: FileText,
    tag: "Remediation",
    title: "From CWE classification to developer-ready patch notes",
    body: "How the classifier, synthesizer, and validator agent loop turns a trace into practical remediation.",
  },
];

export default function BlogPage() {
  return (
    <main className="min-h-dvh px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <p className="font-label text-xs uppercase tracking-[0.2em] text-veritas-electric">
          Threat Intelligence
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
          From the VERITAS lab.
        </h1>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
          Research notes for developers, security leads, and teams building a
          clean vulnerability remediation workflow around real exploit evidence.
        </p>

        <article className="mt-12 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-6 lg:flex lg:items-center lg:justify-between lg:gap-10">
          <div>
            <span className="font-label text-[10px] uppercase tracking-[0.18em] text-rose-300">
              Critical Advisory
            </span>
            <h2 className="mt-3 text-2xl font-semibold text-white">
              Broken access control is still the fastest path from user to admin.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-300">
              The VERITAS mock workflow demonstrates how a direct route request
              becomes a reproducible Playwright trace, an AI root-cause summary,
              and a ticket a developer can actually fix.
            </p>
          </div>
          <Link
            href="/vulnerabilities/cwe-285"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-electric-mix px-4 py-3 font-label text-xs font-semibold uppercase tracking-[0.12em] text-veritas-bg lg:mt-0"
          >
            Open Example Finding
            <ArrowRight className="h-4 w-4" />
          </Link>
        </article>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {POSTS.map((post) => (
            <article
              key={post.title}
              className="rounded-2xl border border-veritas-border-subtle bg-veritas-surface/40 p-6 transition hover:border-veritas-electric/30"
            >
              <post.icon className="h-6 w-6 text-veritas-electric" />
              <p className="mt-5 font-label text-[10px] uppercase tracking-[0.18em] text-veritas-electric">
                {post.tag}
              </p>
              <h2 className="mt-2 text-lg font-semibold text-white">
                {post.title}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-400">
                {post.body}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

import { Radar, GitBranch, ShieldCheck } from "lucide-react";
import Link from "next/link";

const FEATURES = [
  {
    icon: Radar,
    iconColor: "text-veritas-electric",
    iconBg: "bg-veritas-electric/10",
    tag: "SCAN",
    title: "Start a scan without blocking your workflow",
    body: "Submit a target URL, receive a scan session instantly, and let Celery workers run the heavy browser simulation in the background.",
    href: "/features/scan",
  },
  {
    icon: GitBranch,
    iconColor: "text-veritas-arc",
    iconBg: "bg-veritas-arc/10",
    tag: "PROVE",
    title: "Capture proof, not just scanner noise",
    body: "Playwright reproduces attack paths in an isolated browser context, watches DOM and response changes, then stores visual PoC evidence.",
    href: "/features/simulate",
    badge: "HYBRID DAST",
  },
  {
    icon: ShieldCheck,
    iconColor: "text-veritas-success",
    iconBg: "bg-veritas-success/10",
    tag: "PATCH",
    title: "Fix it yourself or assign it to a team",
    body: "A 3-agent AI loop classifies the weakness, drafts a patch, validates the output, and turns it into remediation work for solo or team delivery.",
    href: "/features/solve",
  },
];

export function FeaturePillars() {
  return (
    <section
      id="features"
      className="relative scroll-mt-28 border-t border-veritas-border-subtle/60 px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center">
          <span className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-veritas-electric">
            Product Flow
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-white">
            One scanner. Two ways to work.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Solo developers can run a target scan and ship the recommended fix.
            Teams can route the same finding through leads, developers, SLA
            queues, and verification.
          </p>
        </div>

        {/* Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feat) => (
            <article
              key={feat.tag}
              className="group relative rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 p-8 transition hover:border-veritas-electric/30 hover:bg-veritas-surface/60"
            >
              {/* Hover glow */}
              <div className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition group-hover:opacity-100">
                <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-veritas-electric/5 to-transparent" />
              </div>

              <div
                className={`relative flex h-14 w-14 items-center justify-center rounded-xl ${feat.iconBg} ring-1 ring-white/5`}
              >
                <feat.icon className={`h-7 w-7 ${feat.iconColor}`} />
              </div>

              <div className="relative mt-6 flex items-center gap-3">
                <span className="font-label text-xs font-semibold uppercase tracking-[0.15em] text-veritas-electric">
                  {feat.tag}
                </span>
                {feat.badge && (
                  <span className="rounded-full border border-veritas-electric/30 bg-veritas-electric/10 px-2 py-0.5 font-label text-[9px] font-semibold uppercase tracking-wider text-veritas-electric">
                    {feat.badge}
                  </span>
                )}
              </div>

              <h3 className="relative mt-3 text-lg font-semibold text-white">
                {feat.title}
              </h3>

              <p className="relative mt-3 text-sm leading-relaxed text-slate-400">
                {feat.body}
              </p>

              <Link
                href={feat.href}
                className="relative mt-6 inline-flex items-center gap-1.5 font-label text-xs font-semibold uppercase tracking-[0.12em] text-veritas-electric transition group-hover:text-white"
              >
                Learn More
                <svg
                  className="h-3 w-3 transition group-hover:translate-x-0.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

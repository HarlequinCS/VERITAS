import Link from "next/link";
import { Check, ShieldCheck, User, Users } from "lucide-react";

const TIERS = [
  {
    name: "Solo Developer",
    price: "$29",
    note: "per month",
    icon: User,
    description:
      "For one developer scanning personal projects, client apps, or a small SaaS before every release.",
    features: [
      "5 registered targets",
      "Async Hybrid DAST scans",
      "Playwright visual proof capture",
      "AI root cause explanation",
      "Patch guidance and exportable report",
    ],
  },
  {
    name: "Team",
    price: "$149",
    note: "per workspace / month",
    icon: Users,
    highlighted: true,
    description:
      "For leads and developers who need assignment, verification, and a shared remediation queue.",
    features: [
      "50 registered targets",
      "Lead and Developer roles",
      "Remediation tickets with SLA status",
      "AI patch validation loop",
      "JSON, SARIF, and PDF report studio",
    ],
  },
  {
    name: "Enterprise SOC",
    price: "Custom",
    note: "private deployment",
    icon: ShieldCheck,
    description:
      "For regulated organizations that need dedicated workers, audit controls, and deployment isolation.",
    features: [
      "Unlimited targets and workspaces",
      "Dedicated Celery worker pools",
      "PostgreSQL production deployment",
      "SSO, RBAC, and audit evidence",
      "Custom compliance report templates",
    ],
  },
];

export default function PricingPage() {
  return (
    <main className="min-h-dvh px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <div className="text-center">
          <p className="font-label text-xs uppercase tracking-[0.2em] text-veritas-electric">
            Access Tiers
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
            Start solo. Scale into a team.
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            VERITAS is priced around the workflow: one developer can scan and
            patch immediately, while teams can add role-based assignment,
            verification, and reporting when needed.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier) => (
            <article
              key={tier.name}
              className={`rounded-2xl border p-6 ${
                tier.highlighted
                  ? "border-veritas-electric/50 bg-veritas-electric/10 shadow-glow-electric"
                  : "border-veritas-border-subtle bg-veritas-surface/40"
              }`}
            >
              <tier.icon className="h-7 w-7 text-veritas-electric" />
              <h2 className="mt-5 text-xl font-semibold text-white">
                {tier.name}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {tier.description}
              </p>
              <div className="mt-6 flex items-end gap-2">
                <span className="font-display text-4xl font-bold text-white">
                  {tier.price}
                </span>
                <span className="pb-1 text-sm text-slate-500">{tier.note}</span>
              </div>
              <ul className="mt-6 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex gap-2 text-sm text-slate-300">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-veritas-electric" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link
                href={tier.name === "Enterprise SOC" ? "/contact" : "/auth"}
                className={`mt-8 inline-flex w-full justify-center rounded-lg px-4 py-3 font-label text-xs font-semibold uppercase tracking-[0.12em] transition ${
                  tier.highlighted
                    ? "bg-electric-mix text-veritas-bg shadow-glow-electric hover:brightness-110"
                    : "border border-veritas-border-subtle text-slate-300 hover:border-veritas-electric/40 hover:text-white"
                }`}
              >
                {tier.name === "Enterprise SOC" ? "Request Demo" : "Start Mock Flow"}
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

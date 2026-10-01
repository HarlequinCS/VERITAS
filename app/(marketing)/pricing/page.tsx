import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { MarketingActions } from "@/components/marketing-actions";

export const metadata: Metadata = {
  title: "VERITAS pricing",
  description:
    "Solo Developer is $29 a month. Team is $149 a workspace each month. Enterprise is a quoted private-deployment conversation. Creating an account does not charge a card.",
};

const PLANS = [
  {
    name: "Solo Developer",
    price: "$29",
    note: "per month",
    audience: "One developer testing personal projects, client apps, or a small product before a release.",
    outcome: "A signed-in workspace for the applications you own, with scan sessions, findings, and reports.",
    href: "/register",
    cta: "Create account",
  },
  {
    name: "Team",
    price: "$149",
    note: "per workspace / month",
    audience: "A lead who needs analysts and developers working the same findings.",
    outcome: "An organization with invites, roles, an optional authenticator requirement, and a membership audit log.",
    href: "/register",
    cta: "Create account",
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    note: "private deployment",
    audience: "An organization that needs to talk about running VERITAS in its own environment.",
    outcome: "The same account model as Team, plus a conversation about a private deployment.",
    href: "/contact",
    cta: "Contact",
  },
];

const ROWS = [
  ["Signed-in workspace", "Yes", "Yes", "Yes"],
  ["Register applications you own", "Yes", "Yes", "Yes"],
  ["Scan sessions, findings, and reports", "Yes", "Yes", "Yes"],
  ["Organization, invites, and roles", "No", "Yes", "Yes"],
  ["Authenticator requirement and membership audit", "No", "Yes", "Yes"],
  ["Private-deployment conversation", "No", "No", "Yes"],
];

const QUESTIONS = [
  {
    q: "What is a workspace?",
    a: "A workspace is the signed-in place where your targets, scan sessions, findings, tickets, and reports live. On Team and Enterprise it also includes an organization.",
  },
  {
    q: "Can I invite a teammate on Solo?",
    a: "No. Invites, roles, and the membership audit log start on Team.",
  },
  {
    q: "How do I move from Solo to Team?",
    a: "Create an organization or accept an invitation. There is no automated proration on this site.",
  },
  {
    q: "What does Enterprise include?",
    a: "The same account model as Team, and a conversation about a private deployment. It is not a different scanner.",
  },
  {
    q: "How do I get help?",
    a: "Use the contact page. Creating an account does not start a paid subscription, because this site has no checkout.",
  },
];

export default function PricingPage() {
  return (
    <main className="px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <p className="font-label text-xs uppercase tracking-[0.2em] text-veritas-electric">Pricing</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold text-white sm:text-5xl">
          Choose by who owns the work.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400">
          One person, a shared queue, or a private deployment conversation. Prices are monthly. Creating an account does not charge a card.
        </p>
      </section>

      <section className="mx-auto mt-14 grid max-w-6xl gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => (
          <article
            key={plan.name}
            className={`flex flex-col rounded-2xl border p-6 ${
              plan.highlighted
                ? "border-veritas-electric/50 bg-veritas-electric/10"
                : "border-veritas-border-subtle bg-veritas-surface/40"
            }`}
          >
            <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{plan.audience}</p>
            <p className="mt-6 font-display text-4xl font-bold text-white">
              {plan.price} <span className="text-sm font-normal text-slate-400">{plan.note}</span>
            </p>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-slate-300">{plan.outcome}</p>
            <Link
              href={plan.href}
              className={`mt-8 inline-flex h-11 items-center justify-center rounded-lg px-4 text-sm font-semibold ${
                plan.highlighted
                  ? "bg-electric-mix text-veritas-bg"
                  : "border border-veritas-border-subtle text-slate-200"
              }`}
            >
              {plan.cta}
            </Link>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-20 max-w-6xl">
        <h2 className="font-display text-3xl font-bold text-white">What each plan includes</h2>
        <div className="mt-6 overflow-x-auto rounded-2xl border border-veritas-border-subtle">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="bg-veritas-surface/60 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Capability</th>
                <th className="px-4 py-3 font-medium">Solo</th>
                <th className="px-4 py-3 font-medium">Team</th>
                <th className="px-4 py-3 font-medium">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((row) => (
                <tr key={row[0]} className="border-t border-veritas-border-subtle/70">
                  {row.map((cell, index) => (
                    <td key={cell + index} className="px-4 py-3 text-slate-300">
                      {cell === "Yes" ? <Check className="h-4 w-4 text-veritas-electric" aria-label="Included" /> : cell === "No" ? <span className="text-slate-500">Not included</span> : cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mx-auto mt-20 grid max-w-6xl gap-6 md:grid-cols-3">
        {[
          ["Before a release", "A developer uses Solo to register the apps they own and review findings themselves."],
          ["A shared queue", "A lead uses Team so analysts and developers share the organization, the invites, and the tickets."],
          ["A private deployment", "An organization uses Enterprise to start a conversation. The scanner model stays the same."],
        ].map(([title, body]) => (
          <article key={title} className="rounded-2xl border border-veritas-border-subtle p-5">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-20 max-w-6xl">
        <h2 className="font-display text-3xl font-bold text-white">Billing</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-400">
          Solo is $29 per month. Team is $149 per workspace per month. Enterprise is quoted. Creating an account on this site does not charge a card, because there is no checkout.
        </p>
      </section>

      <section className="mx-auto mt-16 max-w-6xl space-y-4">
        <h2 className="font-display text-3xl font-bold text-white">Questions</h2>
        {QUESTIONS.map((item) => (
          <article key={item.q} className="rounded-2xl border border-veritas-border-subtle p-5">
            <h3 className="text-base font-semibold text-white">{item.q}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-400">{item.a}</p>
          </article>
        ))}
        <MarketingActions primaryHref="/register" primaryLabel="Create account" secondaryHref="/platform" secondaryLabel="Explore the platform" />
      </section>
    </main>
  );
}

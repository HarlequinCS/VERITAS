import type { Metadata } from "next";
import { MarketingActions } from "@/components/marketing-actions";
import { FindingFrame, TicketFrame, WorkspaceFrame } from "@/components/product-frames";

export const metadata: Metadata = {
  title: "VERITAS platform",
  description:
    "VERITAS registers an application you own, keeps exploit evidence, and turns the finding into a fix a developer or a team can own.",
};

const CAPABILITIES = [
  {
    title: "Register the target",
    body: "Add the URL, the environment, and optional authentication for an application you are allowed to test. The scan session stays attached to that target.",
  },
  {
    title: "Keep the proof",
    body: "An isolated browser follows the path and records what changed. The finding stores the trace and the screenshot with the severity, not a label on its own.",
  },
  {
    title: "Hand off the fix",
    body: "The issue is mapped to a weakness class and a suggested change. One developer can apply it, or a lead can assign it on the remediation queue.",
  },
];

export default function PlatformPage() {
  return (
    <main className="px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <p className="font-label text-xs uppercase tracking-[0.2em] text-veritas-electric">Platform</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold text-white sm:text-5xl">
          Find the weakness, keep the evidence, and hand a developer the fix.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400">
          VERITAS is for a developer testing an application they own, and for a small team that needs the same findings shared by an owner, analysts, and developers.
        </p>
        <MarketingActions
          primaryHref="/register"
          primaryLabel="Create account"
          secondaryHref="/how-it-works"
          secondaryLabel="See how it works"
        />
      </section>

      <section className="mx-auto mt-20 grid max-w-6xl gap-6 md:grid-cols-3">
        {CAPABILITIES.map((item) => (
          <article key={item.title} className="rounded-2xl border border-veritas-border-subtle bg-veritas-surface/40 p-6">
            <h2 className="text-lg font-semibold text-white">{item.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">{item.body}</p>
          </article>
        ))}
      </section>

      <section className="mx-auto mt-20 grid max-w-6xl items-start gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-bold text-white">The same finding, with a team around it</h2>
          <p className="mt-4 text-base leading-relaxed text-slate-400">
            An organization has an owner. Admins invite people. Analysts, developers, and viewers each have a role. You can require an authenticator, and membership changes are written to an audit log.
          </p>
        </div>
        <WorkspaceFrame />
      </section>

      <section className="mx-auto mt-20 max-w-6xl">
        <h2 className="font-display text-3xl font-bold text-white">What you open after the scan</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-400">
          The workspace shows the finding, the evidence, a ticket with a status, and a report built from severity counts.
        </p>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <FindingFrame />
          <TicketFrame />
        </div>
      </section>

      <section className="mx-auto mt-20 max-w-6xl rounded-2xl border border-veritas-border-subtle bg-veritas-surface/40 p-6 sm:p-8">
        <h2 className="text-2xl font-semibold text-white">Controls around the account and the scan</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-slate-300">
          <li>Each scan runs in an isolated browser context.</li>
          <li>The account can use an authenticator, and an organization can require one.</li>
          <li>Roles decide who invites people, who reviews findings, and who is assigned the fix.</li>
          <li>Membership changes are recorded in the organization audit log.</li>
        </ul>
        <MarketingActions
          primaryHref="/security"
          primaryLabel="Read the security model"
          secondaryHref="/register"
          secondaryLabel="Create account"
        />
      </section>

      <section className="mx-auto mt-20 max-w-6xl">
        <h2 className="font-display text-3xl font-bold text-white">Start with your own application</h2>
        <MarketingActions
          primaryHref="/register"
          primaryLabel="Create account"
          secondaryHref="/pricing"
          secondaryLabel="View pricing"
        />
      </section>
    </main>
  );
}

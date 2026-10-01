import type { Metadata } from "next";
import { MarketingActions } from "@/components/marketing-actions";
import { FindingFrame, TargetFrame, TicketFrame } from "@/components/product-frames";

export const metadata: Metadata = {
  title: "How VERITAS works",
  description:
    "Add an application you own. VERITAS creates a scan session, records browser evidence, classifies the finding, and prepares a fix you can apply or assign.",
};

const STEPS = [
  {
    title: "Add the application",
    happens: "You enter the URL, the environment, and optional authentication for an app you are allowed to test.",
    see: "The target form shows the address, staging or production, and an optional token or cookie.",
    why: "The scan is tied to a specific application instead of a loose list of alerts.",
  },
  {
    title: "A session is created",
    happens: "VERITAS opens a scan session and runs the long work away from the page you are looking at.",
    see: "The session moves through Pending, Processing, Completed, or Failed.",
    why: "You can leave the page. The result is still attached to that session.",
  },
  {
    title: "An isolated browser follows the path",
    happens: "Playwright opens a separate browser, uses the auth you provided, and records what changed in the page.",
    see: "The live scan shows the browser phase while evidence capture is still waiting.",
    why: "The result is a reproduced path, not only a signature match.",
  },
  {
    title: "The evidence stays with the finding",
    happens: "The trace and the screenshot are stored with the severity.",
    see: "The finding has Analysis, Evidence, and Fix sections.",
    why: "A developer can see the path that reached the weakness.",
  },
  {
    title: "The weakness is classified",
    happens: "The finding is mapped to a CWE weakness and an OWASP category. A suggested code change is checked before it is shown.",
    see: "Labels such as CWE-285 and OWASP A01 sit next to the severity.",
    why: "The name of the issue and the suggested change arrive together.",
  },
  {
    title: "Someone owns the fix",
    happens: "A solo developer applies the change, or a lead assigns it on the ticket queue.",
    see: "Tickets use Open, In Progress, Resolved, and Closed.",
    why: "The finding does not stop at a report. It has a person and a status.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-6xl">
        <p className="font-label text-xs uppercase tracking-[0.2em] text-veritas-electric">How it works</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold text-white sm:text-5xl">
          You add the application. VERITAS returns evidence and a fix path.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400">
          The work moves from the target you register, through an isolated browser, into a classified finding, and then to a person who can fix it.
        </p>
        <MarketingActions
          primaryHref="/register"
          primaryLabel="Create account"
          secondaryHref="/pricing"
          secondaryLabel="View pricing"
        />
      </section>

      <ol className="mx-auto mt-16 hidden max-w-6xl gap-3 md:grid md:grid-cols-6">
        {["Target", "Session", "Browser", "Evidence", "Classify", "Fix"].map((label, index) => (
          <li key={label} className="rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 px-3 py-4 text-center">
            <span className="font-label text-[10px] uppercase tracking-[0.16em] text-veritas-electric">{index + 1}</span>
            <p className="mt-2 text-sm font-semibold text-white">{label}</p>
          </li>
        ))}
      </ol>
      <p className="mx-auto mt-4 max-w-6xl text-sm text-slate-400">
        A session is Pending, Processing, Completed, or Failed.
      </p>

      <div className="mx-auto mt-12 max-w-6xl space-y-8">
        {STEPS.map((step, index) => {
          const frame = index === 0 ? <TargetFrame /> : index === 3 || index === 4 ? <FindingFrame /> : index === 5 ? <TicketFrame /> : null;
          return (
            <article key={step.title} className={`grid items-start gap-6 rounded-2xl border border-veritas-border-subtle bg-veritas-surface/30 p-5 ${frame ? "lg:grid-cols-[1.2fr_0.8fr]" : ""}`}>
              <div>
                <p className="font-label text-xs uppercase tracking-[0.16em] text-veritas-electric">Step {index + 1}</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">{step.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-300">{step.happens}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">You see: {step.see}</p>
                <p className="mt-3 text-sm leading-relaxed text-slate-400">Why it matters: {step.why}</p>
              </div>
              {frame}
            </article>
          );
        })}
      </div>

      <section className="mx-auto mt-20 max-w-6xl">
        <h2 className="font-display text-3xl font-bold text-white">An example path</h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-400">
          A signed-in user requests /admin/users and reaches it without an admin role. VERITAS keeps that route, marks it as broken access control (CWE-285, OWASP A01), and leaves a ticket a developer can take. This is the example finding in the product, not a customer incident.
        </p>
        <div className="mt-8 max-w-xl">
          <FindingFrame />
        </div>
        <MarketingActions
          primaryHref="/register"
          primaryLabel="Create account"
          secondaryHref="/platform"
          secondaryLabel="Explore the platform"
        />
      </section>
    </main>
  );
}

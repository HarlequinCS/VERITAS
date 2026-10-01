import Link from "next/link";
import { PlugZap, ScanLine, Crosshair } from "lucide-react";

const STEPS = [
  {
    icon: PlugZap,
    title: "Register a target",
    body: "Add the URL, environment, and optional auth for an application you are allowed to test.",
  },
  {
    icon: ScanLine,
    title: "Keep the evidence",
    body: "An isolated browser follows the path and stores the trace with the finding.",
  },
  {
    icon: Crosshair,
    title: "Fix or assign",
    body: "The weakness is classified, and a developer applies the change or a lead assigns the ticket.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-28 border-t border-veritas-border-subtle/60 px-4 py-24 sm:px-6 lg:px-8"
    >
      <div className="relative mx-auto max-w-6xl">
        <div className="text-center">
          <span className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-veritas-electric">
            How it works
          </span>
          <h2 className="mt-3 font-display text-3xl font-bold text-white sm:text-4xl">
            From the application you add to a fix someone owns.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Register the target, keep the browser evidence, then apply the change yourself or assign it.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex flex-col items-center px-6 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-veritas-border-subtle bg-veritas-surface">
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-veritas-electric text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                <step.icon className="h-8 w-8 text-veritas-electric" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-white">{step.title}</h3>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-400">{step.body}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/how-it-works" className="text-sm font-semibold text-veritas-electric">
            See the full workflow
          </Link>
        </div>
      </div>
    </section>
  );
}

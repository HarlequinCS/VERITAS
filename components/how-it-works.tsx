import { PlugZap, ScanLine, Crosshair } from "lucide-react";

const STEPS = [
  {
    icon: PlugZap,
    title: "Register a target",
    body: "Add a URL, environment, and optional auth token. VERITAS creates a Pending scan session and immediately returns control to you.",
  },
  {
    icon: ScanLine,
    title: "Simulate in isolation",
    body: "A worker launches an ephemeral Playwright browser, injects payloads, captures traces, screenshots, and successful exploit evidence.",
  },
  {
    icon: Crosshair,
    title: "Patch or assign",
    body: "AI maps the issue to CWE/OWASP, drafts remediation, validates it, then lets a solo developer apply it or a lead assign it to a developer.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative scroll-mt-28 border-t border-veritas-border-subtle/60 px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* Grid background */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-30" aria-hidden />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <div className="text-center">
          <span className="font-label text-xs font-semibold uppercase tracking-[0.2em] text-veritas-electric">
            Scan Lifecycle
          </span>
          <h2 className="mt-3 font-display text-3xl sm:text-4xl font-bold text-white">
            Pending to patched, without guessing.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base">
            Every scan follows a clear state model: Pending, Processing,
            Completed or Failed. That keeps the mockup understandable for solo
            users and scalable for team workflows.
          </p>
        </div>

        {/* Stepper */}
        <div className="mt-16 grid gap-8 md:grid-cols-3 md:gap-0">
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative flex flex-col items-center text-center px-6">
              {/* Connector line */}
              {i < STEPS.length - 1 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-px border-t border-dashed border-veritas-border-subtle" />
              )}

              {/* Number + Icon */}
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border border-veritas-border-subtle bg-veritas-surface">
                <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-veritas-electric text-[10px] font-bold text-white">
                  {i + 1}
                </span>
                <step.icon className="h-8 w-8 text-veritas-electric" />
              </div>

              <h3 className="mt-6 text-lg font-semibold text-white">
                {step.title}
              </h3>

              <p className="mt-3 text-sm leading-relaxed text-slate-400 max-w-xs">
                {step.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

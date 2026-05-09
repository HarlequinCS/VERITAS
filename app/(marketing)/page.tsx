import { LaunchDashboardCta } from "@/components/launch-dashboard-cta";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-dvh">
      <main>
        <section className="relative overflow-hidden px-4 pb-24 pt-16 sm:px-6 sm:pb-32 sm:pt-20 lg:px-8 lg:pt-28">
          <div
            className="pointer-events-none absolute inset-0 grid-bg opacity-50"
            aria-hidden
            style={{
              maskImage:
                "radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent)",
              WebkitMaskImage:
                "radial-gradient(ellipse 70% 60% at 50% 0%, black, transparent)",
            }}
          />

          <div className="relative mx-auto max-w-4xl text-center">
            <p className="text-xs font-medium uppercase tracking-[0.32em] neon-text">
              VERITAS
            </p>
            <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight text-white sm:text-5xl sm:leading-[1.06] md:text-6xl md:leading-[1.02]">
              Secure the era of vibe coding
            </h1>
            <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
              AI-assisted development ships features faster, but it also
              introduces subtle attack surface: copied snippets, permissive
              defaults, and routes you did not intend to expose. Traditional
              scanners flood teams with noise, false positives, and alert
              fatigue, so real issues get buried.
            </p>
            <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-veritas-border-subtle/60 bg-veritas-surface/40 px-6 py-8 text-left backdrop-blur-md sm:px-8 sm:py-10">
              <p className="text-center text-xs font-semibold uppercase tracking-[0.22em] text-cyan-300/80">
                Our approach
              </p>
              <p className="mt-4 text-center text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Detect. Prove. Patch.
              </p>
              <p className="mt-5 text-center text-sm leading-relaxed text-slate-400 sm:text-base">
                VERITAS runs controlled exploit simulation against your target,
                captures visual proof (like a security engineer with a camera),
                and pairs it with AI-driven remediation you can ship. Less
                theater, more signal: what broke, how we proved it, and what to
                change.
              </p>
            </div>
            <div className="mt-12 flex flex-col items-center gap-4 sm:mt-14">
              <LaunchDashboardCta />
              <Link
                href="/#features"
                className="text-sm font-medium text-slate-500 underline-offset-4 transition hover:text-slate-300 hover:underline"
              >
                Explore product pillars
              </Link>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="scroll-mt-32 lg:scroll-mt-40 border-t border-veritas-border-subtle/60 px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-6xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-300/80">
              Features
            </h2>
            <p className="mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Proof-first security for fast-moving teams
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Exploit simulation",
                  body: "Headless browser workflows reproduce real attack paths so you see what an adversary sees, not just a rule ID.",
                },
                {
                  title: "Visual evidence",
                  body: "Captured frames and traces anchor triage: shareable artifacts for engineering, compliance, and leadership.",
                },
                {
                  title: "AI remediation drafts",
                  body: "Context-aware patch suggestions and diffs shorten the loop from finding to fix without replacing human review.",
                },
              ].map((item) => (
                <article
                  key={item.title}
                  className="glass rounded-2xl p-6 transition hover:border-cyan-400/30"
                >
                  <h3 className="text-lg font-semibold text-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {item.body}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="documentation"
          className="scroll-mt-32 lg:scroll-mt-40 border-t border-veritas-border-subtle/60 px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-6xl lg:flex lg:items-start lg:justify-between lg:gap-16">
            <div className="max-w-xl">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-300/80">
                Documentation
              </h2>
              <p className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Integrate VERITAS into your SDLC
              </p>
              <p className="mt-4 text-sm leading-relaxed text-slate-400 sm:text-base">
                Reference architecture for CI triggers, webhook notifications,
                and mapping findings to ticketing systems. This mock does not
                link to live docs; wire your content here when ready.
              </p>
            </div>
            <div className="glass mt-10 flex flex-col gap-3 rounded-2xl p-6 lg:mt-0 lg:min-w-[280px]">
              <span className="font-mono text-xs text-cyan-300/70">
                veritas.config.yml
              </span>
              <p className="font-mono text-sm text-slate-300">
                pipelines: [build, scan, report]
                <br />
                fail_on: critical
              </p>
            </div>
          </div>
        </section>

        <section
          id="enterprise"
          className="scroll-mt-32 lg:scroll-mt-40 border-t border-veritas-border-subtle/60 bg-veritas-surface/20 px-4 py-20 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-6xl text-center lg:text-left">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-cyan-300/80">
              Enterprise
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:mx-0">
              SSO, audit trails, and dedicated support
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400 sm:text-base lg:mx-0">
              For regulated environments and platform teams that need SLAs,
              private deployment options, and alignment with your existing IAM
              stack. Contact sales when you are ready to operationalize this
              mock into production.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-3 lg:justify-start">
              <Link
                href="/auth"
                className="inline-flex rounded-lg border border-veritas-border-strong bg-veritas-bg px-5 py-2.5 text-sm font-medium text-white transition hover:border-cyan-400/40 hover:bg-veritas-surface"
              >
                Request access
              </Link>
              <Link
                href="/#features"
                className="inline-flex rounded-lg border border-transparent px-5 py-2.5 text-sm font-medium text-slate-400 transition hover:text-white"
              >
                View capabilities
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-veritas-border-subtle/60 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-xs text-slate-500 sm:flex-row">
            <p>VERITAS UI mock. No data is collected or scanned.</p>
            <p className="font-mono">detect / prove / patch</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

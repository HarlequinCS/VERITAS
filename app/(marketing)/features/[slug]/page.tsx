import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const CONTENT = {
  scan: {
    title: "Asynchronous scan sessions",
    label: "SCAN",
    body: "FastAPI accepts a target, validates the request, creates a Pending scan session, and sends long-running work to Celery so the UI stays responsive.",
    bullets: ["Target registration", "Pending → Processing state", "Redis-backed background queue", "Workspace-safe production controls"],
  },
  simulate: {
    title: "Playwright exploit simulation",
    label: "PROVE",
    body: "VERITAS launches an ephemeral Chromium context, injects scoped auth state, executes payloads, and captures DOM changes plus visual proof.",
    bullets: ["Ephemeral browser contexts", "JWT and cookie injection", "DOM mutation telemetry", "Screenshot-backed PoC evidence"],
  },
  solve: {
    title: "AI remediation workflow",
    label: "PATCH",
    body: "A three-agent loop classifies the finding, synthesizes patch guidance, validates the output, and prepares work for a solo developer or team ticket.",
    bullets: ["CWE and OWASP mapping", "Patch snippets", "Validator self-reflection", "Ticket-ready remediation notes"],
  },
} as const;

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ slug: keyof typeof CONTENT }>;
}) {
  const { slug } = await params;
  const item = CONTENT[slug] ?? CONTENT.scan;

  return (
    <main className="min-h-dvh px-4 pb-24 pt-32 sm:px-6 lg:px-8">
      <section className="mx-auto max-w-4xl">
        <Link href="/#features" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to platform
        </Link>
        <p className="mt-10 font-label text-xs uppercase tracking-[0.2em] text-veritas-electric">
          {item.label}
        </p>
        <h1 className="mt-3 font-display text-4xl font-bold text-white sm:text-5xl">
          {item.title}
        </h1>
        <p className="mt-5 text-base leading-relaxed text-slate-400">
          {item.body}
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {item.bullets.map((bullet) => (
            <div key={bullet} className="glass flex gap-3 rounded-xl p-4">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-veritas-electric" />
              <span className="text-sm text-slate-300">{bullet}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

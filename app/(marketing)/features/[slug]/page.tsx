import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

const CONTENT = {
  scan: {
    title: "A scan session for the application you register",
    label: "Scan",
    body: "You submit a target you are allowed to test. VERITAS creates a session and runs the work away from the page, so the session can be Pending, Processing, Completed, or Failed.",
    bullets: ["Target URL and environment", "Optional authentication", "A session you can leave and return to", "Findings attached to that session"],
  },
  simulate: {
    title: "Proof from an isolated browser",
    label: "Prove",
    body: "Playwright opens a separate browser, uses the auth you provided, and records the page change. The finding keeps the trace and the screenshot with the severity.",
    bullets: ["Isolated browser context", "Auth you supplied for the target", "Recorded page and response changes", "Screenshot evidence on the finding"],
  },
  solve: {
    title: "A classified fix a person can own",
    label: "Fix",
    body: "The finding is mapped to a CWE weakness and an OWASP category. A suggested change is checked, then a developer applies it or a lead assigns the ticket.",
    bullets: ["CWE and OWASP labels", "A suggested code change", "Ticket statuses from Open to Closed", "A solo queue or a team assignment"],
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = CONTENT[slug as keyof typeof CONTENT] ?? CONTENT.scan;
  return { title: item.title, description: item.body };
}

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
        <Link href="/platform" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white">
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

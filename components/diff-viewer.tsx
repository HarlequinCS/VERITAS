"use client";

import { Check, Copy, GitPullRequest, Rows3, SplitSquareHorizontal } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const VULN_LINES: { n: number; t: string }[] = [
  { n: 10, t: "export async function middleware(req: NextRequest) {" },
  { n: 11, t: "  // legacy: any logged-in user reaches /admin" },
  { n: 12, t: "  if (req.nextUrl.pathname.startsWith('/admin')) {" },
  { n: 13, t: "    return NextResponse.next();" },
  { n: 14, t: "  }" },
  { n: 15, t: "  return NextResponse.next();" },
  { n: 16, t: "}" },
];

const PATCH_LINES: { n: number; t: string; tone?: "add" }[] = [
  { n: 10, t: "export async function middleware(req: NextRequest) {" },
  { n: 11, t: "  if (req.nextUrl.pathname.startsWith('/admin')) {" },
  { n: 12, t: "    const session = await getSession(req);", tone: "add" },
  { n: 13, t: "    if (!session?.roles?.includes('admin')) {", tone: "add" },
  { n: 14, t: "      return NextResponse.redirect(new URL('/login', req.url));", tone: "add" },
  { n: 15, t: "    }", tone: "add" },
  { n: 16, t: "    return NextResponse.next();" },
  { n: 17, t: "  }" },
  { n: 18, t: "  return NextResponse.next();" },
  { n: 19, t: "}" },
];

export function DiffViewer() {
  const [mode, setMode] = useState<"split" | "unified">("split");
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(PATCH_LINES.map((l) => l.t).join("\n"));
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-veritas-border-subtle bg-veritas-bg/60">
      <header className="flex items-center justify-between gap-2 border-b border-veritas-border-subtle bg-veritas-surface/50 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="font-mono text-[11px] text-slate-300">middleware.ts</span>
          <span className="rounded-md border border-veritas-arc/30 bg-veritas-arc/10 px-1.5 py-0.5 text-[10px] font-semibold text-veritas-arc">
            ✦ AI-drafted
          </span>
          <span className="hidden rounded-md bg-veritas-bg/60 px-1.5 py-0.5 font-mono text-[10px] text-slate-500 sm:inline">
            +9 −2
          </span>
        </div>
        <div className="flex items-center gap-1">
          <div className="hidden items-center rounded-md border border-veritas-border-subtle bg-veritas-bg/60 sm:flex">
            <button
              type="button"
              onClick={() => setMode("split")}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] ${
                mode === "split" ? "bg-veritas-electric/15 text-veritas-arc" : "text-slate-400"
              }`}
            >
              <SplitSquareHorizontal className="h-3 w-3" /> Split
            </button>
            <button
              type="button"
              onClick={() => setMode("unified")}
              className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] ${
                mode === "unified" ? "bg-veritas-electric/15 text-veritas-arc" : "text-slate-400"
              }`}
            >
              <Rows3 className="h-3 w-3" /> Unified
            </button>
          </div>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-md border border-veritas-border-subtle bg-veritas-bg/60 px-2 py-1 text-[11px] font-semibold text-slate-200 transition hover:border-veritas-electric/40 hover:text-white"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3 text-emerald-300" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" /> Copy patch
              </>
            )}
          </button>
          <Link
            href="/tickets"
            className="inline-flex items-center gap-1.5 rounded-md bg-electric-mix px-2 py-1 text-[11px] font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110"
          >
            <GitPullRequest className="h-3 w-3" /> Apply via PR
          </Link>
        </div>
      </header>

      <div className={mode === "split" ? "grid grid-cols-1 lg:grid-cols-2" : ""}>
        {/* Vulnerable */}
        <div className={mode === "split" ? "border-b border-veritas-border-subtle lg:border-b-0 lg:border-r" : ""}>
          <p className="border-b border-veritas-border-subtle bg-rose-500/5 px-3 py-1.5 font-mono text-[10px] text-rose-300">
            ─ vulnerable.ts
          </p>
          <pre className="overflow-x-auto p-3 font-mono text-[11.5px] leading-relaxed scrollbar-thin">
            {VULN_LINES.map((l) => (
              <div
                key={l.n}
                className="flex gap-3 rounded px-1 py-px transition hover:bg-rose-500/5"
              >
                <span className="w-6 shrink-0 select-none text-right text-slate-700 tabular-nums">
                  {l.n}
                </span>
                <span className="text-rose-200/90">{l.t}</span>
              </div>
            ))}
          </pre>
        </div>

        {/* Patched */}
        <div>
          <p className="border-b border-veritas-border-subtle bg-emerald-500/5 px-3 py-1.5 font-mono text-[10px] text-emerald-300">
            + patched.ts
          </p>
          <pre className="overflow-x-auto p-3 font-mono text-[11.5px] leading-relaxed scrollbar-thin">
            {PATCH_LINES.map((l) => (
              <div
                key={l.n}
                className={`flex gap-3 rounded px-1 py-px transition ${
                  l.tone === "add"
                    ? "bg-emerald-400/10 ring-1 ring-emerald-400/20"
                    : "hover:bg-emerald-500/5"
                }`}
              >
                <span className="w-6 shrink-0 select-none text-right text-slate-700 tabular-nums">
                  {l.n}
                </span>
                <span
                  className={l.tone === "add" ? "text-emerald-200" : "text-slate-300"}
                >
                  {l.t}
                </span>
              </div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}

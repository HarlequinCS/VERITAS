"use client";

import { Filter, Pause, Play } from "lucide-react";
import { useState } from "react";

type Line = {
  ts: string;
  level: "info" | "warn" | "error" | "ai" | "ok";
  text: string;
};

const LINES: Line[] = [
  { ts: "00:00:01", level: "info", text: "veritas@scan ▶ booting runtime in us-east-1" },
  { ts: "00:00:02", level: "info", text: "loading policy: workspace.scan-default.v3" },
  { ts: "00:00:04", level: "ok", text: "✓ triage agent ready · 248 routes mapped" },
  { ts: "00:00:08", level: "info", text: "GET https://app.acme.io/admin/users → 200 (78ms)" },
  { ts: "00:00:09", level: "ai", text: "✦ exploit-agent: hypothesis #4 — missing server-side role check" },
  { ts: "00:00:11", level: "warn", text: "WARN authorization header echoed in 302 redirect" },
  { ts: "00:00:14", level: "info", text: "POST https://api.acme.io/v2/promote → 201 (132ms)" },
  { ts: "00:00:16", level: "ai", text: "✦ analyst-agent: payload synthesis complete · queued for playwright" },
  { ts: "00:00:18", level: "ok", text: "✓ playwright captured frame_004.png · 1.2 MB" },
  { ts: "00:00:21", level: "error", text: "! exploit succeeded on /admin/users (verified, no side effects)" },
  { ts: "00:00:23", level: "ai", text: "✦ analyst-agent: drafting remediation patch (CWE-285)" },
  { ts: "00:00:24", level: "info", text: "GET https://app.acme.io/admin/audit → 200 (94ms)" },
  { ts: "00:00:25", level: "ok", text: "✓ patch.diff generated · 9 LOC, 1 file" },
  { ts: "00:00:26", level: "info", text: "syncing artifacts to evidence store..." },
];

const LEVEL_CLASS: Record<Line["level"], string> = {
  info: "text-slate-300",
  warn: "text-amber-300",
  error: "text-rose-400",
  ai: "text-veritas-arc",
  ok: "text-emerald-300",
};

const FILTERS = ["All", "Errors", "AI", "HTTP"] as const;
type FilterKey = (typeof FILTERS)[number];

export function LiveTerminal() {
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState<FilterKey>("All");

  const visible = LINES.filter((l) => {
    if (active === "Errors") return l.level === "error" || l.level === "warn";
    if (active === "AI") return l.level === "ai";
    if (active === "HTTP") return /\b(GET|POST|PUT|DELETE|PATCH)\b/.test(l.text);
    return true;
  });

  return (
    <div className="glass relative flex h-full flex-col overflow-hidden rounded-2xl">
      <header className="flex items-center justify-between gap-2 border-b border-veritas-border-subtle/70 bg-veritas-surface/40 px-3 py-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          </div>
          <span className="ml-2 font-mono text-[11px] text-slate-500">
            ~/scans/sess-2098/stream
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="hidden items-center gap-1 rounded-md border border-veritas-border-subtle bg-veritas-bg/60 px-1.5 py-0.5 text-[10px] text-slate-500 sm:inline-flex">
            <Filter className="h-3 w-3" />
            Filter
          </span>
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setActive(f)}
              className={`rounded-md px-2 py-0.5 text-[10px] font-semibold transition ${
                active === f
                  ? "bg-veritas-electric/15 text-veritas-arc ring-1 ring-veritas-electric/30"
                  : "text-slate-500 hover:text-slate-200"
              }`}
            >
              {f}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="ml-2 inline-flex items-center gap-1 rounded-md border border-veritas-border-subtle bg-veritas-bg/60 px-2 py-1 text-[10px] font-semibold text-slate-300 transition hover:border-veritas-electric/40 hover:text-white"
          >
            {paused ? (
              <>
                <Play className="h-3 w-3" /> Resume
              </>
            ) : (
              <>
                <Pause className="h-3 w-3" /> Pause
              </>
            )}
          </button>
        </div>
      </header>

      <div className="relative flex-1 overflow-hidden bg-[#020617]">
        <div className="scanlines absolute inset-0" aria-hidden />
        <div className="relative h-full overflow-y-auto p-4 font-mono text-[11.5px] leading-relaxed scrollbar-thin">
          {visible.map((l, i) => (
            <div
              key={i}
              className="flex gap-3 animate-stream-in py-0.5"
              style={{ animationDelay: `${i * 35}ms` }}
            >
              <span className="shrink-0 text-slate-700">[{l.ts}]</span>
              <span className={`flex-1 ${LEVEL_CLASS[l.level]}`}>{l.text}</span>
            </div>
          ))}
          <div className="mt-1 inline-flex items-center gap-2 text-veritas-electric">
            <span className="font-mono">veritas@scan ▶</span>
            <span className="inline-block h-3 w-1.5 animate-pulse bg-veritas-electric" />
          </div>
        </div>
      </div>
    </div>
  );
}

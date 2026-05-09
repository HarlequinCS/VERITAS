"use client";

import { ArrowUp, Sparkles, X } from "lucide-react";
import { useState } from "react";

const SUGGESTIONS = [
  "/explain the latest critical finding",
  "/patch CWE-285 with minimal diff",
  "/triage by exploitability",
  "Summarize last 24h scans for the exec deck",
];

export function AIAssistantDock() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-neon-mix shadow-glow-purple transition hover:scale-105"
          aria-label="Open AI assistant"
        >
          <Sparkles className="h-5 w-5 text-veritas-bg" />
          <span className="pointer-events-none absolute inset-0 rounded-full ring-2 ring-cyan-400/30 animate-pulse-neon" />
        </button>
      )}

      {open && (
        <div className="fixed bottom-6 right-6 z-40 w-[min(92vw,380px)] animate-fade-up">
          <div className="glass-strong overflow-hidden rounded-2xl shadow-card">
            <div className="flex items-center justify-between gap-2 border-b border-veritas-border-subtle bg-veritas-surface/50 px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-neon-mix">
                  <Sparkles className="h-3.5 w-3.5 text-veritas-bg" />
                </span>
                <div>
                  <p className="text-xs font-semibold text-white">VERITAS Copilot</p>
                  <p className="text-[10px] text-slate-500">
                    Grounded in your workspace
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-veritas-surface hover:text-white"
                aria-label="Close assistant"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="max-h-[42vh] overflow-y-auto p-4 scrollbar-thin">
              <div className="rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-purple-300">
                  ✦ Greeting
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                  I can help you triage findings, draft patches, and explain
                  any vulnerability in plain language. Try a slash-command or
                  ask anything below.
                </p>
              </div>

              <p className="mt-4 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                Suggestions
              </p>
              <ul className="flex flex-col gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      className="w-full rounded-lg border border-veritas-border-subtle bg-veritas-surface/30 px-3 py-2 text-left text-xs text-slate-300 transition hover:border-cyan-400/30 hover:text-white"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-2 border-t border-veritas-border-subtle bg-veritas-surface/40 p-3">
              <input
                type="text"
                placeholder="Ask about this screen..."
                className="flex-1 rounded-lg border border-veritas-border-subtle bg-veritas-bg px-3 py-2 text-xs text-white placeholder:text-slate-500 outline-none focus:border-cyan-400/40"
              />
              <button
                type="button"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-neon-mix text-veritas-bg shadow-glow-cyan transition hover:opacity-90"
                aria-label="Send"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

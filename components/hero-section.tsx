"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HeroGlobe } from "@/components/hero-globe";

export function HeroSection() {
  const [glitchDone, setGlitchDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGlitchDone(true), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-dvh overflow-hidden bg-veritas-bg">
      <div className="pointer-events-auto absolute inset-y-0 right-0 z-0 hidden w-[min(62vw,980px)] cursor-grab active:cursor-grabbing md:block">
        <HeroGlobe />
      </div>

      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-full max-w-3xl bg-gradient-to-r from-veritas-bg via-veritas-bg/85 to-transparent" />

      <div className="pointer-events-none relative z-20 mx-auto flex min-h-dvh max-w-6xl flex-col justify-center px-4 pb-16 pt-28 sm:px-6 lg:px-8 lg:pt-0">
        <div className="pointer-events-auto max-w-xl">
          {/* Live tag */}
          <div className="inline-flex items-center gap-2 rounded-full border border-veritas-electric/30 bg-veritas-electric/10 px-3 py-1 mb-6 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="absolute h-full w-full animate-ping rounded-full bg-veritas-electric/60" />
              <span className="h-2 w-2 rounded-full bg-veritas-electric" />
            </span>
            <span className="font-label text-[10px] font-semibold uppercase tracking-[0.2em] text-veritas-electric">
              Hybrid DAST + AI Remediation
            </span>
          </div>

          {/* Headline */}
          <h1
            className={`font-display text-5xl sm:text-6xl md:text-7xl lg:text-[4.5rem] font-black leading-[1.05] tracking-tight text-white ${
              glitchDone ? "" : "animate-glitch"
            }`}
          >
            {"VERITAS".split("").map((letter, i) => (
              <span
                key={i}
                className="inline-block hover:text-veritas-electric transition-colors duration-200"
                style={{
                  animation: glitchDone
                    ? "none"
                    : `glitch 0.3s ease ${i * 0.05}s both`,
                }}
              >
                {letter}
              </span>
            ))}
          </h1>

          {/* Tagline */}
          <p className="mt-4 font-label text-sm sm:text-base tracking-[0.25em] text-veritas-electric uppercase">
            Scan. Prove. Patch.
          </p>

          {/* Body */}
          <p className="mt-6 max-w-md text-base sm:text-lg leading-relaxed text-slate-400">
            VERITAS runs controlled browser-based attack simulations, captures
            proof, explains the root cause, and generates remediation guidance.
            Use it solo to secure your own app, or with a team to assign,
            verify, and close vulnerabilities.
          </p>

          {/* CTA Row */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/auth"
              className="inline-flex items-center rounded-lg bg-electric-mix px-6 py-3 font-label text-xs font-semibold uppercase tracking-[0.12em] text-white shadow-glow-electric transition hover:opacity-90"
            >
              Start Solo Scan
            </Link>
            <Link
              href="/#features"
              className="inline-flex items-center gap-2 rounded-lg border border-veritas-border-subtle px-6 py-3 font-label text-xs font-semibold uppercase tracking-[0.12em] text-slate-300 transition hover:border-veritas-electric/40 hover:text-white"
            >
              See Team Flow
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>

          <p className="mt-8 max-w-xl border-t border-veritas-border-subtle/60 pt-8 text-base leading-relaxed text-slate-300">
            Sign in to a workspace, invite the people who should see it, and review scans that belong to that account. This page does not show live customer totals.
          </p>
        </div>
      </div>

    </section>
  );
}

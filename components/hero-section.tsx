"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { HeroGlobe } from "@/components/hero-globe";

const THREAT_FEED = [
  "[ SCAN ] Target accepted · session status: Pending",
  "[ WORKER ] Celery claimed scan · status: Processing",
  "[ PLAYWRIGHT ] Headless exploit simulation running",
  "[ TRACE ] DOM mutation detected · visual PoC captured",
  "[ AI ] CWE classified · remediation patch generated",
  "[ TICKET ] Assigned to developer · pending verification",
];

export function HeroSection() {
  const [glitchDone, setGlitchDone] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setGlitchDone(true), 400);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStatsVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="relative min-h-dvh overflow-hidden bg-veritas-bg">
      {/* Moving Earth background. Hidden on small screens to keep mobile fast. */}
      <div className="pointer-events-auto absolute inset-0 z-0 hidden cursor-grab opacity-80 active:cursor-grabbing md:block lg:opacity-95">
        <div className="absolute -left-[18%] top-1/2 h-[110vh] w-[110vw] -translate-y-1/2 lg:-left-[10%] lg:w-[78vw]">
          <HeroGlobe />
        </div>
      </div>

      {/* Readability overlays */}
      <div className="pointer-events-none absolute inset-0 z-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 28% 50%, rgba(0,136,255,0.18) 0%, transparent 48%), linear-gradient(90deg, rgba(5,11,20,0.12) 0%, rgba(5,11,20,0.45) 45%, rgba(5,11,20,0.92) 78%)",
          }}
        />
        <div className="absolute inset-0 grid-bg opacity-20" />
      </div>

      <div className="pointer-events-none relative z-20 mx-auto flex min-h-dvh max-w-7xl flex-col justify-center px-4 pb-24 pt-28 sm:px-6 lg:items-end lg:px-8 lg:pt-0">
        {/* Copy */}
        <div className="pointer-events-auto max-w-xl lg:w-[46%]">
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

          {/* Proof stats */}
          <div
            ref={statsRef}
            className="mt-12 border-t border-veritas-border-subtle/60 pt-8"
          >
            <div className="flex gap-8 sm:gap-12">
              <StatValue
                value="202"
                label="Async Scan Sessions"
                visible={statsVisible}
              />
              <StatValue
                value="3"
                label="AI Agent Loop"
                visible={statsVisible}
              />
              <StatValue
                value="1"
                label="Solo Or Team Flow"
                visible={statsVisible}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Threat intelligence overlay */}
      <div className="pointer-events-none absolute left-4 bottom-20 z-20 hidden w-[360px] rounded-xl border border-veritas-border-subtle/70 bg-veritas-bg/70 p-4 shadow-card backdrop-blur-md lg:block">
        <div className="flex items-center justify-between border-b border-veritas-border-subtle/60 pb-3">
          <div>
            <p className="font-label text-[10px] uppercase tracking-[0.18em] text-veritas-electric">
              Global Threat Map
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Real exploited CVEs mapped into scan context
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/40 bg-rose-500/10 px-2 py-1 font-label text-[9px] font-semibold uppercase tracking-wider text-rose-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute h-full w-full animate-ping rounded-full bg-rose-400/70" />
              <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            </span>
            Active
          </span>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3">
          <ThreatMetric value="8" label="Exploit Routes" tone="text-veritas-electric" />
          <ThreatMetric value="KEV" label="CISA Feed" tone="text-rose-300" />
          <ThreatMetric value="AI" label="Patch Draft" tone="text-orange-300" />
        </div>

        <div className="mt-4 space-y-2 border-t border-veritas-border-subtle/60 pt-3">
          <ThreatRow color="bg-rose-400" label="Red ring" value="known exploited CVE" />
          <ThreatRow color="bg-orange-400" label="Orange arc" value="simulated attack path" />
          <ThreatRow color="bg-veritas-electric" label="Blue node" value="your protected target" />
        </div>
      </div>

      {/* Ticker bar */}
      <div className="absolute bottom-0 left-0 right-0 z-30 border-t border-veritas-border-subtle/60 bg-veritas-bg/80 backdrop-blur-md">
        <div className="overflow-hidden py-3">
          <div className="flex animate-ticker gap-12 whitespace-nowrap">
            {[...THREAT_FEED, ...THREAT_FEED].map((item, i) => (
              <span
                key={i}
                className="font-label text-[11px] text-slate-500 tracking-wide"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ThreatMetric({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: string;
}) {
  return (
    <div className="rounded-lg border border-veritas-border-subtle/60 bg-veritas-surface/50 p-3">
      <p className={`font-display text-xl font-bold ${tone}`}>{value}</p>
      <p className="mt-1 font-label text-[9px] uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

function ThreatRow({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="flex items-center gap-2 text-slate-300">
        <span className={`h-2 w-2 rounded-full ${color}`} />
        {label}
      </span>
      <span className="font-mono text-[10px] text-slate-500">{value}</span>
    </div>
  );
}

function StatValue({
  value,
  label,
  visible,
}: {
  value: string;
  label: string;
  visible: boolean;
}) {
  const [count, setCount] = useState("0");
  const parsed = parseFloat(value.replace(/[^0-9.]/g, ""));
  const suffix = value.replace(/[0-9.]/g, "");

  useEffect(() => {
    if (!visible) return;
    const isLarge = value.includes("M");
    const target = isLarge ? 4.2 : parsed;
    let start = 0;
    const duration = 2000;
    const step = Math.max(target / 60, 1);
    const interval = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(value);
        clearInterval(interval);
      } else {
        setCount(
          (isLarge ? start.toFixed(1) : Math.floor(start).toString()) + suffix,
        );
      }
    }, duration / 60);
    return () => clearInterval(interval);
  }, [visible, parsed, suffix, value]);

  return (
    <div>
      <p className="font-label text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
        {visible ? count : "0"}
      </p>
      <p className="mt-1 font-label text-[10px] uppercase tracking-[0.15em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

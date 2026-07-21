'use client'

import { useState, useEffect, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const LOGOS = [
  "Solo Devs", "Startup Teams", "Security Leads", "Platform Engineers",
  "AppSec Teams", "Agencies", "Internal Tools", "Enterprise SOC",
];

const TESTIMONIALS = [
  {
    quote:
      "VERITAS gave our solo developers proof they could act on, while giving our lead engineer a clean queue to assign, verify, and close remediation work.",
    initials: "DK",
    name: "M. Rahman",
    role: "Lead Developer — SaaS Platform Team",
  },
  {
    quote:
      "We cut our security review cycle from two weeks to three days. The automated remediation patches alone saved us hundreds of engineering hours.",
    initials: "AL",
    name: "A. Lim",
    role: "Head of Engineering — Fintech Startup",
  },
  {
    quote:
      "The OWASP mapping and severity scoring finally let our non-security teammates understand risk in language they already knew. Game changer.",
    initials: "SR",
    name: "S. Rodriguez",
    role: "Security Lead — Enterprise Logistics",
  },
  {
    quote:
      "Integration was dead simple. Within an hour we had our first scan running and actionable tickets flowing into our sprint board.",
    initials: "JW",
    name: "J. Williams",
    role: "DevOps Engineer — E-commerce Platform",
  },
];

export function SocialProof() {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % TESTIMONIALS.length);
  }, []);

  const prev = useCallback(() => {
    setIndex((i) => (i - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  }, []);

  useEffect(() => {
    const id = setInterval(next, 30000);
    return () => clearInterval(id);
  }, [next]);

  const t = TESTIMONIALS[index];

  return (
    <section className="border-t border-veritas-border-subtle/60 px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        {/* Logo marquee */}
        <div className="overflow-hidden">
          <div className="flex animate-ticker gap-16 whitespace-nowrap">
            {[...LOGOS, ...LOGOS].map((name, i) => (
              <span
                key={i}
                className="inline-flex items-center font-label text-xs font-semibold uppercase tracking-[0.2em] text-slate-600 transition hover:text-slate-400"
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Testimonial carousel */}
        <div className="mt-16 mx-auto max-w-3xl relative">
          <div className="relative rounded-xl border border-veritas-border-subtle bg-[#01050a] p-8">
            {/* Terminal dots */}
            <div className="flex gap-1.5 mb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
            </div>

            <blockquote>
              <p className="font-mono text-sm leading-relaxed text-veritas-arc transition-opacity duration-500">
                &ldquo;{t.quote}&rdquo;
              </p>
            </blockquote>

            <div className="mt-6 flex items-center gap-3 border-t border-veritas-border-subtle/40 pt-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-veritas-electric/20 text-veritas-electric font-label text-xs font-bold">
                {t.initials}
              </div>
              <div>
                <p className="text-sm font-medium text-white">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role}</p>
              </div>
            </div>

            {/* Dots */}
            <div className="mt-5 flex items-center justify-center gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index
                      ? 'w-6 bg-veritas-electric'
                      : 'w-1.5 bg-slate-600 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Arrow buttons */}
          <button
            onClick={prev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 sm:-translate-x-12 flex h-10 w-10 items-center justify-center rounded-full border border-veritas-border-subtle bg-veritas-surface text-slate-400 transition hover:border-veritas-electric hover:text-veritas-electric"
            aria-label="Previous review"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 sm:translate-x-12 flex h-10 w-10 items-center justify-center rounded-full border border-veritas-border-subtle bg-veritas-surface text-slate-400 transition hover:border-veritas-electric hover:text-veritas-electric"
            aria-label="Next review"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}

const LOGOS = [
  "Solo Devs", "Startup Teams", "Security Leads", "Platform Engineers",
  "AppSec Teams", "Agencies", "Internal Tools", "Enterprise SOC",
];

export function SocialProof() {
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

        {/* Testimonial */}
        <div className="mt-16 mx-auto max-w-3xl">
          <div className="relative rounded-xl border border-veritas-border-subtle bg-[#01050a] p-8">
            {/* Terminal dots */}
            <div className="flex gap-1.5 mb-4">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
            </div>

            <blockquote>
              <p className="font-mono text-sm leading-relaxed text-veritas-arc">
                &ldquo;VERITAS gave our solo developers proof they could act on,
                while giving our lead engineer a clean queue to assign,
                verify, and close remediation work.&rdquo;
              </p>
            </blockquote>

            <div className="mt-6 flex items-center gap-3 border-t border-veritas-border-subtle/40 pt-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-veritas-electric/20 text-veritas-electric font-label text-xs font-bold">
                DK
              </div>
              <div>
                <p className="text-sm font-medium text-white">M. Rahman</p>
                <p className="text-xs text-slate-500">
                  Lead Developer — SaaS Platform Team
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

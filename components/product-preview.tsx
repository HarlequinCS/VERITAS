export function ProductPreview() {
  return (
    <section className="relative border-t border-veritas-border-subtle/60 bg-gradient-to-b from-veritas-bg via-veritas-surface/20 to-veritas-bg px-4 py-24 sm:px-6 lg:px-8 overflow-hidden">
      {/* Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[900px] max-w-full rounded-full bg-veritas-electric/5 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-5xl text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
          A command centre for solo builders and security teams.
        </h2>
        <p className="mt-4 text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
          Track scan sessions, exploit evidence, AI analysis, generated patches,
          and remediation tickets from one interface.
        </p>
      </div>

      {/* Mockup */}
      <div className="relative mx-auto mt-14 max-w-5xl perspective-[2000px]">
        <div
          className="group relative transition-transform duration-700 ease-out hover:rotateX(0deg) hover:rotateY(0deg)"
          style={{
            transform: "rotateX(5deg) rotateY(-3deg)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Main dashboard panel */}
          <div className="relative overflow-hidden rounded-xl border border-veritas-border-subtle bg-veritas-surface shadow-2xl shadow-black/60">
            {/* Terminal-style header */}
            <div className="flex items-center gap-2 border-b border-veritas-border-subtle/70 bg-veritas-elevated px-4 py-3">
              <div className="flex gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
              </div>
              <span className="ml-3 font-label text-[10px] uppercase tracking-wider text-slate-600">
                VERITAS Command Centre — Scan / Trace / Patch / Assign
              </span>
            </div>

            {/* Dashboard skeleton content */}
            <div className="p-5 sm:p-6">
              {/* Top bar skeleton */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-veritas-elevated ring-1 ring-veritas-border-subtle" />
                  <div>
                    <div className="h-3 w-28 rounded bg-veritas-elevated" />
                    <div className="mt-1.5 h-2 w-20 rounded bg-veritas-elevated/60" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-7 w-16 rounded bg-veritas-elevated" />
                  <div className="h-7 w-24 rounded-full bg-electric-mix/60" />
                </div>
              </div>

              {/* KPI row */}
              <div className="mb-6 grid grid-cols-4 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-veritas-border-subtle/50 bg-veritas-bg/50 p-3"
                  >
                    <div className="h-2 w-16 rounded bg-veritas-elevated/60" />
                    <div className="mt-2 h-6 w-12 rounded bg-veritas-elevated" />
                    <div className="mt-1.5 h-2 w-20 rounded bg-veritas-elevated/40" />
                  </div>
                ))}
              </div>

              {/* Chart row */}
              <div className="mb-6 grid grid-cols-3 gap-3">
                <div className="col-span-2 rounded-lg border border-veritas-border-subtle/50 bg-veritas-bg/50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="h-2 w-24 rounded bg-veritas-elevated/60" />
                    <div className="flex gap-1">
                      {["7D", "30D", "90D"].map((l) => (
                        <div
                          key={l}
                          className="h-5 w-8 rounded bg-veritas-elevated/40"
                        />
                      ))}
                    </div>
                  </div>
                  {/* Sparkline area */}
                  <div className="h-24 w-full rounded bg-gradient-to-t from-veritas-electric/10 to-transparent" />
                </div>
                <div className="rounded-lg border border-veritas-border-subtle/50 bg-veritas-bg/50 p-4 flex flex-col items-center justify-center">
                  <div className="h-16 w-16 rounded-full border-4 border-veritas-electric/30 border-t-veritas-electric" />
                  <div className="mt-2 h-2 w-16 rounded bg-veritas-elevated/60" />
                  <div className="mt-1 h-2 w-12 rounded bg-veritas-elevated/40" />
                </div>
              </div>

              {/* Table row */}
              <div className="rounded-lg border border-veritas-border-subtle/50 bg-veritas-bg/50">
                <div className="flex items-center gap-6 border-b border-veritas-border-subtle/50 px-4 py-2.5">
                  {["Target", "CVE", "Severity", "Status"].map((h) => (
                    <div
                      key={h}
                      className="h-2 w-16 rounded bg-veritas-elevated/60"
                    />
                  ))}
                </div>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-6 border-b border-veritas-border-subtle/30 px-4 py-3 last:border-0"
                  >
                    <div className="h-2 w-24 rounded bg-veritas-elevated/40" />
                    <div className="h-2 w-20 rounded bg-veritas-elevated/40" />
                    <div className="h-4 w-14 rounded-full bg-rose-500/20" />
                    <div className="h-4 w-16 rounded-full bg-veritas-electric/15" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// 12 weeks x 7 days heatmap with deterministic mock intensity
const WEEKS = 12;
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

function intensity(w: number, d: number) {
  // Pseudo-deterministic pattern that looks "scan-y"
  const v =
    (Math.sin(w * 1.7 + d * 0.6) + 1) / 2 +
    (w === WEEKS - 1 ? 0.3 : 0) +
    (d === 2 || d === 4 ? 0.15 : 0);
  return Math.min(1, Math.max(0, v));
}

function colorFor(v: number) {
  if (v < 0.15) return "rgba(148,163,184,0.10)";
  if (v < 0.35) return "rgba(34,211,238,0.18)";
  if (v < 0.55) return "rgba(34,211,238,0.40)";
  if (v < 0.75) return "rgba(245,158,11,0.55)";
  return "rgba(244,63,94,0.75)";
}

export function ThreatHeatmap() {
  return (
    <section className="glass flex flex-col rounded-2xl p-5 sm:p-6">
      <header className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-white">Threat heatmap</h3>
          <p className="text-[11px] text-slate-500">
            Severity intensity · last 12 weeks
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
          <span>Less</span>
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((v) => (
            <span
              key={v}
              className="h-2 w-3 rounded-sm"
              style={{ background: colorFor(v) }}
            />
          ))}
          <span>More</span>
        </div>
      </header>

      <div className="mt-5 flex gap-2">
        <div className="flex flex-col justify-between py-1 text-[10px] text-slate-600">
          {DAYS.map((d, i) => (
            <span key={i} className="h-3 leading-3">
              {i % 2 === 1 ? d : ""}
            </span>
          ))}
        </div>
        <div className="grid flex-1 grid-flow-col grid-rows-7 gap-1">
          {Array.from({ length: WEEKS }).flatMap((_, w) =>
            DAYS.map((_d, d) => {
              const v = intensity(w, d);
              return (
                <span
                  key={`${w}-${d}`}
                  title={`Week ${w + 1} · ${DAYS[d]} · intensity ${(v * 10).toFixed(1)}`}
                  className="h-3 rounded-sm transition hover:scale-110"
                  style={{ background: colorFor(v) }}
                />
              );
            }),
          )}
        </div>
      </div>

      <footer className="mt-5 grid grid-cols-3 gap-3 border-t border-veritas-border-subtle/70 pt-4">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Peak day</p>
          <p className="mt-1 text-xs font-semibold text-white">Tue · Wk 11</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Avg/day</p>
          <p className="mt-1 text-xs font-semibold text-white">7.2 events</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500">Trend</p>
          <p className="mt-1 text-xs font-semibold text-emerald-300">−12% w/w</p>
        </div>
      </footer>
    </section>
  );
}

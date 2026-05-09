const AGENTS = [
  {
    name: "Triage Agent",
    model: "veritas-triage-v3",
    health: 99,
    queue: 0,
    tps: 142,
    state: "Healthy",
  },
  {
    name: "Exploit Agent",
    model: "veritas-exploit-v2",
    health: 96,
    queue: 4,
    tps: 88,
    state: "Active",
  },
  {
    name: "Playwright Runner",
    model: "chromium-headless",
    health: 92,
    queue: 1,
    tps: 24,
    state: "Active",
  },
  {
    name: "Analyst Agent",
    model: "veritas-analyst-v4",
    health: 98,
    queue: 2,
    tps: 312,
    state: "Healthy",
  },
] as const;

function stateClass(s: string) {
  if (s === "Active") return "text-cyan-300 bg-cyan-400/10 border-cyan-400/30";
  if (s === "Healthy")
    return "text-emerald-300 bg-emerald-400/10 border-emerald-400/30";
  return "text-amber-300 bg-amber-400/10 border-amber-400/30";
}

export function AgentStatusGrid() {
  return (
    <section className="glass rounded-2xl p-5">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Agent fleet</h3>
          <p className="text-[11px] text-slate-500">4 active · region us-east-1</p>
        </div>
        <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-300">
          All nominal
        </span>
      </header>

      <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {AGENTS.map((a) => (
          <li
            key={a.name}
            className="rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 p-3 transition hover:border-cyan-400/30"
          >
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold text-white">{a.name}</p>
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${stateClass(
                  a.state,
                )}`}
              >
                {a.state === "Active" && (
                  <span className="relative flex h-1 w-1">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400/60" />
                    <span className="relative inline-flex h-1 w-1 rounded-full bg-cyan-400" />
                  </span>
                )}
                {a.state}
              </span>
            </div>
            <p className="mt-0.5 font-mono text-[10px] text-slate-500">{a.model}</p>

            <div className="mt-3 grid grid-cols-3 gap-2 text-[10px]">
              <div>
                <p className="text-slate-500">Health</p>
                <p className="mt-0.5 font-mono font-semibold text-white">{a.health}%</p>
              </div>
              <div>
                <p className="text-slate-500">Queue</p>
                <p className="mt-0.5 font-mono font-semibold text-white">{a.queue}</p>
              </div>
              <div>
                <p className="text-slate-500">TPS</p>
                <p className="mt-0.5 font-mono font-semibold text-white">{a.tps}</p>
              </div>
            </div>

            <div className="mt-3 h-1 overflow-hidden rounded-full bg-veritas-border-subtle">
              <div
                className="h-full rounded-full bg-neon-mix"
                style={{ width: `${a.health}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

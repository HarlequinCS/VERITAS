const TRACES = [
  { method: "GET", path: "/admin/users", status: 200, ms: 78 },
  { method: "POST", path: "/api/v2/login", status: 200, ms: 132 },
  { method: "GET", path: "/admin/audit", status: 200, ms: 94 },
  { method: "POST", path: "/api/v2/promote", status: 201, ms: 132 },
  { method: "GET", path: "/api/v2/users/42", status: 403, ms: 41 },
  { method: "DELETE", path: "/api/v2/sessions", status: 401, ms: 22 },
  { method: "GET", path: "/admin/users?role=admin", status: 200, ms: 88 },
  { method: "PATCH", path: "/api/v2/users/42", status: 500, ms: 612 },
] as const;

function methodClass(m: string) {
  switch (m) {
    case "GET":
      return "bg-cyan-400/10 text-cyan-300 ring-cyan-400/30";
    case "POST":
      return "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30";
    case "PUT":
    case "PATCH":
      return "bg-amber-400/10 text-amber-300 ring-amber-400/30";
    case "DELETE":
      return "bg-rose-400/10 text-rose-300 ring-rose-400/30";
    default:
      return "bg-slate-400/10 text-slate-300 ring-slate-400/30";
  }
}
function statusClass(s: number) {
  if (s >= 500) return "text-rose-300";
  if (s >= 400) return "text-amber-300";
  if (s >= 300) return "text-cyan-300";
  return "text-emerald-300";
}

export function HttpTraceFeed() {
  return (
    <section className="glass flex flex-col overflow-hidden rounded-2xl">
      <header className="flex items-center justify-between border-b border-veritas-border-subtle/70 px-4 py-3">
        <div>
          <h3 className="text-xs font-semibold text-white">HTTP trace</h3>
          <p className="text-[10px] text-slate-500">last 8 requests · live</p>
        </div>
        <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 ring-1 ring-cyan-400/30">
          live
        </span>
      </header>
      <ul className="max-h-[260px] divide-y divide-veritas-border-subtle/50 overflow-y-auto scrollbar-thin">
        {TRACES.map((t, i) => (
          <li
            key={i}
            className="flex items-center gap-2 px-4 py-2 transition hover:bg-veritas-surface/40"
          >
            <span
              className={`inline-flex h-5 items-center rounded px-1.5 font-mono text-[10px] font-semibold ring-1 ${methodClass(
                t.method,
              )}`}
            >
              {t.method}
            </span>
            <span className="flex-1 truncate font-mono text-[11px] text-slate-300">
              {t.path}
            </span>
            <span className={`font-mono text-[11px] ${statusClass(t.status)}`}>
              {t.status}
            </span>
            <span className="w-12 text-right font-mono text-[10px] text-slate-500">
              {t.ms}ms
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

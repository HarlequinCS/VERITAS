import { Check, Loader2 } from "lucide-react";

export type Phase = {
  id: number;
  name: string;
  status: "done" | "active" | "pending";
  progress?: number;
};

export function PhaseTracker({ phases }: { phases: Phase[] }) {
  return (
    <ol className="flex items-stretch gap-2 overflow-x-auto pb-1 scrollbar-thin">
      {phases.map((p, i) => {
        const isLast = i === phases.length - 1;
        return (
          <li
            key={p.id}
            className={`relative flex min-w-[200px] flex-1 items-center gap-3 rounded-xl border p-3 ${
              p.status === "active"
                ? "border-cyan-400/40 bg-cyan-400/5 shadow-glow-cyan"
                : p.status === "done"
                  ? "border-emerald-400/30 bg-emerald-400/5"
                  : "border-veritas-border-subtle bg-veritas-surface/30"
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                p.status === "done"
                  ? "bg-emerald-400/20 text-emerald-300 ring-1 ring-emerald-400/40"
                  : p.status === "active"
                    ? "bg-cyan-400/20 text-cyan-300 ring-1 ring-cyan-400/40"
                    : "bg-veritas-surface text-slate-500 ring-1 ring-veritas-border-strong"
              }`}
            >
              {p.status === "done" ? (
                <Check className="h-4 w-4" />
              ) : p.status === "active" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span className="font-mono text-xs">{p.id}</span>
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white">{p.name}</p>
              <p className="text-[11px] text-slate-500">
                {p.status === "done"
                  ? "Completed"
                  : p.status === "active"
                    ? `In progress · ${p.progress ?? 0}%`
                    : "Queued"}
              </p>
              {p.status === "active" && (
                <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-veritas-border-subtle">
                  <div
                    className="h-full rounded-full bg-neon-mix transition-all duration-700"
                    style={{ width: `${p.progress ?? 0}%` }}
                  />
                </div>
              )}
            </div>
            {!isLast && (
              <span
                aria-hidden
                className="absolute right-[-10px] top-1/2 hidden h-px w-3 -translate-y-1/2 bg-veritas-border-subtle md:block"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

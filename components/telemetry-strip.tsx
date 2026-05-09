import { Cpu, HardDrive, Wifi } from "lucide-react";

function Ring({
  pct,
  label,
  value,
  color,
  Icon,
}: {
  pct: number;
  label: string;
  value: string;
  color: string;
  Icon: typeof Cpu;
}) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const dash = c * (1 - pct / 100);
  return (
    <div className="flex items-center gap-3 rounded-xl border border-veritas-border-subtle bg-veritas-surface/40 p-3">
      <div className="relative h-12 w-12">
        <svg viewBox="0 0 56 56" className="h-full w-full -rotate-90">
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke="rgba(148,163,184,0.10)"
            strokeWidth="5"
          />
          <circle
            cx="28"
            cy="28"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={dash}
            className="transition-[stroke-dashoffset] duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <Icon className="h-3.5 w-3.5" style={{ color }} />
        </div>
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
        <p className="font-mono text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}

export function TelemetryStrip() {
  return (
    <section className="glass rounded-2xl p-4">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-xs font-semibold text-white">System telemetry</h3>
          <p className="text-[10px] text-slate-500">runner-7a · us-east-1</p>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        <Ring pct={38} label="CPU" value="38%" color="#22d3ee" Icon={Cpu} />
        <Ring pct={62} label="Memory" value="1.2 GB" color="#8b5cf6" Icon={HardDrive} />
        <Ring pct={28} label="Network" value="14 Mbps" color="#10b981" Icon={Wifi} />
      </div>
    </section>
  );
}

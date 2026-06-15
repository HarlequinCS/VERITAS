import { Camera, Crosshair } from "lucide-react";
import Image from "next/image";

const ICON_SRC = "https://saifuliqbal.dev/veritasicon.png";

export function PoCViewer() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-veritas-border-subtle bg-veritas-bg/60">
      <div className="flex items-center justify-between gap-2 border-b border-veritas-border-subtle bg-veritas-surface/50 px-3 py-2">
        <div className="flex min-w-0 items-center gap-2">
          <div className="flex gap-1">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-rose-400/80" />
          </div>
          <div className="ml-1 flex min-w-0 flex-1 items-center gap-1.5 rounded-md border border-veritas-border-subtle bg-veritas-bg/60 px-2 py-1">
            <Crosshair className="h-3 w-3 shrink-0 text-veritas-electric" />
            <span className="truncate font-mono text-[10.5px] text-veritas-arc/90">
              https://app.acme.io/admin/users
            </span>
          </div>
        </div>
        <span className="rounded-full border border-veritas-electric/30 bg-veritas-electric/10 px-2 py-0.5 text-[10px] font-semibold text-veritas-electric">
          frame_004
        </span>
      </div>

      <div className="relative min-h-[300px] flex-1 overflow-hidden bg-[#020617] p-6">
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(34,211,238,0.15),transparent_60%)]"
        />
        {/* Mocked admin UI inside captured frame */}
        <div className="relative mx-auto max-w-md space-y-3 rounded-xl border border-veritas-electric/20 bg-veritas-surface/60 p-4 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="h-2 w-32 rounded-full bg-veritas-elevated" />
            <span className="ml-auto h-6 w-16 rounded-md bg-veritas-border-strong" />
          </div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-lg border border-veritas-border-subtle bg-veritas-bg/40 p-2.5"
              >
                <span className="h-7 w-7 rounded-full bg-veritas-elevated/60" />
                <div className="flex-1 space-y-1">
                  <span className="block h-2 w-3/5 rounded bg-veritas-border-strong" />
                  <span className="block h-2 w-2/5 rounded bg-veritas-border-subtle" />
                </div>
                <span className="rounded-md bg-rose-500/15 px-2 py-0.5 text-[9px] font-semibold text-rose-300 ring-1 ring-rose-400/30">
                  admin
                </span>
              </div>
            ))}
          </div>
          {/* Highlighted exploited element */}
          <div className="absolute inset-x-2 top-[68%] rounded-lg border-2 border-rose-400/60 ring-2 ring-rose-400/30 animate-pulse-neon" />
        </div>

        <div className="relative mt-6 flex flex-wrap items-center justify-center gap-2 rounded-full border border-veritas-electric/30 bg-veritas-surface/60 px-4 py-2 text-[11px] text-veritas-arc">
          <Image src={ICON_SRC} alt="" width={16} height={16} className="opacity-90" />
          <Camera className="h-3 w-3" />
          <span>Captured evidence · 1280×720 · 1.2 MB</span>
        </div>
      </div>

      {/* Frames strip */}
      <div className="flex gap-2 border-t border-veritas-border-subtle bg-veritas-surface/30 p-2">
        {[1, 2, 3, 4].map((i) => (
          <a
            key={i}
            href={`/vulnerabilities/cwe-285#frame-${i}`}
            className={`relative h-12 w-20 shrink-0 overflow-hidden rounded-md border ${
              i === 4
                ? "border-veritas-electric/50 ring-1 ring-veritas-electric/30"
                : "border-veritas-border-subtle hover:border-veritas-electric/30"
            }`}
          >
            <span className="absolute inset-0 bg-gradient-to-br from-veritas-elevated/60 to-veritas-bg" />
            <span className="absolute bottom-0.5 left-1 font-mono text-[8px] text-slate-400">
              frame_{i.toString().padStart(3, "0")}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

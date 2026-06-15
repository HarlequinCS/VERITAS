import {
  AlertTriangle,
  CheckCircle2,
  GitPullRequest,
  ShieldAlert,
  Sparkles,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Activity = {
  id: string;
  agent: string;
  action: string;
  target: string;
  time: string;
  icon: LucideIcon;
  tone: "info" | "warn" | "danger" | "ai" | "success";
};

const ITEMS: Activity[] = [
  {
    id: "1",
    agent: "exploit-agent",
    action: "verified bypass on",
    target: "/admin/users",
    time: "12s ago",
    icon: ShieldAlert,
    tone: "danger",
  },
  {
    id: "2",
    agent: "analyst-agent",
    action: "drafted patch for",
    target: "CWE-285",
    time: "45s ago",
    icon: Sparkles,
    tone: "ai",
  },
  {
    id: "3",
    agent: "playwright",
    action: "captured frame on",
    target: "billing.acme.io",
    time: "1m ago",
    icon: Zap,
    tone: "info",
  },
  {
    id: "4",
    agent: "triage-agent",
    action: "mapped 248 routes on",
    target: "app.acme.io",
    time: "3m ago",
    icon: CheckCircle2,
    tone: "success",
  },
  {
    id: "5",
    agent: "platform",
    action: "rotated runner pool",
    target: "us-east-1",
    time: "9m ago",
    icon: AlertTriangle,
    tone: "warn",
  },
  {
    id: "6",
    agent: "patch-agent",
    action: "opened PR #2419 on",
    target: "acme/web",
    time: "14m ago",
    icon: GitPullRequest,
    tone: "ai",
  },
];

const TONE: Record<Activity["tone"], string> = {
  info: "text-veritas-electric bg-veritas-electric/10 ring-veritas-electric/30",
  warn: "text-amber-300 bg-amber-400/10 ring-amber-400/30",
  danger: "text-rose-300 bg-rose-400/10 ring-rose-400/30",
  ai: "text-veritas-arc bg-veritas-arc/10 ring-veritas-arc/30",
  success: "text-emerald-300 bg-emerald-400/10 ring-emerald-400/30",
};

export function LiveActivityRail() {
  return (
    <section className="glass flex flex-col overflow-hidden rounded-2xl">
      <header className="flex items-center justify-between gap-2 border-b border-veritas-border-subtle/70 px-5 py-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Real-time activity</h3>
          <p className="text-[11px] text-slate-500">Streaming · all agents</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-veritas-electric">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-veritas-electric/60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-veritas-electric" />
          </span>
          Live
        </span>
      </header>

      <ul className="max-h-[420px] overflow-y-auto px-2 py-2 scrollbar-thin">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          return (
            <li
              key={it.id}
              className="group relative flex gap-3 rounded-lg px-3 py-2.5 transition hover:bg-veritas-surface/60 animate-stream-in"
            >
              <span
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md ring-1 ${TONE[it.tone]}`}
              >
                <Icon className="h-3.5 w-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-slate-300">
                  <span className="font-mono text-veritas-electric/80">{it.agent}</span>{" "}
                  <span className="text-slate-400">{it.action}</span>{" "}
                  <span className="font-mono text-white">{it.target}</span>
                </p>
                <p className="mt-0.5 text-[10px] text-slate-500">{it.time}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

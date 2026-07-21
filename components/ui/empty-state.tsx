import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-veritas-border-subtle/60 bg-veritas-surface/20 px-6 py-12 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-veritas-electric/10 ring-1 ring-veritas-electric/20">
        <Icon className="h-5 w-5 text-veritas-electric" />
      </div>
      <h3 className="mt-4 text-sm font-semibold text-white">{title}</h3>
      <p className="mt-1 max-w-xs text-xs leading-relaxed text-slate-500">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="mt-4 rounded-lg bg-electric-mix px-3.5 py-2 text-xs font-semibold text-veritas-bg shadow-glow-electric transition hover:brightness-110"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}

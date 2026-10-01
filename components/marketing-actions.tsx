import Link from "next/link";

const primaryClass =
  "inline-flex h-11 items-center justify-center rounded-lg bg-electric-mix px-5 text-sm font-semibold text-veritas-bg transition hover:brightness-110";
const secondaryClass =
  "inline-flex h-11 items-center justify-center rounded-lg border border-veritas-border-subtle px-5 text-sm font-medium text-slate-200 transition hover:border-veritas-electric/40 hover:text-white";

export function MarketingActions({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="mt-8 flex flex-wrap gap-3">
      <Link href={primaryHref} className={primaryClass}>
        {primaryLabel}
      </Link>
      {secondaryHref && secondaryLabel ? (
        <Link href={secondaryHref} className={secondaryClass}>
          {secondaryLabel}
        </Link>
      ) : null}
    </div>
  );
}

import { ArrowLeft, FileDown } from "lucide-react";
import Link from "next/link";

export function ReportTopBar() {
  return (
    <div className="border-b border-neutral-800/80 bg-neutral-950/80">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/dashboard"
          className="inline-flex min-w-0 items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm text-neutral-300 transition hover:border-neutral-800 hover:bg-neutral-900 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4 shrink-0" aria-hidden />
          <span className="truncate">Back to Dashboard</span>
        </Link>
        <Link
          href="/reports"
          className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-white outline-none ring-offset-2 ring-offset-neutral-950 transition hover:border-neutral-500 hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-neutral-500"
        >
          <FileDown className="h-4 w-4" aria-hidden />
          Export PDF
        </Link>
      </div>
    </div>
  );
}

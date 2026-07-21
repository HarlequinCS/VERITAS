import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      {/* Header */}
      <div className="mb-6 space-y-2">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* KPI row */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-veritas-border-subtle bg-[#01050a] p-5"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
            <Skeleton className="mt-3 h-7 w-16" />
            <Skeleton className="mt-2 h-2 w-24" />
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-xl border border-veritas-border-subtle bg-[#01050a] p-6">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="mt-4 h-48 w-full" />
        </div>
        <div className="rounded-xl border border-veritas-border-subtle bg-[#01050a] p-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-4 h-48 w-full" />
        </div>
      </div>

      {/* Table + side rail */}
      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 rounded-xl border border-veritas-border-subtle bg-[#01050a] p-6">
          <Skeleton className="h-4 w-32" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-veritas-border-subtle bg-[#01050a] p-6">
          <Skeleton className="h-4 w-24" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}

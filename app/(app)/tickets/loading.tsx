import { Skeleton } from "@/components/ui/skeleton";

export default function TicketsLoading() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Skeleton className="h-3 w-32" />
      <Skeleton className="mt-2 h-8 w-64" />
      <div className="mt-8 space-y-1 rounded-2xl border border-veritas-border-subtle bg-[#01050a] p-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>
    </main>
  );
}

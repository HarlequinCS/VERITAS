import { Skeleton } from "@/components/ui/skeleton";

export default function ReportsLoading() {
  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
      <Skeleton className="h-3 w-28" />
      <Skeleton className="mt-2 h-8 w-72" />
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-96 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
        <Skeleton className="h-96 w-full rounded-2xl" />
      </div>
    </main>
  );
}

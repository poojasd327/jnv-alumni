import { Skeleton } from "@/components/ui/skeleton"

export default function DirectoryLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      {/* Search bar */}
      <Skeleton className="h-10 w-full" />

      {/* Filters */}
      <Skeleton className="h-32 w-full rounded-lg" />

      {/* Alumni grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-56 rounded-xl" />
        ))}
      </div>
    </div>
  )
}

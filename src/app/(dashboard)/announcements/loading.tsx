import { Skeleton } from "@/components/ui/skeleton"

export default function AnnouncementsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-44" />
          <Skeleton className="h-4 w-52" />
        </div>
        <Skeleton className="h-9 w-40" />
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-8 w-24" />)}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-lg" />)}
      </div>
    </div>
  )
}

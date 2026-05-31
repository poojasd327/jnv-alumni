import { Users } from "lucide-react"
import { AlumniCard } from "@/components/directory/alumni-card"
import type { Profile } from "@/lib/types/database.types"

interface AlumniGridProps {
  alumni: Profile[]
}

export function AlumniGrid({ alumni }: AlumniGridProps) {
  if (alumni.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed py-16">
        <Users className="size-10 text-muted-foreground" />
        <div className="text-center">
          <h3 className="font-semibold">No alumni found</h3>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or filters.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {alumni.map((person) => (
        <AlumniCard key={person.id} alumni={person} />
      ))}
    </div>
  )
}

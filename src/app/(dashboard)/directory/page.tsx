export const metadata = { title: "Alumni Directory", description: "Search and connect with JNV alumni across India." }

import { Users } from "lucide-react"
import { Pagination } from "@/components/shared/pagination"
import { DirectorySearch } from "@/components/directory/directory-search"
import { DirectoryFilters } from "@/components/directory/directory-filters"
import { AlumniGrid } from "@/components/directory/alumni-grid"
import { searchAlumni } from "@/lib/actions/directory.actions"

const PAGE_SIZE = 12

export default async function DirectoryPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  // Normalize searchParams values to strings
  const q = typeof params.q === "string" ? params.q : undefined
  const batch = typeof params.batch === "string" ? params.batch : undefined
  const city = typeof params.city === "string" ? params.city : undefined
  const skill = typeof params.skill === "string" ? params.skill : undefined
  const industry =
    typeof params.industry === "string" ? params.industry : undefined
  const jnv_state =
    typeof params.jnv_state === "string" ? params.jnv_state : undefined
  const page = typeof params.page === "string" ? params.page : "1"

  const currentPage = Math.max(1, parseInt(page, 10))

  const { alumni, count } = await searchAlumni({
    q,
    batch,
    city,
    skill,
    industry,
    jnv_state,
    page: currentPage.toString(),
  })

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Users className="size-6 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Alumni Directory
          </h1>
          <p className="text-sm text-muted-foreground">
            {count} alumni found
          </p>
        </div>
      </div>

      {/* Search */}
      <DirectorySearch />

      {/* Filters */}
      <DirectoryFilters />

      {/* Results Grid */}
      <AlumniGrid alumni={alumni} />

      {/* Pagination */}
      {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} />}
    </div>
  )
}

import Link from "next/link"
import { ChevronLeft, ChevronRight, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
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
  const page = typeof params.page === "string" ? params.page : "1"

  const currentPage = Math.max(1, parseInt(page, 10))

  const { alumni, count } = await searchAlumni({
    q,
    batch,
    city,
    skill,
    industry,
    page: currentPage.toString(),
  })

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))

  // Build pagination href preserving current filters
  function buildPageHref(targetPage: number): string {
    const sp = new URLSearchParams()
    if (q) sp.set("q", q)
    if (batch) sp.set("batch", batch)
    if (city) sp.set("city", city)
    if (skill) sp.set("skill", skill)
    if (industry) sp.set("industry", industry)
    if (targetPage > 1) sp.set("page", targetPage.toString())
    const qs = sp.toString()
    return qs ? `/directory?${qs}` : "/directory"
  }

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
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {currentPage > 1 ? (
            <Button
              variant="outline"
              size="sm"
              render={<Link href={buildPageHref(currentPage - 1)} />}
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="size-4" />
              Previous
            </Button>
          )}

          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>

          {currentPage < totalPages ? (
            <Button
              variant="outline"
              size="sm"
              render={<Link href={buildPageHref(currentPage + 1)} />}
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              Next
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

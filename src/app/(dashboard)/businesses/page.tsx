import { getBusinesses } from "@/lib/actions/businesses.actions"
import { BUSINESS_CATEGORIES } from "@/lib/constants"
import { BusinessCard } from "@/components/businesses/business-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Plus, Building2, Search } from "lucide-react"

export default async function BusinessesPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams
  const { businesses, count } = await getBusinesses(params)
  const pageSize = 12
  const currentPage = Number(params.page) || 1
  const totalPages = Math.ceil(count / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Business Directory</h1>
          <p className="text-sm text-muted-foreground mt-1">Discover alumni businesses</p>
        </div>
        <Button className="w-full sm:w-auto" render={<Link href="/businesses/new" />}><Plus className="size-4 mr-1" />List Business</Button>
      </div>

      <form className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input name="q" placeholder="Search businesses..." defaultValue={params.q} className="pl-9" /></div>
        <Button type="submit" variant="outline">Search</Button>
      </form>

      <div className="flex gap-2 flex-wrap">
        <Button variant={!params.category ? "default" : "outline"} size="sm" render={<Link href="/businesses" />}>All</Button>
        {BUSINESS_CATEGORIES.slice(0, 6).map((c) => (
          <Button key={c} variant={params.category === c ? "default" : "outline"} size="sm" render={<Link href={`/businesses?category=${c}`} />}>{c}</Button>
        ))}
      </div>

      {businesses.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Building2 className="size-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No businesses found</h3>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{businesses.map((b: Record<string, unknown>) => <BusinessCard key={b.id as string} business={b as never} />)}</div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {currentPage > 1 && <Button variant="outline" size="sm" render={<Link href={`/businesses?page=${currentPage - 1}`} />}>Previous</Button>}
              <span className="flex items-center text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
              {currentPage < totalPages && <Button variant="outline" size="sm" render={<Link href={`/businesses?page=${currentPage + 1}`} />}>Next</Button>}
            </div>
          )}
        </>
      )}
    </div>
  )
}

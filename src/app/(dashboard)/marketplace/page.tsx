import { createClient } from "@/lib/supabase/server"
import { getListings, getCategories } from "@/lib/actions/marketplace.actions"
import { getWishlistedIds } from "@/lib/actions/wishlist.actions"
import { ListingGrid } from "@/components/marketplace/listing-grid"
import { CategoryNav } from "@/components/marketplace/category-nav"
import { MarketplaceSearch } from "@/components/marketplace/marketplace-search"
import { MarketplaceFilters } from "@/components/marketplace/marketplace-filters"
import { Button } from "@/components/ui/button"
import { Plus, ShoppingBag } from "lucide-react"
import Link from "next/link"

export const metadata = { title: "Marketplace", description: "Buy and sell items within the trusted JNV alumni community." }

export default async function MarketplacePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams

  const normalizedParams: Record<string, string> = {}
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") normalizedParams[key] = value
    else if (Array.isArray(value) && value[0]) normalizedParams[key] = value[0]
  }

  const [categories, { listings, count }, wishlistedIds] = await Promise.all([
    getCategories(),
    getListings(normalizedParams),
    getWishlistedIds(),
  ])

  const totalPages = Math.ceil((count || 0) / 12)
  const currentPage = Number(normalizedParams.page) || 1

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Marketplace</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Buy and sell within the JNV community
          </p>
        </div>
        <Button className="w-full sm:w-auto" render={<Link href="/marketplace/new" />}>
            <Plus className="h-4 w-4 mr-2" />
            Sell Item
        </Button>
      </div>

      <CategoryNav categories={categories} />

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <MarketplaceSearch />
        </div>
      </div>

      <MarketplaceFilters />

      {listings.length > 0 ? (
        <>
          <p className="text-sm text-muted-foreground">{count} listings found</p>
          <ListingGrid listings={listings} wishlistedIds={wishlistedIds} />
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Link
                  key={page}
                  href={`/marketplace?${new URLSearchParams({ ...normalizedParams, page: String(page) }).toString()}`}
                >
                  <Button variant={page === currentPage ? "default" : "outline"} size="sm">
                    {page}
                  </Button>
                </Link>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-8 sm:py-12">
          <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No listings found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your filters or be the first to sell something!
          </p>
          <Button className="mt-4" render={<Link href="/marketplace/new" />}>Create Listing</Button>
        </div>
      )}
    </div>
  )
}

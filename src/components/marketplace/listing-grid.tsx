import { ListingCard } from "./listing-card"

interface ListingGridProps {
  listings: Array<{
    id: string
    title: string
    price: number
    price_negotiable: boolean
    location_city: string
    location_state: string
    images: string[]
    condition: string
    status: string
    created_at: string
    marketplace_categories?: { name: string; slug: string } | null
  }>
  wishlistedIds?: string[]
}

export function ListingGrid({ listings, wishlistedIds = [] }: ListingGridProps) {
  if (listings.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {listings.map((listing) => (
        <ListingCard
          key={listing.id}
          listing={listing}
          isWishlisted={wishlistedIds.includes(listing.id)}
        />
      ))}
    </div>
  )
}

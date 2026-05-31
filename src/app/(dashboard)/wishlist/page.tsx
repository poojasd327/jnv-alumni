import { createClient } from "@/lib/supabase/server"
import { ListingCard } from "@/components/marketplace/listing-card"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { MarketplaceListing } from "@/lib/types/database.types"

export const metadata = { title: "Wishlist" }

type WishlistItem = {
  id: string
  listing_id: string
  created_at: string
  marketplace_listings: MarketplaceListing & {
    marketplace_categories?: { name: string; slug: string } | null
  }
}

export default async function WishlistPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data } = user
    ? await supabase
        .from("wishlists")
        .select("*, marketplace_listings(*, marketplace_categories(name, slug))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: null }

  const wishlistItems = (data || []) as unknown as WishlistItem[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Wishlist</h1>
        <p className="text-muted-foreground text-sm mt-1">Items you've saved for later</p>
      </div>

      {wishlistItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistItems.map((item) => {
            const listing = item.marketplace_listings
            if (!listing) return null
            return (
              <ListingCard
                key={item.id}
                listing={listing}
                isWishlisted={true}
              />
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Heart className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Your wishlist is empty</h3>
          <p className="text-muted-foreground mt-1">
            Browse the marketplace and save items you're interested in
          </p>
          <Button className="mt-4" render={<Link href="/marketplace" />}>Browse Marketplace</Button>
        </div>
      )}
    </div>
  )
}

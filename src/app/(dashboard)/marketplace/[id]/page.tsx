import { createClient } from "@/lib/supabase/server"
import { getWishlistedIds } from "@/lib/actions/wishlist.actions"
import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WishlistButton } from "@/components/marketplace/wishlist-button"
import { ContactSeller } from "@/components/marketplace/contact-seller"
import { PriceDisplay } from "@/components/marketplace/price-display"
import { ListingStatusBadge } from "@/components/marketplace/listing-status-badge"
import { MarkAsSoldButton } from "@/components/marketplace/mark-as-sold-button"
import { formatDate, getInitials } from "@/lib/utils"
import { ArrowLeft, MapPin, Calendar, Eye, Pencil, ImageIcon } from "lucide-react"
import type { MarketplaceListing } from "@/lib/types/database.types"

const conditionLabels: Record<string, string> = {
  new: "Brand New",
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
}

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabaseForListing = await createClient()
  const { data: listingData } = await supabaseForListing
    .from("marketplace_listings")
    .select("*, marketplace_categories(name, slug), marketplace_subcategories(name, slug)")
    .eq("id", id)
    .single()

  if (!listingData) notFound()

  const listing = listingData as MarketplaceListing & {
    marketplace_categories?: { name: string; slug: string } | null
    marketplace_subcategories?: { name: string; slug: string } | null
  }

  const supabase = supabaseForListing
  const { data: { user } } = await supabase.auth.getUser()

  const isOwner = user?.id === listing.seller_id

  // Get seller profile for contact info
  const { data: sellerData } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, mobile, whatsapp_number, created_at")
    .eq("id", listing.seller_id)
    .single()

  const seller = sellerData as { id: string; full_name: string; avatar_url: string | null; mobile: string; whatsapp_number: string | null; created_at: string } | null

  const wishlistedIds = await getWishlistedIds()
  const isWishlisted = wishlistedIds.includes(listing.id)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="ghost" size="sm" render={<Link href="/marketplace" />}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images */}
        <div className="lg:col-span-2 space-y-4">
          {listing.images.length > 0 ? (
            <div className="space-y-2">
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden border bg-muted">
                <Image
                  src={listing.images[0]}
                  alt={listing.title}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                />
                {listing.status === "sold" && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="text-white font-bold text-2xl">SOLD</span>
                  </div>
                )}
              </div>
              {listing.images.length > 1 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {listing.images.slice(1).map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-md overflow-hidden border">
                      <Image src={img} alt={`Image ${i + 2}`} fill className="object-cover" sizes="150px" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="aspect-[16/10] rounded-lg border bg-muted flex items-center justify-center">
              <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
            </div>
          )}

          {/* Details */}
          <div className="space-y-4">
            <div>
              <div className="flex items-start justify-between gap-2">
                <h1 className="text-2xl font-bold">{listing.title}</h1>
                <WishlistButton listingId={listing.id} initialWishlisted={isWishlisted} />
              </div>
              <PriceDisplay price={listing.price} negotiable={listing.price_negotiable} size="lg" />
            </div>

            <div className="flex flex-wrap gap-2">
              <ListingStatusBadge status={listing.status} />
              {listing.marketplace_categories && (
                <Badge variant="secondary">
                  {listing.marketplace_categories.name}
                </Badge>
              )}
              <Badge variant="outline">{conditionLabels[listing.condition] || listing.condition}</Badge>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {listing.location_city}, {listing.location_state}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(listing.created_at)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {listing.view_count} views
              </span>
            </div>

            <div>
              <h2 className="font-semibold mb-2">Description</h2>
              <p className="text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Seller Card */}
          {seller && (
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={seller.avatar_url || undefined} />
                    <AvatarFallback>{getInitials(seller.full_name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link href={`/directory/${seller.id}`} className="font-medium hover:underline">
                      {seller.full_name}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      Member since {formatDate(seller.created_at)}
                    </p>
                  </div>
                </div>
                {!isOwner && listing.status !== "sold" && (
                  <ContactSeller seller={seller} />
                )}
                {!isOwner && listing.status === "sold" && (
                  <p className="text-sm text-muted-foreground text-center">This item has been sold</p>
                )}
                {isOwner && (
                  <>
                    <Button variant="outline" className="w-full" render={<Link href={`/marketplace/${listing.id}/edit`} />}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Listing
                    </Button>
                    {listing.status === "active" && (
                      <MarkAsSoldButton listingId={listing.id} />
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

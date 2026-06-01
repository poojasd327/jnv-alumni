import type { Metadata } from "next"
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
import { ShareButton } from "@/components/ui/share-button"
import { ReportButton } from "@/components/ui/report-button"
import { formatDate, getInitials } from "@/lib/utils"
import { MapPin, Calendar, Eye, Pencil } from "lucide-react"
import type { MarketplaceListing } from "@/lib/types/database.types"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { ImageGallery } from "@/components/marketplace/image-gallery"
import { JsonLd } from "@/components/shared/json-ld"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("marketplace_listings")
    .select("title, description, price, location_city, location_state, images")
    .eq("id", id)
    .single()
  if (!data) return { title: "Listing Not Found" }
  const location = [data.location_city, data.location_state].filter(Boolean).join(", ")
  const priceStr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(data.price)
  return {
    title: data.title,
    description: `${data.title} — ${priceStr}${location ? ` in ${location}` : ""}. ${data.description?.slice(0, 120)}`,
    openGraph: {
      title: `${data.title} — ${priceStr} | JNV Alumni Network`,
      description: data.description?.slice(0, 200),
      type: "article",
      ...(data.images?.[0] ? { images: [data.images[0]] } : {}),
    },
  }
}

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
  let isAdmin = false
  if (user) {
    const { data: roleData } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    isAdmin = roleData?.role === "admin"
  }

  // Get seller profile for contact info
  const { data: sellerData } = await supabase
    .from("profiles")
    .select("id, full_name, avatar_url, mobile, whatsapp_number, created_at")
    .eq("id", listing.seller_id)
    .single()

  const seller = sellerData as { id: string; full_name: string; avatar_url: string | null; mobile: string; whatsapp_number: string | null; created_at: string } | null

  const wishlistedIds = await getWishlistedIds()
  const isWishlisted = wishlistedIds.includes(listing.id)

  const conditionMap: Record<string, string> = {
    new: "NewCondition", like_new: "UsedCondition", good: "UsedCondition", fair: "UsedCondition",
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Product",
        name: listing.title,
        description: listing.description,
        image: listing.images,
        offers: {
          "@type": "Offer",
          price: listing.price,
          priceCurrency: "INR",
          availability: listing.status === "sold"
            ? "https://schema.org/SoldOut"
            : "https://schema.org/InStock",
          itemCondition: `https://schema.org/${conditionMap[listing.condition] || "UsedCondition"}`,
          seller: seller ? { "@type": "Person", name: seller.full_name } : undefined,
        },
        ...(listing.marketplace_categories ? { category: listing.marketplace_categories.name } : {}),
      }} />
      <div className="flex items-center justify-between">
        <Breadcrumbs items={[{ label: "Marketplace", href: "/marketplace" }, { label: listing.title }]} />
        <ShareButton title={listing.title} text={`Check out: ${listing.title} on JNV Alumni Marketplace`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Images */}
        <div className="lg:col-span-2 space-y-4">
          <div className="relative">
            <ImageGallery images={listing.images} title={listing.title} />
            {listing.status === "sold" && listing.images.length > 0 && (
              <div className="pointer-events-none absolute inset-0 rounded-lg bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-2xl">SOLD</span>
              </div>
            )}
          </div>

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

            <div className="flex justify-end">
              <ReportButton contentType="marketplace_listing" contentId={id} />
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
                {(isOwner || isAdmin) && (
                  <>
                    {isOwner && (
                      <Button variant="outline" className="w-full" render={<Link href={`/marketplace/${listing.id}/edit`} />}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit Listing
                      </Button>
                    )}
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

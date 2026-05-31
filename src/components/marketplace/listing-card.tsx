"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { MapPin, ImageIcon } from "lucide-react"
import { WishlistButton } from "./wishlist-button"

interface ListingCardProps {
  listing: {
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
  }
  isWishlisted?: boolean
}

const conditionLabels: Record<string, string> = {
  new: "New",
  like_new: "Like New",
  good: "Good",
  fair: "Fair",
}

export function ListingCard({ listing, isWishlisted = false }: ListingCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group">
      <Link href={`/marketplace/${listing.id}`}>
        <div className="relative aspect-[4/3] bg-muted">
          {listing.images.length > 0 ? (
            <Image
              src={listing.images[0]}
              alt={listing.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="h-10 w-10 text-muted-foreground/50" />
            </div>
          )}
          {listing.images.length > 1 && (
            <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
              +{listing.images.length - 1}
            </span>
          )}
          {listing.status === "sold" && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">SOLD</span>
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <Link href={`/marketplace/${listing.id}`}>
              <h3 className="font-medium text-sm truncate hover:underline">{listing.title}</h3>
            </Link>
            <p className="text-lg font-bold mt-1">{formatPrice(listing.price)}</p>
          </div>
          <WishlistButton listingId={listing.id} initialWishlisted={isWishlisted} />
        </div>
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{listing.location_city}, {listing.location_state}</span>
        </div>
        <div className="flex items-center gap-1.5 mt-2">
          {listing.marketplace_categories && (
            <Badge variant="secondary" className="text-xs">
              {listing.marketplace_categories.name}
            </Badge>
          )}
          <Badge variant="outline" className="text-xs">
            {conditionLabels[listing.condition] || listing.condition}
          </Badge>
          {listing.price_negotiable && (
            <Badge variant="outline" className="text-xs text-green-600">
              Negotiable
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

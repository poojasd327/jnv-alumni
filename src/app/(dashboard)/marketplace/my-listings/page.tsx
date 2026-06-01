"use client"

import { useState, useEffect, useTransition } from "react"
import { getMyListings, updateListingStatus } from "@/lib/actions/marketplace.actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ListingStatusBadge } from "@/components/marketplace/listing-status-badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { formatPrice, formatDate } from "@/lib/utils"
import { Pencil, Trash2, CheckCircle, Plus, Package, ImageIcon } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { toast } from "sonner"
import type { MarketplaceListing } from "@/lib/types/database.types"

type ListingWithCategory = MarketplaceListing & {
  marketplace_categories?: { name: string; slug: string } | null
}

export default function MyListingsPage() {
  const [listings, setListings] = useState<ListingWithCategory[]>([])
  const [activeTab, setActiveTab] = useState("all")
  const [isPending, startTransition] = useTransition()
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    getMyListings(activeTab).then((data) => { if (!cancelled) setListings(data as ListingWithCategory[]) })
    return () => { cancelled = true }
  }, [activeTab])

  function loadListings() {
    getMyListings(activeTab).then((data) => setListings(data as ListingWithCategory[]))
  }

  function handleStatusChange(id: string, status: "active" | "sold" | "inactive" | "deleted") {
    startTransition(async () => {
      const result = await updateListingStatus(id, status)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(`Listing ${status === "sold" ? "marked as sold" : status === "deleted" ? "deleted" : "updated"}`)
      loadListings()
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Listings</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your marketplace listings</p>
        </div>
        <Button className="w-full sm:w-auto" render={<Link href="/marketplace/new" />}>
            <Plus className="h-4 w-4 mr-2" />
            New Listing
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="sold">Sold</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
      </Tabs>

      {listings.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No listings yet</h3>
          <p className="text-muted-foreground mt-1">Start selling to the JNV community</p>
          <Button className="mt-4" render={<Link href="/marketplace/new" />}>Create Your First Listing</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full h-40 sm:w-24 sm:h-24 rounded-md overflow-hidden border shrink-0 bg-muted">
                    {listing.images.length > 0 ? (
                      <Image
                        src={listing.images[0]}
                        alt={listing.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-6 w-6 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <Link href={`/marketplace/${listing.id}`} className="font-medium hover:underline">
                          {listing.title}
                        </Link>
                        <p className="text-lg font-bold">{formatPrice(listing.price)}</p>
                      </div>
                      <ListingStatusBadge status={listing.status} />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Posted {formatDate(listing.created_at)} &middot; {listing.view_count} views
                    </p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Button variant="outline" size="sm" render={<Link href={`/marketplace/${listing.id}/edit`} />}>
                          <Pencil className="h-3 w-3 mr-1" />
                          Edit
                      </Button>
                      {listing.status === "active" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(listing.id, "sold")}
                          disabled={isPending}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark Sold
                        </Button>
                      )}
                      {listing.status !== "deleted" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setConfirmDelete(listing.id)}
                          disabled={isPending}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={!!confirmDelete}
        onOpenChange={(open) => { if (!open) setConfirmDelete(null) }}
        title="Delete this listing?"
        description="This will permanently remove your listing from the marketplace. This action cannot be undone."
        confirmLabel="Delete Listing"
        onConfirm={() => { if (confirmDelete) handleStatusChange(confirmDelete, "deleted") }}
      />
    </div>
  )
}

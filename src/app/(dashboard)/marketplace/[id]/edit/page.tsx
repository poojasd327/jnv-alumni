import { createClient } from "@/lib/supabase/server"
import { redirect, notFound } from "next/navigation"
import { getCategories } from "@/lib/actions/marketplace.actions"
import { ListingForm } from "@/components/marketplace/listing-form"
import type { MarketplaceListing } from "@/lib/types/database.types"

export const metadata = { title: "Edit Listing" }

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const userId = user.id

  const { data } = await supabase
    .from("marketplace_listings")
    .select("*")
    .eq("id", id)
    .eq("seller_id", userId)
    .single()

  if (!data) {
    notFound()
  }

  const listing = data as MarketplaceListing
  const categories = await getCategories()

  return (
    <div className="max-w-2xl mx-auto">
      <ListingForm categories={categories} userId={userId} listing={listing} />
    </div>
  )
}

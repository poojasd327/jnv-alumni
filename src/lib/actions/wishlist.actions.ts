"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function toggleWishlist(listingId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Check if already wishlisted
  const { data: existing } = await supabase
    .from("wishlists")
    .select("id")
    .eq("user_id", user.id)
    .eq("listing_id", listingId)
    .single()

  if (existing) {
    // Remove from wishlist
    await supabase
      .from("wishlists")
      .delete()
      .eq("id", existing.id)

    revalidatePath("/wishlist")
    return { wishlisted: false }
  } else {
    // Add to wishlist
    const { error } = await supabase
      .from("wishlists")
      .insert({ user_id: user.id, listing_id: listingId })

    if (error) return { error: error.message }
    revalidatePath("/wishlist")
    return { wishlisted: true }
  }
}

export async function getWishlist() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("wishlists")
    .select("*, marketplace_listings(*, marketplace_categories(name, slug))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return data || []
}

export async function getWishlistedIds() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("wishlists")
    .select("listing_id")
    .eq("user_id", user.id)

  return (data || []).map((w) => w.listing_id)
}

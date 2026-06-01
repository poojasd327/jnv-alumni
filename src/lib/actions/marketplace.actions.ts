"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { ListingCondition, ListingStatus, MarketplaceListingInsert, MarketplaceListingUpdate } from "@/lib/types/database.types"
import { sanitizeSearch, sanitizeInput } from "@/lib/utils"

export async function getCategories() {
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from("marketplace_categories")
    .select("*, marketplace_subcategories(*)")
    .order("sort_order")

  return categories || []
}

export async function getListings(params: {
  category?: string
  subcategory?: string
  q?: string
  city?: string
  state?: string
  min_price?: string
  max_price?: string
  condition?: string
  sort?: string
  page?: string
}) {
  const supabase = await createClient()
  const pageSize = 12
  const currentPage = Number(params.page) || 1
  const from = (currentPage - 1) * pageSize

  let query = supabase
    .from("marketplace_listings")
    .select("*, marketplace_categories(name, slug), marketplace_subcategories(name, slug)", { count: "exact" })
    .eq("status", "active")

  if (params.q) {
    query = query.textSearch("fts", params.q)
  }
  if (params.category) {
    query = query.eq("category_id", params.category)
  }
  if (params.subcategory) {
    query = query.eq("subcategory_id", params.subcategory)
  }
  if (params.city) {
    const city = sanitizeSearch(params.city)
    query = query.ilike("location_city", `%${city}%`)
  }
  if (params.state) {
    query = query.eq("location_state", params.state)
  }
  if (params.min_price) {
    query = query.gte("price", Number(params.min_price))
  }
  if (params.max_price) {
    query = query.lte("price", Number(params.max_price))
  }
  if (params.condition) {
    query = query.eq("condition", params.condition as ListingCondition)
  }

  // Sorting
  switch (params.sort) {
    case "price_asc":
      query = query.order("price", { ascending: true })
      break
    case "price_desc":
      query = query.order("price", { ascending: false })
      break
    default:
      query = query.order("created_at", { ascending: false })
  }

  query = query.range(from, from + pageSize - 1)

  const { data: listings, count, error } = await query

  if (error) return { listings: [], count: 0, error: error.message }
  return { listings: listings || [], count: count || 0 }
}

export async function getListingById(id: string) {
  const supabase = await createClient()

  // Atomic view count increment (race-condition safe)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.rpc as any)("increment_listing_view_count", { listing_id: id }).catch(() => {
    // Fallback: non-atomic increment if RPC not available yet
    supabase.from("marketplace_listings").select("view_count").eq("id", id).single()
      .then(({ data: current }) => {
        if (current) supabase.from("marketplace_listings").update({ view_count: current.view_count + 1 }).eq("id", id)
      })
  })

  const { data, error } = await supabase
    .from("marketplace_listings")
    .select("*, marketplace_categories(name, slug), marketplace_subcategories(name, slug)")
    .eq("id", id)
    .single()

  if (error) return null
  return data
}

export async function getMyListings(status?: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  let query = supabase
    .from("marketplace_listings")
    .select("*, marketplace_categories(name, slug), marketplace_subcategories(name, slug)")
    .eq("seller_id", user.id)
    .neq("status", "deleted")
    .order("created_at", { ascending: false })

  if (status && status !== "all") {
    query = query.eq("status", status as ListingStatus)
  }

  const { data } = await query
  return data || []
}

export async function createListing(data: ListingFormData & { images: string[] }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", user.id)
    .single()

  if (!profile) return { error: "Profile not found" }

  if (!data.title?.trim()) return { error: "Title is required" }
  if (!data.description?.trim()) return { error: "Description is required" }
  if (data.images.length === 0) return { error: "At least one image is required" }

  const insert: MarketplaceListingInsert = {
    seller_id: user.id,
    category_id: data.category_id,
    subcategory_id: data.subcategory_id || null,
    title: sanitizeInput(data.title, 200),
    description: sanitizeInput(data.description, 5000),
    price: data.price,
    price_negotiable: data.price_negotiable,
    condition: data.condition,
    location_city: data.location_city,
    location_state: data.location_state,
    images: data.images,
    seller_name: profile.full_name,
    seller_avatar_url: profile.avatar_url,
  }

  const { data: listing, error } = await supabase
    .from("marketplace_listings")
    .insert(insert)
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath("/marketplace")
  return { data: listing }
}

type ListingFormData = {
  title: string
  description: string
  price: number
  price_negotiable: boolean
  category_id: string
  subcategory_id?: string
  condition: "new" | "like_new" | "good" | "fair"
  location_city: string
  location_state: string
}

export async function updateListing(id: string, data: Partial<ListingFormData> & { images?: string[] }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const update: MarketplaceListingUpdate = {}
  if (data.title !== undefined) update.title = sanitizeInput(data.title, 200)
  if (data.description !== undefined) update.description = sanitizeInput(data.description, 5000)
  if (data.price !== undefined) update.price = data.price
  if (data.price_negotiable !== undefined) update.price_negotiable = data.price_negotiable
  if (data.category_id !== undefined) update.category_id = data.category_id
  if (data.subcategory_id !== undefined) update.subcategory_id = data.subcategory_id || null
  if (data.condition !== undefined) update.condition = data.condition
  if (data.location_city !== undefined) update.location_city = data.location_city
  if (data.location_state !== undefined) update.location_state = data.location_state
  if (data.images !== undefined) update.images = data.images

  const { error } = await supabase
    .from("marketplace_listings")
    .update(update)
    .eq("id", id)
    .eq("seller_id", user.id)

  if (error) return { error: error.message }

  revalidatePath("/marketplace")
  revalidatePath(`/marketplace/${id}`)
  return { success: true }
}

export async function updateListingStatus(id: string, status: "active" | "sold" | "inactive" | "deleted") {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Allow owner or admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  const isAdmin = profile?.role === "admin"

  let query = supabase.from("marketplace_listings").update({ status }).eq("id", id)
  if (!isAdmin) query = query.eq("seller_id", user.id)

  const { error } = await query
  if (error) return { error: error.message }

  revalidatePath("/marketplace")
  revalidatePath("/marketplace/my-listings")
  return { success: true }
}

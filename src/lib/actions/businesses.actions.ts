"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { sanitizeSearch, sanitizeInput } from "@/lib/utils"

export async function getBusinesses(params: {
  q?: string
  category?: string
  city?: string
  page?: string
}) {
  const supabase = await createClient()
  const pageSize = 12
  const currentPage = Number(params.page) || 1
  const from = (currentPage - 1) * pageSize

  let query = supabase
    .from("businesses")
    .select("*, profiles!businesses_owner_id_fkey(full_name, avatar_url)", { count: "exact" })

  if (params.q) {
    const q = sanitizeSearch(params.q)
    query = query.or(`name.ilike.%${q}%,description.ilike.%${q}%`)
  }
  if (params.category) {
    query = query.eq("category", params.category)
  }
  if (params.city) {
    const city = sanitizeSearch(params.city)
    query = query.ilike("location_city", `%${city}%`)
  }

  query = query.order("created_at", { ascending: false })
  query = query.range(from, from + pageSize - 1)

  const { data, count, error } = await query
  if (error) return { businesses: [], count: 0 }
  return { businesses: data || [], count: count || 0 }
}

export async function getBusinessById(id: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("businesses")
    .select("*, profiles!businesses_owner_id_fkey(id, full_name, avatar_url, profession)")
    .eq("id", id)
    .single()

  return data
}

export async function createBusiness(data: {
  name: string
  description: string
  category?: string
  services?: string[]
  location_city?: string
  location_state?: string
  website?: string
  phone?: string
  email?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  if (!data.name.trim()) return { error: "Business name is required" }
  if (data.name.length > 200) return { error: "Business name is too long (max 200 characters)" }

  const { error } = await supabase
    .from("businesses")
    .insert({
      owner_id: user.id,
      name: sanitizeInput(data.name, 200),
      description: sanitizeInput(data.description, 10000),
      category: data.category || null,
      services: data.services || [],
      location_city: data.location_city || null,
      location_state: data.location_state || null,
      website: data.website || null,
      phone: data.phone || null,
      email: data.email || null,
    })

  if (error) return { error: error.message }
  revalidatePath("/businesses")
  return { success: true }
}

export async function deleteBusiness(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("businesses")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id)

  if (error) return { error: error.message }
  revalidatePath("/businesses")
  return { success: true }
}

export async function getMyBusinesses() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("businesses")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false })

  return data || []
}

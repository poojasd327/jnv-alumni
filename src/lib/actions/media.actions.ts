"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { sanitizeSearch, sanitizeInput } from "@/lib/utils"

export async function getMedia(params: {
  q?: string
  category?: string
  batch_year?: string
  page?: string
}) {
  const supabase = await createClient()
  const pageSize = 12
  const currentPage = Number(params.page) || 1
  const from = (currentPage - 1) * pageSize

  let query = supabase
    .from("media")
    .select("*, profiles!media_uploaded_by_fkey(full_name, avatar_url)", { count: "exact" })

  if (params.q) {
    const q = sanitizeSearch(params.q)
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)
  }
  if (params.category) {
    query = query.eq("category", params.category)
  }
  if (params.batch_year) {
    query = query.eq("batch_year", Number(params.batch_year))
  }

  query = query.order("created_at", { ascending: false })
  query = query.range(from, from + pageSize - 1)

  const { data, count, error } = await query
  if (error) return { media: [], count: 0 }
  return { media: data || [], count: count || 0 }
}

export async function getMediaById(id: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("media")
    .select("*, profiles!media_uploaded_by_fkey(id, full_name, avatar_url)")
    .eq("id", id)
    .single()

  return data
}

export async function uploadMedia(data: {
  title: string
  description?: string
  file_url: string
  file_type: string
  category?: string
  batch_year?: number | null
  tags?: string[]
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  if (!data.title.trim()) return { error: "Title is required" }
  if (!data.file_url.trim()) return { error: "File URL is required" }

  const { error } = await supabase
    .from("media")
    .insert({
      uploaded_by: user.id,
      title: sanitizeInput(data.title, 200),
      description: data.description || null,
      file_url: data.file_url,
      file_type: data.file_type,
      category: data.category || null,
      batch_year: data.batch_year ?? null,
      tags: data.tags || [],
    })

  if (error) return { error: error.message }
  revalidatePath("/media")
  return { success: true }
}

export async function deleteMedia(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("media")
    .delete()
    .eq("id", id)
    .eq("uploaded_by", user.id)

  if (error) return { error: error.message }
  revalidatePath("/media")
  return { success: true }
}

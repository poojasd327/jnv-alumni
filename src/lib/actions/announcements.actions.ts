"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { AnnouncementType } from "@/lib/types/database.types"
import { sanitizeSearch, sanitizeInput } from "@/lib/utils"

export async function getAnnouncements(params: {
  q?: string
  type?: string
  page?: string
}) {
  const supabase = await createClient()
  const pageSize = 12
  const currentPage = Number(params.page) || 1
  const from = (currentPage - 1) * pageSize

  let query = supabase
    .from("announcements")
    .select("*, profiles!announcements_author_id_fkey(full_name, avatar_url)", { count: "exact" })

  if (params.q) {
    const q = sanitizeSearch(params.q)
    query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`)
  }
  if (params.type) {
    query = query.eq("type", params.type as AnnouncementType)
  }

  query = query
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
  query = query.range(from, from + pageSize - 1)

  const { data, count, error } = await query
  if (error) return { announcements: [], count: 0 }
  return { announcements: data || [], count: count || 0 }
}

export async function getAnnouncementById(id: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("announcements")
    .select("*, profiles!announcements_author_id_fkey(id, full_name, avatar_url)")
    .eq("id", id)
    .single()

  return data
}

export async function createAnnouncement(data: {
  title: string
  content: string
  type: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  if (!data.title.trim() || !data.content.trim()) return { error: "Title and content are required" }
  if (data.title.length > 200) return { error: "Title is too long (max 200 characters)" }

  const { error } = await supabase
    .from("announcements")
    .insert({
      author_id: user.id,
      title: sanitizeInput(data.title, 200),
      content: sanitizeInput(data.content, 20000),
      type: data.type as AnnouncementType,
    })

  if (error) return { error: error.message }
  revalidatePath("/announcements")
  return { success: true }
}

export async function deleteAnnouncement(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("announcements")
    .delete()
    .eq("id", id)
    .eq("author_id", user.id)

  if (error) return { error: error.message }
  revalidatePath("/announcements")
  return { success: true }
}

export async function togglePin(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "admin") return { error: "Admin only" }

  const { data: announcement } = await supabase
    .from("announcements")
    .select("is_pinned")
    .eq("id", id)
    .single()

  if (!announcement) return { error: "Not found" }

  const { error } = await supabase
    .from("announcements")
    .update({ is_pinned: !announcement.is_pinned })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath("/announcements")
  return { success: true }
}

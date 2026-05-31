"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { MentorshipStatus } from "@/lib/types/database.types"
import { sanitizeSearch, sanitizeInput } from "@/lib/utils"

export async function getMentors(params: {
  q?: string
  area?: string
  page?: string
}) {
  const supabase = await createClient()
  const pageSize = 12
  const currentPage = Number(params.page) || 1
  const from = (currentPage - 1) * pageSize

  let query = supabase
    .from("profiles")
    .select("id, full_name, avatar_url, profession, company, industry, skills, city, state", { count: "exact" })
    .eq("approval_status", "approved")

  if (params.q) {
    const q = sanitizeSearch(params.q)
    query = query.or(`full_name.ilike.%${q}%,profession.ilike.%${q}%,company.ilike.%${q}%`)
  }
  if (params.area && params.area !== "all") {
    const area = sanitizeSearch(params.area)
    query = query.or(`profession.ilike.%${area}%,industry.ilike.%${area}%`)
  }

  query = query.order("full_name")
  query = query.range(from, from + pageSize - 1)

  const { data, count, error } = await query
  if (error) return { mentors: [], count: 0 }
  return { mentors: data || [], count: count || 0 }
}

export async function requestMentorship(data: {
  mentor_id: string
  area: string
  message?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  if (user.id === data.mentor_id) return { error: "Cannot request mentorship from yourself" }
  if (!data.area.trim()) return { error: "Area of mentorship is required" }

  const { error } = await supabase
    .from("mentorship_requests")
    .insert({
      mentor_id: data.mentor_id,
      mentee_id: user.id,
      area: sanitizeInput(data.area, 100),
      message: data.message ? sanitizeInput(data.message, 2000) : null,
    })

  if (error) {
    if (error.code === "23505") return { error: "Request already sent to this mentor" }
    return { error: error.message }
  }

  revalidatePath("/mentorship")
  return { success: true }
}

export async function getMyMentorshipRequests() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("mentorship_requests")
    .select("*, profiles!mentorship_requests_mentor_id_fkey(id, full_name, avatar_url, profession, company)")
    .eq("mentee_id", user.id)
    .order("created_at", { ascending: false })

  return data || []
}

export async function getIncomingMentorshipRequests() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("mentorship_requests")
    .select("*, profiles!mentorship_requests_mentee_id_fkey(id, full_name, avatar_url, profession, company)")
    .eq("mentor_id", user.id)
    .order("created_at", { ascending: false })

  return data || []
}

export async function updateMentorshipStatus(id: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("mentorship_requests")
    .update({ status: status as MentorshipStatus })
    .eq("id", id)
    .eq("mentor_id", user.id)

  if (error) return { error: error.message }
  revalidatePath("/mentorship/my-requests")
  return { success: true }
}

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { sanitizeInput } from "@/lib/utils"
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit"

const VALID_CONTENT_TYPES = [
  "forum_post", "forum_comment", "marketplace_listing", "job",
  "event", "business", "media", "profile", "announcement",
] as const

const VALID_REASONS = [
  "spam", "harassment", "inappropriate", "misinformation", "fraud", "other",
] as const

type ContentType = (typeof VALID_CONTENT_TYPES)[number]
type ReportReason = (typeof VALID_REASONS)[number]

export async function submitReport(data: {
  contentType: ContentType
  contentId: string
  reason: ReportReason
  description?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const rl = checkRateLimit(`${user.id}:report`, RATE_LIMITS.sensitive)
  if (!rl.success) return { error: "Too many reports. Please wait before submitting another." }

  // Check for duplicate report
  const { data: existing } = await supabase
    .from("reports")
    .select("id")
    .eq("reporter_id", user.id)
    .eq("content_type", data.contentType)
    .eq("content_id", data.contentId)
    .maybeSingle()

  if (existing) return { error: "You have already reported this content" }

  const { error } = await supabase.from("reports").insert({
    reporter_id: user.id,
    content_type: data.contentType,
    content_id: data.contentId,
    reason: data.reason,
    description: data.description ? sanitizeInput(data.description, 1000) : null,
  })

  if (error) return { error: error.message }

  return { success: true }
}

// Admin actions

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Unauthorized")

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "admin") throw new Error("Forbidden")
  return { supabase, adminId: user.id }
}

export async function getReports(params?: { status?: string; page?: string }) {
  const { supabase } = await requireAdmin()
  const pageSize = 20
  const currentPage = Number(params?.page) || 1
  const from = (currentPage - 1) * pageSize

  let query = supabase
    .from("reports")
    .select("*, reporter:profiles!reporter_id(full_name, avatar_url)", { count: "exact" })

  if (params?.status && params.status !== "all") {
    query = query.eq("status", params.status as "pending" | "reviewed" | "action_taken" | "dismissed")
  } else {
    // Default to pending
    query = query.eq("status", "pending")
  }

  query = query.order("created_at", { ascending: false }).range(from, from + pageSize - 1)

  const { data, count } = await query
  return { reports: data || [], count: count || 0 }
}

export async function getPendingReportsCount() {
  const { supabase } = await requireAdmin()

  const { count } = await supabase
    .from("reports")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  return count || 0
}

export async function reviewReport(reportId: string, action: "dismissed" | "action_taken", adminNotes?: string) {
  const { supabase, adminId } = await requireAdmin()

  const { error } = await supabase
    .from("reports")
    .update({
      status: action,
      reviewed_by: adminId,
      reviewed_at: new Date().toISOString(),
      admin_notes: adminNotes ? sanitizeInput(adminNotes, 2000) : null,
    })
    .eq("id", reportId)

  if (error) return { error: error.message }

  revalidatePath("/admin/reports")
  return { success: true }
}

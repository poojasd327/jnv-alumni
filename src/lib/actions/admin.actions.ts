"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { ApprovalStatus, Profile } from "@/lib/types/database.types"

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
  return { supabase, userId: user.id }
}

export async function getPendingUsers() {
  const { supabase } = await requireAdmin()

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("approval_status", "pending")
    .order("created_at", { ascending: true })

  return data || []
}

export async function approveUser(userId: string) {
  const { supabase, userId: adminId } = await requireAdmin()

  const { error } = await supabase
    .from("profiles")
    .update({
      approval_status: "approved",
      approved_by: adminId,
      approved_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) return { error: error.message }

  revalidatePath("/admin")
  revalidatePath("/admin/users")
  return { success: true }
}

export async function rejectUser(userId: string) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase
    .from("profiles")
    .update({ approval_status: "rejected" })
    .eq("id", userId)

  if (error) return { error: error.message }

  revalidatePath("/admin")
  revalidatePath("/admin/users")
  return { success: true }
}

export async function getAllUsers(params?: { status?: string; page?: string }): Promise<{ users: Profile[]; count: number }> {
  const { supabase } = await requireAdmin()
  const pageSize = 20
  const currentPage = Number(params?.page) || 1
  const from = (currentPage - 1) * pageSize

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })

  if (params?.status && params.status !== "all") {
    query = query.eq("approval_status", params.status as ApprovalStatus)
  }

  query = query.order("created_at", { ascending: false }).range(from, from + pageSize - 1)

  const { data, count, error } = await query

  if (error) return { users: [], count: 0 }
  return { users: data || [], count: count || 0 }
}

export async function updateUserRole(userId: string, role: "alumni" | "admin") {
  const { supabase } = await requireAdmin()

  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", userId)

  if (error) return { error: error.message }

  revalidatePath("/admin/users")
  return { success: true }
}

"use server"

import { createClient } from "@/lib/supabase/server"
import type { Profile } from "@/lib/types/database.types"
import { sanitizeSearch } from "@/lib/utils"

const PAGE_SIZE = 12

interface SearchAlumniParams {
  q?: string
  batch?: string
  city?: string
  skill?: string
  industry?: string
  jnv_state?: string
  page?: string
}

interface SearchAlumniResult {
  alumni: Profile[]
  count: number
}

export async function searchAlumni(
  params: SearchAlumniParams
): Promise<SearchAlumniResult> {
  const supabase = await createClient()

  const page = Math.max(1, parseInt(params.page || "1", 10))
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let query = supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .eq("approval_status", "approved")

  // Full-text search on the fts column
  if (params.q && params.q.trim()) {
    query = query.textSearch("fts", params.q.trim(), {
      type: "websearch",
      config: "english",
    })
  }

  // Filter by passing year (batch)
  if (params.batch) {
    const year = parseInt(params.batch, 10)
    if (!isNaN(year)) {
      query = query.eq("passing_year", year)
    }
  }

  // Filter by city (case-insensitive partial match)
  if (params.city && params.city.trim()) {
    const city = sanitizeSearch(params.city.trim())
    query = query.ilike("city", `%${city}%`)
  }

  // Filter by skill (array contains)
  if (params.skill && params.skill.trim()) {
    query = query.contains("skills", [params.skill.trim()])
  }

  // Filter by industry (exact match)
  if (params.industry && params.industry.trim()) {
    query = query.eq("industry", params.industry.trim())
  }

  // Filter by JNV state
  if (params.jnv_state && params.jnv_state.trim()) {
    query = query.eq("jnv_state", params.jnv_state.trim())
  }

  // Order and paginate
  query = query.order("full_name", { ascending: true }).range(from, to)

  const { data, count, error } = await query

  if (error) {
    console.error("searchAlumni error:", error.message)
    return { alumni: [], count: 0 }
  }

  return {
    alumni: (data as Profile[]) || [],
    count: count ?? 0,
  }
}

export async function getAlumniById(id: string) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { data: null, error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("approval_status", "approved")
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

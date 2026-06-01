"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { JobType, ApplicationStatus } from "@/lib/types/database.types"
import { sanitizeSearch, sanitizeInput } from "@/lib/utils"

export async function getJobs(params: {
  q?: string
  type?: string
  city?: string
  referral?: string
  page?: string
}) {
  const supabase = await createClient()
  const pageSize = 12
  const currentPage = Number(params.page) || 1
  const from = (currentPage - 1) * pageSize

  let query = supabase
    .from("jobs")
    .select("*, profiles!jobs_posted_by_fkey(full_name, avatar_url)", { count: "exact" })
    .eq("status", "open")

  if (params.q) {
    const q = sanitizeSearch(params.q)
    query = query.or(`title.ilike.%${q}%,company.ilike.%${q}%,description.ilike.%${q}%`)
  }
  if (params.type) {
    query = query.eq("job_type", params.type as JobType)
  }
  if (params.city) {
    const city = sanitizeSearch(params.city)
    query = query.ilike("location_city", `%${city}%`)
  }
  if (params.referral === "true") {
    query = query.eq("referral_available", true)
  }

  query = query.order("created_at", { ascending: false })
  query = query.range(from, from + pageSize - 1)

  const { data: jobs, count, error } = await query

  if (error) return { jobs: [], count: 0, error: error.message }
  return { jobs: jobs || [], count: count || 0 }
}

export async function getJobById(id: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("jobs")
    .select("*, profiles!jobs_posted_by_fkey(id, full_name, avatar_url, company, profession)")
    .eq("id", id)
    .single()

  if (error) return null
  return data
}

export async function createJob(data: {
  title: string
  company: string
  description: string
  location_city?: string
  location_state?: string
  job_type: string
  experience_min?: number | null
  experience_max?: number | null
  salary_min?: number | null
  salary_max?: number | null
  skills_required?: string[]
  referral_available?: boolean
  contact_email?: string
  apply_url?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  if (!data.title.trim() || !data.company.trim() || !data.description.trim()) {
    return { error: "Title, company, and description are required" }
  }
  if (data.title.length > 200) return { error: "Title is too long (max 200 characters)" }

  const { data: job, error } = await supabase
    .from("jobs")
    .insert({
      posted_by: user.id,
      title: sanitizeInput(data.title, 200),
      company: sanitizeInput(data.company, 200),
      description: sanitizeInput(data.description, 20000),
      location_city: data.location_city || null,
      location_state: data.location_state || null,
      job_type: data.job_type as JobType,
      experience_min: data.experience_min ?? null,
      experience_max: data.experience_max ?? null,
      salary_min: data.salary_min ?? null,
      salary_max: data.salary_max ?? null,
      skills_required: data.skills_required || [],
      referral_available: data.referral_available || false,
      contact_email: data.contact_email || null,
      apply_url: data.apply_url || null,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath("/jobs")
  return { data: job }
}

export async function updateJob(id: string, data: {
  title?: string
  company?: string
  description?: string
  location_city?: string
  location_state?: string
  job_type?: string
  experience_min?: number | null
  experience_max?: number | null
  salary_min?: number | null
  salary_max?: number | null
  skills_required?: string[]
  referral_available?: boolean
  contact_email?: string
  apply_url?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("jobs")
    .update({
      ...(data.title !== undefined && { title: data.title }),
      ...(data.company !== undefined && { company: data.company }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.location_city !== undefined && { location_city: data.location_city || null }),
      ...(data.location_state !== undefined && { location_state: data.location_state || null }),
      ...(data.job_type !== undefined && { job_type: data.job_type as JobType }),
      ...(data.experience_min !== undefined && { experience_min: data.experience_min }),
      ...(data.experience_max !== undefined && { experience_max: data.experience_max }),
      ...(data.salary_min !== undefined && { salary_min: data.salary_min }),
      ...(data.salary_max !== undefined && { salary_max: data.salary_max }),
      ...(data.skills_required !== undefined && { skills_required: data.skills_required }),
      ...(data.referral_available !== undefined && { referral_available: data.referral_available }),
      ...(data.contact_email !== undefined && { contact_email: data.contact_email || null }),
      ...(data.apply_url !== undefined && { apply_url: data.apply_url || null }),
    })
    .eq("id", id)
    .eq("posted_by", user.id)

  if (error) return { error: error.message }

  revalidatePath("/jobs")
  revalidatePath(`/jobs/${id}`)
  return { success: true }
}

export async function deleteJob(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Allow owner or admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  const isAdmin = profile?.role === "admin"

  let query = supabase.from("jobs").update({ status: "closed" as const }).eq("id", id)
  if (!isAdmin) query = query.eq("posted_by", user.id)

  const { error } = await query
  if (error) return { error: error.message }

  revalidatePath("/jobs")
  revalidatePath("/jobs/my-jobs")
  return { success: true }
}

export async function applyToJob(jobId: string, data: { cover_note?: string; resume_url?: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Check if already applied
  const { data: existing } = await supabase
    .from("job_applications")
    .select("id")
    .eq("job_id", jobId)
    .eq("applicant_id", user.id)
    .single()

  if (existing) return { error: "You have already applied to this job" }

  const { data: application, error } = await supabase
    .from("job_applications")
    .insert({
      job_id: jobId,
      applicant_id: user.id,
      cover_note: data.cover_note ? sanitizeInput(data.cover_note, 5000) : null,
      resume_url: data.resume_url || null,
    })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath(`/jobs/${jobId}`)
  return { data: application }
}

export async function getMyJobs() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("jobs")
    .select("*")
    .eq("posted_by", user.id)
    .order("created_at", { ascending: false })

  return data || []
}

export async function getMyApplications() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("job_applications")
    .select("*, jobs(id, title, company, job_type, status)")
    .eq("applicant_id", user.id)
    .order("created_at", { ascending: false })

  return data || []
}

export async function getJobApplications(jobId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Verify the user owns this job or is admin
  const { data: job } = await supabase
    .from("jobs")
    .select("posted_by")
    .eq("id", jobId)
    .single()

  if (!job) return []

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  const isAdmin = profile?.role === "admin"

  if (job.posted_by !== user.id && !isAdmin) return []

  const { data } = await supabase
    .from("job_applications")
    .select("*, profiles!job_applications_applicant_id_fkey(id, full_name, avatar_url, profession, company)")
    .eq("job_id", jobId)
    .order("created_at", { ascending: false })

  return data || []
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Get the application to find the job
  const { data: application } = await supabase
    .from("job_applications")
    .select("job_id")
    .eq("id", applicationId)
    .single()

  if (!application) return { error: "Application not found" }

  // Verify the user owns the job
  const { data: job } = await supabase
    .from("jobs")
    .select("posted_by")
    .eq("id", application.job_id)
    .single()

  if (!job || job.posted_by !== user.id) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("job_applications")
    .update({ status: status as ApplicationStatus })
    .eq("id", applicationId)

  if (error) return { error: error.message }

  revalidatePath(`/jobs/${application.job_id}`)
  return { success: true }
}

export async function checkIfApplied(jobId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from("job_applications")
    .select("id")
    .eq("job_id", jobId)
    .eq("applicant_id", user.id)
    .single()

  return !!data
}

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { sanitizeSearch, sanitizeInput } from "@/lib/utils"

export async function getEvents(params: {
  q?: string
  status?: string
  city?: string
  page?: string
}) {
  const supabase = await createClient()
  const pageSize = 12
  const currentPage = Number(params.page) || 1
  const from = (currentPage - 1) * pageSize

  let query = supabase
    .from("events")
    .select("*, profiles!events_organizer_id_fkey(full_name, avatar_url)", { count: "exact" })

  if (params.q) {
    const q = sanitizeSearch(params.q)
    query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%,venue.ilike.%${q}%`)
  }
  if (params.status === "upcoming") {
    query = query.in("status", ["upcoming", "ongoing"])
  } else if (params.status === "past") {
    query = query.in("status", ["completed", "cancelled"])
  }
  if (params.city) {
    const city = sanitizeSearch(params.city)
    query = query.ilike("location_city", `%${city}%`)
  }

  query = query.order("event_date", { ascending: true })
  query = query.range(from, from + pageSize - 1)

  const { data, count, error } = await query
  if (error) return { events: [], count: 0 }
  return { events: data || [], count: count || 0 }
}

export async function getEventById(id: string) {
  const supabase = await createClient()

  const { data: event } = await supabase
    .from("events")
    .select("*, profiles!events_organizer_id_fkey(id, full_name, avatar_url, profession, company)")
    .eq("id", id)
    .single()

  if (!event) return null

  const { count } = await supabase
    .from("event_registrations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", id)

  return { ...event, registration_count: count || 0 }
}

export async function createEvent(data: {
  title: string
  description: string
  event_date: string
  end_date?: string
  venue?: string
  location_city?: string
  location_state?: string
  is_online?: boolean
  meeting_url?: string
  max_attendees?: number | null
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  if (!data.title.trim()) return { error: "Title is required" }
  if (!data.event_date) return { error: "Event date is required" }

  const { error } = await supabase
    .from("events")
    .insert({
      organizer_id: user.id,
      title: sanitizeInput(data.title, 200),
      description: sanitizeInput(data.description, 10000),
      event_date: data.event_date,
      end_date: data.end_date || null,
      venue: data.venue || null,
      location_city: data.location_city || null,
      location_state: data.location_state || null,
      is_online: data.is_online || false,
      meeting_url: data.meeting_url || null,
      max_attendees: data.max_attendees ?? null,
    })

  if (error) return { error: error.message }
  revalidatePath("/events")
  return { success: true }
}

export async function cancelEvent(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("events")
    .update({ status: "cancelled" as const })
    .eq("id", id)
    .eq("organizer_id", user.id)

  if (error) return { error: error.message }
  revalidatePath("/events")
  return { success: true }
}

export async function registerForEvent(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("event_registrations")
    .insert({ event_id: eventId, user_id: user.id })

  if (error) {
    if (error.code === "23505") return { error: "Already registered" }
    return { error: error.message }
  }
  revalidatePath(`/events/${eventId}`)
  return { success: true }
}

export async function unregisterFromEvent(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { error } = await supabase
    .from("event_registrations")
    .delete()
    .eq("event_id", eventId)
    .eq("user_id", user.id)

  if (error) return { error: error.message }
  revalidatePath(`/events/${eventId}`)
  return { success: true }
}

export async function isRegistered(eventId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from("event_registrations")
    .select("id")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .single()

  return !!data
}

export async function getMyEvents() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("events")
    .select("*")
    .eq("organizer_id", user.id)
    .order("event_date", { ascending: false })

  return data || []
}

export async function getMyRegistrations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("event_registrations")
    .select("*, events(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return data || []
}

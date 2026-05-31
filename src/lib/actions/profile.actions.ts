"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import type { ProfileUpdate } from "@/lib/types/database.types"

export async function getMyProfile() {
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
    .eq("id", user.id)
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  return { data, error: null }
}

export async function getProfileById(id: string) {
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

export async function updateProfile(data: ProfileUpdate) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { data: null, error: "Not authenticated" }
  }

  // Prevent updating sensitive fields
  const safeData: ProfileUpdate = {
    city: data.city,
    state: data.state,
    profession: data.profession,
    company: data.company,
    industry: data.industry,
    skills: data.skills,
    linkedin_url: data.linkedin_url,
    portfolio_url: data.portfolio_url,
    whatsapp_number: data.whatsapp_number,
    bio: data.bio,
    updated_at: new Date().toISOString(),
  }

  // Determine if profile is complete enough
  if (safeData.city && safeData.profession) {
    safeData.is_profile_complete = true
  }

  const { data: updated, error } = await supabase
    .from("profiles")
    .update(safeData)
    .eq("id", user.id)
    .select()
    .single()

  if (error) {
    return { data: null, error: error.message }
  }

  revalidatePath("/profile")

  return { data: updated, error: null }
}

export async function uploadAvatar(formData: FormData) {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { data: null, error: "Not authenticated" }
  }

  const file = formData.get("avatar") as File | null

  if (!file) {
    return { data: null, error: "No file provided" }
  }

  // Validate file type
  const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
  if (!allowedTypes.includes(file.type)) {
    return { data: null, error: "Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image." }
  }

  // Validate file size (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    return { data: null, error: "File size must be less than 2MB" }
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
  const filePath = `${user.id}/avatar.${ext}`

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, {
      cacheControl: "3600",
      upsert: true,
    })

  if (uploadError) {
    return { data: null, error: uploadError.message }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath)

  // Append cache-busting param so browsers refresh the image
  const avatarUrl = `${publicUrl}?t=${Date.now()}`

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: avatarUrl, updated_at: new Date().toISOString() })
    .eq("id", user.id)

  if (updateError) {
    return { data: null, error: updateError.message }
  }

  revalidatePath("/profile")

  return { data: { avatar_url: avatarUrl }, error: null }
}

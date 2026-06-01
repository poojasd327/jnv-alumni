"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit"

export async function changePassword(data: {
  currentPassword: string
  newPassword: string
}) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "Not authenticated" }
  }

  // Rate limit
  const rl = checkRateLimit(`${user.id}:change-password`, RATE_LIMITS.sensitive)
  if (!rl.success) {
    return { error: "Too many attempts. Please try again later." }
  }

  // Verify current password by re-authenticating
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password: data.currentPassword,
  })

  if (signInError) {
    return { error: "Current password is incorrect" }
  }

  // Update password
  const { error: updateError } = await supabase.auth.updateUser({
    password: data.newPassword,
  })

  if (updateError) {
    return { error: updateError.message }
  }

  return { success: "Password updated successfully" }
}

export async function deleteAccount(password: string) {
  const supabase = await createClient()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { error: "Not authenticated" }
  }

  // Rate limit
  const rl = checkRateLimit(`${user.id}:delete-account`, RATE_LIMITS.sensitive)
  if (!rl.success) {
    return { error: "Too many attempts. Please try again later." }
  }

  // Verify password
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: user.email!,
    password,
  })

  if (signInError) {
    return { error: "Incorrect password" }
  }

  // Delete profile (cascades to all user data via FK ON DELETE CASCADE)
  const { error: deleteProfileError } = await supabase
    .from("profiles")
    .delete()
    .eq("id", user.id)

  if (deleteProfileError) {
    return { error: "Failed to delete account data. Please contact support." }
  }

  // Sign out the user
  await supabase.auth.signOut()

  redirect("/login")
}

export interface NotificationPreferences {
  email_messages: boolean
  email_job_updates: boolean
  email_event_reminders: boolean
  email_forum_replies: boolean
  email_announcements: boolean
  email_mentorship: boolean
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  email_messages: true,
  email_job_updates: true,
  email_event_reminders: true,
  email_forum_replies: true,
  email_announcements: true,
  email_mentorship: true,
}

export async function getNotificationPreferences(): Promise<NotificationPreferences> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return DEFAULT_PREFERENCES

  const stored = user.user_metadata?.notification_preferences as Partial<NotificationPreferences> | undefined
  return { ...DEFAULT_PREFERENCES, ...stored }
}

export async function updateNotificationPreferences(preferences: NotificationPreferences) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const { error } = await supabase.auth.updateUser({
    data: { notification_preferences: preferences },
  })

  if (error) return { error: error.message }
  return { success: true }
}

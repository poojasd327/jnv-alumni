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

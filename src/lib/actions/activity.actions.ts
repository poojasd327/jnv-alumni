"use server"

import { createClient } from "@/lib/supabase/server"

// Track last active timestamp (throttled to once per 5 minutes)
const THROTTLE_MS = 5 * 60 * 1000

export async function trackActivity() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  // Only update if last update was > 5 min ago
  const { data: profile } = await supabase
    .from("profiles")
    .select("updated_at")
    .eq("id", user.id)
    .single()

  if (!profile) return

  const lastUpdate = new Date(profile.updated_at).getTime()
  const now = Date.now()

  if (now - lastUpdate > THROTTLE_MS) {
    await supabase
      .from("profiles")
      .update({ updated_at: new Date().toISOString() })
      .eq("id", user.id)
  }
}

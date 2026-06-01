import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { Profile } from "@/lib/types/database.types"
import { getNotificationPreferences } from "@/lib/actions/settings.actions"
import { SettingsForm } from "./settings-form"

export const metadata = {
  title: "Settings",
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data } = await supabase
    .from("profiles")
    .select("full_name, email, jnv_school, jnv_state, batch_start_year, passing_year, created_at")
    .eq("id", user.id)
    .single()

  const profile = data as Pick<Profile, "full_name" | "email" | "jnv_school" | "jnv_state" | "batch_start_year" | "passing_year" | "created_at"> | null

  const notificationPreferences = await getNotificationPreferences()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your account and preferences
        </p>
      </div>

      <SettingsForm profile={profile} email={user.email || ""} notificationPreferences={notificationPreferences} />
    </div>
  )
}

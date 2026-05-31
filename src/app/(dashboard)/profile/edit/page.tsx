import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { ProfileForm } from "@/components/profile/profile-form"
import { AvatarUpload } from "@/components/profile/avatar-upload"
import { redirect } from "next/navigation"
import type { Profile } from "@/lib/types/database.types"

export default async function EditProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!data) {
    redirect("/login")
  }

  const profile = data as Profile

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button render={<Link href="/profile" />} variant="ghost" size="icon">
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
      </div>

      {/* Avatar */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Photo</CardTitle>
        </CardHeader>
        <CardContent>
          <AvatarUpload
            currentAvatarUrl={profile.avatar_url}
            fullName={profile.full_name}
          />
        </CardContent>
      </Card>

      {/* Read-only info */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Full Name</p>
              <p className="text-sm font-medium">{profile.full_name}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="text-sm font-medium">{profile.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Mobile</p>
              <p className="text-sm font-medium">{profile.mobile}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">JNV School</p>
              <p className="text-sm font-medium">{profile.jnv_school}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Batch</p>
              <p className="text-sm font-medium">
                {profile.batch_start_year} - {profile.passing_year}
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            Contact an admin to update the information above.
          </p>
        </CardContent>
      </Card>

      {/* Editable form */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Details</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={profile} />
        </CardContent>
      </Card>
    </div>
  )
}

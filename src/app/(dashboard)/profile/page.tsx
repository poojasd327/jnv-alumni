export const metadata = { title: "Profile" }

import Link from "next/link"
import {
  MapPin,
  Briefcase,
  Building2,
  GraduationCap,
  ExternalLink,
  Globe,
  Phone,
  Pencil,
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { getInitials, formatDate } from "@/lib/utils"
import { redirect } from "next/navigation"
import { ProfileCompleteness } from "@/components/profile/profile-completeness"
import type { Profile } from "@/lib/types/database.types"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  if (!data) redirect("/login")

  const profile = data as Profile

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <Button className="w-full sm:w-auto" variant="outline" render={<Link href="/profile/edit" />}>
            <Pencil className="size-4 mr-2" />
            Edit Profile
        </Button>
      </div>

      {/* Completeness indicator */}
      <ProfileCompleteness profile={profile} />

      {/* Profile Card */}
      <Card>
        <CardContent className="flex flex-col items-center gap-6 pt-6 sm:flex-row sm:items-start">
          <Avatar className="size-24">
            {profile.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
            ) : null}
            <AvatarFallback className="text-xl">
              {getInitials(profile.full_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-1 text-center sm:text-left">
            <h2 className="text-xl font-semibold">{profile.full_name}</h2>
            <p className="text-sm text-muted-foreground">{profile.email}</p>

            {(profile.profession || profile.company) && (
              <p className="text-sm text-muted-foreground">
                {profile.profession}
                {profile.company && ` at ${profile.company}`}
              </p>
            )}

            {(profile.city || profile.state) && (
              <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground sm:justify-start">
                <MapPin className="size-3.5" />
                {[profile.city, profile.state].filter(Boolean).join(", ")}
              </div>
            )}

            <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground sm:justify-start">
              <GraduationCap className="size-3.5" />
              {profile.jnv_school} | Batch {profile.passing_year}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Details */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Professional Info */}
        <Card>
          <CardHeader>
            <CardTitle>Professional Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <InfoRow
              icon={<Briefcase className="size-4 text-muted-foreground" />}
              label="Profession"
              value={profile.profession}
            />
            <InfoRow
              icon={<Building2 className="size-4 text-muted-foreground" />}
              label="Company"
              value={profile.company}
            />
            <InfoRow
              icon={<Briefcase className="size-4 text-muted-foreground" />}
              label="Industry"
              value={profile.industry}
            />
          </CardContent>
        </Card>

        {/* Contact Links */}
        <Card>
          <CardHeader>
            <CardTitle>Contact & Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {profile.linkedin_url && (
              <div className="flex items-center gap-2">
                <ExternalLink className="size-4 text-muted-foreground" />
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  LinkedIn Profile
                </a>
              </div>
            )}
            {profile.portfolio_url && (
              <div className="flex items-center gap-2">
                <Globe className="size-4 text-muted-foreground" />
                <a
                  href={profile.portfolio_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  Portfolio
                </a>
              </div>
            )}
            {profile.whatsapp_number && (
              <div className="flex items-center gap-2">
                <Phone className="size-4 text-muted-foreground" />
                <a
                  href={`https://wa.me/${profile.whatsapp_number.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {profile.whatsapp_number}
                </a>
              </div>
            )}
            {!profile.linkedin_url &&
              !profile.portfolio_url &&
              !profile.whatsapp_number && (
                <p className="text-sm text-muted-foreground">
                  No contact links added yet.
                </p>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Skills */}
      {profile.skills && profile.skills.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Bio */}
      {profile.bio && (
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {profile.bio}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Metadata */}
      <p className="text-xs text-muted-foreground">
        Member since {formatDate(profile.created_at)}
      </p>
    </div>
  )
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string | null
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm">{value || "Not specified"}</p>
      </div>
    </div>
  )
}

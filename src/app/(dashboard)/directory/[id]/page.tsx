import type { Metadata } from "next"
import { notFound } from "next/navigation"
import {
  MapPin,
  Briefcase,
  Building2,
  GraduationCap,
  ExternalLink,
  Globe,
  Phone,
  Calendar,
} from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/server"
import { getInitials, formatDate } from "@/lib/utils"
import type { Profile } from "@/lib/types/database.types"
import { MessageButton } from "@/components/messages/message-button"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("full_name, profession, company, jnv_school, batch_start_year, passing_year")
    .eq("id", id)
    .eq("approval_status", "approved")
    .single()
  if (!data) return { title: "Alumni Not Found" }
  const desc = `${data.full_name}${data.profession ? ` — ${data.profession}` : ""}${data.company ? ` at ${data.company}` : ""}. ${data.jnv_school}, Batch ${data.batch_start_year}–${data.passing_year}.`
  return {
    title: data.full_name,
    description: desc,
    openGraph: {
      title: `${data.full_name} | JNV Alumni Network`,
      description: desc,
      type: "profile",
    },
  }
}

export default async function AlumniDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("approval_status", "approved")
    .single()

  if (!data) {
    notFound()
  }

  const profile = data as Profile
  const { data: { user } } = await supabase.auth.getUser()
  const isOwnProfile = user?.id === profile.id

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Breadcrumbs items={[{ label: "Directory", href: "/directory" }, { label: profile.full_name }]} />

      {/* Profile Header */}
      <Card>
        <CardContent className="flex flex-col items-center gap-6 pt-6 sm:flex-row sm:items-start">
          <Avatar className="size-28">
            {profile.avatar_url ? (
              <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
            ) : null}
            <AvatarFallback className="text-2xl">
              {getInitials(profile.full_name)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 space-y-2 text-center sm:text-left">
            <h1 className="text-2xl font-bold">{profile.full_name}</h1>

            {(profile.profession || profile.company) && (
              <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                <Briefcase className="size-4" />
                <span>
                  {profile.profession}
                  {profile.company && ` at ${profile.company}`}
                </span>
              </div>
            )}

            {profile.industry && (
              <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                <Building2 className="size-4" />
                <span>{profile.industry}</span>
              </div>
            )}

            {(profile.city || profile.state) && (
              <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
                <MapPin className="size-4" />
                <span>
                  {[profile.city, profile.state].filter(Boolean).join(", ")}
                </span>
              </div>
            )}

            <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
              <GraduationCap className="size-4" />
              <span>
                {profile.jnv_school} | Batch {profile.batch_start_year} -{" "}
                {profile.passing_year}
              </span>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-sm text-muted-foreground sm:justify-start">
              <Calendar className="size-4" />
              <span>Member since {formatDate(profile.created_at)}</span>
            </div>

            {!isOwnProfile && (
              <div className="pt-2">
                <MessageButton userId={profile.id} />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Contact Links */}
      {(profile.linkedin_url ||
        profile.portfolio_url ||
        profile.whatsapp_number) && (
        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {profile.linkedin_url && (
                <Button variant="outline" size="sm" render={<a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" />}>
                    <ExternalLink className="size-4 mr-1.5" />
                    LinkedIn
                </Button>
              )}
              {profile.portfolio_url && (
                <Button variant="outline" size="sm" render={<a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" />}>
                    <Globe className="size-4 mr-1.5" />
                    Portfolio
                </Button>
              )}
              {profile.whatsapp_number && (
                <Button variant="outline" size="sm" render={<a href={`https://wa.me/${profile.whatsapp_number.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" />}>
                    <Phone className="size-4 mr-1.5" />
                    WhatsApp
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
    </div>
  )
}

import type { Metadata } from "next"
import { getAnnouncementById } from "@/lib/actions/announcements.actions"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Pin } from "lucide-react"
import { formatDate, getInitials } from "@/lib/utils"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { ReportButton } from "@/components/ui/report-button"
import { AnnouncementActions } from "./announcement-actions"

const TYPE_COLORS: Record<string, string> = {
  general: "bg-gray-100 text-gray-700", achievement: "bg-amber-100 text-amber-700",
  opportunity: "bg-blue-100 text-blue-700", update: "bg-green-100 text-green-700",
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const announcement = await getAnnouncementById(id)
  if (!announcement) return { title: "Announcement Not Found" }
  return {
    title: announcement.title,
    description: announcement.content?.slice(0, 160),
    openGraph: {
      title: `${announcement.title} | JNV Alumni Network`,
      description: announcement.content?.slice(0, 200),
      type: "article",
    },
  }
}

export default async function AnnouncementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const announcement = await getAnnouncementById(id)
  if (!announcement) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isAuthor = user?.id === announcement.author_id

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    isAdmin = profile?.role === "admin"
  }

  const author = announcement.profiles as { id: string; full_name: string; avatar_url: string | null } | null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Breadcrumbs items={[{ label: "Announcements", href: "/announcements" }, { label: announcement.title }]} />

      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">{announcement.title}</h1>
          <Badge className={TYPE_COLORS[announcement.type] || ""}>{announcement.type}</Badge>
          {announcement.is_pinned && (
            <Badge variant="secondary" className="bg-amber-100 text-amber-700">
              <Pin className="size-3 mr-1" />Pinned
            </Badge>
          )}
        </div>
        <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
          {author && (
            <span className="flex items-center gap-1.5">
              <Avatar className="size-5"><AvatarImage src={author.avatar_url || ""} /><AvatarFallback className="text-[8px]">{getInitials(author.full_name)}</AvatarFallback></Avatar>
              {author.full_name}
            </span>
          )}
          <span>{formatDate(announcement.created_at)}</span>
        </div>
      </div>

      <Card><CardContent className="p-6">
        <div className="whitespace-pre-wrap text-sm">{announcement.content}</div>
      </CardContent></Card>

      {(isAuthor || isAdmin) && (
        <AnnouncementActions
          announcementId={id}
          title={announcement.title}
          content={announcement.content || ""}
          type={announcement.type}
          isPinned={announcement.is_pinned || false}
          isAuthor={isAuthor}
          isAdmin={isAdmin}
        />
      )}

      <div className="flex justify-end">
        <ReportButton contentType="announcement" contentId={id} />
      </div>
    </div>
  )
}

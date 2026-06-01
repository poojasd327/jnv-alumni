import type { Metadata } from "next"
import { getMediaById } from "@/lib/actions/media.actions"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate, getInitials } from "@/lib/utils"
import Image from "next/image"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const media = await getMediaById(id)
  if (!media) return { title: "Media Not Found" }
  return {
    title: media.title,
    description: media.description?.slice(0, 160) || `${media.title} — JNV Alumni Media Gallery`,
    openGraph: {
      title: `${media.title} | JNV Alumni Media`,
      description: media.description?.slice(0, 200) || media.title,
      type: "article",
      ...(media.file_type === "image" ? { images: [media.file_url] } : {}),
    },
  }
}

export default async function MediaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const media = await getMediaById(id)
  if (!media) notFound()

  const uploader = media.profiles as { id: string; full_name: string; avatar_url: string | null } | null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Breadcrumbs items={[{ label: "Media", href: "/media" }, { label: media.title }]} />

      <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
        {media.file_type === "image" ? (
          <Image src={media.file_url} alt={media.title} fill className="object-contain" sizes="(max-width: 768px) 100vw, 768px" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <a href={media.file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Open Video</a>
          </div>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold">{media.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          {media.category && <Badge variant="outline">{media.category}</Badge>}
          {media.batch_year && <Badge variant="secondary">Batch {media.batch_year}</Badge>}
        </div>
      </div>

      {media.description && (
        <Card><CardContent className="p-4"><div className="text-sm whitespace-pre-wrap">{media.description}</div></CardContent></Card>
      )}

      {media.tags && media.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">{media.tags.map((tag: string) => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}</div>
      )}

      {uploader && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Avatar className="size-5"><AvatarImage src={uploader.avatar_url || ""} /><AvatarFallback className="text-[8px]">{getInitials(uploader.full_name)}</AvatarFallback></Avatar>
          <span>Uploaded by {uploader.full_name}</span>
          <span>&middot; {formatDate(media.created_at)}</span>
        </div>
      )}
    </div>
  )
}

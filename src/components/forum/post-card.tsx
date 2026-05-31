import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, ThumbsUp, MessageCircle, Pin } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"

interface PostCardProps {
  post: {
    id: string
    title: string
    content: string
    is_pinned: boolean
    view_count: number
    likes_count: number
    comments_count: number
    created_at: string
    profiles?: { full_name: string; avatar_url: string | null } | null
    forum_categories?: { name: string; slug: string } | null
  }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/forum/${post.id}`}>
      <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            {post.profiles && (
              <Avatar className="size-8 shrink-0">
                {post.profiles.avatar_url && <AvatarImage src={post.profiles.avatar_url} />}
                <AvatarFallback className="text-xs">
                  {getInitials(post.profiles.full_name)}
                </AvatarFallback>
              </Avatar>
            )}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {post.is_pinned && <Pin className="size-3 text-amber-500" />}
                <h3 className="font-semibold truncate">{post.title}</h3>
              </div>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {post.content}
              </p>

              <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
                {post.forum_categories && (
                  <Badge variant="outline" className="text-xs">{post.forum_categories.name}</Badge>
                )}
                <span className="flex items-center gap-1">
                  <Eye className="size-3" />{post.view_count}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsUp className="size-3" />{post.likes_count}
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="size-3" />{post.comments_count}
                </span>
                <span className="ml-auto">{formatDate(post.created_at)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

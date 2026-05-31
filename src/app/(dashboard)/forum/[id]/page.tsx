import { getPostById, getPostComments, isPostLiked } from "@/lib/actions/forum.actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Eye, ThumbsUp, MessageCircle } from "lucide-react"
import { formatDate, getInitials } from "@/lib/utils"
import Link from "next/link"
import { PostActions } from "./post-actions"
import { CommentSection } from "./comment-section"

export default async function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [post, comments, liked] = await Promise.all([getPostById(id), getPostComments(id), isPostLiked(id)])
  if (!post) notFound()

  const author = post.profiles as { id: string; full_name: string; avatar_url: string | null; profession: string | null } | null
  const category = post.forum_categories as { name: string; slug: string } | null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" render={<Link href="/forum" />}><ArrowLeft className="size-4 mr-1" /> Back</Button>

      <div>
        <div className="flex items-center gap-2 mb-2">
          {category && <Badge variant="outline">{category.name}</Badge>}
        </div>
        <h1 className="text-2xl font-bold">{post.title}</h1>
        <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
          {author && (
            <span className="flex items-center gap-1.5">
              <Avatar className="size-5"><AvatarImage src={author.avatar_url || ""} /><AvatarFallback className="text-[8px]">{getInitials(author.full_name)}</AvatarFallback></Avatar>
              {author.full_name}
            </span>
          )}
          <span>{formatDate(post.created_at)}</span>
          <span className="flex items-center gap-1"><Eye className="size-3" />{post.view_count}</span>
        </div>
      </div>

      <Card><CardContent className="p-6">
        <div className="whitespace-pre-wrap text-sm">{post.content}</div>
      </CardContent></Card>

      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <PostActions postId={id} liked={liked} likesCount={post.likes_count} />
        <span className="flex items-center gap-1"><MessageCircle className="size-4" />{post.comments_count} comments</span>
      </div>

      <CommentSection postId={id} comments={comments} />
    </div>
  )
}

"use client"

import { useTransition } from "react"
import { createComment } from "@/lib/actions/forum.actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDate, getInitials } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Comment {
  id: string
  content: string
  created_at: string
  parent_id: string | null
  profiles: { id: string; full_name: string; avatar_url: string | null } | null
}

export function CommentSection({ postId, comments }: { postId: string; comments: Comment[] }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const content = fd.get("content") as string
    if (!content.trim()) return

    startTransition(async () => {
      const result = await createComment({ post_id: postId, content })
      if (result.error) { toast.error(result.error); return }
      toast.success("Comment added!")
      form.reset()
      router.refresh()
    })
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Comments</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:flex-row">
        <Textarea name="content" placeholder="Write a comment..." rows={2} className="flex-1" maxLength={10000} required />
        <Button type="submit" disabled={isPending} className="self-end sm:self-end">{isPending ? "..." : "Post"}</Button>
      </form>

      <div className="space-y-3">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="size-7">
                  <AvatarImage src={comment.profiles?.avatar_url || ""} />
                  <AvatarFallback className="text-xs">{comment.profiles ? getInitials(comment.profiles.full_name) : "?"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{comment.profiles?.full_name}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                  </div>
                  <p className="mt-1 text-sm">{comment.content}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {comments.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first!</p>}
      </div>
    </div>
  )
}

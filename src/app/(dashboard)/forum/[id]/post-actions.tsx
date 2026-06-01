"use client"

import { useState, useTransition } from "react"
import { togglePostLike, updatePost, deletePost, togglePinPost } from "@/lib/actions/forum.actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { ThumbsUp, Pencil, Trash2, Pin, X, Check, Loader2 } from "lucide-react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface PostActionsProps {
  postId: string
  liked: boolean
  likesCount: number
  isAuthor: boolean
  isAdmin: boolean
  isPinned: boolean
  postTitle: string
  postContent: string
}

export function PostActions({
  postId,
  liked,
  likesCount,
  isAuthor,
  isAdmin,
  isPinned,
  postTitle,
  postContent,
}: PostActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(postTitle)
  const [editContent, setEditContent] = useState(postContent)
  const [showDelete, setShowDelete] = useState(false)
  const router = useRouter()

  function handleLike() {
    startTransition(async () => {
      await togglePostLike(postId)
      router.refresh()
    })
  }

  function handleEdit() {
    startTransition(async () => {
      const result = await updatePost(postId, { title: editTitle, content: editContent })
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Post updated")
      setEditing(false)
      router.refresh()
    })
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deletePost(postId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Post deleted")
      router.push("/forum")
    })
  }

  function handlePin() {
    startTransition(async () => {
      const result = await togglePinPost(postId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(result.pinned ? "Post pinned" : "Post unpinned")
      router.refresh()
    })
  }

  if (editing) {
    return (
      <Card>
        <CardContent className="p-4 space-y-3">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Post title"
            maxLength={300}
          />
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Post content"
            rows={8}
            maxLength={50000}
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleEdit} disabled={isPending}>
              {isPending ? <Loader2 className="size-3.5 mr-1 animate-spin" /> : <Check className="size-3.5 mr-1" />}
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditing(false)
                setEditTitle(postTitle)
                setEditContent(postContent)
              }}
            >
              <X className="size-3.5 mr-1" />Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant={liked ? "default" : "outline"} size="sm" onClick={handleLike} disabled={isPending}>
          <ThumbsUp className="size-3.5 mr-1" />{likesCount}
        </Button>

        {isAuthor && (
          <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="size-3.5 mr-1" />Edit
          </Button>
        )}

        {(isAuthor || isAdmin) && (
          <Button
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="size-3.5 mr-1" />Delete
          </Button>
        )}

        {isAdmin && (
          <Button variant="ghost" size="sm" onClick={handlePin} disabled={isPending}>
            <Pin className={`size-3.5 mr-1 ${isPinned ? "text-amber-500" : ""}`} />
            {isPinned ? "Unpin" : "Pin"}
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Delete this post?"
        description="This will permanently delete your post and all its comments. This action cannot be undone."
        confirmLabel="Delete Post"
        onConfirm={handleDelete}
      />
    </>
  )
}

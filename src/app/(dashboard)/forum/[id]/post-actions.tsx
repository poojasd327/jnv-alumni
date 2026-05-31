"use client"

import { useTransition } from "react"
import { togglePostLike } from "@/lib/actions/forum.actions"
import { Button } from "@/components/ui/button"
import { ThumbsUp } from "lucide-react"
import { useRouter } from "next/navigation"

export function PostActions({ postId, liked, likesCount }: { postId: string; liked: boolean; likesCount: number }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleLike() {
    startTransition(async () => {
      await togglePostLike(postId)
      router.refresh()
    })
  }

  return (
    <Button variant={liked ? "default" : "outline"} size="sm" onClick={handleLike} disabled={isPending}>
      <ThumbsUp className="size-3.5 mr-1" />{likesCount}
    </Button>
  )
}

"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { getOrCreateConversation } from "@/lib/actions/messages.actions"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { toast } from "sonner"

export function MessageButton({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleClick() {
    startTransition(async () => {
      const result = await getOrCreateConversation(userId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      if (result.conversationId) {
        router.push(`/messages/${result.conversationId}`)
      }
    })
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={isPending}>
      <Mail className="size-4 mr-1.5" />
      {isPending ? "Opening..." : "Message"}
    </Button>
  )
}

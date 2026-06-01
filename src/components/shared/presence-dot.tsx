"use client"

import { usePresenceContext } from "@/components/providers/presence-provider"
import { cn } from "@/lib/utils"

/**
 * Shows a green dot when the given user is online.
 * Place this as a sibling of an Avatar inside a relative container.
 */
export function PresenceDot({ userId, className }: { userId: string; className?: string }) {
  const { isOnline } = usePresenceContext()

  if (!isOnline(userId)) return null

  return (
    <span
      className={cn(
        "absolute bottom-0 right-0 size-3 rounded-full bg-green-500 ring-2 ring-background",
        className
      )}
      title="Online"
    />
  )
}

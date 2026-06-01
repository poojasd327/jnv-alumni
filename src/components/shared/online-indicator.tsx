"use client"

import { cn } from "@/lib/utils"

interface OnlineIndicatorProps {
  isOnline: boolean
  className?: string
  size?: "sm" | "md"
}

export function OnlineIndicator({ isOnline, className, size = "sm" }: OnlineIndicatorProps) {
  if (!isOnline) return null

  return (
    <span
      className={cn(
        "rounded-full bg-green-500 ring-2 ring-background",
        size === "sm" ? "size-2.5" : "size-3",
        className
      )}
      title="Online"
    />
  )
}

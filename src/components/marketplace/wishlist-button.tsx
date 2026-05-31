"use client"

import { useState, useTransition } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toggleWishlist } from "@/lib/actions/wishlist.actions"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  listingId: string
  initialWishlisted?: boolean
  size?: "sm" | "default"
}

export function WishlistButton({ listingId, initialWishlisted = false, size = "sm" }: WishlistButtonProps) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted)
  const [isPending, startTransition] = useTransition()

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    startTransition(async () => {
      const result = await toggleWishlist(listingId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      setWishlisted(result.wishlisted ?? false)
      toast.success(result.wishlisted ? "Added to wishlist" : "Removed from wishlist")
    })
  }

  return (
    <Button
      variant="ghost"
      size={size === "sm" ? "icon" : "default"}
      className={cn("shrink-0", size === "sm" && "h-8 w-8")}
      onClick={handleToggle}
      disabled={isPending}
    >
      <Heart
        className={cn(
          "h-4 w-4",
          wishlisted && "fill-red-500 text-red-500"
        )}
      />
    </Button>
  )
}

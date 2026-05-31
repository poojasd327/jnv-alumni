"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { updateListingStatus } from "@/lib/actions/marketplace.actions"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { CheckCircle } from "lucide-react"
import { toast } from "sonner"

export function MarkAsSoldButton({ listingId }: { listingId: string }) {
  const router = useRouter()
  const [showConfirm, setShowConfirm] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleConfirm() {
    startTransition(async () => {
      const result = await updateListingStatus(listingId, "sold")
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Listing marked as sold")
      router.refresh()
    })
  }

  return (
    <>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        Mark as Sold
      </Button>
      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Mark this listing as sold?"
        description="This will mark the item as sold and it will no longer appear as available to other users. You can change this later from My Listings."
        confirmLabel="Mark as Sold"
        variant="default"
        onConfirm={handleConfirm}
      />
    </>
  )
}

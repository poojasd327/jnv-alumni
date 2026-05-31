"use client"

import { useState, useTransition } from "react"
import { registerForEvent, unregisterFromEvent } from "@/lib/actions/events.actions"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function EventActions({ eventId, isRegistered }: { eventId: string; isRegistered: boolean }) {
  const [isPending, startTransition] = useTransition()
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  function handleRegister() {
    startTransition(async () => {
      const result = await registerForEvent(eventId)
      if (result.error) { toast.error(result.error); return }
      toast.success("Registered!")
      router.refresh()
    })
  }

  function handleUnregister() {
    startTransition(async () => {
      const result = await unregisterFromEvent(eventId)
      if (result.error) { toast.error(result.error); return }
      toast.success("Unregistered")
      router.refresh()
    })
  }

  return (
    <>
      <Button
        onClick={isRegistered ? () => setShowConfirm(true) : handleRegister}
        disabled={isPending}
        variant={isRegistered ? "outline" : "default"}
      >
        {isPending ? "..." : isRegistered ? "Cancel Registration" : "Register for Event"}
      </Button>

      <ConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Cancel registration?"
        description="You will lose your spot in this event. You can register again later if spots are still available."
        confirmLabel="Cancel Registration"
        onConfirm={handleUnregister}
      />
    </>
  )
}

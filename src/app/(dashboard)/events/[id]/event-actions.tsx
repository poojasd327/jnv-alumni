"use client"

import { useState, useTransition } from "react"
import { registerForEvent, unregisterFromEvent } from "@/lib/actions/events.actions"
import { Button } from "@/components/ui/button"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { CalendarCheck, CalendarX, Loader2 } from "lucide-react"

export function EventActions({ eventId, isRegistered }: { eventId: string; isRegistered: boolean }) {
  const [isPending, startTransition] = useTransition()
  const [showConfirm, setShowConfirm] = useState(false)
  const router = useRouter()

  function handleRegister() {
    startTransition(async () => {
      const result = await registerForEvent(eventId)
      if (result.error) { toast.error(result.error); return }
      toast.success("You're registered! Check your email for confirmation details.")
      router.refresh()
    })
  }

  function handleUnregister() {
    startTransition(async () => {
      const result = await unregisterFromEvent(eventId)
      if (result.error) { toast.error(result.error); return }
      toast.success("Registration cancelled")
      router.refresh()
    })
  }

  if (isRegistered) {
    return (
      <div className="flex flex-col gap-3 rounded-lg border bg-green-50 p-4 dark:bg-green-950/20">
        <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
          <CalendarCheck className="size-5" />
          You are registered for this event
        </div>
        <Button
          onClick={() => setShowConfirm(true)}
          disabled={isPending}
          variant="outline"
          size="sm"
          className="w-fit"
        >
          {isPending ? (
            <><Loader2 className="size-4 animate-spin" /> Cancelling...</>
          ) : (
            <><CalendarX className="size-4" /> Cancel Registration</>
          )}
        </Button>

        <ConfirmDialog
          open={showConfirm}
          onOpenChange={setShowConfirm}
          title="Cancel registration?"
          description="You will lose your spot in this event. You can register again later if spots are still available."
          confirmLabel="Cancel Registration"
          onConfirm={handleUnregister}
        />
      </div>
    )
  }

  return (
    <Button
      onClick={handleRegister}
      disabled={isPending}
      size="lg"
      className="w-full sm:w-auto"
    >
      {isPending ? (
        <><Loader2 className="size-4 animate-spin" /> Registering...</>
      ) : (
        <><CalendarCheck className="size-4" /> Register for Event</>
      )}
    </Button>
  )
}

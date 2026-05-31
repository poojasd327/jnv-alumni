"use client"

import { useTransition } from "react"
import { applyToJob } from "@/lib/actions/jobs.actions"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function ApplyForm({ jobId }: { jobId: string }) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await applyToJob(jobId, {
        cover_note: formData.get("cover_note") as string,
      })

      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Application submitted!")
      router.refresh()
    })
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="font-semibold mb-3">Apply for this position</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cover_note">Cover Note</Label>
            <Textarea id="cover_note" name="cover_note" rows={4} placeholder="Tell the poster why you're interested..." />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit Application"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

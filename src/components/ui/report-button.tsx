"use client"

import { useState, useTransition } from "react"
import { Flag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { submitReport } from "@/lib/actions/report.actions"

const REASONS = [
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "inappropriate", label: "Inappropriate Content" },
  { value: "misinformation", label: "Misinformation" },
  { value: "fraud", label: "Fraud / Scam" },
  { value: "other", label: "Other" },
] as const

type ContentType =
  | "forum_post"
  | "forum_comment"
  | "marketplace_listing"
  | "job"
  | "event"
  | "business"
  | "media"
  | "profile"
  | "announcement"

interface ReportButtonProps {
  contentType: ContentType
  contentId: string
}

export function ReportButton({ contentType, contentId }: ReportButtonProps) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [description, setDescription] = useState("")
  const [result, setResult] = useState<{ success?: boolean; error?: string } | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    if (!reason) return

    startTransition(async () => {
      const res = await submitReport({
        contentType,
        contentId,
        reason: reason as (typeof REASONS)[number]["value"],
        description: description || undefined,
      })
      setResult(res)
      if (res.success) {
        setTimeout(() => {
          setOpen(false)
          setResult(null)
          setReason("")
          setDescription("")
        }, 2000)
      }
    })
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive transition-colors"
      >
        <Flag className="size-3.5" />
        Report
      </button>

      {open && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50" onClick={() => !isPending && setOpen(false)} />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4">
            <div className="rounded-xl border bg-card p-6 shadow-2xl space-y-4">
              <div>
                <h3 className="text-lg font-semibold">Report Content</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Help us keep the community safe. Select a reason for your report.
                </p>
              </div>

              {result?.success ? (
                <div className="rounded-lg bg-green-500/10 border border-green-500/20 p-4 text-center">
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Report submitted. Thank you for helping keep our community safe.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Reason</label>
                    <div className="grid grid-cols-2 gap-2">
                      {REASONS.map((r) => (
                        <button
                          key={r.value}
                          type="button"
                          onClick={() => setReason(r.value)}
                          className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                            reason === r.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "hover:bg-muted"
                          }`}
                        >
                          {r.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Additional details <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Provide more context about this report..."
                      className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      rows={3}
                    />
                  </div>

                  {result?.error && (
                    <p className="text-sm text-destructive">{result.error}</p>
                  )}

                  <div className="flex gap-2 justify-end">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setOpen(false)}
                      disabled={isPending}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleSubmit}
                      disabled={!reason || isPending}
                    >
                      {isPending ? "Submitting..." : "Submit Report"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

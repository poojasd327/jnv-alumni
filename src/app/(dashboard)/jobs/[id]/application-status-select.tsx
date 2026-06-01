"use client"

import { useTransition } from "react"
import { updateApplicationStatus } from "@/lib/actions/jobs.actions"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

const STATUS_OPTIONS = [
  { value: "applied", label: "Applied", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "under_review", label: "Under Review", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { value: "interview", label: "Interview", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { value: "selected", label: "Selected", color: "bg-green-100 text-green-700 border-green-200" },
  { value: "rejected", label: "Rejected", color: "bg-red-100 text-red-700 border-red-200" },
]

interface ApplicationStatusSelectProps {
  applicationId: string
  currentStatus: string
}

export function ApplicationStatusSelect({ applicationId, currentStatus }: ApplicationStatusSelectProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    if (newStatus === currentStatus) return

    startTransition(async () => {
      const result = await updateApplicationStatus(applicationId, newStatus)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(`Status updated to ${newStatus.replace("_", " ")}`)
      router.refresh()
    })
  }

  const current = STATUS_OPTIONS.find((s) => s.value === currentStatus)
  const colorClass = current?.color || "bg-muted text-foreground border-border"

  return (
    <select
      value={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className={`rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring ${colorClass} ${isPending ? "opacity-50" : ""}`}
    >
      {STATUS_OPTIONS.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  )
}

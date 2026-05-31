"use client"

import { useState, useTransition } from "react"
import { reviewReport } from "@/lib/actions/report.actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Check, X, ExternalLink, AlertTriangle } from "lucide-react"
import Link from "next/link"

interface Report {
  id: string
  content_type: string
  content_id: string
  reason: string
  description: string | null
  status: string
  created_at: string
  reporter: { full_name: string; avatar_url: string | null } | { full_name: string; avatar_url: string | null }[] | null
}

const CONTENT_TYPE_LABELS: Record<string, string> = {
  forum_post: "Forum Post",
  forum_comment: "Comment",
  marketplace_listing: "Listing",
  job: "Job",
  event: "Event",
  business: "Business",
  media: "Media",
  profile: "Profile",
}

const CONTENT_TYPE_URLS: Record<string, string> = {
  forum_post: "/forum",
  marketplace_listing: "/marketplace",
  job: "/jobs",
  event: "/events",
  business: "/businesses",
  media: "/media",
  profile: "/directory",
}

const REASON_COLORS: Record<string, string> = {
  spam: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  harassment: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  inappropriate: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  misinformation: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  fraud: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

const STATUS_FILTERS = [
  { value: "pending", label: "Pending" },
  { value: "action_taken", label: "Action Taken" },
  { value: "dismissed", label: "Dismissed" },
  { value: "all", label: "All" },
]

export function ReportQueue({ reports, currentStatus }: { reports: Report[]; currentStatus: string }) {
  return (
    <div className="space-y-4">
      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {STATUS_FILTERS.map((filter) => (
          <Button
            key={filter.value}
            variant={currentStatus === filter.value ? "default" : "outline"}
            size="sm"
            render={<Link href={`/admin/reports?status=${filter.value}`} />}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Reports list */}
      <div className="space-y-3">
        {reports.map((report) => (
          <ReportCard key={report.id} report={report} />
        ))}
      </div>
    </div>
  )
}

function ReportCard({ report }: { report: Report }) {
  const [adminNotes, setAdminNotes] = useState("")
  const [isPending, startTransition] = useTransition()
  const [handled, setHandled] = useState(false)

  const contentUrl = `${CONTENT_TYPE_URLS[report.content_type] || ""}/${report.content_id}`

  const handleAction = (action: "dismissed" | "action_taken") => {
    startTransition(async () => {
      const result = await reviewReport(report.id, action, adminNotes || undefined)
      if (result.success) setHandled(true)
    })
  }

  if (handled) {
    return (
      <Card className="opacity-60">
        <CardContent className="p-4 text-center text-sm text-muted-foreground">
          Report handled successfully.
        </CardContent>
      </Card>
    )
  }

  const reporter = Array.isArray(report.reporter) ? report.reporter[0] : report.reporter

  const initials = reporter?.full_name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?"

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{reporter?.full_name || "Unknown"}</p>
              <p className="text-xs text-muted-foreground">
                {new Date(report.created_at).toLocaleDateString()} &middot;{" "}
                {CONTENT_TYPE_LABELS[report.content_type] || report.content_type}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={REASON_COLORS[report.reason] || ""}>
              <AlertTriangle className="size-3 mr-1" />
              {report.reason}
            </Badge>
            <Button variant="outline" size="sm" render={<Link href={contentUrl} target="_blank" />}>
              <ExternalLink className="size-3 mr-1" /> View
            </Button>
          </div>
        </div>

        {report.description && (
          <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
            {report.description}
          </p>
        )}

        {report.status === "pending" && (
          <div className="space-y-2">
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Admin notes (optional)..."
              className="w-full rounded-lg border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
              rows={2}
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleAction("action_taken")}
                disabled={isPending}
              >
                <Check className="size-3 mr-1" />
                Take Action
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction("dismissed")}
                disabled={isPending}
              >
                <X className="size-3 mr-1" />
                Dismiss
              </Button>
            </div>
          </div>
        )}

        {report.status !== "pending" && (
          <Badge variant={report.status === "action_taken" ? "destructive" : "secondary"}>
            {report.status === "action_taken" ? "Action Taken" : "Dismissed"}
          </Badge>
        )}
      </CardContent>
    </Card>
  )
}

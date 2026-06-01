"use client"

import { useState, useEffect } from "react"
import { getMyApplications } from "@/lib/actions/jobs.actions"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

const STATUS_COLORS: Record<string, string> = {
  applied: "bg-blue-100 text-blue-700",
  under_review: "bg-yellow-100 text-yellow-700",
  interview: "bg-purple-100 text-purple-700",
  selected: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Record<string, unknown>[]>([])

  useEffect(() => {
    getMyApplications().then(setApplications)
  }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Applications</h1>
        <p className="text-sm text-muted-foreground mt-1">Track your job applications</p>
      </div>

      {applications.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <FileText className="size-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No applications yet</h3>
          <p className="text-muted-foreground mt-1">Browse jobs posted by fellow alumni and start applying</p>
          <Button className="mt-4" render={<Link href="/jobs" />}>Browse Jobs</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => {
            const job = app.jobs as { id: string; title: string; company: string; status: string } | null
            return (
              <Card key={app.id as string}>
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    {job && (
                      <Link href={`/jobs/${job.id}`} className="font-medium hover:underline">{job.title}</Link>
                    )}
                    <p className="text-sm text-muted-foreground">
                      {job?.company} &middot; Applied {formatDate(app.created_at as string)}
                    </p>
                  </div>
                  <Badge className={STATUS_COLORS[app.status as string] || ""}>{(app.status as string).replace("_", " ")}</Badge>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

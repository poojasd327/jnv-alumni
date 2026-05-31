"use client"

import { useState, useEffect, useTransition } from "react"
import { getMyJobs, deleteJob } from "@/lib/actions/jobs.actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { Briefcase, Plus, XCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Link from "next/link"
import { toast } from "sonner"

const STATUS_COLORS: Record<string, string> = {
  open: "bg-green-100 text-green-700",
  closed: "bg-gray-100 text-gray-700",
  filled: "bg-blue-100 text-blue-700",
}

export default function MyJobsPage() {
  const [jobs, setJobs] = useState<Record<string, unknown>[]>([])
  const [isPending, startTransition] = useTransition()
  const [confirmClose, setConfirmClose] = useState<string | null>(null)

  useEffect(() => { loadJobs() }, [])

  async function loadJobs() {
    const data = await getMyJobs()
    setJobs(data)
  }

  function handleClose(id: string) {
    startTransition(async () => {
      const result = await deleteJob(id)
      if (result.error) { toast.error(result.error); return }
      toast.success("Job closed")
      loadJobs()
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Job Posts</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your job postings</p>
        </div>
        <Button className="w-full sm:w-auto" render={<Link href="/jobs/new" />}><Plus className="size-4 mr-1" />Post Job</Button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Briefcase className="size-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No jobs posted yet</h3>
          <Button className="mt-4" render={<Link href="/jobs/new" />}>Post Your First Job</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <Card key={job.id as string}>
              <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <Link href={`/jobs/${job.id}`} className="font-medium hover:underline">{job.title as string}</Link>
                  <p className="text-sm text-muted-foreground">{job.company as string} &middot; {formatDate(job.created_at as string)}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={STATUS_COLORS[job.status as string] || ""}>{job.status as string}</Badge>
                  {job.status === "open" && (
                    <Button variant="outline" size="sm" onClick={() => setConfirmClose(job.id as string)} disabled={isPending}>
                      <XCircle className="size-3 mr-1" />Close
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <ConfirmDialog
        open={!!confirmClose}
        onOpenChange={(open) => { if (!open) setConfirmClose(null) }}
        title="Close this job?"
        description="This will mark the job as closed. Applicants will no longer be able to apply. This action cannot be undone."
        confirmLabel="Close Job"
        onConfirm={() => { if (confirmClose) handleClose(confirmClose) }}
      />
    </div>
  )
}

import { getReports, getPendingReportsCount } from "@/lib/actions/report.actions"
import { ReportQueue } from "@/components/admin/report-queue"
import { AdminExportButton } from "@/components/admin/admin-export-button"
import { Flag } from "lucide-react"

export const metadata = { title: "Admin - Reports" }

export default async function AdminReportsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const { reports } = await getReports(params)
  const pendingCount = await getPendingReportsCount()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Content Reports</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review reported content and take action ({pendingCount} pending)
          </p>
        </div>
        <AdminExportButton type="reports" label="Export Reports CSV" />
      </div>

      {reports.length > 0 ? (
        <ReportQueue reports={reports as unknown as Parameters<typeof ReportQueue>[0]["reports"]} currentStatus={params.status || "pending"} />
      ) : (
        <div className="text-center py-8 sm:py-12">
          <Flag className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No reports found</h3>
          <p className="text-muted-foreground mt-1">
            {params.status === "pending" || !params.status
              ? "No pending reports to review"
              : "No reports match this filter"}
          </p>
        </div>
      )}
    </div>
  )
}

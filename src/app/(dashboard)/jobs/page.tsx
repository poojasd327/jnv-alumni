import { getJobs } from "@/lib/actions/jobs.actions"
import { JobCard } from "@/components/jobs/job-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Plus, Briefcase, Search } from "lucide-react"

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const { jobs, count } = await getJobs(params)
  const pageSize = 12
  const currentPage = Number(params.page) || 1
  const totalPages = Math.ceil(count / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jobs & Referrals</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Find opportunities or help fellow alumni
          </p>
        </div>
        <Button render={<Link href="/jobs/new" />}>
          <Plus className="size-4 mr-1" />
          Post a Job
        </Button>
      </div>

      <form className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            name="q"
            placeholder="Search jobs..."
            defaultValue={params.q}
            className="pl-9"
          />
        </div>
        <Input name="city" placeholder="City" defaultValue={params.city} className="w-32" />
        <Button type="submit" variant="outline">Search</Button>
      </form>

      <div className="flex gap-2 text-sm">
        <Button
          variant={!params.type ? "default" : "outline"}
          size="sm"
          render={<Link href="/jobs" />}
        >
          All
        </Button>
        {["full_time", "part_time", "contract", "internship"].map((t) => (
          <Button
            key={t}
            variant={params.type === t ? "default" : "outline"}
            size="sm"
            render={<Link href={`/jobs?type=${t}${params.q ? `&q=${params.q}` : ""}`} />}
          >
            {t.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
          </Button>
        ))}
        <Button
          variant={params.referral === "true" ? "default" : "outline"}
          size="sm"
          render={<Link href={`/jobs?referral=true${params.q ? `&q=${params.q}` : ""}`} />}
        >
          Referral Available
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12">
          <Briefcase className="size-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No jobs found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job: Record<string, unknown>) => (
              <JobCard key={job.id as string} job={job as never} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {currentPage > 1 && (
                <Button variant="outline" size="sm" render={<Link href={`/jobs?page=${currentPage - 1}${params.q ? `&q=${params.q}` : ""}${params.type ? `&type=${params.type}` : ""}`} />}>
                  Previous
                </Button>
              )}
              <span className="flex items-center text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              {currentPage < totalPages && (
                <Button variant="outline" size="sm" render={<Link href={`/jobs?page=${currentPage + 1}${params.q ? `&q=${params.q}` : ""}${params.type ? `&type=${params.type}` : ""}`} />}>
                  Next
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export const metadata = { title: "Jobs Board", description: "Browse and post job opportunities within the JNV alumni network." }

import { getJobs } from "@/lib/actions/jobs.actions"
import { JobCard } from "@/components/jobs/job-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Plus, Briefcase, Search } from "lucide-react"
import { Pagination } from "@/components/shared/pagination"

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Jobs & Referrals</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Find opportunities or help fellow alumni
          </p>
        </div>
        <Button className="w-full sm:w-auto" render={<Link href="/jobs/new" />}>
          <Plus className="size-4 mr-1" />
          Post a Job
        </Button>
      </div>

      <form className="flex flex-col gap-2 sm:flex-row" role="search" aria-label="Search jobs">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" aria-hidden="true" />
          <Input
            name="q"
            placeholder="Search jobs..."
            defaultValue={params.q}
            className="pl-9"
            aria-label="Search jobs"
          />
        </div>
        <Input name="city" placeholder="City" defaultValue={params.city} className="w-full sm:w-32" aria-label="Filter by city" />
        <Button type="submit" variant="outline">Search</Button>
      </form>

      <nav className="flex flex-wrap gap-2 text-sm" aria-label="Job type filters">
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
      </nav>

      {jobs.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Briefcase className="size-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No jobs found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your filters or post a new opportunity</p>
          <Button className="mt-4" render={<Link href="/jobs/new" />}>Post a Job</Button>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job: Record<string, unknown>) => (
              <JobCard key={job.id as string} job={job as never} />
            ))}
          </div>

          {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} />}
        </>
      )}
    </div>
  )
}

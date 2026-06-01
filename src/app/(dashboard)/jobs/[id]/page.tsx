import type { Metadata } from "next"
import { getJobById, checkIfApplied, getJobApplications } from "@/lib/actions/jobs.actions"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Briefcase, IndianRupee, UserCheck, ExternalLink } from "lucide-react"
import { formatDate, getInitials } from "@/lib/utils"
import Link from "next/link"
import { ShareButton } from "@/components/ui/share-button"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { ReportButton } from "@/components/ui/report-button"
import { ApplyForm } from "./apply-form"
import { ApplicationStatusSelect } from "./application-status-select"
import { JobOwnerActions } from "./job-owner-actions"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const job = await getJobById(id)
  if (!job) return { title: "Job Not Found" }
  const location = [job.location_city, job.location_state].filter(Boolean).join(", ")
  return {
    title: job.title,
    description: `${job.title} at ${job.company}${location ? ` in ${location}` : ""}. ${job.description?.slice(0, 150)}`,
    openGraph: {
      title: `${job.title} at ${job.company} | JNV Alumni Network`,
      description: job.description?.slice(0, 200),
      type: "article",
    },
  }
}

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: "Full Time", part_time: "Part Time", contract: "Contract",
  internship: "Internship", freelance: "Freelance",
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const job = await getJobById(id)
  if (!job) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === job.posted_by

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    isAdmin = profile?.role === "admin"
  }

  const hasApplied = user ? await checkIfApplied(id) : false
  const applications = (isOwner || isAdmin) ? await getJobApplications(id) : []

  const poster = job.profiles as { id: string; full_name: string; avatar_url: string | null; profession: string | null; company: string | null } | null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <Breadcrumbs items={[{ label: "Jobs", href: "/jobs" }, { label: `${job.title} at ${job.company}` }]} />
        <ShareButton title={`${job.title} at ${job.company}`} text={`Check out this job: ${job.title} at ${job.company} on JNV Alumni Network`} />
      </div>

      <div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div>
            <h1 className="text-2xl font-bold">{job.title}</h1>
            <p className="text-lg text-muted-foreground">{job.company}</p>
          </div>
          <Badge variant="outline" className="text-sm shrink-0">{JOB_TYPE_LABELS[job.job_type] || job.job_type}</Badge>
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          {(job.location_city || job.location_state) && (
            <span className="flex items-center gap-1"><MapPin className="size-4" />{job.location_city}{job.location_state ? `, ${job.location_state}` : ""}</span>
          )}
          {(job.salary_min || job.salary_max) && (
            <span className="flex items-center gap-1">
              <IndianRupee className="size-4" />
              {job.salary_min && job.salary_max
                ? `${(job.salary_min / 100000).toFixed(1)}L - ${(job.salary_max / 100000).toFixed(1)}L`
                : job.salary_min ? `From ${(job.salary_min / 100000).toFixed(1)}L` : `Up to ${((job.salary_max || 0) / 100000).toFixed(1)}L`}
            </span>
          )}
          {job.referral_available && (
            <Badge variant="secondary" className="text-green-700 bg-green-100"><UserCheck className="size-3 mr-1" />Referral Available</Badge>
          )}
        </div>

        {(job.experience_min !== null || job.experience_max !== null) && (
          <p className="mt-2 text-sm text-muted-foreground">
            <Briefcase className="inline size-4 mr-1" />
            Experience: {job.experience_min ?? 0} - {job.experience_max ?? "any"} years
          </p>
        )}
      </div>

      <Card>
        <CardContent className="p-6">
          <h2 className="font-semibold mb-3">Description</h2>
          <div className="whitespace-pre-wrap text-sm">{job.description}</div>
        </CardContent>
      </Card>

      {job.skills_required.length > 0 && (
        <div>
          <h2 className="font-semibold mb-2">Skills Required</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills_required.map((skill: string) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {job.contact_email && (
          <Button variant="outline" render={<a href={`mailto:${job.contact_email}`} />}>
            Email Poster
          </Button>
        )}
        {job.apply_url && (
          <Button variant="outline" render={<a href={job.apply_url} target="_blank" rel="noopener noreferrer" />}>
            <ExternalLink className="size-4 mr-1" /> Apply External
          </Button>
        )}
      </div>

      {poster && (
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Avatar>
              {poster.avatar_url && <AvatarImage src={poster.avatar_url} />}
              <AvatarFallback>{getInitials(poster.full_name)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{poster.full_name}</p>
              <p className="text-sm text-muted-foreground">{poster.profession}{poster.company ? ` at ${poster.company}` : ""}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {(isOwner || isAdmin) && (
        <JobOwnerActions
          jobId={id}
          title={job.title}
          company={job.company}
          description={job.description || ""}
          jobType={job.job_type}
          locationCity={job.location_city}
          locationState={job.location_state}
          salaryMin={job.salary_min}
          salaryMax={job.salary_max}
          experienceMin={job.experience_min}
          experienceMax={job.experience_max}
          skillsRequired={job.skills_required || []}
          referralAvailable={job.referral_available || false}
          contactEmail={job.contact_email}
          applyUrl={job.apply_url}
        />
      )}

      {!isOwner && !hasApplied && (
        <ApplyForm jobId={id} />
      )}
      {hasApplied && !isOwner && (
        <Card><CardContent className="p-4 text-center text-muted-foreground">You have already applied to this job.</CardContent></Card>
      )}

      {isOwner && applications.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Applications ({applications.length})</h2>
          <div className="space-y-3">
            {applications.map((app: Record<string, unknown>) => {
              const applicant = app.profiles as { id: string; full_name: string; avatar_url: string | null; profession: string | null } | null
              return (
                <Card key={app.id as string}>
                  <CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <Link href={applicant ? `/directory/${applicant.id}` : "#"} className="flex items-center gap-3 min-w-0 hover:opacity-80 transition-opacity">
                      <Avatar className="size-8 shrink-0">
                        {applicant?.avatar_url && <AvatarImage src={applicant.avatar_url} />}
                        <AvatarFallback className="text-xs">{applicant ? getInitials(applicant.full_name) : "?"}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{applicant?.full_name}</p>
                        <p className="text-xs text-muted-foreground truncate">{applicant?.profession} &middot; {formatDate(app.created_at as string)}</p>
                        {app.cover_note ? <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{String(app.cover_note)}</p> : null}
                      </div>
                    </Link>
                    <ApplicationStatusSelect applicationId={app.id as string} currentStatus={app.status as string} />
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Posted {formatDate(job.created_at)}</p>
        <ReportButton contentType="job" contentId={id} />
      </div>
    </div>
  )
}

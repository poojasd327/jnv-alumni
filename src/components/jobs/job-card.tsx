import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, IndianRupee, UserCheck } from "lucide-react"
import { formatDate } from "@/lib/utils"

const JOB_TYPE_LABELS: Record<string, string> = {
  full_time: "Full Time",
  part_time: "Part Time",
  contract: "Contract",
  internship: "Internship",
  freelance: "Freelance",
}

interface JobCardProps {
  job: {
    id: string
    title: string
    company: string
    location_city: string | null
    location_state: string | null
    job_type: string
    salary_min: number | null
    salary_max: number | null
    referral_available: boolean
    created_at: string
    skills_required: string[]
    profiles?: { full_name: string; avatar_url: string | null } | null
  }
}

export function JobCard({ job }: JobCardProps) {
  return (
    <Link href={`/jobs/${job.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold truncate">{job.title}</h3>
              <p className="text-sm text-muted-foreground">{job.company}</p>
            </div>
            {job.referral_available && (
              <Badge variant="secondary" className="shrink-0 text-green-700 bg-green-100">
                <UserCheck className="size-3 mr-1" />
                Referral
              </Badge>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Badge variant="outline">{JOB_TYPE_LABELS[job.job_type] || job.job_type}</Badge>
            {job.location_city && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                {job.location_city}{job.location_state ? `, ${job.location_state}` : ""}
              </span>
            )}
          </div>

          {(job.salary_min || job.salary_max) && (
            <div className="mt-2 flex items-center gap-1 text-sm text-muted-foreground">
              <IndianRupee className="size-3" />
              {job.salary_min && job.salary_max
                ? `${(job.salary_min / 100000).toFixed(1)}L - ${(job.salary_max / 100000).toFixed(1)}L`
                : job.salary_min
                ? `From ${(job.salary_min / 100000).toFixed(1)}L`
                : `Up to ${((job.salary_max || 0) / 100000).toFixed(1)}L`}
            </div>
          )}

          {job.skills_required.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {job.skills_required.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {job.skills_required.length > 3 && (
                <Badge variant="secondary" className="text-xs">+{job.skills_required.length - 3}</Badge>
              )}
            </div>
          )}

          <div className="mt-3 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="size-3" />
            {formatDate(job.created_at)}
            {job.profiles && <span className="ml-auto">by {job.profiles.full_name}</span>}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

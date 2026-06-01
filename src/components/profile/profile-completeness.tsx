import Link from "next/link"
import { CheckCircle2, Circle, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { Profile } from "@/lib/types/database.types"

interface ProfileCompletenessProps {
  profile: Profile
}

interface CheckItem {
  label: string
  completed: boolean
}

function getChecklist(profile: Profile): CheckItem[] {
  return [
    { label: "Add a profile photo", completed: !!profile.avatar_url },
    { label: "Add your profession", completed: !!profile.profession },
    { label: "Add your company", completed: !!profile.company },
    { label: "Add your city", completed: !!profile.city },
    { label: "Add your industry", completed: !!profile.industry },
    { label: "Add at least one skill", completed: !!(profile.skills && profile.skills.length > 0) },
    { label: "Write a bio", completed: !!profile.bio },
    { label: "Add LinkedIn profile", completed: !!profile.linkedin_url },
  ]
}

export function ProfileCompleteness({ profile }: ProfileCompletenessProps) {
  const checklist = getChecklist(profile)
  const completed = checklist.filter((c) => c.completed).length
  const total = checklist.length
  const percentage = Math.round((completed / total) * 100)

  if (percentage === 100) return null

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Complete Your Profile</CardTitle>
          <span className="text-sm font-medium text-muted-foreground">
            {percentage}%
          </span>
        </div>
        {/* Progress bar */}
        <div className="h-2 w-full rounded-full bg-muted">
          <div
            className="h-2 rounded-full bg-primary transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {checklist
          .filter((item) => !item.completed)
          .slice(0, 4)
          .map((item) => (
            <div key={item.label} className="flex items-center gap-2 text-sm">
              <Circle className="size-4 text-muted-foreground/50 shrink-0" />
              <span className="text-muted-foreground">{item.label}</span>
            </div>
          ))}
        {checklist.filter((item) => item.completed).length > 0 && (
          <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>{completed} of {total} completed</span>
          </div>
        )}
        <Button variant="outline" size="sm" className="mt-2 w-full" render={<Link href="/profile/edit" />}>
          Complete profile
          <ArrowRight className="size-3.5" />
        </Button>
      </CardContent>
    </Card>
  )
}

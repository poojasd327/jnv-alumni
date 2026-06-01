import Link from "next/link"
import { MapPin, GraduationCap, Briefcase } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getInitials } from "@/lib/utils"
import { PresenceDot } from "@/components/shared/presence-dot"
import type { Profile } from "@/lib/types/database.types"

interface AlumniCardProps {
  alumni: Profile
}

export function AlumniCard({ alumni }: AlumniCardProps) {
  const MAX_SKILLS = 3

  return (
    <Link href={`/directory/${alumni.id}`} className="block">
      <Card className="h-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <CardContent className="flex flex-col items-center gap-3 pt-6 text-center">
          <div className="relative">
            <Avatar className="size-16" size="lg">
              {alumni.avatar_url ? (
                <AvatarImage src={alumni.avatar_url} alt={alumni.full_name} />
              ) : null}
              <AvatarFallback className="text-base">
                {getInitials(alumni.full_name)}
              </AvatarFallback>
            </Avatar>
            <PresenceDot userId={alumni.id} />
          </div>

          <div className="space-y-1 min-w-0 w-full">
            <h3 className="font-semibold leading-snug truncate">{alumni.full_name}</h3>

            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <GraduationCap className="size-3 shrink-0" />
              <span className="truncate">
                {alumni.jnv_school} | {alumni.passing_year}
              </span>
            </div>

            {(alumni.profession || alumni.company) && (
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <Briefcase className="size-3 shrink-0" />
                <span className="truncate">
                  {alumni.profession}
                  {alumni.company && ` @ ${alumni.company}`}
                </span>
              </div>
            )}

            {alumni.city && (
              <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3" />
                <span>{alumni.city}</span>
              </div>
            )}
          </div>

          {alumni.skills && alumni.skills.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1">
              {alumni.skills.slice(0, MAX_SKILLS).map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
              {alumni.skills.length > MAX_SKILLS && (
                <Badge variant="outline">
                  +{alumni.skills.length - MAX_SKILLS}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

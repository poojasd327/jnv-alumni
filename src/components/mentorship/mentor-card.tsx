import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { MapPin, HandHelping } from "lucide-react"

interface MentorCardProps {
  mentor: {
    id: string
    full_name: string
    avatar_url: string | null
    profession: string | null
    company: string | null
    industry: string | null
    skills: string[] | null
    city: string | null
    state: string | null
  }
}

export function MentorCard({ mentor }: MentorCardProps) {
  return (
    <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Avatar className="size-12">
            {mentor.avatar_url && <AvatarImage src={mentor.avatar_url} />}
            <AvatarFallback>{getInitials(mentor.full_name)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold">{mentor.full_name}</h3>
            {mentor.profession && (
              <p className="text-sm text-muted-foreground">
                {mentor.profession}{mentor.company ? ` at ${mentor.company}` : ""}
              </p>
            )}
          </div>
        </div>

        {mentor.skills && mentor.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {mentor.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {mentor.skills.length > 3 && (
              <Badge variant="secondary" className="text-xs">+{mentor.skills.length - 3}</Badge>
            )}
          </div>
        )}

        {mentor.city && (
          <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {mentor.city}{mentor.state ? `, ${mentor.state}` : ""}
          </div>
        )}

        <Button
          className="mt-3 w-full"
          size="sm"
          variant="outline"
          render={<Link href={`/mentorship/my-requests?mentor=${mentor.id}`} />}
        >
          <HandHelping className="size-3.5 mr-1" />
          Request Mentorship
        </Button>
      </CardContent>
    </Card>
  )
}

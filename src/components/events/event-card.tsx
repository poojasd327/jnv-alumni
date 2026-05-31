import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Globe, Users } from "lucide-react"
import { formatDate } from "@/lib/utils"

const STATUS_COLORS: Record<string, string> = {
  upcoming: "bg-blue-100 text-blue-700",
  ongoing: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
}

interface EventCardProps {
  event: {
    id: string
    title: string
    event_date: string
    venue: string | null
    location_city: string | null
    is_online: boolean
    status: string
    max_attendees: number | null
    profiles?: { full_name: string } | null
  }
}

export function EventCard({ event }: EventCardProps) {
  return (
    <Link href={`/events/${event.id}`}>
      <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2 min-w-0">
            <h3 className="font-semibold line-clamp-2 min-w-0">{event.title}</h3>
            <Badge className={STATUS_COLORS[event.status] || ""}>
              {event.status}
            </Badge>
          </div>

          <div className="mt-3 space-y-1.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {formatDate(event.event_date)}
            </div>

            {event.is_online ? (
              <div className="flex items-center gap-1.5">
                <Globe className="size-3.5" />
                Online Event
              </div>
            ) : event.venue || event.location_city ? (
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {event.venue || event.location_city}
              </div>
            ) : null}

            {event.max_attendees && (
              <div className="flex items-center gap-1.5">
                <Users className="size-3.5" />
                Max {event.max_attendees} attendees
              </div>
            )}
          </div>

          {event.profiles && (
            <p className="mt-3 text-xs text-muted-foreground">
              Organized by {event.profiles.full_name}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

import { getEventById, isRegistered } from "@/lib/actions/events.actions"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Calendar, MapPin, Globe, Users } from "lucide-react"
import { formatDate, getInitials } from "@/lib/utils"
import Link from "next/link"
import { EventActions } from "./event-actions"

const STATUS_COLORS: Record<string, string> = {
  upcoming: "bg-blue-100 text-blue-700", ongoing: "bg-green-100 text-green-700",
  completed: "bg-gray-100 text-gray-700", cancelled: "bg-red-100 text-red-700",
}

export default async function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const event = await getEventById(id)
  if (!event) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === event.organizer_id
  const registered = user ? await isRegistered(id) : false

  const organizer = event.profiles as { id: string; full_name: string; avatar_url: string | null; profession: string | null } | null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" render={<Link href="/events" />}><ArrowLeft className="size-4 mr-1" /> Back to Events</Button>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <h1 className="text-2xl font-bold">{event.title}</h1>
        <Badge className={`shrink-0 ${STATUS_COLORS[event.status] || ""}`}>{event.status}</Badge>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><Calendar className="size-4" />{formatDate(event.event_date)}</span>
        {event.is_online ? (
          <span className="flex items-center gap-1"><Globe className="size-4" />Online</span>
        ) : event.venue ? (
          <span className="flex items-center gap-1"><MapPin className="size-4" />{event.venue}{event.location_city ? `, ${event.location_city}` : ""}</span>
        ) : null}
        <span className="flex items-center gap-1"><Users className="size-4" />{event.registration_count} registered{event.max_attendees ? ` / ${event.max_attendees} max` : ""}</span>
      </div>

      {event.is_online && event.meeting_url && (
        <Button variant="outline" render={<a href={event.meeting_url} target="_blank" rel="noopener noreferrer" />}>
          <Globe className="size-4 mr-1" /> Join Meeting
        </Button>
      )}

      <Card><CardContent className="p-6">
        <h2 className="font-semibold mb-3">About this event</h2>
        <div className="whitespace-pre-wrap text-sm">{event.description}</div>
      </CardContent></Card>

      {organizer && (
        <Card><CardContent className="p-4 flex items-center gap-3">
          <Avatar><AvatarImage src={organizer.avatar_url || ""} /><AvatarFallback>{getInitials(organizer.full_name)}</AvatarFallback></Avatar>
          <div>
            <p className="font-medium">{organizer.full_name}</p>
            <p className="text-sm text-muted-foreground">Organizer</p>
          </div>
        </CardContent></Card>
      )}

      {!isOwner && event.status === "upcoming" && (
        <EventActions eventId={id} isRegistered={registered} />
      )}
    </div>
  )
}

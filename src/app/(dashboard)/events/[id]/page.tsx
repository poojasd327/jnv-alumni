import type { Metadata } from "next"
import { getEventById, isRegistered } from "@/lib/actions/events.actions"
import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, MapPin, Globe, Users } from "lucide-react"
import { formatDate, getInitials } from "@/lib/utils"
import Link from "next/link"
import { ShareButton } from "@/components/ui/share-button"
import { Breadcrumbs } from "@/components/shared/breadcrumbs"
import { ReportButton } from "@/components/ui/report-button"
import { EventActions } from "./event-actions"
import { EventOwnerActions } from "./event-owner-actions"
import { JsonLd } from "@/components/shared/json-ld"

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const event = await getEventById(id)
  if (!event) return { title: "Event Not Found" }
  const location = event.is_online ? "Online" : [event.venue, event.location_city].filter(Boolean).join(", ")
  return {
    title: event.title,
    description: `${event.title}${location ? ` — ${location}` : ""}. ${event.description?.slice(0, 150)}`,
    openGraph: {
      title: `${event.title} | JNV Alumni Network`,
      description: event.description?.slice(0, 200),
      type: "article",
    },
  }
}

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

  let isAdmin = false
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
    isAdmin = profile?.role === "admin"
  }

  const organizer = event.profiles as { id: string; full_name: string; avatar_url: string | null; profession: string | null } | null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.title,
        description: event.description,
        startDate: event.event_date,
        ...(event.end_date ? { endDate: event.end_date } : {}),
        eventStatus: event.status === "cancelled"
          ? "https://schema.org/EventCancelled"
          : "https://schema.org/EventScheduled",
        eventAttendanceMode: event.is_online
          ? "https://schema.org/OnlineEventAttendanceMode"
          : "https://schema.org/OfflineEventAttendanceMode",
        ...(event.is_online ? {} : {
          location: {
            "@type": "Place",
            name: event.venue || undefined,
            address: {
              "@type": "PostalAddress",
              addressLocality: event.location_city,
              addressRegion: event.location_state,
              addressCountry: "IN",
            },
          },
        }),
        ...(event.max_attendees ? { maximumAttendeeCapacity: event.max_attendees } : {}),
        organizer: organizer ? { "@type": "Person", name: organizer.full_name } : undefined,
      }} />
      <div className="flex items-center justify-between">
        <Breadcrumbs items={[{ label: "Events", href: "/events" }, { label: event.title }]} />
        <ShareButton title={event.title} text={`Check out this event: ${event.title} on JNV Alumni Network`} />
      </div>

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

      {(isOwner || isAdmin) && (
        <EventOwnerActions
          eventId={id}
          eventTitle={event.title}
          eventDescription={event.description || ""}
          eventDate={event.event_date}
          endDate={event.end_date}
          venue={event.venue}
          locationCity={event.location_city}
          locationState={event.location_state}
          isOnline={event.is_online}
          meetingUrl={event.meeting_url}
          maxAttendees={event.max_attendees}
          status={event.status}
        />
      )}

      {!isOwner && event.status === "upcoming" && (
        <EventActions eventId={id} isRegistered={registered} />
      )}

      <div className="flex justify-end">
        <ReportButton contentType="event" contentId={id} />
      </div>
    </div>
  )
}

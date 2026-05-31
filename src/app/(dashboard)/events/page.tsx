import { getEvents } from "@/lib/actions/events.actions"
import { EventCard } from "@/components/events/event-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Plus, Calendar, Search } from "lucide-react"

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const params = await searchParams
  const { events, count } = await getEvents(params)
  const pageSize = 12
  const currentPage = Number(params.page) || 1
  const totalPages = Math.ceil(count / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Events & Meetups</h1>
          <p className="text-sm text-muted-foreground mt-1">Join alumni gatherings and events</p>
        </div>
        <Button className="w-full sm:w-auto" render={<Link href="/events/new" />}><Plus className="size-4 mr-1" />Create Event</Button>
      </div>

      <form className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input name="q" placeholder="Search events..." defaultValue={params.q} className="pl-9" />
        </div>
        <Button type="submit" variant="outline">Search</Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Button variant={!params.status ? "default" : "outline"} size="sm" render={<Link href="/events" />}>All</Button>
        <Button variant={params.status === "upcoming" ? "default" : "outline"} size="sm" render={<Link href="/events?status=upcoming" />}>Upcoming</Button>
        <Button variant={params.status === "past" ? "default" : "outline"} size="sm" render={<Link href="/events?status=past" />}>Past</Button>
      </div>

      {events.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Calendar className="size-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No events found</h3>
          <p className="text-muted-foreground mt-1">Be the first to create an event</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event: Record<string, unknown>) => (
              <EventCard key={event.id as string} event={event as never} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {currentPage > 1 && <Button variant="outline" size="sm" render={<Link href={`/events?page=${currentPage - 1}&status=${params.status || ""}`} />}>Previous</Button>}
              <span className="flex items-center text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
              {currentPage < totalPages && <Button variant="outline" size="sm" render={<Link href={`/events?page=${currentPage + 1}&status=${params.status || ""}`} />}>Next</Button>}
            </div>
          )}
        </>
      )}
    </div>
  )
}

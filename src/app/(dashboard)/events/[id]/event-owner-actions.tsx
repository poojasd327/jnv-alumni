"use client"

import { useState, useTransition } from "react"
import { updateEvent, deleteEvent, cancelEvent } from "@/lib/actions/events.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2, X, Check, Loader2, Ban } from "lucide-react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface EventOwnerActionsProps {
  eventId: string
  eventTitle: string
  eventDescription: string
  eventDate: string
  endDate: string | null
  venue: string | null
  locationCity: string | null
  locationState: string | null
  isOnline: boolean
  meetingUrl: string | null
  maxAttendees: number | null
  status: string
}

export function EventOwnerActions({
  eventId,
  eventTitle,
  eventDescription,
  eventDate,
  endDate,
  venue,
  locationCity,
  locationState,
  isOnline,
  meetingUrl,
  maxAttendees,
  status,
}: EventOwnerActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [showCancel, setShowCancel] = useState(false)
  const router = useRouter()

  const [form, setForm] = useState({
    title: eventTitle,
    description: eventDescription,
    event_date: eventDate ? new Date(eventDate).toISOString().slice(0, 16) : "",
    end_date: endDate ? new Date(endDate).toISOString().slice(0, 16) : "",
    venue: venue || "",
    location_city: locationCity || "",
    location_state: locationState || "",
    is_online: isOnline,
    meeting_url: meetingUrl || "",
    max_attendees: maxAttendees?.toString() || "",
  })

  function handleSave() {
    startTransition(async () => {
      const result = await updateEvent(eventId, {
        title: form.title,
        description: form.description,
        event_date: form.event_date ? new Date(form.event_date).toISOString() : eventDate,
        end_date: form.end_date ? new Date(form.end_date).toISOString() : null,
        venue: form.venue || null,
        location_city: form.location_city || null,
        location_state: form.location_state || null,
        is_online: form.is_online,
        meeting_url: form.meeting_url || null,
        max_attendees: form.max_attendees ? parseInt(form.max_attendees) : null,
      })
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Event updated")
      setEditing(false)
      router.refresh()
    })
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteEvent(eventId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Event deleted")
      router.push("/events")
    })
  }

  function handleCancel() {
    startTransition(async () => {
      const result = await cancelEvent(eventId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Event cancelled")
      router.refresh()
    })
  }

  if (editing) {
    return (
      <Card>
        <CardContent className="p-4 space-y-3">
          <Input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Event title"
            maxLength={200}
          />
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Event description"
            rows={6}
            maxLength={10000}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs text-muted-foreground">Start Date</label>
              <Input
                type="datetime-local"
                value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">End Date</label>
              <Input
                type="datetime-local"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              value={form.venue}
              onChange={(e) => setForm({ ...form, venue: e.target.value })}
              placeholder="Venue"
            />
            <Input
              value={form.location_city}
              onChange={(e) => setForm({ ...form, location_city: e.target.value })}
              placeholder="City"
            />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              value={form.location_state}
              onChange={(e) => setForm({ ...form, location_state: e.target.value })}
              placeholder="State"
            />
            <Input
              value={form.max_attendees}
              onChange={(e) => setForm({ ...form, max_attendees: e.target.value })}
              placeholder="Max attendees (leave empty for unlimited)"
              type="number"
              min={1}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_online}
                onChange={(e) => setForm({ ...form, is_online: e.target.checked })}
                className="rounded"
              />
              Online event
            </label>
          </div>
          {form.is_online && (
            <Input
              value={form.meeting_url}
              onChange={(e) => setForm({ ...form, meeting_url: e.target.value })}
              placeholder="Meeting URL"
              type="url"
            />
          )}
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave} disabled={isPending}>
              {isPending ? <Loader2 className="size-3.5 mr-1 animate-spin" /> : <Check className="size-3.5 mr-1" />}
              Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditing(false)
                setForm({
                  title: eventTitle,
                  description: eventDescription,
                  event_date: eventDate ? new Date(eventDate).toISOString().slice(0, 16) : "",
                  end_date: endDate ? new Date(endDate).toISOString().slice(0, 16) : "",
                  venue: venue || "",
                  location_city: locationCity || "",
                  location_state: locationState || "",
                  is_online: isOnline,
                  meeting_url: meetingUrl || "",
                  max_attendees: maxAttendees?.toString() || "",
                })
              }}
            >
              <X className="size-3.5 mr-1" />Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
          <Pencil className="size-3.5 mr-1" />Edit
        </Button>
        {status === "upcoming" && (
          <Button
            variant="ghost"
            size="sm"
            className="text-amber-600 hover:text-amber-600"
            onClick={() => setShowCancel(true)}
          >
            <Ban className="size-3.5 mr-1" />Cancel Event
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => setShowDelete(true)}
        >
          <Trash2 className="size-3.5 mr-1" />Delete
        </Button>
      </div>

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Delete this event?"
        description="This will permanently delete the event and all registrations. This action cannot be undone."
        confirmLabel="Delete Event"
        onConfirm={handleDelete}
      />
      <ConfirmDialog
        open={showCancel}
        onOpenChange={setShowCancel}
        title="Cancel this event?"
        description="This will mark the event as cancelled. Attendees will still see it but cannot register. You can't undo this."
        confirmLabel="Cancel Event"
        onConfirm={handleCancel}
      />
    </>
  )
}

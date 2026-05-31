"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createEvent } from "@/lib/actions/events.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { INDIAN_STATES } from "@/lib/constants"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function NewEventPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [locationState, setLocationState] = useState("")
  const [isOnline, setIsOnline] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)

    startTransition(async () => {
      const result = await createEvent({
        title: fd.get("title") as string,
        description: fd.get("description") as string,
        event_date: fd.get("event_date") as string,
        end_date: (fd.get("end_date") as string) || undefined,
        venue: fd.get("venue") as string,
        location_city: fd.get("location_city") as string,
        location_state: locationState,
        is_online: isOnline,
        meeting_url: fd.get("meeting_url") as string,
        max_attendees: fd.get("max_attendees") ? Number(fd.get("max_attendees")) : null,
      })

      if (result.error) { toast.error(result.error); return }
      toast.success("Event created!")
      router.push("/events")
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button render={<Link href="/events" />} variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button>
        <h1 className="text-2xl font-bold">Create Event</h1>
      </div>
      <Card><CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input id="title" name="title" placeholder="e.g., Bangalore Alumni Meetup" required maxLength={200} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea id="description" name="description" rows={4} required maxLength={10000} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="event_date">Start Date & Time *</Label>
              <Input id="event_date" name="event_date" type="datetime-local" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="end_date">End Date & Time</Label>
              <Input id="end_date" name="end_date" type="datetime-local" />
            </div>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={isOnline} onChange={(e) => setIsOnline(e.target.checked)} className="rounded" />
            <span className="text-sm">This is an online event</span>
          </label>

          {isOnline ? (
            <div className="space-y-2">
              <Label htmlFor="meeting_url">Meeting URL</Label>
              <Input id="meeting_url" name="meeting_url" type="url" placeholder="https://meet.google.com/..." />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="venue">Venue</Label>
                <Input id="venue" name="venue" placeholder="e.g., Hotel Taj, MG Road" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location_city">City</Label>
                  <Input id="location_city" name="location_city" />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Select value={locationState} onValueChange={(val) => setLocationState(val ?? "")}>
                    <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                    <SelectContent>
                      {INDIAN_STATES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="max_attendees">Max Attendees (optional)</Label>
            <Input id="max_attendees" name="max_attendees" type="number" min={1} />
          </div>
          <Button type="submit" disabled={isPending} className="w-full">{isPending ? "Creating..." : "Create Event"}</Button>
        </form>
      </CardContent></Card>
    </div>
  )
}

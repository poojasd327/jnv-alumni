"use client"

import { useState, useEffect, useTransition } from "react"
import { getMyMentorshipRequests, getIncomingMentorshipRequests, updateMentorshipStatus, requestMentorship } from "@/lib/actions/mentorship.actions"
import { MENTORSHIP_AREAS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { HandHelping, Check, X } from "lucide-react"
import { formatDate, getInitials } from "@/lib/utils"
import { toast } from "sonner"
import { useSearchParams } from "next/navigation"

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700", accepted: "bg-blue-100 text-blue-700",
  active: "bg-green-100 text-green-700", completed: "bg-gray-100 text-gray-700",
  declined: "bg-red-100 text-red-700",
}

export default function MyRequestsPage() {
  const searchParams = useSearchParams()
  const mentorId = searchParams.get("mentor")
  const [tab, setTab] = useState("sent")
  const [sent, setSent] = useState<Record<string, unknown>[]>([])
  const [received, setReceived] = useState<Record<string, unknown>[]>([])
  const [isPending, startTransition] = useTransition()
  const [area, setArea] = useState("")

  useEffect(() => { loadData() }, [])

  async function loadData() {
    const [s, r] = await Promise.all([getMyMentorshipRequests(), getIncomingMentorshipRequests()])
    setSent(s)
    setReceived(r)
  }

  function handleStatusUpdate(id: string, status: string) {
    startTransition(async () => {
      const result = await updateMentorshipStatus(id, status)
      if (result.error) { toast.error(result.error); return }
      toast.success(`Request ${status}`)
      loadData()
    })
  }

  function handleRequest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!mentorId || !area) return
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await requestMentorship({
        mentor_id: mentorId,
        area,
        message: fd.get("message") as string,
      })
      if (result.error) { toast.error(result.error); return }
      toast.success("Request sent!")
      loadData()
    })
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Mentorship Requests</h1>

      {mentorId && (
        <Card><CardContent className="p-6">
          <h2 className="font-semibold mb-3">Send Mentorship Request</h2>
          <form onSubmit={handleRequest} className="space-y-4">
            <div className="space-y-2"><Label>Area *</Label>
              <Select value={area} onValueChange={(val) => setArea(val ?? "")}><SelectTrigger><SelectValue placeholder="Select area" /></SelectTrigger><SelectContent>{MENTORSHIP_AREAS.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}</SelectContent></Select>
            </div>
            <div className="space-y-2"><Label htmlFor="message">Message</Label><Textarea id="message" name="message" rows={3} placeholder="Why are you seeking mentorship..." /></div>
            <Button type="submit" disabled={isPending || !area}>{isPending ? "Sending..." : "Send Request"}</Button>
          </form>
        </CardContent></Card>
      )}

      <Tabs value={tab} onValueChange={(val) => setTab(val ?? "sent")}>
        <TabsList><TabsTrigger value="sent">Sent ({sent.length})</TabsTrigger><TabsTrigger value="received">Received ({received.length})</TabsTrigger></TabsList>
      </Tabs>

      <div className="space-y-3">
        {tab === "sent" && sent.length === 0 && (
          <div className="text-center py-8"><HandHelping className="size-10 mx-auto text-muted-foreground/50" /><p className="mt-2 text-muted-foreground">No sent requests</p></div>
        )}
        {tab === "sent" && sent.map((req) => {
          const mentor = req.profiles as { full_name: string; avatar_url: string | null; profession: string | null } | null
          return (
            <Card key={req.id as string}><CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="size-8 shrink-0"><AvatarImage src={mentor?.avatar_url || ""} /><AvatarFallback className="text-xs">{mentor ? getInitials(mentor.full_name) : "?"}</AvatarFallback></Avatar>
                <div className="min-w-0"><p className="font-medium text-sm truncate">{mentor?.full_name}</p><p className="text-xs text-muted-foreground truncate">{req.area as string} &middot; {formatDate(req.created_at as string)}</p></div>
              </div>
              <Badge className={`shrink-0 ${STATUS_COLORS[req.status as string] || ""}`}>{req.status as string}</Badge>
            </CardContent></Card>
          )
        })}
        {tab === "received" && received.length === 0 && (
          <div className="text-center py-8"><HandHelping className="size-10 mx-auto text-muted-foreground/50" /><p className="mt-2 text-muted-foreground">No incoming requests</p></div>
        )}
        {tab === "received" && received.map((req) => {
          const mentee = req.profiles as { full_name: string; avatar_url: string | null } | null
          return (
            <Card key={req.id as string}><CardContent className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="size-8 shrink-0"><AvatarImage src={mentee?.avatar_url || ""} /><AvatarFallback className="text-xs">{mentee ? getInitials(mentee.full_name) : "?"}</AvatarFallback></Avatar>
                <div className="min-w-0"><p className="font-medium text-sm truncate">{mentee?.full_name}</p><p className="text-xs text-muted-foreground truncate">{req.area as string} &middot; {formatDate(req.created_at as string)}</p>{req.message ? <p className="text-xs text-muted-foreground mt-1">&ldquo;{req.message as string}&rdquo;</p> : null}</div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Badge className={`shrink-0 ${STATUS_COLORS[req.status as string] || ""}`}>{req.status as string}</Badge>
                {req.status === "pending" && (
                  <>
                    <Button size="sm" onClick={() => handleStatusUpdate(req.id as string, "accepted")} disabled={isPending}><Check className="size-3" /></Button>
                    <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(req.id as string, "declined")} disabled={isPending}><X className="size-3" /></Button>
                  </>
                )}
              </div>
            </CardContent></Card>
          )
        })}
      </div>
    </div>
  )
}

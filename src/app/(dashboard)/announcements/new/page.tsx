"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createAnnouncement } from "@/lib/actions/announcements.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function NewAnnouncementPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [type, setType] = useState("general")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await createAnnouncement({
        title: fd.get("title") as string,
        content: fd.get("content") as string,
        type,
      })
      if (result.error) { toast.error(result.error); return }
      toast.success("Announcement posted!")
      router.push("/announcements")
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button render={<Link href="/announcements" />} variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button>
        <h1 className="text-2xl font-bold">New Announcement</h1>
      </div>
      <Card><CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" required maxLength={200} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea id="content" name="content" rows={6} required maxLength={10000} />
          </div>
          <div className="space-y-2">
            <Label>Type</Label>
            <Select value={type} onValueChange={(val) => setType(val ?? "general")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="achievement">Achievement</SelectItem>
                <SelectItem value="opportunity">Opportunity</SelectItem>
                <SelectItem value="update">Update</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" disabled={isPending} className="w-full">{isPending ? "Posting..." : "Post Announcement"}</Button>
        </form>
      </CardContent></Card>
    </div>
  )
}

"use client"

import { useState, useTransition } from "react"
import { updateAnnouncement, deleteAnnouncement, togglePin } from "@/lib/actions/announcements.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2, X, Check, Loader2, Pin } from "lucide-react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const TYPES = [
  { value: "general", label: "General" },
  { value: "achievement", label: "Achievement" },
  { value: "opportunity", label: "Opportunity" },
  { value: "update", label: "Update" },
]

interface AnnouncementActionsProps {
  announcementId: string
  title: string
  content: string
  type: string
  isPinned: boolean
  isAuthor: boolean
  isAdmin: boolean
}

export function AnnouncementActions({
  announcementId,
  title,
  content,
  type,
  isPinned,
  isAuthor,
  isAdmin,
}: AnnouncementActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [editTitle, setEditTitle] = useState(title)
  const [editContent, setEditContent] = useState(content)
  const [editType, setEditType] = useState(type)
  const router = useRouter()

  function handleSave() {
    startTransition(async () => {
      const result = await updateAnnouncement(announcementId, {
        title: editTitle,
        content: editContent,
        type: editType,
      })
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Announcement updated")
      setEditing(false)
      router.refresh()
    })
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteAnnouncement(announcementId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Announcement deleted")
      router.push("/announcements")
    })
  }

  function handlePin() {
    startTransition(async () => {
      const result = await togglePin(announcementId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(isPinned ? "Unpinned" : "Pinned")
      router.refresh()
    })
  }

  if (editing) {
    return (
      <Card>
        <CardContent className="p-4 space-y-3">
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Announcement title"
            maxLength={200}
          />
          <Textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            placeholder="Announcement content"
            rows={8}
            maxLength={20000}
          />
          <select
            value={editType}
            onChange={(e) => setEditType(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>{t.label}</option>
            ))}
          </select>
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
                setEditTitle(title)
                setEditContent(content)
                setEditType(type)
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
        {isAuthor && (
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditing(true)}>
              <Pencil className="size-3.5 mr-1" />Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => setShowDelete(true)}
            >
              <Trash2 className="size-3.5 mr-1" />Delete
            </Button>
          </>
        )}
        {isAdmin && (
          <Button variant="ghost" size="sm" onClick={handlePin} disabled={isPending}>
            <Pin className={`size-3.5 mr-1 ${isPinned ? "text-amber-500" : ""}`} />
            {isPinned ? "Unpin" : "Pin"}
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Delete this announcement?"
        description="This will permanently delete the announcement. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={handleDelete}
      />
    </>
  )
}

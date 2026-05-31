"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { uploadMedia } from "@/lib/actions/media.actions"
import { MEDIA_CATEGORIES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function UploadMediaPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [category, setCategory] = useState("")
  const [fileType, setFileType] = useState("image")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    startTransition(async () => {
      const result = await uploadMedia({
        title: fd.get("title") as string,
        description: fd.get("description") as string,
        file_url: fd.get("file_url") as string,
        file_type: fileType,
        category: category || undefined,
        batch_year: fd.get("batch_year") ? Number(fd.get("batch_year")) : null,
        tags: (fd.get("tags") as string)?.split(",").map((t) => t.trim()).filter(Boolean) || [],
      })
      if (result.error) { toast.error(result.error); return }
      toast.success("Media uploaded!")
      router.push("/media")
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button render={<Link href="/media" />} variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button>
        <h1 className="text-2xl font-bold">Upload Media</h1>
      </div>
      <Card><CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label htmlFor="title">Title *</Label><Input id="title" name="title" required maxLength={200} /></div>
          <div className="space-y-2"><Label htmlFor="description">Description</Label><Textarea id="description" name="description" rows={3} /></div>
          <div className="space-y-2"><Label htmlFor="file_url">File URL *</Label><Input id="file_url" name="file_url" type="url" required placeholder="https://..." /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>File Type</Label><Select value={fileType} onValueChange={(val) => setFileType(val ?? "image")}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="image">Image</SelectItem><SelectItem value="video">Video</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Category</Label><Select value={category} onValueChange={(val) => setCategory(val ?? "")}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{MEDIA_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="batch_year">Batch Year</Label><Input id="batch_year" name="batch_year" type="number" min={1986} /></div>
            <div className="space-y-2"><Label htmlFor="tags">Tags (comma-separated)</Label><Input id="tags" name="tags" /></div>
          </div>
          <Button type="submit" disabled={isPending} className="w-full">{isPending ? "Uploading..." : "Upload"}</Button>
        </form>
      </CardContent></Card>
    </div>
  )
}

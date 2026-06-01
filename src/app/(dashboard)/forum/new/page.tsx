"use client"

import { useState, useEffect, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createPost, getForumCategories } from "@/lib/actions/forum.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function NewPostPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [categoryId, setCategoryId] = useState("")
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])

  useEffect(() => {
    getForumCategories().then((cats) => setCategories(cats as { id: string; name: string }[]))
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const title = (fd.get("title") as string).trim()
    const content = (fd.get("content") as string).trim()

    if (!categoryId) { toast.error("Please select a category"); return }
    if (title.length < 3) { toast.error("Title must be at least 3 characters"); return }
    if (content.length < 10) { toast.error("Content must be at least 10 characters"); return }

    startTransition(async () => {
      const result = await createPost({
        category_id: categoryId,
        title,
        content,
      })
      if (result.error) { toast.error(result.error); return }
      toast.success("Post created!")
      router.push("/forum")
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button render={<Link href="/forum" />} variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button>
        <h1 className="text-2xl font-bold">New Discussion</h1>
      </div>
      <Card><CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Category *</Label>
            <Select value={categoryId} onValueChange={(val) => setCategoryId(val ?? "")} required>
              <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
              <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label htmlFor="title">Title *</Label><Input id="title" name="title" required maxLength={300} /></div>
          <div className="space-y-2"><Label htmlFor="content">Content *</Label><Textarea id="content" name="content" rows={8} required maxLength={50000} /></div>
          <Button type="submit" disabled={isPending || !categoryId} className="w-full">{isPending ? "Posting..." : "Create Post"}</Button>
        </form>
      </CardContent></Card>
    </div>
  )
}

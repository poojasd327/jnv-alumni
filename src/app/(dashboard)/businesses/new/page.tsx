"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createBusiness } from "@/lib/actions/businesses.actions"
import { BUSINESS_CATEGORIES, INDIAN_STATES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function NewBusinessPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [category, setCategory] = useState("")
  const [locationState, setLocationState] = useState("")

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const name = (fd.get("name") as string).trim()
    const description = (fd.get("description") as string).trim()

    if (name.length < 2) { toast.error("Business name must be at least 2 characters"); return }
    if (description.length < 10) { toast.error("Description must be at least 10 characters"); return }

    startTransition(async () => {
      const result = await createBusiness({
        name,
        description,
        category,
        services: (fd.get("services") as string)?.split(",").map((s) => s.trim()).filter(Boolean) || [],
        location_city: fd.get("location_city") as string,
        location_state: locationState,
        website: fd.get("website") as string,
        phone: fd.get("phone") as string,
        email: fd.get("email") as string,
      })
      if (result.error) { toast.error(result.error); return }
      toast.success("Business listed!")
      router.push("/businesses")
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button render={<Link href="/businesses" />} variant="ghost" size="icon"><ArrowLeft className="size-4" /></Button>
        <h1 className="text-2xl font-bold">List Your Business</h1>
      </div>
      <Card><CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2"><Label htmlFor="name">Business Name *</Label><Input id="name" name="name" required maxLength={200} /></div>
          <div className="space-y-2"><Label htmlFor="description">Description *</Label><Textarea id="description" name="description" rows={4} required maxLength={10000} /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label>Category</Label><Select value={category} onValueChange={(val) => setCategory(val ?? "")}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{BUSINESS_CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label htmlFor="services">Services (comma-separated)</Label><Input id="services" name="services" placeholder="Consulting, Training..." /></div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="location_city">City</Label><Input id="location_city" name="location_city" /></div>
            <div className="space-y-2"><Label>State</Label><Select value={locationState} onValueChange={(val) => setLocationState(val ?? "")}><SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger><SelectContent>{INDIAN_STATES.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent></Select></div>
          </div>
          <div className="space-y-2"><Label htmlFor="website">Website</Label><Input id="website" name="website" type="url" /></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor="phone">Phone</Label><Input id="phone" name="phone" /></div>
            <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" name="email" type="email" /></div>
          </div>
          <Button type="submit" disabled={isPending} className="w-full">{isPending ? "Listing..." : "List Business"}</Button>
        </form>
      </CardContent></Card>
    </div>
  )
}

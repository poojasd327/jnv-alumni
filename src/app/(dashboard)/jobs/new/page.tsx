"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { createJob } from "@/lib/actions/jobs.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { INDIAN_STATES, JOB_TYPES } from "@/lib/constants"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function NewJobPage() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [jobType, setJobType] = useState("")
  const [locationState, setLocationState] = useState("")
  const [referral, setReferral] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    if (!jobType) {
      toast.error("Please select a job type")
      return
    }

    startTransition(async () => {
      const result = await createJob({
        title: formData.get("title") as string,
        company: formData.get("company") as string,
        description: formData.get("description") as string,
        job_type: jobType,
        location_city: formData.get("location_city") as string,
        location_state: locationState,
        experience_min: formData.get("experience_min") ? Number(formData.get("experience_min")) : null,
        experience_max: formData.get("experience_max") ? Number(formData.get("experience_max")) : null,
        salary_min: formData.get("salary_min") ? Number(formData.get("salary_min")) : null,
        salary_max: formData.get("salary_max") ? Number(formData.get("salary_max")) : null,
        skills_required: (formData.get("skills") as string)?.split(",").map((s) => s.trim()).filter(Boolean) || [],
        referral_available: referral,
        contact_email: formData.get("contact_email") as string,
        apply_url: formData.get("apply_url") as string,
      })

      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Job posted successfully")
      router.push("/jobs")
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Button render={<Link href="/jobs" />} variant="ghost" size="icon">
          <ArrowLeft className="size-4" />
        </Button>
        <h1 className="text-2xl font-bold">Post a Job</h1>
      </div>

      <Card>
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input id="title" name="title" placeholder="e.g., Software Engineer" required maxLength={200} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company *</Label>
                <Input id="company" name="company" placeholder="e.g., Google" required maxLength={200} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" name="description" rows={5} placeholder="Job description, requirements..." required maxLength={20000} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Job Type *</Label>
                <Select value={jobType} onValueChange={(val) => setJobType(val ?? "")} required>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    {JOB_TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Location State</Label>
                <Select value={locationState} onValueChange={(val) => setLocationState(val ?? "")}>
                  <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                  <SelectContent>
                    {INDIAN_STATES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location_city">City</Label>
              <Input id="location_city" name="location_city" placeholder="e.g., Bangalore" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="experience_min">Min Experience (years)</Label>
                <Input id="experience_min" name="experience_min" type="number" min={0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience_max">Max Experience (years)</Label>
                <Input id="experience_max" name="experience_max" type="number" min={0} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="salary_min">Min Salary (annual)</Label>
                <Input id="salary_min" name="salary_min" type="number" min={0} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary_max">Max Salary (annual)</Label>
                <Input id="salary_max" name="salary_max" type="number" min={0} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills Required (comma-separated)</Label>
              <Input id="skills" name="skills" placeholder="React, Node.js, TypeScript" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="contact_email">Contact Email</Label>
                <Input id="contact_email" name="contact_email" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="apply_url">Apply URL</Label>
                <Input id="apply_url" name="apply_url" type="url" placeholder="https://..." />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={referral} onChange={(e) => setReferral(e.target.checked)} className="rounded" />
              <span className="text-sm">Referral available for this position</span>
            </label>

            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Posting..." : "Post Job"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

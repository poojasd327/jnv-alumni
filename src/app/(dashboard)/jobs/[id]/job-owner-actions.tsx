"use client"

import { useState, useTransition } from "react"
import { updateJob, deleteJob } from "@/lib/actions/jobs.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Pencil, Trash2, X, Check, Loader2 } from "lucide-react"
import { ConfirmDialog } from "@/components/ui/confirm-dialog"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

const JOB_TYPES = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "contract", label: "Contract" },
  { value: "internship", label: "Internship" },
  { value: "freelance", label: "Freelance" },
]

interface JobOwnerActionsProps {
  jobId: string
  title: string
  company: string
  description: string
  jobType: string
  locationCity: string | null
  locationState: string | null
  salaryMin: number | null
  salaryMax: number | null
  experienceMin: number | null
  experienceMax: number | null
  skillsRequired: string[]
  referralAvailable: boolean
  contactEmail: string | null
  applyUrl: string | null
}

export function JobOwnerActions({
  jobId,
  title,
  company,
  description,
  jobType,
  locationCity,
  locationState,
  salaryMin,
  salaryMax,
  experienceMin,
  experienceMax,
  skillsRequired,
  referralAvailable,
  contactEmail,
  applyUrl,
}: JobOwnerActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [skillInput, setSkillInput] = useState("")
  const router = useRouter()

  const [form, setForm] = useState({
    title,
    company,
    description,
    job_type: jobType,
    location_city: locationCity || "",
    location_state: locationState || "",
    salary_min: salaryMin?.toString() || "",
    salary_max: salaryMax?.toString() || "",
    experience_min: experienceMin?.toString() || "",
    experience_max: experienceMax?.toString() || "",
    skills_required: skillsRequired,
    referral_available: referralAvailable,
    contact_email: contactEmail || "",
    apply_url: applyUrl || "",
  })

  function handleSave() {
    startTransition(async () => {
      const result = await updateJob(jobId, {
        title: form.title,
        company: form.company,
        description: form.description,
        job_type: form.job_type,
        location_city: form.location_city || undefined,
        location_state: form.location_state || undefined,
        salary_min: form.salary_min ? parseInt(form.salary_min) : null,
        salary_max: form.salary_max ? parseInt(form.salary_max) : null,
        experience_min: form.experience_min ? parseInt(form.experience_min) : null,
        experience_max: form.experience_max ? parseInt(form.experience_max) : null,
        skills_required: form.skills_required,
        referral_available: form.referral_available,
        contact_email: form.contact_email || undefined,
        apply_url: form.apply_url || undefined,
      })
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Job updated")
      setEditing(false)
      router.refresh()
    })
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteJob(jobId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success("Job closed")
      router.push("/jobs")
    })
  }

  function addSkill() {
    const skill = skillInput.trim()
    if (skill && !form.skills_required.includes(skill)) {
      setForm({ ...form, skills_required: [...form.skills_required, skill] })
      setSkillInput("")
    }
  }

  function removeSkill(skill: string) {
    setForm({ ...form, skills_required: form.skills_required.filter((s) => s !== skill) })
  }

  if (editing) {
    return (
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Job title"
              maxLength={200}
            />
            <Input
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              placeholder="Company"
              maxLength={200}
            />
          </div>
          <Textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Job description"
            rows={6}
            maxLength={20000}
          />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <select
              value={form.job_type}
              onChange={(e) => setForm({ ...form, job_type: e.target.value })}
              className="rounded-md border px-3 py-2 text-sm"
            >
              {JOB_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <Input
              value={form.location_city}
              onChange={(e) => setForm({ ...form, location_city: e.target.value })}
              placeholder="City"
            />
            <Input
              value={form.location_state}
              onChange={(e) => setForm({ ...form, location_state: e.target.value })}
              placeholder="State"
            />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Input
              value={form.salary_min}
              onChange={(e) => setForm({ ...form, salary_min: e.target.value })}
              placeholder="Min salary"
              type="number"
            />
            <Input
              value={form.salary_max}
              onChange={(e) => setForm({ ...form, salary_max: e.target.value })}
              placeholder="Max salary"
              type="number"
            />
            <Input
              value={form.experience_min}
              onChange={(e) => setForm({ ...form, experience_min: e.target.value })}
              placeholder="Min exp (yrs)"
              type="number"
            />
            <Input
              value={form.experience_max}
              onChange={(e) => setForm({ ...form, experience_max: e.target.value })}
              placeholder="Max exp (yrs)"
              type="number"
            />
          </div>
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="Add skill and press Enter"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill() } }}
              />
              <Button type="button" size="sm" variant="outline" onClick={addSkill}>Add</Button>
            </div>
            {form.skills_required.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {form.skills_required.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2.5 py-0.5 text-xs">
                    {skill}
                    <button onClick={() => removeSkill(skill)} className="hover:text-destructive">
                      <X className="size-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Input
              value={form.contact_email}
              onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
              placeholder="Contact email"
              type="email"
            />
            <Input
              value={form.apply_url}
              onChange={(e) => setForm({ ...form, apply_url: e.target.value })}
              placeholder="External apply URL"
              type="url"
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.referral_available}
              onChange={(e) => setForm({ ...form, referral_available: e.target.checked })}
              className="rounded"
            />
            Referral available
          </label>
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
                  title,
                  company,
                  description,
                  job_type: jobType,
                  location_city: locationCity || "",
                  location_state: locationState || "",
                  salary_min: salaryMin?.toString() || "",
                  salary_max: salaryMax?.toString() || "",
                  experience_min: experienceMin?.toString() || "",
                  experience_max: experienceMax?.toString() || "",
                  skills_required: skillsRequired,
                  referral_available: referralAvailable,
                  contact_email: contactEmail || "",
                  apply_url: applyUrl || "",
                })
                setSkillInput("")
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
        <Button
          variant="ghost"
          size="sm"
          className="text-destructive hover:text-destructive"
          onClick={() => setShowDelete(true)}
        >
          <Trash2 className="size-3.5 mr-1" />Close Job
        </Button>
      </div>

      <ConfirmDialog
        open={showDelete}
        onOpenChange={setShowDelete}
        title="Close this job listing?"
        description="This will mark the job as closed. It will no longer appear in search results. Existing applications will be preserved."
        confirmLabel="Close Job"
        onConfirm={handleDelete}
      />
    </>
  )
}

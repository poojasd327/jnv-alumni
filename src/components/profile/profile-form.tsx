"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateProfile } from "@/lib/actions/profile.actions"
import { INDIAN_STATES, INDUSTRIES } from "@/lib/constants"
import {
  profileUpdateSchema,
  type ProfileUpdateFormValues,
} from "@/lib/validations/profile.schema"
import type { Profile } from "@/lib/types/database.types"

interface ProfileFormProps {
  profile: Profile
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileUpdateFormValues>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      city: profile.city || "",
      state: profile.state || "",
      profession: profile.profession || "",
      company: profile.company || "",
      industry: profile.industry || "",
      skills: profile.skills?.join(", ") || "",
      linkedin_url: profile.linkedin_url || "",
      portfolio_url: profile.portfolio_url || "",
      whatsapp_number: profile.whatsapp_number || "",
      bio: profile.bio || "",
    },
  })

  const watchState = watch("state")
  const watchIndustry = watch("industry")

  async function onSubmit(data: ProfileUpdateFormValues) {
    setIsSubmitting(true)
    try {
      // Parse skills from comma-separated string to array
      const skills = data.skills
        ? data.skills
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : []

      const result = await updateProfile({
        city: data.city || null,
        state: data.state || null,
        profession: data.profession || null,
        company: data.company || null,
        industry: data.industry || null,
        skills,
        linkedin_url: data.linkedin_url || null,
        portfolio_url: data.portfolio_url || null,
        whatsapp_number: data.whatsapp_number || null,
        bio: data.bio || null,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success("Profile updated successfully!")
      }
    } catch {
      toast.error("Failed to update profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Location */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            placeholder="e.g., Mumbai"
            {...register("city")}
          />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Select
            value={watchState ?? ""}
            onValueChange={(val) => setValue("state", val ?? "", { shouldValidate: true })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              {INDIAN_STATES.map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.state && (
            <p className="text-sm text-destructive">{errors.state.message}</p>
          )}
        </div>
      </div>

      {/* Professional */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="profession">Profession</Label>
          <Input
            id="profession"
            placeholder="e.g., Software Engineer"
            {...register("profession")}
          />
          {errors.profession && (
            <p className="text-sm text-destructive">
              {errors.profession.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input
            id="company"
            placeholder="e.g., Google"
            {...register("company")}
          />
          {errors.company && (
            <p className="text-sm text-destructive">{errors.company.message}</p>
          )}
        </div>
      </div>

      {/* Industry */}
      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Select
          value={watchIndustry ?? ""}
          onValueChange={(val) => setValue("industry", val ?? "", { shouldValidate: true })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select industry" />
          </SelectTrigger>
          <SelectContent>
            {INDUSTRIES.map((industry) => (
              <SelectItem key={industry} value={industry}>
                {industry}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.industry && (
          <p className="text-sm text-destructive">{errors.industry.message}</p>
        )}
      </div>

      {/* Skills */}
      <div className="space-y-2">
        <Label htmlFor="skills">Skills</Label>
        <Input
          id="skills"
          placeholder="e.g., JavaScript, React, Node.js (comma-separated)"
          {...register("skills")}
        />
        <p className="text-xs text-muted-foreground">
          Separate multiple skills with commas
        </p>
        {errors.skills && (
          <p className="text-sm text-destructive">{errors.skills.message}</p>
        )}
      </div>

      {/* URLs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="linkedin_url">LinkedIn URL</Label>
          <Input
            id="linkedin_url"
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            {...register("linkedin_url")}
          />
          {errors.linkedin_url && (
            <p className="text-sm text-destructive">
              {errors.linkedin_url.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="portfolio_url">Portfolio URL</Label>
          <Input
            id="portfolio_url"
            type="url"
            placeholder="https://yourportfolio.com"
            {...register("portfolio_url")}
          />
          {errors.portfolio_url && (
            <p className="text-sm text-destructive">
              {errors.portfolio_url.message}
            </p>
          )}
        </div>
      </div>

      {/* WhatsApp */}
      <div className="space-y-2">
        <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
        <Input
          id="whatsapp_number"
          type="tel"
          placeholder="e.g., +919876543210"
          {...register("whatsapp_number")}
        />
        {errors.whatsapp_number && (
          <p className="text-sm text-destructive">
            {errors.whatsapp_number.message}
          </p>
        )}
      </div>

      {/* Bio */}
      <div className="space-y-2">
        <Label htmlFor="bio">Bio</Label>
        <Textarea
          id="bio"
          placeholder="Tell other alumni about yourself..."
          rows={4}
          {...register("bio")}
        />
        <p className="text-xs text-muted-foreground">Maximum 500 characters</p>
        {errors.bio && (
          <p className="text-sm text-destructive">{errors.bio.message}</p>
        )}
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Changes"
          )}
        </Button>
      </div>
    </form>
  )
}

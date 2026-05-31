import { z } from "zod"

export const profileUpdateSchema = z.object({
  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(100, "City must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  profession: z
    .string()
    .min(2, "Profession must be at least 2 characters")
    .max(100, "Profession must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  company: z
    .string()
    .max(100, "Company must be at most 100 characters")
    .optional()
    .or(z.literal("")),
  industry: z.string().optional().or(z.literal("")),
  skills: z
    .string()
    .max(500, "Skills text must be at most 500 characters")
    .optional()
    .or(z.literal("")),
  linkedin_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  portfolio_url: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  whatsapp_number: z
    .string()
    .regex(/^(\+?\d{10,15})?$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
  bio: z
    .string()
    .max(500, "Bio must be at most 500 characters")
    .optional()
    .or(z.literal("")),
})

export type ProfileUpdateFormValues = z.infer<typeof profileUpdateSchema>

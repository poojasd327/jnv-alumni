import { z } from "zod"

export const listingSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title too long"),
  description: z.string().min(10, "Description must be at least 10 characters").max(2000, "Description too long"),
  price: z.number().positive("Price must be greater than 0"),
  price_negotiable: z.boolean(),
  category_id: z.string().min(1, "Please select a category"),
  subcategory_id: z.string().optional(),
  condition: z.enum(["new", "like_new", "good", "fair"]),
  location_city: z.string().min(1, "Please enter the city"),
  location_state: z.string().min(1, "Please select the state"),
})

export type ListingFormData = z.infer<typeof listingSchema>

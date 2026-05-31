"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { listingSchema, type ListingFormData } from "@/lib/validations/marketplace.schema"
import { createListing, updateListing } from "@/lib/actions/marketplace.actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageUpload } from "./image-upload"
import { INDIAN_STATES, LISTING_CONDITIONS } from "@/lib/constants"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

interface Category {
  id: string
  name: string
  slug: string
  marketplace_subcategories: Array<{
    id: string
    name: string
    slug: string
  }>
}

interface ListingFormProps {
  categories: Category[]
  userId: string
  listing?: {
    id: string
    title: string
    description: string
    price: number
    price_negotiable: boolean
    category_id: string
    subcategory_id: string | null
    condition: string
    location_city: string
    location_state: string
    images: string[]
  }
}

export function ListingForm({ categories, userId, listing }: ListingFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [images, setImages] = useState<string[]>(listing?.images || [])
  const [listingId] = useState(listing?.id || crypto.randomUUID())
  const [subcategories, setSubcategories] = useState<Array<{ id: string; name: string }>>([])

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: listing
      ? {
          title: listing.title,
          description: listing.description,
          price: listing.price,
          price_negotiable: listing.price_negotiable,
          category_id: listing.category_id,
          subcategory_id: listing.subcategory_id || undefined,
          condition: listing.condition as ListingFormData["condition"],
          location_city: listing.location_city,
          location_state: listing.location_state,
        }
      : {
          price_negotiable: false,
          condition: "good",
        },
  })

  const selectedCategory = watch("category_id")

  useEffect(() => {
    if (selectedCategory) {
      const cat = categories.find((c) => c.id === selectedCategory)
      setSubcategories(cat?.marketplace_subcategories || [])
    } else {
      setSubcategories([])
    }
  }, [selectedCategory, categories])

  async function onSubmit(data: ListingFormData) {
    if (images.length === 0) {
      toast.error("Please add at least one image")
      return
    }

    setLoading(true)

    if (listing) {
      const result = await updateListing(listing.id, { ...data, images })
      if (result.error) {
        toast.error(result.error)
        setLoading(false)
        return
      }
      toast.success("Listing updated")
      router.push(`/marketplace/${listing.id}`)
    } else {
      const result = await createListing({ ...data, images })
      if (result.error) {
        toast.error(typeof result.error === "string" ? result.error : "Failed to create listing")
        setLoading(false)
        return
      }
      toast.success("Listing created")
      router.push("/marketplace")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{listing ? "Edit Listing" : "Create New Listing"}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="What are you selling?" {...register("title")} />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your item in detail..."
              rows={4}
              {...register("description")}
            />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Price (INR)</Label>
              <Input id="price" type="number" placeholder="0" {...register("price", { valueAsNumber: true })} />
              {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register("price_negotiable")} className="rounded" />
                <span className="text-sm">Price is negotiable</span>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register("category_id")}
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.category_id && <p className="text-sm text-destructive">{errors.category_id.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="subcategory">Subcategory</Label>
              <select
                id="subcategory"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register("subcategory_id")}
                disabled={subcategories.length === 0}
              >
                <option value="">Select subcategory</option>
                {subcategories.map((sub) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <select
              id="condition"
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              {...register("condition")}
            >
              {LISTING_CONDITIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location_city">City</Label>
              <Input id="location_city" placeholder="City" {...register("location_city")} />
              {errors.location_city && <p className="text-sm text-destructive">{errors.location_city.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="location_state">State</Label>
              <select
                id="location_state"
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                {...register("location_state")}
              >
                <option value="">Select state</option>
                {INDIAN_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {errors.location_state && <p className="text-sm text-destructive">{errors.location_state.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Images</Label>
            <ImageUpload
              images={images}
              onChange={setImages}
              userId={userId}
              listingId={listingId}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {listing ? "Update Listing" : "Create Listing"}
          </Button>
        </CardContent>
      </form>
    </Card>
  )
}

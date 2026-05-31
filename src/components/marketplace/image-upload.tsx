"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImagePlus, X, Loader2 } from "lucide-react"
import Image from "next/image"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
  maxImages?: number
  userId: string
  listingId: string
}

export function ImageUpload({ images, onChange, maxImages = 5, userId, listingId }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return

    const remaining = maxImages - images.length
    if (remaining <= 0) {
      toast.error(`Maximum ${maxImages} images allowed`)
      return
    }

    const filesToUpload = Array.from(files).slice(0, remaining)
    setUploading(true)

    try {
      const supabase = createClient()
      const newUrls: string[] = []

      for (const file of filesToUpload) {
        const ext = file.name.split(".").pop()
        const fileName = `${userId}/${listingId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

        const { error } = await supabase.storage
          .from("marketplace-images")
          .upload(fileName, file, { cacheControl: "3600", upsert: false })

        if (error) {
          toast.error(`Failed to upload ${file.name}`)
          continue
        }

        const { data: { publicUrl } } = supabase.storage
          .from("marketplace-images")
          .getPublicUrl(fileName)

        newUrls.push(publicUrl)
      }

      onChange([...images, ...newUrls])
    } catch {
      toast.error("Upload failed")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  function removeImage(index: number) {
    const newImages = images.filter((_, i) => i !== index)
    onChange(newImages)
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((url, i) => (
          <div key={i} className="relative aspect-[4/3] rounded-md overflow-hidden border">
            <Image src={url} alt={`Image ${i + 1}`} fill className="object-cover" sizes="200px" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-2 hover:bg-black/80"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        {images.length < maxImages && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="aspect-[4/3] rounded-md border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:border-muted-foreground/50 transition-colors"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin" />
            ) : (
              <>
                <ImagePlus className="h-6 w-6" />
                <span className="text-xs">Add Photo</span>
              </>
            )}
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleUpload}
        className="hidden"
      />
      <p className="text-xs text-muted-foreground">
        {images.length}/{maxImages} images uploaded. Max 5MB each.
      </p>
    </div>
  )
}

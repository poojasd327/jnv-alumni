"use client"

import { useState, useRef } from "react"
import { Camera, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { uploadAvatar } from "@/lib/actions/profile.actions"
import { getInitials } from "@/lib/utils"

interface AvatarUploadProps {
  currentAvatarUrl: string | null
  fullName: string
}

export function AvatarUpload({ currentAvatarUrl, fullName }: AvatarUploadProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const displayUrl = preview || currentAvatarUrl

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    // Client-side validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a JPEG, PNG, WebP, or GIF image.")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size must be less than 2MB.")
      return
    }

    // Show preview
    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)

    // Upload immediately
    handleUpload(file)
  }

  async function handleUpload(file: File) {
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("avatar", file)

      const result = await uploadAvatar(formData)

      if (result.error) {
        toast.error(result.error)
        setPreview(null)
      } else {
        toast.success("Avatar updated successfully!")
        if (result.data?.avatar_url) {
          setPreview(result.data.avatar_url)
        }
      }
    } catch {
      toast.error("Failed to upload avatar. Please try again.")
      setPreview(null)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        className="group relative cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <Avatar className="size-24" size="lg">
          {displayUrl ? (
            <AvatarImage src={displayUrl} alt={fullName} />
          ) : null}
          <AvatarFallback className="text-lg">
            {getInitials(fullName)}
          </AvatarFallback>
        </Avatar>

        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          {isUploading ? (
            <Loader2 className="size-6 animate-spin text-white" />
          ) : (
            <Camera className="size-6 text-white" />
          )}
        </div>
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileSelect}
        disabled={isUploading}
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        {isUploading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Camera className="size-4" />
            Change Photo
          </>
        )}
      </Button>
    </div>
  )
}

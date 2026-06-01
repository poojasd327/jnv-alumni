"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFocusTrap } from "@/hooks/use-focus-trap"

interface ImageGalleryProps {
  images: string[]
  title: string
}

export function ImageGallery({ images, title }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const { containerRef, handleKeyDown: handleFocusTrapKeyDown } = useFocusTrap(lightboxOpen)

  const openLightbox = (index: number) => {
    setSelectedIndex(index)
    setLightboxOpen(true)
  }

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const goNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    if (!lightboxOpen) return

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox()
      else if (e.key === "ArrowRight") goNext()
      else if (e.key === "ArrowLeft") goPrev()
    }

    document.addEventListener("keydown", onKeyDown)
    // Prevent body scroll
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = ""
    }
  }, [lightboxOpen, closeLightbox, goNext, goPrev])

  if (images.length === 0) {
    return (
      <div className="aspect-[16/10] rounded-lg border bg-muted flex items-center justify-center">
        <ImageIcon className="h-16 w-16 text-muted-foreground/30" />
      </div>
    )
  }

  return (
    <>
      <div className="space-y-2">
        {/* Main Image */}
        <button
          className="relative aspect-[16/10] w-full rounded-lg overflow-hidden border bg-muted cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          onClick={() => openLightbox(selectedIndex)}
          aria-label={`View ${title} image ${selectedIndex + 1} of ${images.length} in fullscreen`}
        >
          <Image
            src={images[selectedIndex]}
            alt={`${title} - Image ${selectedIndex + 1}`}
            fill
            className="object-contain"
            sizes="(max-width: 1024px) 100vw, 66vw"
            priority
          />
        </button>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2" role="tablist" aria-label="Image thumbnails">
            {images.map((img, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === selectedIndex}
                aria-label={`View image ${i + 1}`}
                className={cn(
                  "relative aspect-square rounded-md overflow-hidden border cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary",
                  i === selectedIndex && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedIndex(i)}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${i + 1}`}
                  fill
                  className="object-cover"
                  sizes="100px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          ref={containerRef}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          role="dialog"
          aria-modal="true"
          aria-label="Image lightbox"
          onClick={closeLightbox}
          onKeyDown={handleFocusTrapKeyDown}
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 z-10 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Close lightbox"
          >
            <X className="size-6" />
          </button>

          {/* Image counter */}
          <div className="absolute top-4 left-4 z-10 rounded-full bg-black/50 px-3 py-1 text-sm text-white">
            {selectedIndex + 1} / {images.length}
          </div>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              className="absolute left-4 z-10 rounded-full bg-black/50 p-3 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Previous image"
            >
              <ChevronLeft className="size-6" />
            </button>
          )}

          {/* Main lightbox image */}
          <div
            className="relative h-[85vh] w-[90vw] max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[selectedIndex]}
              alt={`${title} - Image ${selectedIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
              priority
            />
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); goNext() }}
              className="absolute right-4 z-10 rounded-full bg-black/50 p-3 text-white hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Next image"
            >
              <ChevronRight className="size-6" />
            </button>
          )}
        </div>
      )}
    </>
  )
}

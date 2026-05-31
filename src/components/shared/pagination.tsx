"use client"

import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
}

export function Pagination({ currentPage, totalPages }: PaginationProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const router = useRouter()

  const createPageURL = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set("page", page.toString())
      return `${pathname}?${params.toString()}`
    },
    [pathname, searchParams]
  )

  const goToPage = useCallback(
    (page: number) => {
      router.push(createPageURL(page))
    },
    [createPageURL, router]
  )

  if (totalPages <= 1) return null

  // Build page numbers to show
  const pages: (number | "ellipsis")[] = []
  const delta = 1 // pages around current

  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - delta && i <= currentPage + delta)
    ) {
      pages.push(i)
    } else if (pages[pages.length - 1] !== "ellipsis") {
      pages.push("ellipsis")
    }
  }

  return (
    <nav
      className="flex items-center justify-center gap-1"
      aria-label="Pagination"
    >
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage <= 1}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </Button>

      {pages.map((page, index) => {
        if (page === "ellipsis") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="flex size-7 items-center justify-center text-sm text-muted-foreground"
            >
              ...
            </span>
          )
        }

        const isActive = page === currentPage

        return (
          <Button
            key={page}
            variant={isActive ? "default" : "ghost"}
            size="icon-sm"
            onClick={() => goToPage(page)}
            aria-label={`Page ${page}`}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "text-xs",
              isActive && "pointer-events-none"
            )}
          >
            {page}
          </Button>
        )
      })}

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage >= totalPages}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </Button>
    </nav>
  )
}

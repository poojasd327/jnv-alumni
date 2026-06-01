"use client"

import { usePathname, useSearchParams, useRouter } from "next/navigation"
import { useCallback } from "react"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  currentPage: number
  totalPages: number
  totalItems?: number
  pageSize?: number
}

export function Pagination({ currentPage, totalPages, totalItems, pageSize }: PaginationProps) {
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

  // Calculate item range for display
  const showingFrom = totalItems && pageSize
    ? (currentPage - 1) * pageSize + 1
    : undefined
  const showingTo = totalItems && pageSize
    ? Math.min(currentPage * pageSize, totalItems)
    : undefined

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      {/* Item count */}
      {totalItems !== undefined && showingFrom !== undefined && showingTo !== undefined ? (
        <p className="text-xs text-muted-foreground">
          Showing {showingFrom}-{showingTo} of {totalItems}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          Page {currentPage} of {totalPages}
        </p>
      )}

      <nav
        className="flex items-center gap-1"
        aria-label="Pagination"
      >
        {/* First page */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => goToPage(1)}
          disabled={currentPage <= 1}
          aria-label="First page"
          className="hidden sm:inline-flex"
        >
          <ChevronsLeft className="size-4" />
        </Button>

        {/* Previous */}
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

        {/* Next */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="size-4" />
        </Button>

        {/* Last page */}
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => goToPage(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label="Last page"
          className="hidden sm:inline-flex"
        >
          <ChevronsRight className="size-4" />
        </Button>
      </nav>
    </div>
  )
}

"use client"

import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useCallback } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { INDUSTRIES } from "@/lib/constants"

// Generate passing year options (JNV typically 1986 onwards)
const currentYear = new Date().getFullYear()
const PASSING_YEARS = Array.from(
  { length: currentYear - 1985 },
  (_, i) => (currentYear - i).toString()
)

export function DirectoryFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const batch = searchParams.get("batch") || ""
  const city = searchParams.get("city") || ""
  const industry = searchParams.get("industry") || ""
  const skill = searchParams.get("skill") || ""

  const createQueryString = useCallback(
    (params: Record<string, string>) => {
      const current = new URLSearchParams(searchParams.toString())

      for (const [key, value] of Object.entries(params)) {
        if (value) {
          current.set(key, value)
        } else {
          current.delete(key)
        }
      }

      // Reset to page 1 when filters change
      current.delete("page")

      return current.toString()
    },
    [searchParams]
  )

  function updateFilter(key: string, value: string | null) {
    const qs = createQueryString({ [key]: value || "" })
    router.push(`${pathname}?${qs}`)
  }

  function clearFilters() {
    // Preserve only the search query if present
    const q = searchParams.get("q")
    if (q) {
      router.push(`${pathname}?q=${encodeURIComponent(q)}`)
    } else {
      router.push(pathname)
    }
  }

  const hasFilters = batch || city || industry || skill

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Filters</h3>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="size-3.5" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Passing Year / Batch */}
        <div className="space-y-1.5">
          <Label className="text-xs">Passing Year</Label>
          <Select
            value={batch}
            onValueChange={(val) => updateFilter("batch", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All years" />
            </SelectTrigger>
            <SelectContent>
              {PASSING_YEARS.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* City */}
        <div className="space-y-1.5">
          <Label className="text-xs">City</Label>
          <Input
            placeholder="Filter by city"
            value={city}
            onChange={(e) => updateFilter("city", e.target.value)}
          />
        </div>

        {/* Industry */}
        <div className="space-y-1.5">
          <Label className="text-xs">Industry</Label>
          <Select
            value={industry}
            onValueChange={(val) => updateFilter("industry", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="All industries" />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((ind) => (
                <SelectItem key={ind} value={ind}>
                  {ind}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Skill */}
        <div className="space-y-1.5">
          <Label className="text-xs">Skill</Label>
          <Input
            placeholder="Filter by skill"
            value={skill}
            onChange={(e) => updateFilter("skill", e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

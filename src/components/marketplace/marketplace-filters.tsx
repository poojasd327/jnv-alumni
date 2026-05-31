"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { INDIAN_STATES, LISTING_CONDITIONS } from "@/lib/constants"
import { X } from "lucide-react"

export function MarketplaceFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete("page")
    router.push(`/marketplace?${params.toString()}`)
  }

  function clearFilters() {
    router.push("/marketplace")
  }

  const hasFilters = searchParams.has("state") || searchParams.has("min_price") ||
    searchParams.has("max_price") || searchParams.has("condition")

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="space-y-1">
        <Label className="text-xs">State</Label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={searchParams.get("state") || ""}
          onChange={(e) => updateParam("state", e.target.value)}
        >
          <option value="">All States</option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Min Price</Label>
        <Input
          type="number"
          placeholder="Min"
          className="w-28 h-9"
          value={searchParams.get("min_price") || ""}
          onChange={(e) => updateParam("min_price", e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Max Price</Label>
        <Input
          type="number"
          placeholder="Max"
          className="w-28 h-9"
          value={searchParams.get("max_price") || ""}
          onChange={(e) => updateParam("max_price", e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Condition</Label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={searchParams.get("condition") || ""}
          onChange={(e) => updateParam("condition", e.target.value)}
        >
          <option value="">Any Condition</option>
          {LISTING_CONDITIONS.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      </div>
      <div className="space-y-1">
        <Label className="text-xs">Sort</Label>
        <select
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          value={searchParams.get("sort") || ""}
          onChange={(e) => updateParam("sort", e.target.value)}
        >
          <option value="">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
      {hasFilters && (
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          <X className="h-4 w-4 mr-1" />
          Clear
        </Button>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"

export function DirectorySearch() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const initialQuery = searchParams.get("q") || ""
  const [query, setQuery] = useState(initialQuery)
  const debouncedQuery = useDebounce(query, 400)

  useEffect(() => {
    const current = new URLSearchParams(searchParams.toString())

    if (debouncedQuery) {
      current.set("q", debouncedQuery)
    } else {
      current.delete("q")
    }

    // Reset to page 1 on search
    current.delete("page")

    const qs = current.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }, [debouncedQuery, pathname, router, searchParams])

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search alumni by name, profession, school..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="pl-9"
      />
    </div>
  )
}

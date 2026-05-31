"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Smartphone, Car, Home, Wheat, Briefcase } from "lucide-react"

const iconMap: Record<string, React.ElementType> = {
  Smartphone,
  Car,
  Home,
  Wheat,
  Briefcase,
}

interface CategoryNavProps {
  categories: Array<{
    id: string
    name: string
    slug: string
    icon: string | null
  }>
}

export function CategoryNav({ categories }: CategoryNavProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category")

  function selectCategory(categoryId: string | null) {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryId) {
      params.set("category", categoryId)
    } else {
      params.delete("category")
    }
    params.delete("subcategory")
    params.delete("page")
    router.push(`/marketplace?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant={!activeCategory ? "default" : "outline"}
        size="sm"
        onClick={() => selectCategory(null)}
      >
        All
      </Button>
      {categories.map((cat) => {
        const Icon = cat.icon ? iconMap[cat.icon] : null
        return (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => selectCategory(cat.id)}
          >
            {Icon && <Icon className="h-4 w-4 mr-1.5" />}
            {cat.name}
          </Button>
        )
      })}
    </div>
  )
}

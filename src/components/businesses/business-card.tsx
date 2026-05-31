import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, CheckCircle } from "lucide-react"

interface BusinessCardProps {
  business: {
    id: string
    name: string
    description: string
    category: string | null
    services: string[]
    location_city: string | null
    location_state: string | null
    is_verified: boolean
    profiles?: { full_name: string } | null
  }
}

export function BusinessCard({ business }: BusinessCardProps) {
  return (
    <Link href={`/businesses/${business.id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold">{business.name}</h3>
            {business.is_verified && (
              <CheckCircle className="size-4 text-green-600 shrink-0" />
            )}
          </div>

          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {business.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {business.category && (
              <Badge variant="outline">{business.category}</Badge>
            )}
            {business.services.slice(0, 2).map((service) => (
              <Badge key={service} variant="secondary" className="text-xs">
                {service}
              </Badge>
            ))}
            {business.services.length > 2 && (
              <Badge variant="secondary" className="text-xs">+{business.services.length - 2}</Badge>
            )}
          </div>

          {business.location_city && (
            <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3" />
              {business.location_city}{business.location_state ? `, ${business.location_state}` : ""}
            </div>
          )}

          {business.profiles && (
            <p className="mt-2 text-xs text-muted-foreground">
              by {business.profiles.full_name}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}

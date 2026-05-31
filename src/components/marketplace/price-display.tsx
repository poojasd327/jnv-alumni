import { formatPrice } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface PriceDisplayProps {
  price: number
  negotiable?: boolean
  size?: "sm" | "lg"
}

export function PriceDisplay({ price, negotiable, size = "sm" }: PriceDisplayProps) {
  return (
    <div className="flex items-center gap-2">
      <span className={size === "lg" ? "text-2xl font-bold" : "text-lg font-bold"}>
        {formatPrice(price)}
      </span>
      {negotiable && (
        <Badge variant="outline" className="text-green-600 text-xs">
          Negotiable
        </Badge>
      )}
    </div>
  )
}

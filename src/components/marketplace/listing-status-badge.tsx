import { Badge } from "@/components/ui/badge"

const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  active: { label: "Active", variant: "default" },
  sold: { label: "Sold", variant: "secondary" },
  inactive: { label: "Inactive", variant: "outline" },
  deleted: { label: "Deleted", variant: "destructive" },
}

export function ListingStatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, variant: "outline" as const }
  return <Badge variant={config.variant}>{config.label}</Badge>
}

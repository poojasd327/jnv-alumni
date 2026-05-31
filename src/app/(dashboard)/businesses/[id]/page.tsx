import { getBusinessById } from "@/lib/actions/businesses.actions"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft, Globe, Phone, Mail, MapPin, CheckCircle } from "lucide-react"
import { getInitials } from "@/lib/utils"
import Link from "next/link"

export default async function BusinessDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const business = await getBusinessById(id)
  if (!business) notFound()

  const owner = business.profiles as { id: string; full_name: string; avatar_url: string | null; profession: string | null } | null

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" render={<Link href="/businesses" />}><ArrowLeft className="size-4 mr-1" /> Back</Button>

      <div className="flex items-start gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{business.name}</h1>
            {business.is_verified && <CheckCircle className="size-5 text-green-600" />}
          </div>
          {business.category && <Badge variant="outline" className="mt-1">{business.category}</Badge>}
        </div>
      </div>

      <Card><CardContent className="p-6">
        <div className="whitespace-pre-wrap text-sm">{business.description}</div>
      </CardContent></Card>

      {business.services.length > 0 && (
        <div><h2 className="font-semibold mb-2">Services</h2><div className="flex flex-wrap gap-2">{business.services.map((s: string) => <Badge key={s} variant="secondary">{s}</Badge>)}</div></div>
      )}

      <div className="space-y-2 text-sm">
        {(business.location_city || business.location_state) && <p className="flex items-center gap-2"><MapPin className="size-4" />{business.location_city}{business.location_state ? `, ${business.location_state}` : ""}</p>}
        {business.website && <p className="flex items-center gap-2"><Globe className="size-4" /><a href={business.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{business.website}</a></p>}
        {business.phone && <p className="flex items-center gap-2"><Phone className="size-4" />{business.phone}</p>}
        {business.email && <p className="flex items-center gap-2"><Mail className="size-4" /><a href={`mailto:${business.email}`} className="text-primary hover:underline">{business.email}</a></p>}
      </div>

      {owner && (
        <Card><CardContent className="p-4 flex items-center gap-3">
          <Avatar><AvatarImage src={owner.avatar_url || ""} /><AvatarFallback>{getInitials(owner.full_name)}</AvatarFallback></Avatar>
          <div><p className="font-medium">{owner.full_name}</p><p className="text-sm text-muted-foreground">Owner</p></div>
        </CardContent></Card>
      )}
    </div>
  )
}

import { getAnnouncements } from "@/lib/actions/announcements.actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { Plus, Megaphone, Pin, Search } from "lucide-react"
import { formatDate, getInitials } from "@/lib/utils"

const TYPE_COLORS: Record<string, string> = {
  general: "bg-gray-100 text-gray-700", achievement: "bg-amber-100 text-amber-700",
  opportunity: "bg-blue-100 text-blue-700", update: "bg-green-100 text-green-700",
}

export default async function AnnouncementsPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams
  const { announcements, count } = await getAnnouncements(params)
  const pageSize = 12
  const currentPage = Number(params.page) || 1
  const totalPages = Math.ceil(count / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Announcements</h1>
          <p className="text-sm text-muted-foreground mt-1">Stay updated with the community</p>
        </div>
        <Button className="w-full sm:w-auto" render={<Link href="/announcements/new" />}><Plus className="size-4 mr-1" />New Announcement</Button>
      </div>

      <form className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input name="q" placeholder="Search..." defaultValue={params.q} className="pl-9" /></div>
        <Button type="submit" variant="outline">Search</Button>
      </form>

      <div className="flex flex-wrap gap-2">
        <Button variant={!params.type ? "default" : "outline"} size="sm" render={<Link href="/announcements" />}>All</Button>
        {["general", "achievement", "opportunity", "update"].map((t) => (
          <Button key={t} variant={params.type === t ? "default" : "outline"} size="sm" render={<Link href={`/announcements?type=${t}`} />}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </Button>
        ))}
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Megaphone className="size-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No announcements</h3>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {announcements.map((a: Record<string, unknown>) => {
              const author = a.profiles as { full_name: string; avatar_url: string | null } | null
              return (
                <Link key={a.id as string} href={`/announcements/${a.id}`}>
                  <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        {a.is_pinned ? <Pin className="size-4 text-amber-500 shrink-0 mt-1" /> : null}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{a.title as string}</h3>
                            <Badge className={TYPE_COLORS[a.type as string] || ""}>{a.type as string}</Badge>
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{(a.content as string).slice(0, 150)}</p>
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                            {author && (
                              <span className="flex items-center gap-1">
                                <Avatar className="size-4"><AvatarImage src={author.avatar_url || ""} /><AvatarFallback className="text-[8px]">{getInitials(author.full_name)}</AvatarFallback></Avatar>
                                {author.full_name}
                              </span>
                            )}
                            <span>{formatDate(a.created_at as string)}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {currentPage > 1 && <Button variant="outline" size="sm" render={<Link href={`/announcements?page=${currentPage - 1}`} />}>Previous</Button>}
              <span className="flex items-center text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
              {currentPage < totalPages && <Button variant="outline" size="sm" render={<Link href={`/announcements?page=${currentPage + 1}`} />}>Next</Button>}
            </div>
          )}
        </>
      )}
    </div>
  )
}

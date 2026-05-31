export const metadata = { title: "Media Gallery", description: "Photos and videos from JNV schools, reunions, and events." }

import { getMedia } from "@/lib/actions/media.actions"
import { MEDIA_CATEGORIES } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import Image from "next/image"
import { Plus, ImageIcon, Search, Play } from "lucide-react"
import { Pagination } from "@/components/shared/pagination"

export default async function MediaPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams
  const { media, count } = await getMedia(params)
  const pageSize = 12
  const currentPage = Number(params.page) || 1
  const totalPages = Math.ceil(count / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media Gallery</h1>
          <p className="text-sm text-muted-foreground mt-1">Photos and videos from the community</p>
        </div>
        <Button className="w-full sm:w-auto" render={<Link href="/media/upload" />}><Plus className="size-4 mr-1" />Upload</Button>
      </div>

      <form className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input name="q" placeholder="Search media..." defaultValue={params.q} className="pl-9" /></div>
        <Button type="submit" variant="outline">Search</Button>
      </form>

      <div className="flex gap-2 flex-wrap">
        <Button variant={!params.category ? "default" : "outline"} size="sm" render={<Link href="/media" />}>All</Button>
        {MEDIA_CATEGORIES.map((c) => (
          <Button key={c} variant={params.category === c ? "default" : "outline"} size="sm" render={<Link href={`/media?category=${c}`} />}>{c}</Button>
        ))}
      </div>

      {media.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <ImageIcon className="size-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No media yet</h3>
          <p className="text-muted-foreground mt-1">Upload photos and videos</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {media.map((item: Record<string, unknown>) => (
              <Link key={item.id as string} href={`/media/${item.id}`}>
                <Card className="overflow-hidden transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                  <div className="relative aspect-square bg-muted">
                    {(item.file_type as string) === "image" ? (
                      <Image src={item.file_url as string} alt={item.title as string} fill className="object-cover" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
                    ) : (
                      <div className="flex items-center justify-center h-full"><Play className="size-8 text-muted-foreground" /></div>
                    )}
                  </div>
                  <CardContent className="p-2">
                    <p className="text-sm font-medium truncate">{item.title as string}</p>
                    {item.category ? <Badge variant="secondary" className="text-xs mt-1">{item.category as string}</Badge> : null}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
          {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} />}
        </>
      )}
    </div>
  )
}

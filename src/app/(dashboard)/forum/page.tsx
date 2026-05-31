import { getForumPosts, getForumCategories } from "@/lib/actions/forum.actions"
import { PostCard } from "@/components/forum/post-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Plus, MessageSquare, Search } from "lucide-react"

export default async function ForumPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams
  const [{ posts, count }, categories] = await Promise.all([getForumPosts(params), getForumCategories()])
  const pageSize = 12
  const currentPage = Number(params.page) || 1
  const totalPages = Math.ceil(count / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Discussion Forum</h1>
          <p className="text-sm text-muted-foreground mt-1">Connect and discuss with alumni</p>
        </div>
        <Button className="w-full sm:w-auto" render={<Link href="/forum/new" />}><Plus className="size-4 mr-1" />New Post</Button>
      </div>

      <form className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input name="q" placeholder="Search discussions..." defaultValue={params.q} className="pl-9" /></div>
        <Button type="submit" variant="outline">Search</Button>
      </form>

      <div className="flex gap-2 flex-wrap">
        <Button variant={!params.category ? "default" : "outline"} size="sm" render={<Link href="/forum" />}>All</Button>
        {categories.map((cat: Record<string, unknown>) => (
          <Button key={cat.slug as string} variant={params.category === cat.slug ? "default" : "outline"} size="sm" render={<Link href={`/forum?category=${cat.slug}`} />}>
            {cat.name as string}
          </Button>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <MessageSquare className="size-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No discussions yet</h3>
          <p className="text-muted-foreground mt-1">Start a conversation</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">{posts.map((p: Record<string, unknown>) => <PostCard key={p.id as string} post={p as never} />)}</div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {currentPage > 1 && <Button variant="outline" size="sm" render={<Link href={`/forum?page=${currentPage - 1}${params.category ? `&category=${params.category}` : ""}`} />}>Previous</Button>}
              <span className="flex items-center text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
              {currentPage < totalPages && <Button variant="outline" size="sm" render={<Link href={`/forum?page=${currentPage + 1}${params.category ? `&category=${params.category}` : ""}`} />}>Next</Button>}
            </div>
          )}
        </>
      )}
    </div>
  )
}

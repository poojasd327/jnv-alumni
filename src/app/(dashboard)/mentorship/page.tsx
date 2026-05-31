import { getMentors } from "@/lib/actions/mentorship.actions"
import { MENTORSHIP_AREAS } from "@/lib/constants"
import { MentorCard } from "@/components/mentorship/mentor-card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { HandHelping, Search } from "lucide-react"

export default async function MentorshipPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams
  const { mentors, count } = await getMentors(params)
  const pageSize = 12
  const currentPage = Number(params.page) || 1
  const totalPages = Math.ceil(count / pageSize)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mentorship</h1>
          <p className="text-sm text-muted-foreground mt-1">Find mentors from the alumni community</p>
        </div>
        <Button className="w-full sm:w-auto" variant="outline" render={<Link href="/mentorship/my-requests" />}>My Requests</Button>
      </div>

      <form className="flex flex-col gap-2 sm:flex-row">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" /><Input name="q" placeholder="Search by name, profession..." defaultValue={params.q} className="pl-9" /></div>
        <Button type="submit" variant="outline">Search</Button>
      </form>

      <div className="flex gap-2 flex-wrap">
        <Button variant={!params.area ? "default" : "outline"} size="sm" render={<Link href="/mentorship" />}>All</Button>
        {MENTORSHIP_AREAS.slice(0, 6).map((a) => (
          <Button key={a} variant={params.area === a ? "default" : "outline"} size="sm" render={<Link href={`/mentorship?area=${a}`} />}>{a}</Button>
        ))}
      </div>

      {mentors.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <HandHelping className="size-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No mentors found</h3>
          <p className="text-muted-foreground mt-1">Try broadening your search</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{mentors.map((m: Record<string, unknown>) => <MentorCard key={m.id as string} mentor={m as never} />)}</div>
          {totalPages > 1 && (
            <div className="flex justify-center gap-2">
              {currentPage > 1 && <Button variant="outline" size="sm" render={<Link href={`/mentorship?page=${currentPage - 1}`} />}>Previous</Button>}
              <span className="flex items-center text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
              {currentPage < totalPages && <Button variant="outline" size="sm" render={<Link href={`/mentorship?page=${currentPage + 1}`} />}>Next</Button>}
            </div>
          )}
        </>
      )}
    </div>
  )
}

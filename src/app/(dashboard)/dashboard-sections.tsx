import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDate } from "@/lib/utils"
import {
  Calendar,
  Briefcase,
  MessageSquare,
  Megaphone,
  ArrowRight,
} from "lucide-react"

export async function RecentEvents() {
  const supabase = await createClient()
  const { data: recentEvents } = await supabase
    .from("events")
    .select("id, title, event_date, location_city")
    .eq("status", "upcoming")
    .order("event_date")
    .limit(3)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Upcoming Events</h2>
        <Button variant="ghost" size="sm" className="text-xs" render={<Link href="/events" />}>
          View all<ArrowRight className="size-3 ml-1" />
        </Button>
      </div>
      <Card>
        <CardContent className="p-0 divide-y">
          {recentEvents && recentEvents.length > 0 ? (
            recentEvents.map((event: { id: string; title: string; event_date: string; location_city: string | null }) => (
              <Link key={event.id} href={`/events/${event.id}`} className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Calendar className="size-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{event.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(event.event_date)}{event.location_city && ` \u00B7 ${event.location_city}`}
                  </p>
                </div>
              </Link>
            ))
          ) : (
            <p className="p-4 text-sm text-muted-foreground text-center">No upcoming events</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export async function RecentJobs() {
  const supabase = await createClient()
  const { data: recentJobs } = await supabase
    .from("jobs")
    .select("id, title, company, created_at")
    .eq("status", "open")
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Latest Jobs</h2>
        <Button variant="ghost" size="sm" className="text-xs" render={<Link href="/jobs" />}>
          View all<ArrowRight className="size-3 ml-1" />
        </Button>
      </div>
      <Card>
        <CardContent className="p-0 divide-y">
          {recentJobs && recentJobs.length > 0 ? (
            recentJobs.map((job: { id: string; title: string; company: string; created_at: string }) => (
              <Link key={job.id} href={`/jobs/${job.id}`} className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Briefcase className="size-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{job.title}</p>
                  <p className="text-xs text-muted-foreground">{job.company} &middot; {formatDate(job.created_at)}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="p-4 text-sm text-muted-foreground text-center">No open positions</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export async function RecentPosts() {
  const supabase = await createClient()
  const { data: recentPosts } = await supabase
    .from("forum_posts")
    .select("id, title, comments_count, created_at")
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Recent Discussions</h2>
        <Button variant="ghost" size="sm" className="text-xs" render={<Link href="/forum" />}>
          View all<ArrowRight className="size-3 ml-1" />
        </Button>
      </div>
      <Card>
        <CardContent className="p-0 divide-y">
          {recentPosts && recentPosts.length > 0 ? (
            recentPosts.map((post: { id: string; title: string; comments_count: number; created_at: string }) => (
              <Link key={post.id} href={`/forum/${post.id}`} className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <MessageSquare className="size-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{post.title}</p>
                  <p className="text-xs text-muted-foreground">{post.comments_count} comments &middot; {formatDate(post.created_at)}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="p-4 text-sm text-muted-foreground text-center">No discussions yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export async function RecentAnnouncements() {
  const supabase = await createClient()
  const { data: recentAnnouncements } = await supabase
    .from("announcements")
    .select("id, title, type, created_at")
    .order("created_at", { ascending: false })
    .limit(3)

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold">Announcements</h2>
        <Button variant="ghost" size="sm" className="text-xs" render={<Link href="/announcements" />}>
          View all<ArrowRight className="size-3 ml-1" />
        </Button>
      </div>
      <Card>
        <CardContent className="p-0 divide-y">
          {recentAnnouncements && recentAnnouncements.length > 0 ? (
            recentAnnouncements.map((item: { id: string; title: string; type: string; created_at: string }) => (
              <Link key={item.id} href={`/announcements/${item.id}`} className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Megaphone className="size-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium truncate">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.type} &middot; {formatDate(item.created_at)}</p>
                </div>
              </Link>
            ))
          ) : (
            <p className="p-4 text-sm text-muted-foreground text-center">No announcements yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export function SectionSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="h-4 w-28 rounded bg-muted animate-pulse" />
        <div className="h-4 w-16 rounded bg-muted animate-pulse" />
      </div>
      <Card>
        <CardContent className="p-0 divide-y">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 p-3">
              <div className="size-9 shrink-0 rounded-lg bg-muted animate-pulse" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}

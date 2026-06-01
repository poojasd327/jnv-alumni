import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials, formatDate } from "@/lib/utils"
import {
  Users,
  Briefcase,
  Calendar,
  ShoppingBag,
  ArrowRight,
  Plus,
  MessageSquare,
  UserCircle,
  Megaphone,
  FileText,
  ClipboardList,
  CalendarCheck,
  Package,
} from "lucide-react"
import type { Profile } from "@/lib/types/database.types"

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return "Good morning"
  if (hour < 17) return "Good afternoon"
  return "Good evening"
}

function getFirstName(fullName: string): string {
  return fullName.split(" ")[0]
}

function calculateProfileCompleteness(profile: Profile): number {
  const fields = [
    profile.full_name,
    profile.email,
    profile.avatar_url,
    profile.bio,
    profile.profession,
    profile.company,
    profile.city,
    profile.linkedin_url,
    profile.skills && profile.skills.length > 0,
    profile.whatsapp_number,
  ]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
}

export default async function DashboardHome() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect("/login")

  const { data: profileData } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const profile = profileData as Profile | null

  if (!profile || profile.approval_status !== "approved") {
    redirect("/pending-approval")
  }

  // Fetch counts in parallel
  const [alumniRes, jobRes, eventRes, listingRes] = await Promise.all([
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("approval_status", "approved"),
    supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("status", "open"),
    supabase
      .from("events")
      .select("*", { count: "exact", head: true })
      .eq("status", "upcoming"),
    supabase
      .from("marketplace_listings")
      .select("*", { count: "exact", head: true })
      .eq("status", "active"),
  ])

  // Fetch user-specific counts in parallel
  const [myJobsRes, myAppsRes, myEventsRes, myListingsRes] = await Promise.all([
    supabase
      .from("jobs")
      .select("*", { count: "exact", head: true })
      .eq("posted_by", user.id),
    supabase
      .from("job_applications")
      .select("*", { count: "exact", head: true })
      .eq("applicant_id", user.id),
    supabase
      .from("event_registrations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("marketplace_listings")
      .select("*", { count: "exact", head: true })
      .eq("seller_id", user.id)
      .neq("status", "deleted"),
  ])

  // Fetch recent items
  const [{ data: recentEvents }, { data: recentJobs }, { data: recentPosts }, { data: recentAnnouncements }] = await Promise.all([
    supabase
      .from("events")
      .select("id, title, event_date, location_city")
      .eq("status", "upcoming")
      .order("event_date")
      .limit(3),
    supabase
      .from("jobs")
      .select("id, title, company, created_at")
      .eq("status", "open")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("forum_posts")
      .select("id, title, comments_count, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("announcements")
      .select("id, title, type, created_at")
      .order("created_at", { ascending: false })
      .limit(3),
  ])

  const completeness = calculateProfileCompleteness(profile)

  const stats = [
    {
      label: "Alumni",
      count: alumniRes.count ?? 0,
      icon: Users,
      href: "/directory",
    },
    {
      label: "Open Jobs",
      count: jobRes.count ?? 0,
      icon: Briefcase,
      href: "/jobs",
    },
    {
      label: "Upcoming Events",
      count: eventRes.count ?? 0,
      icon: Calendar,
      href: "/events",
    },
    {
      label: "Active Listings",
      count: listingRes.count ?? 0,
      icon: ShoppingBag,
      href: "/marketplace",
    },
  ]

  const myActivity = [
    { label: "Jobs Posted", count: myJobsRes.count ?? 0, icon: FileText, href: "/jobs/my-jobs" },
    { label: "Applications", count: myAppsRes.count ?? 0, icon: ClipboardList, href: "/jobs/my-applications" },
    { label: "Events Joined", count: myEventsRes.count ?? 0, icon: CalendarCheck, href: "/events" },
    { label: "My Listings", count: myListingsRes.count ?? 0, icon: Package, href: "/marketplace/my-listings" },
  ]

  const quickActions = [
    { label: "Browse Directory", href: "/directory", icon: Users },
    { label: "Post a Job", href: "/jobs/new", icon: Plus },
    { label: "Create Event", href: "/events/new", icon: Calendar },
    { label: "New Forum Post", href: "/forum/new", icon: MessageSquare },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex items-center gap-4">
        <Avatar className="size-14">
          {profile.avatar_url && (
            <AvatarImage src={profile.avatar_url} alt={profile.full_name} />
          )}
          <AvatarFallback className="text-lg">
            {getInitials(profile.full_name)}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            {getGreeting()}, {getFirstName(profile.full_name)}
          </h1>
          <p className="text-sm text-muted-foreground">
            Welcome to your alumni network dashboard
          </p>
        </div>
      </div>

      {/* Profile Completeness */}
      {completeness < 100 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <UserCircle className="size-4 text-primary" />
                  <span className="text-sm font-medium">
                    Profile {completeness}% complete
                  </span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${completeness}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Complete your profile to help fellow alumni connect with you
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                render={<Link href="/profile/edit" />}
              >
                Complete Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.href} href={stat.href}>
            <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <stat.icon className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.count}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {quickActions.map((action) => (
            <Button
              key={action.href}
              variant="outline"
              className="h-auto py-3 flex-col gap-2"
              render={<Link href={action.href} />}
            >
              <action.icon className="size-5 text-primary" />
              <span className="text-xs">{action.label}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Your Activity */}
      <div>
        <h2 className="text-sm font-semibold mb-3">Your Activity</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {myActivity.map((item) => (
            <Link key={item.href} href={item.href}>
              <Card className="transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                <CardContent className="p-3 flex items-center gap-3">
                  <item.icon className="size-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-lg font-bold leading-tight">{item.count}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{item.label}</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Upcoming Events */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Upcoming Events</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              render={<Link href="/events" />}
            >
              View all
              <ArrowRight className="size-3 ml-1" />
            </Button>
          </div>
          <Card>
            <CardContent className="p-0 divide-y">
              {recentEvents && recentEvents.length > 0 ? (
                recentEvents.map(
                  (event: {
                    id: string
                    title: string
                    event_date: string
                    location_city: string | null
                  }) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Calendar className="size-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {event.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(event.event_date)}
                          {event.location_city && ` \u00B7 ${event.location_city}`}
                        </p>
                      </div>
                    </Link>
                  )
                )
              ) : (
                <p className="p-4 text-sm text-muted-foreground text-center">
                  No upcoming events
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Latest Jobs */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Latest Jobs</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              render={<Link href="/jobs" />}
            >
              View all
              <ArrowRight className="size-3 ml-1" />
            </Button>
          </div>
          <Card>
            <CardContent className="p-0 divide-y">
              {recentJobs && recentJobs.length > 0 ? (
                recentJobs.map(
                  (job: {
                    id: string
                    title: string
                    company: string
                    created_at: string
                  }) => (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Briefcase className="size-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {job.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {job.company} &middot; {formatDate(job.created_at)}
                        </p>
                      </div>
                    </Link>
                  )
                )
              ) : (
                <p className="p-4 text-sm text-muted-foreground text-center">
                  No open positions
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Forum & Announcements */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Forum Posts */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Recent Discussions</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              render={<Link href="/forum" />}
            >
              View all
              <ArrowRight className="size-3 ml-1" />
            </Button>
          </div>
          <Card>
            <CardContent className="p-0 divide-y">
              {recentPosts && recentPosts.length > 0 ? (
                recentPosts.map(
                  (post: {
                    id: string
                    title: string
                    comments_count: number
                    created_at: string
                  }) => (
                    <Link
                      key={post.id}
                      href={`/forum/${post.id}`}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <MessageSquare className="size-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {post.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {post.comments_count} comments &middot; {formatDate(post.created_at)}
                        </p>
                      </div>
                    </Link>
                  )
                )
              ) : (
                <p className="p-4 text-sm text-muted-foreground text-center">
                  No discussions yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Announcements */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold">Announcements</h2>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs"
              render={<Link href="/announcements" />}
            >
              View all
              <ArrowRight className="size-3 ml-1" />
            </Button>
          </div>
          <Card>
            <CardContent className="p-0 divide-y">
              {recentAnnouncements && recentAnnouncements.length > 0 ? (
                recentAnnouncements.map(
                  (item: {
                    id: string
                    title: string
                    type: string
                    created_at: string
                  }) => (
                    <Link
                      key={item.id}
                      href={`/announcements/${item.id}`}
                      className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <Megaphone className="size-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.type} &middot; {formatDate(item.created_at)}
                        </p>
                      </div>
                    </Link>
                  )
                )
              ) : (
                <p className="p-4 text-sm text-muted-foreground text-center">
                  No announcements yet
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

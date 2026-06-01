import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import {
  Users,
  Briefcase,
  Calendar,
  ShoppingBag,
  Plus,
  MessageSquare,
  UserCircle,
  FileText,
  ClipboardList,
  CalendarCheck,
  Package,
} from "lucide-react"
import type { Profile } from "@/lib/types/database.types"
import {
  RecentEvents,
  RecentJobs,
  RecentPosts,
  RecentAnnouncements,
  SectionSkeleton,
} from "./dashboard-sections"

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

  // Fetch counts in parallel (lightweight HEAD queries)
  const [alumniRes, jobRes, eventRes, listingRes, myJobsRes, myAppsRes, myEventsRes, myListingsRes] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("approval_status", "approved"),
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("status", "open"),
    supabase.from("events").select("*", { count: "exact", head: true }).eq("status", "upcoming"),
    supabase.from("marketplace_listings").select("*", { count: "exact", head: true }).eq("status", "active"),
    supabase.from("jobs").select("*", { count: "exact", head: true }).eq("posted_by", user.id),
    supabase.from("job_applications").select("*", { count: "exact", head: true }).eq("applicant_id", user.id),
    supabase.from("event_registrations").select("*", { count: "exact", head: true }).eq("user_id", user.id),
    supabase.from("marketplace_listings").select("*", { count: "exact", head: true }).eq("seller_id", user.id).neq("status", "deleted"),
  ])

  const completeness = calculateProfileCompleteness(profile)

  const stats = [
    { label: "Alumni", count: alumniRes.count ?? 0, icon: Users, href: "/directory" },
    { label: "Open Jobs", count: jobRes.count ?? 0, icon: Briefcase, href: "/jobs" },
    { label: "Upcoming Events", count: eventRes.count ?? 0, icon: Calendar, href: "/events" },
    { label: "Active Listings", count: listingRes.count ?? 0, icon: ShoppingBag, href: "/marketplace" },
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
                <div className="h-2 rounded-full bg-muted overflow-hidden" role="progressbar" aria-valuenow={completeness} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completeness">
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
                    <stat.icon className="size-5 text-primary" aria-hidden="true" />
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
              <action.icon className="size-5 text-primary" aria-hidden="true" />
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
                  <item.icon className="size-4 text-muted-foreground shrink-0" aria-hidden="true" />
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

      {/* Recent Activity — Streamed with Suspense */}
      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<SectionSkeleton />}>
          <RecentEvents />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <RecentJobs />
        </Suspense>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Suspense fallback={<SectionSkeleton />}>
          <RecentPosts />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <RecentAnnouncements />
        </Suspense>
      </div>
    </div>
  )
}

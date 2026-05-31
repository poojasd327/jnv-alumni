import { getPendingUsers } from "@/lib/actions/admin.actions"
import { getPendingReportsCount } from "@/lib/actions/report.actions"
import { createClient } from "@/lib/supabase/server"
import { ApprovalQueue } from "@/components/admin/approval-queue"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { UserCheck, Users, Flag, Briefcase, MessageSquare, ShoppingBag } from "lucide-react"

export const metadata = { title: "Admin Dashboard" }

export default async function AdminPage() {
  const supabase = await createClient()

  const [
    pendingUsers,
    pendingReports,
    { count: totalUsers },
    { count: approvedUsers },
    { count: totalJobs },
    { count: totalPosts },
    { count: totalListings },
  ] = await Promise.all([
    getPendingUsers(),
    getPendingReportsCount(),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("approval_status", "approved"),
    supabase.from("jobs").select("*", { count: "exact", head: true }),
    supabase.from("forum_posts").select("*", { count: "exact", head: true }),
    supabase.from("marketplace_listings").select("*", { count: "exact", head: true }),
  ])

  const stats = [
    { label: "Total Users", value: totalUsers ?? 0, icon: Users, href: "/admin/users" },
    { label: "Approved", value: approvedUsers ?? 0, icon: UserCheck, href: "/admin/users?status=approved" },
    { label: "Pending Approvals", value: pendingUsers.length, icon: UserCheck, href: "/admin", highlight: pendingUsers.length > 0 },
    { label: "Pending Reports", value: pendingReports, icon: Flag, href: "/admin/reports", highlight: pendingReports > 0 },
    { label: "Total Jobs", value: totalJobs ?? 0, icon: Briefcase, href: "/jobs" },
    { label: "Forum Posts", value: totalPosts ?? 0, icon: MessageSquare, href: "/forum" },
    { label: "Listings", value: totalListings ?? 0, icon: ShoppingBag, href: "/marketplace" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Platform overview and management
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className={`transition-all hover:shadow-md hover:-translate-y-0.5 ${stat.highlight ? "border-destructive/50" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex size-9 shrink-0 items-center justify-center rounded-lg ${stat.highlight ? "bg-destructive/10" : "bg-primary/10"}`}>
                    <stat.icon className={`size-4 ${stat.highlight ? "text-destructive" : "text-primary"}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold">{stat.value}</p>
                    <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pending Approvals */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Pending Approvals</h2>
        {pendingUsers.length > 0 ? (
          <ApprovalQueue users={pendingUsers} />
        ) : (
          <div className="text-center py-12">
            <UserCheck className="h-12 w-12 mx-auto text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-medium">No pending approvals</h3>
            <p className="text-muted-foreground mt-1">All registration requests have been processed</p>
          </div>
        )}
      </div>
    </div>
  )
}

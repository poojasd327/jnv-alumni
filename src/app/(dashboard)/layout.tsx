import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/sidebar"
import { Topbar } from "@/components/layout/topbar"
import { getUnreadCount } from "@/lib/actions/notifications.actions"
import { trackActivity } from "@/lib/actions/activity.actions"
import { PresenceProvider } from "@/components/providers/presence-provider"
import { ScrollToTop } from "@/components/shared/scroll-to-top"
import { KeyboardShortcuts } from "@/components/shared/keyboard-shortcuts"
import type { Profile } from "@/lib/types/database.types"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  const profile = data as Profile | null

  if (!profile || profile.approval_status !== "approved") {
    redirect("/pending-approval")
  }

  const sidebarProfile = {
    id: profile.id,
    full_name: profile.full_name,
    avatar_url: profile.avatar_url,
    role: profile.role,
    email: profile.email,
  }

  const unreadCount = await getUnreadCount()

  // Fire-and-forget activity tracking (throttled to once per 5 min)
  trackActivity().catch(() => {})

  return (
    <PresenceProvider userId={profile.id}>
      <div className="flex h-screen">
        {/* Skip to main content link for keyboard users */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none"
        >
          Skip to main content
        </a>

        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 flex-col overflow-hidden border-r bg-card md:flex" aria-label="Main navigation">
          <Sidebar profile={sidebarProfile} />
        </aside>

        {/* Main Content Area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar profile={sidebarProfile} unreadNotifications={unreadCount} />
          <main id="main-content" className="flex-1 overflow-y-auto bg-background p-4 md:p-6" role="main">
            {children}
          </main>
          <ScrollToTop />
          <KeyboardShortcuts />
        </div>
      </div>
    </PresenceProvider>
  )
}

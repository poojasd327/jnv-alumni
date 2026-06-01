"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Command } from "cmdk"
import {
  Users,
  Briefcase,
  Calendar,
  ShoppingBag,
  MessageSquare,
  Megaphone,
  Building2,
  ImageIcon,
  HandHelping,
  Search,
  Settings,
  User,
  Plus,
  LayoutDashboard,
} from "lucide-react"

const NAVIGATION_ITEMS = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard, group: "Navigation" },
  { label: "Alumni Directory", href: "/directory", icon: Users, group: "Navigation" },
  { label: "Marketplace", href: "/marketplace", icon: ShoppingBag, group: "Navigation" },
  { label: "Jobs Board", href: "/jobs", icon: Briefcase, group: "Navigation" },
  { label: "Events", href: "/events", icon: Calendar, group: "Navigation" },
  { label: "Forum", href: "/forum", icon: MessageSquare, group: "Navigation" },
  { label: "Announcements", href: "/announcements", icon: Megaphone, group: "Navigation" },
  { label: "Business Directory", href: "/businesses", icon: Building2, group: "Navigation" },
  { label: "Media Gallery", href: "/media", icon: ImageIcon, group: "Navigation" },
  { label: "Mentorship", href: "/mentorship", icon: HandHelping, group: "Navigation" },
  { label: "Profile", href: "/profile", icon: User, group: "Personal" },
  { label: "Settings", href: "/settings", icon: Settings, group: "Personal" },
]

const QUICK_ACTIONS = [
  { label: "Post a Job", href: "/jobs/new", icon: Plus, group: "Quick Actions" },
  { label: "Create Event", href: "/events/new", icon: Plus, group: "Quick Actions" },
  { label: "New Forum Post", href: "/forum/new", icon: Plus, group: "Quick Actions" },
  { label: "Create Listing", href: "/marketplace/new", icon: Plus, group: "Quick Actions" },
  { label: "Upload Media", href: "/media/upload", icon: Plus, group: "Quick Actions" },
  { label: "Register Business", href: "/businesses/new", icon: Plus, group: "Quick Actions" },
]

export function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  // Toggle on Cmd+K or Ctrl+K
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [])

  const navigate = useCallback(
    (href: string) => {
      setOpen(false)
      router.push(href)
    },
    [router]
  )

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        aria-label="Search pages and actions (Ctrl+K)"
        className="flex items-center gap-2 rounded-lg border bg-muted/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        <Search className="size-4" aria-hidden="true" />
        <span className="hidden sm:inline">Search...</span>
        <kbd className="pointer-events-none hidden select-none rounded border bg-background px-1.5 py-0.5 font-mono text-[10px] font-medium text-muted-foreground sm:inline-block">
          Ctrl K
        </kbd>
      </button>

      {/* Command Dialog */}
      {open && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Dialog */}
          <div className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 px-4" role="dialog" aria-label="Search" aria-modal="true">
            <Command
              className="rounded-xl border bg-popover text-popover-foreground shadow-2xl"
              loop
            >
              <div className="flex items-center gap-2 border-b px-3">
                <Search className="size-4 shrink-0 text-muted-foreground" />
                <Command.Input
                  placeholder="Search pages, actions..."
                  className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  autoFocus
                />
              </div>

              <Command.List className="max-h-72 overflow-y-auto p-2">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>

                <Command.Group
                  heading="Navigation"
                  className="text-xs font-medium text-muted-foreground px-2 py-1.5"
                >
                  {NAVIGATION_ITEMS.map((item) => (
                    <Command.Item
                      key={item.href}
                      value={item.label}
                      onSelect={() => navigate(item.href)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
                    >
                      <item.icon className="size-4 shrink-0 text-muted-foreground" />
                      {item.label}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Separator className="my-1 h-px bg-border" />

                <Command.Group
                  heading="Quick Actions"
                  className="text-xs font-medium text-muted-foreground px-2 py-1.5"
                >
                  {QUICK_ACTIONS.map((item) => (
                    <Command.Item
                      key={item.href}
                      value={item.label}
                      onSelect={() => navigate(item.href)}
                      className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm aria-selected:bg-accent aria-selected:text-accent-foreground"
                    >
                      <item.icon className="size-4 shrink-0 text-muted-foreground" />
                      {item.label}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>

              <div className="border-t px-3 py-2 text-xs text-muted-foreground flex items-center gap-3">
                <span>
                  <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">↑↓</kbd> navigate
                </span>
                <span>
                  <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">↵</kbd> select
                </span>
                <span>
                  <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">esc</kbd> close
                </span>
              </div>
            </Command>
          </div>
        </div>
      )}
    </>
  )
}

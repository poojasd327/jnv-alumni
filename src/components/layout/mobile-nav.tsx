"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn, getInitials } from "@/lib/utils"
import { NAV_ITEMS, PERSONAL_NAV_ITEMS, ADMIN_NAV_ITEMS } from "@/lib/constants"
import {
  Users,
  ShoppingBag,
  Package,
  Heart,
  User,
  UserCheck,
  UsersRound,
  GraduationCap,
  LogOut,
  Menu,
  Briefcase,
  Calendar,
  MessageSquare,
  Megaphone,
  Building2,
  ImageIcon,
  HandHelping,
  LayoutDashboard,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet"
import { logout } from "@/lib/actions/auth.actions"

const iconMap: Record<string, React.ElementType> = {
  Users,
  ShoppingBag,
  Package,
  Heart,
  User,
  UserCheck,
  UsersRound,
  Briefcase,
  Calendar,
  MessageSquare,
  Megaphone,
  Building2,
  ImageIcon,
  HandHelping,
  LayoutDashboard,
}

interface MobileNavProps {
  profile: {
    full_name: string
    avatar_url: string | null
    role: string
    email: string
  }
}

export function MobileNav({ profile }: MobileNavProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="ghost" size="icon" className="md:hidden" />}
      >
        <Menu className="size-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </SheetTrigger>
      <SheetContent side="left" className="w-72 p-0">
        <SheetHeader className="border-b px-4 py-4">
          <SheetTitle className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <GraduationCap className="size-4" />
            </div>
            <span className="text-sm font-semibold">JNV Alumni Network</span>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 space-y-1 px-3 py-4">
          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Main
          </p>
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon]
            const isActive =
              pathname === item.href ||
              (item.href as string !== "/" && pathname.startsWith(item.href))

            return (
              <SheetClose
                key={item.href}
                render={
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  />
                }
              >
                {Icon && <Icon className="size-4 shrink-0" />}
                {item.label}
              </SheetClose>
            )
          })}

          {/* Personal Section */}
          <Separator className="my-3" />
          <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Personal
          </p>
          {PERSONAL_NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon]
            const isActive =
              pathname === item.href ||
              (item.href as string !== "/" && pathname.startsWith(item.href))

            return (
              <SheetClose
                key={item.href}
                render={
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  />
                }
              >
                {Icon && <Icon className="size-4 shrink-0" />}
                {item.label}
              </SheetClose>
            )
          })}

          {profile.role === "admin" && (
            <>
              <Separator className="my-3" />
              <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Admin
              </p>
              {ADMIN_NAV_ITEMS.map((item) => {
                const Icon = iconMap[item.icon]
                const isActive =
                  pathname === item.href ||
                  (item.href as string !== "/" && pathname.startsWith(item.href))

                return (
                  <SheetClose
                    key={item.href}
                    render={
                      <Link
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}
                      />
                    }
                  >
                    {Icon && <Icon className="size-4 shrink-0" />}
                    {item.label}
                  </SheetClose>
                )
              })}
            </>
          )}
        </nav>

        <Separator />

        {/* User Info + Logout */}
        <div className="p-4">
          <div className="flex items-center gap-3">
            <Avatar size="default">
              {profile.avatar_url && (
                <AvatarImage
                  src={profile.avatar_url}
                  alt={profile.full_name}
                />
              )}
              <AvatarFallback>
                {getInitials(profile.full_name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-sm font-medium">
                {profile.full_name}
              </span>
              <span className="truncate text-xs text-muted-foreground">
                {profile.email}
              </span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-3 w-full justify-start text-muted-foreground"
            onClick={() => logout()}
          >
            <LogOut className="size-4" />
            Log out
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}

"use client"

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
  Shield,
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
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
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

export interface SidebarProps {
  profile: {
    full_name: string
    avatar_url: string | null
    role: string
    email: string
  }
}

export function Sidebar({ profile }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className="flex h-full flex-col">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3 px-4 py-5">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="size-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-tight tracking-tight">
            JNV Alumni
          </span>
          <span className="text-xs text-muted-foreground">Network</span>
        </div>
      </div>

      <Separator />

      {/* Main Navigation */}
      <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto px-3 py-4">
        <p className="mb-2 px-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Main
        </p>
        {NAV_ITEMS.map((item) => {
          const Icon = iconMap[item.icon]
          const isActive =
            pathname === item.href ||
            (item.href as string !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {Icon && <Icon className="size-4 shrink-0" />}
              {item.label}
            </Link>
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
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {Icon && <Icon className="size-4 shrink-0" />}
              {item.label}
            </Link>
          )
        })}

        {/* Admin Section */}
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
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {Icon && <Icon className="size-4 shrink-0" />}
                  {item.label}
                </Link>
              )
            })}
          </>
        )}
      </nav>

      {/* User Section */}
      <Separator />
      <div className="p-3">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left",
              "transition-colors hover:bg-muted"
            )}
          >
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
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" sideOffset={8}>
            <DropdownMenuGroup>
              <DropdownMenuLabel>{profile.full_name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem render={<Link href="/profile" />}>
                <User className="size-4" />
                Profile
              </DropdownMenuItem>
              {profile.role === "admin" && (
                <DropdownMenuItem render={<Link href="/admin" />}>
                  <Shield className="size-4" />
                  Admin Panel
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onClick={() => logout()}
              >
                <LogOut className="size-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

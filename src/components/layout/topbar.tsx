"use client"

import Link from "next/link"
import { cn, getInitials } from "@/lib/utils"
import {
  GraduationCap,
  LogOut,
  User,
  Shield,
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
import { MobileNav } from "@/components/layout/mobile-nav"
import { logout } from "@/lib/actions/auth.actions"

interface TopbarProps {
  profile: {
    full_name: string
    avatar_url: string | null
    role: string
    email: string
  }
}

export function Topbar({ profile }: TopbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b bg-card px-4">
      {/* Mobile Nav Trigger */}
      <MobileNav profile={profile} />

      {/* Brand - visible only on mobile where sidebar is hidden */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <GraduationCap className="size-4" />
        </div>
        <span className="text-sm font-semibold">JNV Alumni</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            "flex items-center gap-2 rounded-lg px-2 py-1.5",
            "transition-colors hover:bg-muted"
          )}
        >
          <Avatar size="sm">
            {profile.avatar_url && (
              <AvatarImage
                src={profile.avatar_url}
                alt={profile.full_name}
              />
            )}
            <AvatarFallback>{getInitials(profile.full_name)}</AvatarFallback>
          </Avatar>
          <span className="hidden text-sm font-medium sm:inline-block">
            {profile.full_name}
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" sideOffset={8}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-medium">{profile.full_name}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {profile.email}
                </span>
              </div>
            </DropdownMenuLabel>
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
    </header>
  )
}

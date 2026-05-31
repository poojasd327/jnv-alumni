"use client"

import { usePathname } from "next/navigation"
import { NAV_ITEMS, PERSONAL_NAV_ITEMS, ADMIN_NAV_ITEMS } from "@/lib/constants"

const ALL_ITEMS = [...NAV_ITEMS, ...PERSONAL_NAV_ITEMS, ...ADMIN_NAV_ITEMS]

export function PageTitle() {
  const pathname = usePathname()

  const match = ALL_ITEMS.find(
    (item) =>
      pathname === item.href ||
      (item.href !== "/" && pathname.startsWith(item.href))
  )

  const title =
    match?.label ||
    (pathname === "/" || pathname === "/dashboard" ? "Dashboard" : "")

  if (!title) return null

  return <h2 className="hidden text-sm font-semibold md:block">{title}</h2>
}

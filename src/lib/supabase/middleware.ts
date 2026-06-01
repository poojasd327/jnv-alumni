import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Allow health check without auth
  if (pathname === "/api/health") {
    return supabaseResponse
  }

  // Public routes that don't require auth
  const publicRoutes = ["/login", "/register", "/forgot-password", "/api/auth/callback", "/privacy", "/terms"]
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route))

  // Pending approval route
  const isPendingRoute = pathname === "/pending-approval"

  // Admin routes
  const isAdminRoute = pathname.startsWith("/admin")

  // No session -> redirect to login (unless on public route)
  if (!user) {
    if (isPublicRoute) return supabaseResponse
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  // User has session -> check approval status
  const { data: profile } = await supabase
    .from("profiles")
    .select("approval_status, role")
    .eq("id", user.id)
    .single()

  if (!profile) {
    // Profile not found (trigger may not have fired yet), allow pending route
    if (isPendingRoute) return supabaseResponse
    const url = request.nextUrl.clone()
    url.pathname = "/pending-approval"
    return NextResponse.redirect(url)
  }

  const { approval_status, role } = profile

  if (approval_status === "pending") {
    if (isPendingRoute) return supabaseResponse
    const url = request.nextUrl.clone()
    url.pathname = "/pending-approval"
    return NextResponse.redirect(url)
  }

  if (approval_status === "rejected") {
    await supabase.auth.signOut()
    const url = request.nextUrl.clone()
    url.pathname = "/login"
    url.searchParams.set("error", "account_rejected")
    return NextResponse.redirect(url)
  }

  // User is approved
  if (isPublicRoute || isPendingRoute) {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  // Admin route check
  if (isAdminRoute && role !== "admin") {
    const url = request.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

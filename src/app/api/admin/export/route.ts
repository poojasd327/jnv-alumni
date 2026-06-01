import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit"

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "admin") return null
  return { supabase, userId: user.id }
}

function escapeCsvField(value: unknown): string {
  if (value === null || value === undefined) return ""
  const str = String(value)
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

function arrayToCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return ""
  const headers = Object.keys(rows[0])
  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      headers.map((h) => escapeCsvField(row[h])).join(",")
    ),
  ]
  return lines.join("\n")
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin()
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
  }

  const rateCheck = checkRateLimit(`${admin.userId}:admin-export`, RATE_LIMITS.sensitive)
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "Too many export requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateCheck.resetAt - Date.now()) / 1000)) } }
    )
  }

  const type = request.nextUrl.searchParams.get("type") || "users"
  const { supabase } = admin

  if (type === "users") {
    const { data: users } = await supabase
      .from("profiles")
      .select("id, full_name, email, mobile, jnv_school, jnv_state, batch_start_year, passing_year, city, profession, company, industry, role, approval_status, created_at")
      .order("created_at", { ascending: false })

    if (!users || users.length === 0) {
      return NextResponse.json({ error: "No data to export" }, { status: 404 })
    }

    const csv = arrayToCsv(users)
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="users-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  }

  if (type === "reports") {
    const { data: reports } = await supabase
      .from("reports")
      .select("id, content_type, content_id, reason, description, status, reviewed_at, admin_notes, created_at, reporter_id, reviewed_by")
      .order("created_at", { ascending: false })

    if (!reports || reports.length === 0) {
      return NextResponse.json({ error: "No data to export" }, { status: 404 })
    }

    const csv = arrayToCsv(reports)
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="reports-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  }

  if (type === "jobs") {
    const { data: jobs } = await supabase
      .from("jobs")
      .select("id, title, company, location_city, location_state, job_type, experience_min, experience_max, salary_min, salary_max, posted_by, created_at")
      .order("created_at", { ascending: false })

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ error: "No data to export" }, { status: 404 })
    }

    const csv = arrayToCsv(jobs)
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="jobs-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  }

  return NextResponse.json({ error: "Invalid export type. Use: users, reports, or jobs" }, { status: 400 })
}

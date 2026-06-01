import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit"

function toCsvRow(values: string[]): string {
  return values.map(v => {
    const s = String(v ?? "")
    if (s.includes(",") || s.includes('"') || s.includes("\n")) {
      return `"${s.replace(/"/g, '""')}"`
    }
    return s
  }).join(",")
}

function arrayToCsv(rows: Record<string, unknown>[]): string {
  if (rows.length === 0) return ""
  const headers = Object.keys(rows[0])
  const lines = [toCsvRow(headers)]
  for (const row of rows) {
    lines.push(toCsvRow(headers.map(h => {
      const val = row[h]
      if (Array.isArray(val)) return val.join("; ")
      if (typeof val === "object" && val !== null) return JSON.stringify(val)
      return String(val ?? "")
    })))
  }
  return lines.join("\n")
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const rateCheck = checkRateLimit(`${user.id}:export`, RATE_LIMITS.sensitive)
  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "Too many export requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil((rateCheck.resetAt - Date.now()) / 1000)) } }
    )
  }

  const format = request.nextUrl.searchParams.get("format") === "csv" ? "csv" : "json"

  // Fetch all user data in parallel
  const [
    { data: profile },
    { data: jobs },
    { data: applications },
    { data: events },
    { data: registrations },
    { data: listings },
    { data: forumPosts },
    { data: forumComments },
    { data: businesses },
    { data: media },
    { data: mentorshipAsMentor },
    { data: mentorshipAsMentee },
    { data: announcements },
    { data: wishlists },
  ] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    supabase.from("jobs").select("*").eq("posted_by", user.id),
    supabase.from("job_applications").select("*").eq("applicant_id", user.id),
    supabase.from("events").select("*").eq("organizer_id", user.id),
    supabase.from("event_registrations").select("*").eq("user_id", user.id),
    supabase.from("marketplace_listings").select("*").eq("seller_id", user.id),
    supabase.from("forum_posts").select("*").eq("author_id", user.id),
    supabase.from("forum_comments").select("*").eq("author_id", user.id),
    supabase.from("businesses").select("*").eq("owner_id", user.id),
    supabase.from("media").select("*").eq("uploaded_by", user.id),
    supabase.from("mentorship_requests").select("*").eq("mentor_id", user.id),
    supabase.from("mentorship_requests").select("*").eq("mentee_id", user.id),
    supabase.from("announcements").select("*").eq("author_id", user.id),
    supabase.from("wishlists").select("*").eq("user_id", user.id),
  ])

  const dateStr = new Date().toISOString().split("T")[0]

  if (format === "csv") {
    const sections: { name: string; rows: Record<string, unknown>[] }[] = [
      { name: "Profile", rows: profile ? [profile] : [] },
      { name: "Jobs Posted", rows: jobs || [] },
      { name: "Job Applications", rows: applications || [] },
      { name: "Events Organized", rows: events || [] },
      { name: "Event Registrations", rows: registrations || [] },
      { name: "Marketplace Listings", rows: listings || [] },
      { name: "Forum Posts", rows: forumPosts || [] },
      { name: "Forum Comments", rows: forumComments || [] },
      { name: "Businesses", rows: businesses || [] },
      { name: "Media Uploads", rows: media || [] },
      { name: "Mentorship (as Mentor)", rows: mentorshipAsMentor || [] },
      { name: "Mentorship (as Mentee)", rows: mentorshipAsMentee || [] },
      { name: "Announcements", rows: announcements || [] },
      { name: "Wishlists", rows: wishlists || [] },
    ]

    const csvParts: string[] = [`# JNV Alumni Data Export — ${dateStr}`]
    for (const section of sections) {
      csvParts.push(`\n# ${section.name} (${section.rows.length} records)`)
      if (section.rows.length > 0) {
        csvParts.push(arrayToCsv(section.rows))
      }
    }

    return new NextResponse(csvParts.join("\n"), {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="jnv-alumni-data-${dateStr}.csv"`,
      },
    })
  }

  const exportData = {
    exported_at: new Date().toISOString(),
    user_id: user.id,
    email: user.email,
    profile,
    jobs_posted: jobs || [],
    job_applications: applications || [],
    events_organized: events || [],
    event_registrations: registrations || [],
    marketplace_listings: listings || [],
    forum_posts: forumPosts || [],
    forum_comments: forumComments || [],
    businesses: businesses || [],
    media_uploads: media || [],
    mentorship_as_mentor: mentorshipAsMentor || [],
    mentorship_as_mentee: mentorshipAsMentee || [],
    announcements: announcements || [],
    wishlists: wishlists || [],
  }

  const json = JSON.stringify(exportData, null, 2)

  return new NextResponse(json, {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="jnv-alumni-data-${dateStr}.json"`,
    },
  })
}

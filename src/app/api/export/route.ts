import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

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
      "Content-Disposition": `attachment; filename="jnv-alumni-data-${new Date().toISOString().split("T")[0]}.json"`,
    },
  })
}

"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { sanitizeSearch, sanitizeInput } from "@/lib/utils"

export async function getForumCategories() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("forum_categories")
    .select("*")
    .order("sort_order")
  return data || []
}

export async function getForumPosts(params: {
  category?: string
  q?: string
  page?: string
}) {
  const supabase = await createClient()
  const pageSize = 12
  const currentPage = Number(params.page) || 1
  const from = (currentPage - 1) * pageSize

  let query = supabase
    .from("forum_posts")
    .select("*, profiles!forum_posts_author_id_fkey(full_name, avatar_url), forum_categories!forum_posts_category_id_fkey(name, slug)", { count: "exact" })

  if (params.category) {
    query = query.eq("forum_categories.slug", params.category)
    // Also filter by category_id directly for efficiency
    const { data: cat } = await supabase
      .from("forum_categories")
      .select("id")
      .eq("slug", params.category)
      .single()
    if (cat) {
      query = supabase
        .from("forum_posts")
        .select("*, profiles!forum_posts_author_id_fkey(full_name, avatar_url), forum_categories!forum_posts_category_id_fkey(name, slug)", { count: "exact" })
        .eq("category_id", cat.id)
    }
  }
  if (params.q) {
    const q = sanitizeSearch(params.q)
    query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`)
  }

  query = query
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })
  query = query.range(from, from + pageSize - 1)

  const { data, count, error } = await query
  if (error) return { posts: [], count: 0 }
  return { posts: data || [], count: count || 0 }
}

export async function getPostById(id: string) {
  const supabase = await createClient()

  // Atomic view count increment (race-condition safe)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.rpc as any)("increment_view_count", { post_id: id }).catch(() => {
    // Fallback: non-atomic increment if RPC not available yet
    supabase.from("forum_posts").select("view_count").eq("id", id).single()
      .then(({ data }) => {
        if (data) supabase.from("forum_posts").update({ view_count: (data.view_count || 0) + 1 }).eq("id", id)
      })
  })

  const { data } = await supabase
    .from("forum_posts")
    .select("*, profiles!forum_posts_author_id_fkey(id, full_name, avatar_url, profession), forum_categories!forum_posts_category_id_fkey(name, slug)")
    .eq("id", id)
    .single()

  return data
}

export async function getPostComments(postId: string) {
  const supabase = await createClient()

  const { data } = await supabase
    .from("forum_comments")
    .select("*, profiles!forum_comments_author_id_fkey(id, full_name, avatar_url)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true })

  return data || []
}

export async function createPost(data: {
  category_id: string
  title: string
  content: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  if (!data.title.trim() || !data.content.trim()) return { error: "Title and content are required" }
  if (data.title.length > 300) return { error: "Title is too long (max 300 characters)" }

  const { data: post, error } = await supabase
    .from("forum_posts")
    .insert({
      category_id: data.category_id,
      author_id: user.id,
      title: sanitizeInput(data.title, 300),
      content: sanitizeInput(data.content, 50000),
    })
    .select()
    .single()

  if (error) return { error: error.message }
  revalidatePath("/forum")
  return { data: post }
}

export async function createComment(data: {
  post_id: string
  content: string
  parent_id?: string
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  if (!data.content.trim()) return { error: "Comment cannot be empty" }
  if (data.content.length > 10000) return { error: "Comment is too long (max 10000 characters)" }

  const { error } = await supabase
    .from("forum_comments")
    .insert({
      post_id: data.post_id,
      author_id: user.id,
      content: sanitizeInput(data.content, 10000),
      parent_id: data.parent_id || null,
    })

  if (error) return { error: error.message }

  // Atomic comments_count increment (race-condition safe)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (supabase.rpc as any)("increment_comments_count", { post_id: data.post_id }).catch(() => {
    supabase.from("forum_posts").select("comments_count").eq("id", data.post_id).single()
      .then(({ data: post }) => {
        if (post) supabase.from("forum_posts").update({ comments_count: (post.comments_count || 0) + 1 }).eq("id", data.post_id)
      })
  })

  revalidatePath(`/forum/${data.post_id}`)
  return { success: true }
}

export async function togglePostLike(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  const { data: existing } = await supabase
    .from("forum_likes")
    .select("id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .single()

  if (existing) {
    await supabase.from("forum_likes").delete().eq("id", existing.id)
    // Atomic decrement (race-condition safe)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.rpc as any)("update_likes_count", { post_id: postId, delta: -1 }).catch(() => {
      supabase.from("forum_posts").select("likes_count").eq("id", postId).single()
        .then(({ data: post }) => {
          if (post) supabase.from("forum_posts").update({ likes_count: Math.max(0, (post.likes_count || 0) - 1) }).eq("id", postId)
        })
    })
  } else {
    await supabase.from("forum_likes").insert({ user_id: user.id, post_id: postId })
    // Atomic increment (race-condition safe)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.rpc as any)("update_likes_count", { post_id: postId, delta: 1 }).catch(() => {
      supabase.from("forum_posts").select("likes_count").eq("id", postId).single()
        .then(({ data: post }) => {
          if (post) supabase.from("forum_posts").update({ likes_count: (post.likes_count || 0) + 1 }).eq("id", postId)
        })
    })
  }

  revalidatePath(`/forum/${postId}`)
  return { success: true, liked: !existing }
}

export async function deletePost(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Allow author or admin
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()
  const isAdmin = profile?.role === "admin"

  let query = supabase.from("forum_posts").delete().eq("id", id)
  if (!isAdmin) query = query.eq("author_id", user.id)

  const { error } = await query
  if (error) return { error: error.message }
  revalidatePath("/forum")
  return { success: true }
}

export async function updatePost(id: string, data: { title: string; content: string }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  if (!data.title.trim() || !data.content.trim()) return { error: "Title and content are required" }
  if (data.title.length > 300) return { error: "Title is too long (max 300 characters)" }

  const { error } = await supabase
    .from("forum_posts")
    .update({
      title: sanitizeInput(data.title, 300),
      content: sanitizeInput(data.content, 50000),
    })
    .eq("id", id)
    .eq("author_id", user.id)

  if (error) return { error: error.message }
  revalidatePath(`/forum/${id}`)
  revalidatePath("/forum")
  return { success: true }
}

export async function togglePinPost(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Unauthorized" }

  // Only admins can pin/unpin
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "admin") return { error: "Only admins can pin posts" }

  const { data: post } = await supabase
    .from("forum_posts")
    .select("is_pinned")
    .eq("id", id)
    .single()

  if (!post) return { error: "Post not found" }

  const { error } = await supabase
    .from("forum_posts")
    .update({ is_pinned: !post.is_pinned })
    .eq("id", id)

  if (error) return { error: error.message }
  revalidatePath(`/forum/${id}`)
  revalidatePath("/forum")
  return { success: true, pinned: !post.is_pinned }
}

export async function isPostLiked(postId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false

  const { data } = await supabase
    .from("forum_likes")
    .select("id")
    .eq("user_id", user.id)
    .eq("post_id", postId)
    .single()

  return !!data
}

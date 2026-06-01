"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"
import { sanitizeInput } from "@/lib/utils"

export async function getConversations() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from("conversations")
    .select(`
      *,
      participant_1_profile:profiles!conversations_participant_1_fkey(id, full_name, avatar_url),
      participant_2_profile:profiles!conversations_participant_2_fkey(id, full_name, avatar_url)
    `)
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)
    .order("last_message_at", { ascending: false })

  if (!data) return []

  // Get last message and unread count for each conversation
  const enriched = await Promise.all(
    data.map(async (conv) => {
      const [{ data: lastMsg }, { count: unread }] = await Promise.all([
        supabase
          .from("messages")
          .select("content, sender_id, created_at")
          .eq("conversation_id", conv.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single(),
        supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .eq("is_read", false)
          .neq("sender_id", user.id),
      ])

      const otherProfile = conv.participant_1 === user.id
        ? conv.participant_2_profile
        : conv.participant_1_profile

      return {
        id: conv.id,
        otherUser: Array.isArray(otherProfile) ? otherProfile[0] : otherProfile,
        lastMessage: lastMsg,
        unreadCount: unread || 0,
        lastMessageAt: conv.last_message_at,
      }
    })
  )

  return enriched
}

export async function getOrCreateConversation(otherUserId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }
  if (user.id === otherUserId) return { error: "Cannot message yourself" }

  // Check if conversation already exists
  const { data: existing } = await supabase
    .from("conversations")
    .select("id")
    .or(
      `and(participant_1.eq.${user.id},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${user.id})`
    )
    .limit(1)
    .single()

  if (existing) return { conversationId: existing.id }

  // Create new conversation
  const { data: newConv, error } = await supabase
    .from("conversations")
    .insert({
      participant_1: user.id,
      participant_2: otherUserId,
    })
    .select("id")
    .single()

  if (error) return { error: "Could not create conversation" }
  return { conversationId: newConv.id }
}

export async function getMessages(conversationId: string, limit = 50) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  // Verify user is participant
  const { data: conv } = await supabase
    .from("conversations")
    .select("participant_1, participant_2")
    .eq("id", conversationId)
    .single()

  if (!conv || (conv.participant_1 !== user.id && conv.participant_2 !== user.id)) {
    return []
  }

  const { data: messages } = await supabase
    .from("messages")
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(id, full_name, avatar_url)
    `)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(limit)

  // Mark unread messages from the other user as read
  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("conversation_id", conversationId)
    .eq("is_read", false)
    .neq("sender_id", user.id)

  return messages || []
}

export async function sendMessage(conversationId: string, content: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: "Not authenticated" }

  const sanitized = sanitizeInput(content, 5000)
  if (!sanitized || sanitized.length < 1) return { error: "Message cannot be empty" }

  // Verify user is participant
  const { data: conv } = await supabase
    .from("conversations")
    .select("participant_1, participant_2")
    .eq("id", conversationId)
    .single()

  if (!conv || (conv.participant_1 !== user.id && conv.participant_2 !== user.id)) {
    return { error: "Not authorized" }
  }

  const { error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: sanitized,
    })

  if (error) return { error: "Failed to send message" }

  // Update conversation last_message_at
  await supabase
    .from("conversations")
    .update({ last_message_at: new Date().toISOString() })
    .eq("id", conversationId)

  revalidatePath("/messages")
  return { success: true }
}

export async function getUnreadMessageCount() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return 0

  // Get all conversation IDs where user is a participant
  const { data: convs } = await supabase
    .from("conversations")
    .select("id")
    .or(`participant_1.eq.${user.id},participant_2.eq.${user.id}`)

  if (!convs || convs.length === 0) return 0

  const convIds = convs.map(c => c.id)
  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .in("conversation_id", convIds)
    .eq("is_read", false)
    .neq("sender_id", user.id)

  return count || 0
}

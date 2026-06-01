"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"

const PRESENCE_CHANNEL = "online-users"

/**
 * Hook to track which users are online using Supabase Realtime Presence.
 * Call with the current user's ID to announce presence and track others.
 */
export function usePresence(currentUserId: string | undefined) {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (!currentUserId) return

    const supabase = createClient()
    const channel = supabase.channel(PRESENCE_CHANNEL, {
      config: { presence: { key: currentUserId } },
    })

    channel
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState()
        const userIds = new Set<string>()
        for (const key of Object.keys(state)) {
          userIds.add(key)
        }
        setOnlineUsers(userIds)
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({ user_id: currentUserId, online_at: new Date().toISOString() })
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId])

  return {
    onlineUsers,
    isOnline: (userId: string) => onlineUsers.has(userId),
  }
}

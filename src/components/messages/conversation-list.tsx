"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { getInitials } from "@/lib/utils"
import { PresenceDot } from "@/components/shared/presence-dot"

interface ConversationItem {
  id: string
  otherUser: { id: string; full_name: string; avatar_url: string | null } | null
  lastMessage: { content: string; sender_id: string; created_at: string } | null
  unreadCount: number
  lastMessageAt: string
}

function timeAgo(dateString: string) {
  const diff = Date.now() - new Date(dateString).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return "now"
  if (mins < 60) return `${mins}m`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d`
  return new Date(dateString).toLocaleDateString()
}

export function ConversationList({ conversations }: { conversations: ConversationItem[] }) {
  return (
    <div className="space-y-2">
      {conversations.map((conv) => (
        <Link key={conv.id} href={`/messages/${conv.id}`}>
          <Card className={`transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${conv.unreadCount > 0 ? "border-primary/30 bg-primary/5" : ""}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                  <Avatar className="size-10">
                    <AvatarImage src={conv.otherUser?.avatar_url || ""} />
                    <AvatarFallback>{getInitials(conv.otherUser?.full_name || "?")}</AvatarFallback>
                  </Avatar>
                  {conv.otherUser?.id && <PresenceDot userId={conv.otherUser.id} className="size-2.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-medium truncate ${conv.unreadCount > 0 ? "text-foreground" : ""}`}>
                      {conv.otherUser?.full_name || "Unknown User"}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0">
                      {conv.lastMessage ? timeAgo(conv.lastMessage.created_at) : ""}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <p className={`text-sm truncate ${conv.unreadCount > 0 ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                      {conv.lastMessage?.content || "No messages yet"}
                    </p>
                    {conv.unreadCount > 0 && (
                      <Badge variant="default" className="shrink-0 size-5 rounded-full p-0 flex items-center justify-center text-[10px]">
                        {conv.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}

"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { sendMessage } from "@/lib/actions/messages.actions"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials } from "@/lib/utils"
import { Send } from "lucide-react"
import { toast } from "sonner"

interface ChatMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  is_read: boolean
  created_at: string
  sender: { id: string; full_name: string; avatar_url: string | null } | null
}

interface ChatViewProps {
  conversationId: string
  currentUserId: string
  initialMessages: ChatMessage[]
  otherUserName: string
}

function formatTime(dateString: string) {
  const date = new Date(dateString)
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  const isYesterday = date.toDateString() === yesterday.toDateString()

  const time = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  if (isToday) return time
  if (isYesterday) return `Yesterday ${time}`
  return `${date.toLocaleDateString()} ${time}`
}

export function ChatView({ conversationId, currentUserId, initialMessages, otherUserName }: ChatViewProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Subscribe to new messages via Supabase Realtime
  useEffect(() => {
    const supabase = createClient()
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          const newMsg = payload.new as ChatMessage
          // Only add if not from us (our optimistic msg is already there)
          if (newMsg.sender_id !== currentUserId) {
            setMessages((prev) => {
              if (prev.some(m => m.id === newMsg.id)) return prev
              return [...prev, {
                ...newMsg,
                sender: { id: newMsg.sender_id, full_name: otherUserName, avatar_url: null },
              }]
            })
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [conversationId, currentUserId, otherUserName])

  async function handleSend() {
    const content = newMessage.trim()
    if (!content || sending) return

    setSending(true)
    setNewMessage("")

    // Optimistic update
    const optimisticMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversation_id: conversationId,
      sender_id: currentUserId,
      content,
      is_read: false,
      created_at: new Date().toISOString(),
      sender: { id: currentUserId, full_name: "You", avatar_url: null },
    }
    setMessages((prev) => [...prev, optimisticMsg])

    const result = await sendMessage(conversationId, content)
    if (result.error) {
      toast.error(result.error)
      setMessages((prev) => prev.filter(m => m.id !== optimisticMsg.id))
    }

    setSending(false)
    textareaRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto py-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Start your conversation with {otherUserName}
          </p>
        )}
        {messages.map((msg) => {
          const isMe = msg.sender_id === currentUserId
          const senderData = Array.isArray(msg.sender) ? msg.sender[0] : msg.sender
          return (
            <div key={msg.id} className={`flex gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
              {!isMe && (
                <Avatar className="size-8 shrink-0 mt-1">
                  <AvatarImage src={senderData?.avatar_url || ""} />
                  <AvatarFallback className="text-xs">{getInitials(senderData?.full_name || "?")}</AvatarFallback>
                </Avatar>
              )}
              <div className={`max-w-[75%] ${isMe ? "items-end" : "items-start"}`}>
                <div
                  className={`rounded-2xl px-3 py-2 text-sm ${
                    isMe
                      ? "bg-primary text-primary-foreground rounded-br-md"
                      : "bg-muted rounded-bl-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">{msg.content}</p>
                </div>
                <p className={`text-[10px] text-muted-foreground mt-0.5 ${isMe ? "text-right" : ""}`}>
                  {formatTime(msg.created_at)}
                </p>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t pt-3 flex gap-2">
        <Textarea
          ref={textareaRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={1}
          className="resize-none min-h-[40px] max-h-[120px]"
          maxLength={5000}
        />
        <Button
          onClick={handleSend}
          disabled={!newMessage.trim() || sending}
          size="icon"
          className="shrink-0 self-end"
        >
          <Send className="size-4" />
        </Button>
      </div>
    </>
  )
}

import { getMessages } from "@/lib/actions/messages.actions"
import { createClient } from "@/lib/supabase/server"
import { ChatView } from "@/components/messages/chat-view"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { redirect } from "next/navigation"

export const metadata = { title: "Conversation" }

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id: conversationId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  // Get conversation details
  const { data: conv } = await supabase
    .from("conversations")
    .select(`
      *,
      participant_1_profile:profiles!conversations_participant_1_fkey(id, full_name, avatar_url),
      participant_2_profile:profiles!conversations_participant_2_fkey(id, full_name, avatar_url)
    `)
    .eq("id", conversationId)
    .single()

  if (!conv || (conv.participant_1 !== user.id && conv.participant_2 !== user.id)) {
    redirect("/messages")
  }

  const messages = await getMessages(conversationId)

  const otherProfileRaw = conv.participant_1 === user.id
    ? conv.participant_2_profile
    : conv.participant_1_profile
  const otherUser = Array.isArray(otherProfileRaw) ? otherProfileRaw[0] : otherProfileRaw

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-3 pb-4 border-b">
        <Button render={<Link href="/messages" />} variant="ghost" size="icon" className="shrink-0">
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-lg font-semibold">{otherUser?.full_name || "Unknown User"}</h1>
        </div>
      </div>

      <ChatView
        conversationId={conversationId}
        currentUserId={user.id}
        initialMessages={messages as never[]}
        otherUserName={otherUser?.full_name || "Unknown User"}
      />
    </div>
  )
}

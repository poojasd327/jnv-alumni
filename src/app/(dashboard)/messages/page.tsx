export const metadata = { title: "Messages", description: "Direct messages with fellow alumni." }

import { getConversations } from "@/lib/actions/messages.actions"
import { ConversationList } from "@/components/messages/conversation-list"
import { Mail } from "lucide-react"

export default async function MessagesPage() {
  const conversations = await getConversations()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">Direct messages with fellow alumni</p>
      </div>

      {conversations.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <Mail className="size-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No messages yet</h3>
          <p className="text-muted-foreground mt-1">Visit an alumni profile to start a conversation</p>
        </div>
      ) : (
        <ConversationList conversations={conversations as never[]} />
      )}
    </div>
  )
}

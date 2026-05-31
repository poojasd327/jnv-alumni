"use client"

import { useTransition } from "react"
import { approveUser, rejectUser } from "@/lib/actions/admin.actions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import { Check, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import type { Profile } from "@/lib/types/database.types"

interface ApprovalQueueProps {
  users: Profile[]
}

export function ApprovalQueue({ users }: ApprovalQueueProps) {
  const [isPending, startTransition] = useTransition()

  function handleApprove(userId: string, name: string) {
    startTransition(async () => {
      const result = await approveUser(userId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(`${name} has been approved`)
    })
  }

  function handleReject(userId: string, name: string) {
    startTransition(async () => {
      const result = await rejectUser(userId)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(`${name} has been rejected`)
    })
  }

  return (
    <div className="space-y-3">
      {users.map((user) => (
        <Card key={user.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <h3 className="font-medium">{user.full_name}</h3>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span>{user.email}</span>
                  <span>&middot;</span>
                  <span>{user.mobile}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <Badge variant="secondary">{user.jnv_school}</Badge>
                  <Badge variant="outline">Batch {user.batch_start_year}-{user.passing_year}</Badge>
                  <Badge variant="outline">{user.jnv_state}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Registered {formatDate(user.created_at)}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Button
                  size="sm"
                  onClick={() => handleApprove(user.id, user.full_name)}
                  disabled={isPending}
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-destructive hover:text-destructive"
                  onClick={() => handleReject(user.id, user.full_name)}
                  disabled={isPending}
                >
                  <X className="h-4 w-4 mr-1" />
                  Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

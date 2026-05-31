"use client"

import { useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { approveUser, rejectUser, updateUserRole } from "@/lib/actions/admin.actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import type { Profile } from "@/lib/types/database.types"

const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  approved: "default",
  pending: "secondary",
  rejected: "destructive",
}

interface UserTableProps {
  users: Profile[]
  count: number
}

export function UserTable({ users, count }: UserTableProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()

  function filterByStatus(status: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (status === "all") {
      params.delete("status")
    } else {
      params.set("status", status)
    }
    params.delete("page")
    router.push(`/admin/users?${params.toString()}`)
  }

  function handleAction(action: () => Promise<{ error?: string; success?: boolean }>, successMsg: string) {
    startTransition(async () => {
      const result = await action()
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(successMsg)
    })
  }

  const activeStatus = searchParams.get("status") || "all"

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["all", "approved", "pending", "rejected"].map((status) => (
          <Button
            key={status}
            variant={activeStatus === status ? "default" : "outline"}
            size="sm"
            onClick={() => filterByStatus(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Button>
        ))}
      </div>

      <div className="space-y-2">
        {users.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{user.full_name}</span>
                    <Badge variant={statusColors[user.approval_status] || "outline"}>
                      {user.approval_status}
                    </Badge>
                    {user.role === "admin" && <Badge>Admin</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">{user.email} &middot; {user.mobile}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {user.jnv_school} &middot; Batch {user.batch_start_year}-{user.passing_year} &middot; Joined {formatDate(user.created_at)}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0">
                  {user.approval_status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => handleAction(() => approveUser(user.id), `${user.full_name} approved`)}
                        disabled={isPending}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAction(() => rejectUser(user.id), `${user.full_name} rejected`)}
                        disabled={isPending}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {user.role !== "admin" && user.approval_status === "approved" && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleAction(() => updateUserRole(user.id, "admin"), `${user.full_name} made admin`)}
                      disabled={isPending}
                    >
                      Make Admin
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

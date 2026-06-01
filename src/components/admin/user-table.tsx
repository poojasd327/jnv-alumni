"use client"

import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { approveUser, rejectUser, updateUserRole, bulkApproveUsers, bulkRejectUsers } from "@/lib/actions/admin.actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { toast } from "sonner"
import { CheckSquare, Square, MinusSquare } from "lucide-react"
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const router = useRouter()
  const searchParams = useSearchParams()

  const pendingUsers = users.filter((u) => u.approval_status === "pending")
  const pendingIds = pendingUsers.map((u) => u.id)
  const allPendingSelected = pendingIds.length > 0 && pendingIds.every((id) => selectedIds.has(id))
  const somePendingSelected = pendingIds.some((id) => selectedIds.has(id))

  function toggleSelect(userId: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(userId)) {
        next.delete(userId)
      } else {
        next.add(userId)
      }
      return next
    })
  }

  function toggleSelectAll() {
    if (allPendingSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(pendingIds))
    }
  }

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

  function handleBulkApprove() {
    const ids = Array.from(selectedIds)
    startTransition(async () => {
      const result = await bulkApproveUsers(ids)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(`${ids.length} user(s) approved`)
      setSelectedIds(new Set())
    })
  }

  function handleBulkReject() {
    const ids = Array.from(selectedIds)
    startTransition(async () => {
      const result = await bulkRejectUsers(ids)
      if (result.error) {
        toast.error(result.error)
        return
      }
      toast.success(`${ids.length} user(s) rejected`)
      setSelectedIds(new Set())
    })
  }

  const activeStatus = searchParams.get("status") || "all"

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
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

      {/* Bulk action bar */}
      {selectedIds.size > 0 && (
        <div className="flex flex-col gap-2 rounded-lg border bg-muted/50 p-3 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-sm font-medium">
            {selectedIds.size} user{selectedIds.size > 1 ? "s" : ""} selected
          </span>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleBulkApprove} disabled={isPending}>
              Approve Selected
            </Button>
            <Button size="sm" variant="outline" onClick={handleBulkReject} disabled={isPending}>
              Reject Selected
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setSelectedIds(new Set())} disabled={isPending}>
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Select all toggle for pending users */}
      {pendingIds.length > 1 && (
        <button
          type="button"
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          onClick={toggleSelectAll}
        >
          {allPendingSelected ? (
            <CheckSquare className="size-4" />
          ) : somePendingSelected ? (
            <MinusSquare className="size-4" />
          ) : (
            <Square className="size-4" />
          )}
          {allPendingSelected ? "Deselect all pending" : `Select all ${pendingIds.length} pending`}
        </button>
      )}

      <div className="space-y-2">
        {users.map((user) => (
          <Card key={user.id} className={selectedIds.has(user.id) ? "ring-2 ring-primary" : ""}>
            <CardContent className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  {/* Checkbox for pending users */}
                  {user.approval_status === "pending" && (
                    <button
                      type="button"
                      className="mt-0.5 shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => toggleSelect(user.id)}
                      aria-label={`Select ${user.full_name}`}
                    >
                      {selectedIds.has(user.id) ? (
                        <CheckSquare className="size-5" />
                      ) : (
                        <Square className="size-5" />
                      )}
                    </button>
                  )}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">{user.full_name}</span>
                      <Badge variant={statusColors[user.approval_status] || "outline"}>
                        {user.approval_status}
                      </Badge>
                      {user.role === "admin" && <Badge>Admin</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{user.email} &middot; {user.mobile}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {user.jnv_school} &middot; Batch {user.batch_start_year}-{user.passing_year} &middot; Joined {formatDate(user.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  {user.approval_status === "pending" && (
                    <>
                      <Button
                        size="sm"
                        className="flex-1 sm:flex-none"
                        onClick={() => handleAction(() => approveUser(user.id), `${user.full_name} approved`)}
                        disabled={isPending}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 sm:flex-none"
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

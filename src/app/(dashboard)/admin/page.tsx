import { getPendingUsers } from "@/lib/actions/admin.actions"
import { ApprovalQueue } from "@/components/admin/approval-queue"
import { UserCheck } from "lucide-react"

export const metadata = { title: "Admin - Approvals" }

export default async function AdminPage() {
  const pendingUsers = await getPendingUsers()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Pending Approvals</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Review and approve new alumni registrations
        </p>
      </div>

      {pendingUsers.length > 0 ? (
        <ApprovalQueue users={pendingUsers} />
      ) : (
        <div className="text-center py-12">
          <UserCheck className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">No pending approvals</h3>
          <p className="text-muted-foreground mt-1">All registration requests have been processed</p>
        </div>
      )}
    </div>
  )
}

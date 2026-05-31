import { getAllUsers } from "@/lib/actions/admin.actions"
import { UserTable } from "@/components/admin/user-table"

export const metadata = { title: "Admin - Users" }

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const status = typeof params.status === "string" ? params.status : undefined
  const page = typeof params.page === "string" ? params.page : undefined

  const { users, count } = await getAllUsers({ status, page })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">All Users</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage all registered users ({count} total)
        </p>
      </div>

      <UserTable users={users} count={count} />
    </div>
  )
}

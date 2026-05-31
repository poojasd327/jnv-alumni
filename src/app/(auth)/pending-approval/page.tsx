import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { logout } from "@/lib/actions/auth.actions"
import { Clock } from "lucide-react"

export default function PendingApprovalPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
          <Clock className="h-6 w-6 text-amber-600 dark:text-amber-400" />
        </div>
        <CardTitle>Account Pending Approval</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-3">
        <p className="text-sm text-muted-foreground">
          Your registration has been received. An administrator will review and
          approve your account shortly.
        </p>
        <p className="text-sm text-muted-foreground">
          You will receive an email notification once your account has been
          approved.
        </p>
      </CardContent>
      <CardFooter className="justify-center">
        <form action={logout}>
          <Button type="submit" variant="outline">
            Sign Out
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

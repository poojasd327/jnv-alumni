import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileQuestion, ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-4">
      <div className="rounded-full bg-muted p-4">
        <FileQuestion className="h-10 w-10 text-muted-foreground" />
      </div>
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold">404</h1>
        <h2 className="text-xl font-semibold">Page Not Found</h2>
        <p className="text-muted-foreground text-sm max-w-md">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="default" render={<Link href="/" />}>
          <Home className="size-4" />
          Go home
        </Button>
        <Button variant="outline" render={<Link href="/directory" />}>
          <ArrowLeft className="size-4" />
          Alumni Directory
        </Button>
      </div>
    </div>
  )
}

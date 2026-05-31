import { Button } from "@/components/ui/button"
import Link from "next/link"
import { FileQuestion } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <FileQuestion className="h-12 w-12 text-muted-foreground" />
      <h2 className="text-xl font-bold">Page Not Found</h2>
      <p className="text-muted-foreground text-sm">The page you're looking for doesn't exist.</p>
      <Button render={<Link href="/" />}>Go Home</Button>
    </div>
  )
}

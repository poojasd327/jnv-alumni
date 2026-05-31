"use client"

import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

export default function SettingsError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <AlertTriangle className="h-10 w-10 text-destructive" />
      <h2 className="text-lg font-semibold">Failed to load Settings</h2>
      <p className="text-sm text-muted-foreground max-w-md text-center">{error.message || "An unexpected error occurred. Please try again."}</p>
      <Button onClick={reset}>Try again</Button>
    </div>
  )
}

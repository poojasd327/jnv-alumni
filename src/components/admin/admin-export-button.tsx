"use client"

import { useState } from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface AdminExportButtonProps {
  type: "users" | "reports" | "jobs"
  label: string
}

export function AdminExportButton({ type, label }: AdminExportButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleExport() {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/export?type=${type}`)
      if (!res.ok) {
        const body = await res.json().catch(() => ({ error: "Export failed" }))
        toast.error(body.error || "Export failed")
        return
      }

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = res.headers.get("Content-Disposition")?.split("filename=")[1]?.replace(/"/g, "") || `${type}-export.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      toast.success("Export downloaded")
    } catch {
      toast.error("Export failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      disabled={loading}
      className="w-full sm:w-auto"
    >
      <Download className="size-4" />
      {loading ? "Exporting..." : label}
    </Button>
  )
}

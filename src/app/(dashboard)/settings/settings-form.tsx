"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { changePassword, deleteAccount, updateNotificationPreferences } from "@/lib/actions/settings.actions"
import type { NotificationPreferences } from "@/lib/actions/settings.actions"
import { toast } from "sonner"
import { Lock, Trash2, User, Shield, AlertTriangle, Download, Bell } from "lucide-react"
import { formatDate } from "@/lib/utils"

interface SettingsFormProps {
  profile: {
    full_name: string
    email: string
    jnv_school: string
    jnv_state: string
    batch_start_year: number
    passing_year: number
    created_at: string
  } | null
  email: string
  notificationPreferences: NotificationPreferences
}

export function SettingsForm({ profile, email, notificationPreferences }: SettingsFormProps) {
  return (
    <div className="space-y-6">
      <AccountInfoSection profile={profile} email={email} />
      <NotificationPreferencesSection initialPrefs={notificationPreferences} />
      <ChangePasswordSection />
      <DataPrivacySection />
      <DangerZoneSection />
    </div>
  )
}

function AccountInfoSection({ profile, email }: { profile: SettingsFormProps["profile"]; email: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <User className="size-4" /> Account Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">Full Name</p>
            <p className="text-sm font-medium">{profile?.full_name || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Email</p>
            <p className="text-sm font-medium">{email}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">School</p>
            <p className="text-sm font-medium">{profile?.jnv_school || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Batch</p>
            <p className="text-sm font-medium">
              {profile ? `${profile.batch_start_year} – ${profile.passing_year}` : "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">State</p>
            <p className="text-sm font-medium">{profile?.jnv_state || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Member Since</p>
            <p className="text-sm font-medium">{profile ? formatDate(profile.created_at) : "—"}</p>
          </div>
        </div>
        <p className="text-xs text-muted-foreground pt-2">
          To update your name, school, or batch details, please contact an administrator.
        </p>
      </CardContent>
    </Card>
  )
}

const NOTIFICATION_OPTIONS: { key: keyof NotificationPreferences; label: string; description: string }[] = [
  { key: "email_messages", label: "Direct Messages", description: "Get notified when someone sends you a message" },
  { key: "email_job_updates", label: "Job Updates", description: "Updates on your job applications and new matching jobs" },
  { key: "email_event_reminders", label: "Event Reminders", description: "Reminders for events you've registered for" },
  { key: "email_forum_replies", label: "Forum Replies", description: "Notifications when someone replies to your posts" },
  { key: "email_announcements", label: "Announcements", description: "Important announcements from the community" },
  { key: "email_mentorship", label: "Mentorship", description: "Updates on your mentorship requests" },
]

function NotificationPreferencesSection({ initialPrefs }: { initialPrefs: NotificationPreferences }) {
  const [prefs, setPrefs] = useState<NotificationPreferences>(initialPrefs)
  const [saving, setSaving] = useState(false)

  async function handleToggle(key: keyof NotificationPreferences) {
    const updated = { ...prefs, [key]: !prefs[key] }
    setPrefs(updated)
    setSaving(true)
    const result = await updateNotificationPreferences(updated)
    setSaving(false)
    if (result.error) {
      toast.error(result.error)
      setPrefs(prefs) // revert
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Bell className="size-4" /> Email Notifications
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {NOTIFICATION_OPTIONS.map((opt) => (
          <div key={opt.key} className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-sm font-medium">{opt.label}</p>
              <p className="text-xs text-muted-foreground">{opt.description}</p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={prefs[opt.key]}
              disabled={saving}
              onClick={() => handleToggle(opt.key)}
              className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${prefs[opt.key] ? "bg-primary" : "bg-muted"}`}
            >
              <span className={`inline-block size-4 rounded-full bg-white shadow-sm transition-transform ${prefs[opt.key] ? "translate-x-4" : "translate-x-0.5"}`} />
            </button>
          </div>
        ))}
        {saving && <p className="text-xs text-muted-foreground">Saving...</p>}
      </CardContent>
    </Card>
  )
}

function ChangePasswordSection() {
  const [loading, setLoading] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    setLoading(true)
    const result = await changePassword({
      currentPassword,
      newPassword,
    })
    setLoading(false)

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(result.success)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Lock className="size-4" /> Change Password
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">New Password</Label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
            <p className="text-xs text-muted-foreground">Minimum 8 characters</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm New Password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function DataPrivacySection() {
  const [downloading, setDownloading] = useState(false)
  const [format, setFormat] = useState<"json" | "csv">("json")

  async function handleExport() {
    setDownloading(true)
    try {
      const response = await fetch(`/api/export${format === "csv" ? "?format=csv" : ""}`)
      if (!response.ok) throw new Error("Export failed")

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const dateStr = new Date().toISOString().split("T")[0]
      a.download = `jnv-alumni-data-${dateStr}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Your data has been downloaded")
    } catch {
      toast.error("Failed to export data. Please try again.")
    } finally {
      setDownloading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Download className="size-4" /> Data & Privacy
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Export Your Data</p>
          <p className="text-xs text-muted-foreground">
            Download all your data including profile, posts, listings, and activity.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setFormat("json")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${format === "json" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              JSON
            </button>
            <button
              type="button"
              onClick={() => setFormat("csv")}
              className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${format === "csv" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              CSV
            </button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="shrink-0"
            onClick={handleExport}
            disabled={downloading}
          >
            <Download className="size-4 mr-1" />
            {downloading ? "Exporting..." : `Download ${format.toUpperCase()}`}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {format === "json"
            ? "JSON format preserves full data structure — ideal for backups or data portability."
            : "CSV format is spreadsheet-compatible — ideal for viewing in Excel or Google Sheets."}
        </p>
      </CardContent>
    </Card>
  )
}

function DangerZoneSection() {
  const [showConfirm, setShowConfirm] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmText, setConfirmText] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault()

    if (confirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm")
      return
    }

    setLoading(true)
    const result = await deleteAccount(password)
    setLoading(false)

    if (result?.error) {
      toast.error(result.error)
    }
    // On success, the server action redirects to /login
  }

  return (
    <Card className="border-destructive/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-destructive">
          <Shield className="size-4" /> Danger Zone
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!showConfirm ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium">Delete Account</p>
              <p className="text-xs text-muted-foreground">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="shrink-0"
              onClick={() => setShowConfirm(true)}
            >
              <Trash2 className="size-4 mr-1" /> Delete Account
            </Button>
          </div>
        ) : (
          <form onSubmit={handleDelete} className="space-y-4">
            <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              <AlertTriangle className="size-4 shrink-0 mt-0.5" />
              <p>
                This will permanently delete your profile, listings, job postings, applications,
                event registrations, forum posts, and all other data. This cannot be undone.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="delete-password">Enter your password</Label>
              <Input
                id="delete-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="delete-confirm">
                Type <span className="font-mono font-bold">DELETE</span> to confirm
              </Label>
              <Input
                id="delete-confirm"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                required
                autoComplete="off"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" variant="destructive" disabled={loading || confirmText !== "DELETE"}>
                {loading ? "Deleting..." : "Permanently Delete"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowConfirm(false)
                  setPassword("")
                  setConfirmText("")
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  )
}

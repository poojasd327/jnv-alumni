"use client"

import { useState, useEffect, useCallback, useTransition } from "react"
import { Bell, Check, CheckCheck, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from "@/lib/actions/notifications.actions"
import { useRouter } from "next/navigation"

interface Notification {
  id: string
  type: string
  title: string
  message: string
  link: string | null
  is_read: boolean
  created_at: string
}

export function NotificationBell({ initialCount }: { initialCount: number }) {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(initialCount)
  const [loaded, setLoaded] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  // Fetch notifications when dropdown opens
  const loadNotifications = useCallback(async () => {
    const result = await getNotifications(10)
    setNotifications(result.notifications as unknown as Notification[])
    setUnreadCount(result.unreadCount)
    setLoaded(true)
  }, [])

  useEffect(() => {
    if (open && !loaded) {
      loadNotifications()
    }
  }, [open, loaded, loadNotifications])

  // Refresh count periodically (every 60s)
  useEffect(() => {
    const interval = setInterval(async () => {
      const result = await getNotifications(1)
      setUnreadCount(result.unreadCount)
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  const handleMarkAsRead = (notificationId: string) => {
    startTransition(async () => {
      await markAsRead(notificationId)
      setNotifications((prev) =>
        prev.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n))
      )
      setUnreadCount((prev) => Math.max(0, prev - 1))
    })
  }

  const handleMarkAllRead = () => {
    startTransition(async () => {
      await markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })))
      setUnreadCount(0)
    })
  }

  const handleDelete = (notificationId: string, wasUnread: boolean) => {
    startTransition(async () => {
      await deleteNotification(notificationId)
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      if (wasUnread) setUnreadCount((prev) => Math.max(0, prev - 1))
    })
  }

  const handleClick = (notification: Notification) => {
    if (!notification.is_read) {
      handleMarkAsRead(notification.id)
    }
    if (notification.link) {
      setOpen(false)
      router.push(notification.link)
    }
  }

  function timeAgo(dateStr: string) {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
    if (seconds < 60) return "just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    if (days < 7) return `${days}d ago`
    return new Date(dateStr).toLocaleDateString()
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        aria-label={unreadCount > 0 ? `Notifications (${unreadCount} unread)` : "Notifications"}
        className={cn(
          "relative flex items-center justify-center rounded-lg p-2",
          "transition-colors hover:bg-muted"
        )}
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8} className="w-80 p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b px-4 py-3">
          <h3 className="text-sm font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={isPending}
              className="flex items-center gap-1 text-xs text-primary hover:underline disabled:opacity-50"
            >
              <CheckCheck className="size-3" />
              Mark all read
            </button>
          )}
        </div>

        {/* Notification List */}
        <div className="max-h-80 overflow-y-auto">
          {!loaded ? (
            <div className="flex items-center justify-center py-8">
              <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "group flex gap-3 border-b px-4 py-3 last:border-b-0",
                  !notification.is_read && "bg-primary/5",
                  notification.link && "cursor-pointer hover:bg-muted/50"
                )}
                onClick={() => handleClick(notification)}
              >
                {/* Unread dot */}
                <div className="mt-1.5 flex shrink-0">
                  <div
                    className={cn(
                      "size-2 rounded-full",
                      notification.is_read ? "bg-transparent" : "bg-primary"
                    )}
                  />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-tight">
                    {notification.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                    {notification.message}
                  </p>
                  <p className="mt-1 text-[11px] text-muted-foreground/70">
                    {timeAgo(notification.created_at)}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 items-start gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {!notification.is_read && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsRead(notification.id)
                      }}
                      className="rounded p-1 hover:bg-muted"
                      title="Mark as read"
                    >
                      <Check className="size-3.5 text-muted-foreground" />
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(notification.id, !notification.is_read)
                    }}
                    className="rounded p-1 hover:bg-muted"
                    title="Delete"
                  >
                    <Trash2 className="size-3.5 text-muted-foreground" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs"
              onClick={() => {
                setOpen(false)
                router.push("/notifications")
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

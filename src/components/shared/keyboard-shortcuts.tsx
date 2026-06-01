"use client"

import { useState, useEffect } from "react"
import { Keyboard } from "lucide-react"

const SHORTCUTS = [
  { keys: ["Ctrl", "K"], description: "Open search / command palette" },
  { keys: ["?"], description: "Show keyboard shortcuts" },
  { keys: ["Esc"], description: "Close dialogs and modals" },
  { keys: ["\u2191", "\u2193"], description: "Navigate search results" },
  { keys: ["\u21B5"], description: "Select search result" },
]

export function KeyboardShortcuts() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      // Don't trigger when typing in inputs/textareas
      const target = e.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return
      }

      if (e.key === "?" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }

      if (e.key === "Escape" && open) {
        setOpen(false)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-4 left-4 z-40 hidden items-center gap-1.5 rounded-lg border bg-card px-2.5 py-1.5 text-xs text-muted-foreground shadow-sm transition-colors hover:bg-muted hover:text-foreground md:flex"
        title="Keyboard shortcuts (?)"
      >
        <Keyboard className="size-3.5" />
        <kbd className="rounded border bg-muted px-1 py-0.5 font-mono text-[10px]">?</kbd>
      </button>

      {/* Dialog */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 px-4">
            <div className="rounded-xl border bg-popover p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
                <button
                  onClick={() => setOpen(false)}
                  className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  <span className="sr-only">Close</span>
                  <kbd className="rounded border bg-muted px-1.5 py-0.5 font-mono text-xs">esc</kbd>
                </button>
              </div>

              <div className="space-y-3">
                {SHORTCUTS.map((shortcut) => (
                  <div
                    key={shortcut.description}
                    className="flex items-center justify-between"
                  >
                    <span className="text-sm text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <div className="flex items-center gap-1">
                      {shortcut.keys.map((key) => (
                        <kbd
                          key={key}
                          className="inline-flex h-6 min-w-6 items-center justify-center rounded border bg-muted px-1.5 font-mono text-xs font-medium"
                        >
                          {key}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

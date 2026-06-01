"use client"

import { useEffect, useRef, useCallback } from "react"

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Traps focus within a container element when active.
 * Returns focus to the previously focused element on deactivation.
 */
export function useFocusTrap(active: boolean) {
  const containerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Store the previously focused element when becoming active
  useEffect(() => {
    if (active) {
      previousFocusRef.current = document.activeElement as HTMLElement | null

      // Focus the first focusable element inside the container
      const timer = requestAnimationFrame(() => {
        const container = containerRef.current
        if (!container) return
        const firstFocusable = container.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)
        firstFocusable?.focus()
      })

      return () => cancelAnimationFrame(timer)
    } else {
      // Restore focus to previous element
      previousFocusRef.current?.focus()
      previousFocusRef.current = null
    }
  }, [active])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!active || e.key !== "Tab") return

      const container = containerRef.current
      if (!container) return

      const focusableElements = Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
      )

      if (focusableElements.length === 0) {
        e.preventDefault()
        return
      }

      const firstFocusable = focusableElements[0]
      const lastFocusable = focusableElements[focusableElements.length - 1]

      if (e.shiftKey) {
        // Shift+Tab: if on first element, wrap to last
        if (document.activeElement === firstFocusable) {
          e.preventDefault()
          lastFocusable.focus()
        }
      } else {
        // Tab: if on last element, wrap to first
        if (document.activeElement === lastFocusable) {
          e.preventDefault()
          firstFocusable.focus()
        }
      }
    },
    [active]
  )

  return { containerRef, handleKeyDown }
}

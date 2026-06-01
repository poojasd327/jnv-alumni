"use client"

import { useRef, useCallback } from "react"

/**
 * Rate-limits a callback to prevent spam submissions.
 * Returns [wrappedFn, isLimited] where isLimited is true during cooldown.
 */
export function useRateLimit<T extends (...args: never[]) => unknown>(
  fn: T,
  cooldownMs = 3000
): [(...args: Parameters<T>) => ReturnType<T> | undefined, () => boolean] {
  const lastCallRef = useRef(0)

  const isLimited = useCallback(() => {
    return Date.now() - lastCallRef.current < cooldownMs
  }, [cooldownMs])

  const rateLimitedFn = useCallback(
    (...args: Parameters<T>) => {
      if (isLimited()) return undefined
      lastCallRef.current = Date.now()
      return fn(...args) as ReturnType<T>
    },
    [fn, isLimited]
  )

  return [rateLimitedFn, isLimited]
}

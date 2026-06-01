"use client"

import { useState, useEffect } from "react"
import { ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const main = document.getElementById("main-content")
    if (!main) return

    function onScroll() {
      setVisible(main!.scrollTop > 400)
    }

    main.addEventListener("scroll", onScroll, { passive: true })
    return () => main.removeEventListener("scroll", onScroll)
  }, [])

  function scrollToTop() {
    const main = document.getElementById("main-content")
    main?.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      className={cn(
        "fixed bottom-6 right-6 z-40 size-10 rounded-full shadow-lg transition-all duration-300",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      )}
    >
      <ArrowUp className="size-4" />
    </Button>
  )
}

"use client"

import { useEffect, useRef } from "react"

export const useScrollLock = (isLocked: boolean) => {
  const scrollPositionRef = useRef<number>(0)
  const originalStylesRef = useRef<{
    overflow: string
    position: string
    top: string
    width: string
    height: string
  } | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    const body = document.body
    const html = document.documentElement

    if (isLocked) {
      // Store current scroll position
      scrollPositionRef.current = window.pageYOffset || document.documentElement.scrollTop

      // Store original styles
      originalStylesRef.current = {
        overflow: body.style.overflow || "",
        position: body.style.position || "",
        top: body.style.top || "",
        width: body.style.width || "",
        height: body.style.height || "",
      }

      // Apply scroll lock styles
      body.style.overflow = "hidden"
      body.style.position = "fixed"
      body.style.top = `-${scrollPositionRef.current}px`
      body.style.width = "100%"
      body.style.height = "100%"

      // Also lock html element for better compatibility
      html.style.overflow = "hidden"

      // Prevent touch events on iOS Safari
      const preventTouch = (e: TouchEvent) => {
        // Allow touch events within scrollable containers
        let element = e.target as Element
        while (element && element !== document.body) {
          const style = window.getComputedStyle(element)
          if (
            style.overflowY === "scroll" ||
            style.overflowY === "auto" ||
            element.classList.contains("mobile-scroll") ||
            element.classList.contains("enhanced-scrollbar")
          ) {
            return // Allow scrolling in these containers
          }
          element = element.parentElement as Element
        }
        e.preventDefault()
      }

      document.addEventListener("touchmove", preventTouch, { passive: false })

      return () => {
        document.removeEventListener("touchmove", preventTouch)
      }
    } else {
      // Restore scroll - only if we have stored styles
      if (originalStylesRef.current) {
        const { overflow, position, top, width, height } = originalStylesRef.current

        // Restore body styles
        body.style.overflow = overflow
        body.style.position = position
        body.style.top = top
        body.style.width = width
        body.style.height = height

        // Restore html overflow
        html.style.overflow = ""

        // Restore scroll position
        if (scrollPositionRef.current > 0) {
          window.scrollTo(0, scrollPositionRef.current)
          scrollPositionRef.current = 0
        }

        // Clear stored styles
        originalStylesRef.current = null
      }
    }
  }, [isLocked])

  // Additional cleanup on component unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") {
        const body = document.body
        const html = document.documentElement

        // Force restore normal scrolling
        body.style.overflow = ""
        body.style.position = ""
        body.style.top = ""
        body.style.width = ""
        body.style.height = ""
        html.style.overflow = ""
      }
    }
  }, [])
}

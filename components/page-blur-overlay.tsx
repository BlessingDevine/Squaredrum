"use client"

import type React from "react"

import { useScrollLock } from "@/hooks/use-scroll-lock"

interface PageBlurOverlayProps {
  isBlurred: boolean
  children: React.ReactNode
}

export default function PageBlurOverlay({ isBlurred, children }: PageBlurOverlayProps) {
  useScrollLock(isBlurred)

  return (
    <div className={`transition-all duration-300 ${isBlurred ? "blur-sm pointer-events-none" : ""}`}>{children}</div>
  )
}

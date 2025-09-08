"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface SelectedTrack {
  id: number
  title: string
  artist: string
  downloadUrl: string
  audioUrl: string
  coverArt?: string
  compilationId: string
}

interface DownloadContextType {
  selectedTracks: SelectedTrack[]
  monthlyDownloads: number
  maxSelections: number
  maxMonthlyDownloads: number
  toggleTrackSelection: (track: SelectedTrack) => void
  clearSelections: () => void
  downloadSelected: () => void
  isTrackSelected: (trackId: number, compilationId: string) => boolean
  canSelectMore: boolean
  canDownload: boolean
  remainingDownloads: number
}

const DownloadContext = createContext<DownloadContextType | undefined>(undefined)

export function DownloadProvider({ children }: { children: React.ReactNode }) {
  const [selectedTracks, setSelectedTracks] = useState<SelectedTrack[]>([])
  const [monthlyDownloads, setMonthlyDownloads] = useState(0)
  const maxSelections = 999 // Effectively unlimited
  const maxMonthlyDownloads = 999 // Effectively unlimited

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("squaredrum-downloads")
      if (saved) {
        try {
          const data = JSON.parse(saved)
          setMonthlyDownloads(data.count || 0)
        } catch (error) {
          console.error("Error loading download data:", error)
        }
      }
    }
  }, [])

  const toggleTrackSelection = (track: SelectedTrack) => {
    setSelectedTracks((prev) => {
      const isSelected = prev.some((t) => t.id === track.id && t.compilationId === track.compilationId)
      if (isSelected) {
        return prev.filter((t) => !(t.id === track.id && t.compilationId === track.compilationId))
      } else {
        return [...prev, track]
      }
    })
  }

  const clearSelections = () => {
    setSelectedTracks([])
  }

  const downloadSelected = () => {
    if (selectedTracks.length === 0) return

    console.log("[v0] Download button clicked, selected tracks:", selectedTracks.length)
    console.log(
      "[v0] Checking window.omnisend:",
      typeof window !== "undefined" ? !!window.omnisend : "window undefined",
    )

    if (typeof window !== "undefined") {
      console.log("[v0] Window omnisend object:", window.omnisend)

      // Ensure omnisend is initialized
      window.omnisend = window.omnisend || []

      try {
        console.log("[v0] Attempting to track download and open form")

        // Track download attempt
        window.omnisend.push([
          "track",
          "downloadAttempted",
          {
            trackCount: selectedTracks.length,
            tracks: selectedTracks.map((track) => ({
              title: track.title,
              artist: track.artist,
              compilationId: track.compilationId,
            })),
          },
        ])

        const tracksWithUrls = selectedTracks.map((track) => ({
          ...track,
          audioUrl: track.audioUrl || track.downloadUrl, // Ensure we have a download URL
        }))
        localStorage.setItem("pendingDownload", JSON.stringify(tracksWithUrls))

        setTimeout(() => {
          console.log("[v0] Opening Omnisend form")
          window.omnisend.push(["openForm", "68a3d3d43a6a28c6e3a0de92"])
        }, 100)

        const observer = new MutationObserver((mutations) => {
          mutations.forEach((mutation) => {
            if (mutation.type === "childList") {
              // Look for Omnisend's built-in thank you message elements
              const thankYouElements = document.querySelectorAll(
                '[class*="omnisend"][class*="thank"], [class*="omnisend"][class*="success"], [data-omnisend*="thank"], [data-omnisend*="success"], .omnisend-thank-you, .omnisend-success',
              )

              // Also check for common thank you message text
              const textElements = Array.from(document.querySelectorAll("*")).filter((el) => {
                const text = el.textContent?.toLowerCase() || ""
                return text.includes("thank you") || text.includes("thanks") || text.includes("submitted")
              })

              if (thankYouElements.length > 0 || textElements.length > 0) {
                console.log("[v0] Omnisend thank you message detected, dispatching event to open download modal")
                window.dispatchEvent(new CustomEvent("omnisend-form-completed"))
                observer.disconnect()
              }
            }
          })
        })

        observer.observe(document.body, {
          childList: true,
          subtree: true,
        })

        // Clean up observer after 30 seconds
        setTimeout(() => observer.disconnect(), 30000)
      } catch (error) {
        console.error("[v0] Omnisend form error:", error)
        console.log("[v0] Form failed to open, user must try again")
      }
    } else {
      console.log("[v0] Window not available, cannot open form")
    }
  }

  const isTrackSelected = (trackId: number, compilationId: string) => {
    return selectedTracks.some((t) => t.id === trackId && t.compilationId === compilationId)
  }

  const canSelectMore = true // Always allow more selections
  const canDownload = selectedTracks.length > 0 // Only require at least one track selected
  const remainingDownloads = 999 // Always show unlimited

  return (
    <DownloadContext.Provider
      value={{
        selectedTracks,
        monthlyDownloads,
        maxSelections,
        maxMonthlyDownloads,
        toggleTrackSelection,
        clearSelections,
        downloadSelected,
        isTrackSelected,
        canSelectMore,
        canDownload,
        remainingDownloads,
      }}
    >
      {children}
    </DownloadContext.Provider>
  )
}

export function useDownload() {
  const context = useContext(DownloadContext)
  if (context === undefined) {
    throw new Error("useDownload must be used within a DownloadProvider")
  }
  return context
}

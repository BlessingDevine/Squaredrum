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
  isTrackSelected: (trackId: number) => boolean
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
      const isSelected = prev.some((t) => t.id === track.id)
      if (isSelected) {
        return prev.filter((t) => t.id !== track.id)
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

        // Store selected tracks for after form completion
        localStorage.setItem("pendingDownload", JSON.stringify(selectedTracks))

        setTimeout(() => {
          console.log("[v0] Opening Omnisend form")
          window.omnisend.push(["openForm", "68a3d3d43a6a28c6e3a0de92"])
        }, 100)
      } catch (error) {
        console.error("[v0] Omnisend form error:", error)
        console.log("[v0] Form opening failed, user must complete form to download")
      }
    } else {
      console.log("[v0] Window not available, cannot open form")
    }
  }

  const proceedWithDownload = () => {
    selectedTracks.forEach((track) => {
      const link = document.createElement("a")
      link.href = track.downloadUrl
      link.download = `${track.artist} - ${track.title}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })

    const newCount = monthlyDownloads + 1
    setMonthlyDownloads(newCount)

    if (typeof window !== "undefined") {
      localStorage.setItem(
        "squaredrum-downloads",
        JSON.stringify({
          count: newCount,
          month: new Date().getMonth(),
          year: new Date().getFullYear(),
        }),
      )

      // Clear pending download after completion
      localStorage.removeItem("pendingDownload")
    }

    clearSelections()
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleFormComplete = () => {
        console.log("[v0] Form completion detected")
        const pendingDownload = localStorage.getItem("pendingDownload")
        if (pendingDownload) {
          try {
            const tracks = JSON.parse(pendingDownload)
            setSelectedTracks(tracks)
            window.dispatchEvent(new CustomEvent("omnisend-form-completed"))
            console.log("[v0] Dispatched form completion event")
          } catch (error) {
            console.error("Error processing pending download:", error)
          }
        }
      }

      // Listen for Omnisend form completion events
      window.addEventListener("omnisend-form-completed", handleFormComplete)

      return () => {
        window.removeEventListener("omnisend-form-completed", handleFormComplete)
      }
    }
  }, [selectedTracks, monthlyDownloads])

  const isTrackSelected = (trackId: number) => {
    return selectedTracks.some((t) => t.id === trackId)
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

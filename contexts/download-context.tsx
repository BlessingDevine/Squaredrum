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

        // Store selected tracks for after form completion
        localStorage.setItem("pendingDownload", JSON.stringify(selectedTracks))

        const handleFormSubmission = () => {
          console.log("[v0] Form submitted successfully")

          // Show success message
          const successMessage = document.createElement("div")
          successMessage.innerHTML = `
            <div style="
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background: #10b981;
              color: white;
              padding: 20px 30px;
              border-radius: 8px;
              box-shadow: 0 10px 25px rgba(0,0,0,0.3);
              z-index: 10000;
              font-family: system-ui;
              font-size: 16px;
              font-weight: 500;
              text-align: center;
              cursor: pointer;
            ">
              ✓ Form submitted successfully!<br>
              <small style="opacity: 0.9; font-size: 14px;">Click to continue to download</small>
            </div>
          `

          document.body.appendChild(successMessage)

          // Auto-close success message and trigger modal after 3 seconds or on click
          const closeAndContinue = () => {
            document.body.removeChild(successMessage)
            window.dispatchEvent(new CustomEvent("omnisend-form-completed"))
          }

          successMessage.addEventListener("click", closeAndContinue)
          setTimeout(closeAndContinue, 3000)
        }

        // Listen for form submission
        window.addEventListener("message", (event) => {
          if (event.data && event.data.type === "omnisend-form-submitted") {
            handleFormSubmission()
          }
        })

        setTimeout(() => {
          console.log("[v0] Opening Omnisend form")
          window.omnisend.push(["openForm", "68a3d3d43a6a28c6e3a0de92"])
        }, 100)
      } catch (error) {
        console.error("[v0] Omnisend form error:", error)
        console.log("[v0] Form failed to open, user must try again")
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

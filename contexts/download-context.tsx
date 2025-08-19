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
  const maxSelections = 10
  const maxMonthlyDownloads = 2

  // Load data from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("squaredrum-downloads")
      if (saved) {
        try {
          const data = JSON.parse(saved)
          const currentMonth = new Date().getMonth()
          const currentYear = new Date().getFullYear()

          // Reset if it's a new month
          if (data.month !== currentMonth || data.year !== currentYear) {
            setMonthlyDownloads(0)
            localStorage.setItem(
              "squaredrum-downloads",
              JSON.stringify({
                count: 0,
                month: currentMonth,
                year: currentYear,
              }),
            )
          } else {
            setMonthlyDownloads(data.count || 0)
          }
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
      } else if (prev.length < maxSelections) {
        return [...prev, track]
      }
      return prev
    })
  }

  const clearSelections = () => {
    setSelectedTracks([])
  }

  const downloadSelected = () => {
    if (selectedTracks.length === 0 || monthlyDownloads >= maxMonthlyDownloads) return

    // Create and trigger download for each selected track
    selectedTracks.forEach((track) => {
      const link = document.createElement("a")
      link.href = track.downloadUrl
      link.download = `${track.artist} - ${track.title}.mp3`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })

    // Update monthly download count
    const newCount = monthlyDownloads + 1
    setMonthlyDownloads(newCount)

    // Save to localStorage
    if (typeof window !== "undefined") {
      const currentMonth = new Date().getMonth()
      const currentYear = new Date().getFullYear()
      localStorage.setItem(
        "squaredrum-downloads",
        JSON.stringify({
          count: newCount,
          month: currentMonth,
          year: currentYear,
        }),
      )
    }

    // Clear selections after download
    clearSelections()
  }

  const isTrackSelected = (trackId: number) => {
    return selectedTracks.some((t) => t.id === trackId)
  }

  const canSelectMore = selectedTracks.length < maxSelections
  const canDownload = selectedTracks.length > 0 && monthlyDownloads < maxMonthlyDownloads
  const remainingDownloads = maxMonthlyDownloads - monthlyDownloads

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

"use client"

import { useState } from "react"
import { X, Download, Music, Clock, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDownload } from "@/contexts/download-context"
import Image from "next/image"

interface DownloadFormModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DownloadFormModal({ isOpen, onClose }: DownloadFormModalProps) {
  const [isDownloading, setIsDownloading] = useState(false)
  const { selectedTracks, downloadSelected, remainingDownloads } = useDownload()

  if (!isOpen) return null

  const handleDownload = async () => {
    console.log("[v0] Download button clicked in modal")
    setIsDownloading(true)

    try {
      // Ensure omnisend is available
      window.omnisend = window.omnisend || []

      console.log("[v0] Opening Omnisend form with ID: 68a3d3d43a6a28c6e3a0de92")
      window.omnisend.push(["openForm", "68a3d3d43a6a28c6e3a0de92"])

      let formCompleted = false
      let formDetected = false

      const checkForForm = () => {
        const formSelectors = [
          "[data-omnisend-form]",
          ".omnisend-form",
          '[id*="omnisend"]',
          '[class*="omnisend"]',
          'iframe[src*="omnisend"]',
          ".omnisend-popup",
          ".omnisend-modal",
        ]

        for (const selector of formSelectors) {
          const form = document.querySelector(selector)
          if (form && form.offsetParent !== null) {
            // Check if visible
            console.log("[v0] Omnisend form detected:", selector)
            formDetected = true
            setupFormListeners(form)
            return true
          }
        }
        return false
      }

      const setupFormListeners = (formElement: Element) => {
        const handleFormSuccess = (e: Event) => {
          console.log("[v0] Form submission detected:", e.type)
          if (!formCompleted) {
            formCompleted = true
            console.log("[v0] Form successfully submitted, starting download")
            setTimeout(() => proceedWithDownload(), 1000)
            cleanup()
          }
        }

        // Listen for various form events
        formElement.addEventListener("submit", handleFormSuccess)

        // Listen for Omnisend-specific events
        document.addEventListener("omnisend:submit", handleFormSuccess)
        document.addEventListener("omnisend:success", handleFormSuccess)

        // Check for form closure (successful submission usually closes the form)
        const observer = new MutationObserver(() => {
          if (!document.contains(formElement) || formElement.offsetParent === null) {
            console.log("[v0] Form disappeared - likely submitted successfully")
            if (!formCompleted) {
              formCompleted = true
              setTimeout(() => proceedWithDownload(), 500)
              cleanup()
            }
          }
        })

        observer.observe(document.body, { childList: true, subtree: true })
      }

      const cleanup = () => {
        // Cleanup will be handled by component unmount
      }

      if (!checkForForm()) {
        let attempts = 0
        const formCheckInterval = setInterval(() => {
          attempts++
          if (checkForForm() || attempts > 20) {
            // Check for 10 seconds
            clearInterval(formCheckInterval)
            if (!formDetected) {
              console.log("[v0] Form not detected after 10 seconds")
              setIsDownloading(false)
              // Don't proceed with download - user must submit form
            }
          }
        }, 500)
      }
    } catch (error) {
      console.error("[v0] Error in download process:", error)
      setIsDownloading(false)
    }
  }

  const proceedWithDownload = async () => {
    try {
      console.log("[v0] Starting actual download process for", selectedTracks.length, "tracks")

      for (let i = 0; i < selectedTracks.length; i++) {
        const track = selectedTracks[i]
        console.log("[v0] Downloading track:", track.title)

        try {
          // Fetch the audio file as a blob
          const response = await fetch(track.audioUrl)
          if (!response.ok) {
            console.error("[v0] Failed to fetch track:", track.title, response.status)
            continue
          }

          const blob = await response.blob()
          const url = window.URL.createObjectURL(blob)

          // Create download link
          const link = document.createElement("a")
          link.href = url
          link.download = `${track.artist} - ${track.title}.mp3`
          link.style.display = "none"

          // Add to DOM, click, and remove
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          // Clean up the blob URL
          setTimeout(() => window.URL.revokeObjectURL(url), 1000)

          console.log("[v0] Successfully initiated download for:", track.title)
        } catch (error) {
          console.error("[v0] Error downloading track:", track.title, error)
        }

        // Stagger downloads to prevent browser blocking
        if (i < selectedTracks.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1000))
        }
      }

      // Track the download completion
      if (typeof window !== "undefined" && window.omnisend) {
        window.omnisend.push([
          "track",
          "downloadCompleted",
          {
            trackCount: selectedTracks.length,
            tracks: selectedTracks.map((track) => ({
              title: track.title,
              artist: track.artist,
              compilationId: track.compilationId,
            })),
          },
        ])
      }

      // Close modal after a short delay
      setTimeout(() => {
        onClose()
      }, 2000)
    } catch (error) {
      console.error("[v0] Download failed:", error)
    } finally {
      setIsDownloading(false)
    }
  }

  const totalDuration = selectedTracks.reduce((total, track) => {
    // Assuming duration is in "mm:ss" format, convert to seconds
    const [minutes, seconds] = track.audioUrl.includes("duration") ? ["3", "30"] : ["3", "30"] // Fallback
    return total + 3.5 * 60 // Average 3.5 minutes per track
  }, 0)

  const formatDuration = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60)
    return `${minutes}m`
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="bg-zinc-900 border-zinc-700 w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-white flex items-center">
              <Download className="h-5 w-5 mr-2 text-amber-400" />
              Download Selected Tracks
            </CardTitle>
            <Button onClick={onClose} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Download Summary */}
          <div className="mb-6 p-4 bg-zinc-800/50 rounded-lg">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-amber-400">{selectedTracks.length}</div>
                <div className="text-sm text-gray-400">Tracks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{formatDuration(totalDuration)}</div>
                <div className="text-sm text-gray-400">Duration</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-amber-400">{remainingDownloads}</div>
                <div className="text-sm text-gray-400">Downloads Left</div>
              </div>
            </div>
          </div>

          {/* Selected Tracks List */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Music className="h-4 w-4 mr-2" />
              Selected Tracks
            </h3>

            <div className="max-h-60 overflow-y-auto space-y-2">
              {selectedTracks.map((track, index) => (
                <div key={track.id} className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg">
                  {/* Track Cover */}
                  <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                    <Image src={track.coverArt || "/placeholder.svg"} alt={track.title} fill className="object-cover" />
                  </div>

                  {/* Track Number */}
                  <div className="w-6 text-center text-sm text-gray-400 font-mono">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  {/* Track Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-white truncate text-sm">{track.title}</h4>
                    <p className="text-gray-400 text-xs truncate flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {track.artist}
                    </p>
                  </div>

                  {/* Duration */}
                  <div className="text-gray-400 text-xs flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    3:30
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Download Info */}
          <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
              <div className="text-sm text-amber-100">
                <p className="font-medium mb-1">Download Information</p>
                <ul className="space-y-1 text-amber-200/80">
                  <li>• High-quality MP3 files (320kbps)</li>
                  <li>• Files will be downloaded individually</li>
                  <li>• You have {remainingDownloads} downloads remaining this month</li>
                  <li>• Download limit resets monthly</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              onClick={handleDownload}
              disabled={isDownloading || remainingDownloads === 0}
              className="flex-1 bg-amber-600 hover:bg-amber-700 text-white h-12 font-medium"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Preparing Download...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download {selectedTracks.length} Tracks
                </>
              )}
            </Button>
          </div>

          {remainingDownloads === 0 && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm text-center">
                You've reached your monthly download limit. Limit resets next month.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

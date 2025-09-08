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
      await proceedWithDownload()
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
          // Fetch the audio file as a blob with proper headers
          const response = await fetch(track.audioUrl, {
            method: "GET",
            headers: {
              Accept: "audio/*",
            },
            mode: "cors",
          })

          if (!response.ok) {
            console.error("[v0] Failed to fetch track:", track.title, response.status, response.statusText)
            continue
          }

          // Ensure we got audio content
          const contentType = response.headers.get("content-type")
          if (!contentType || !contentType.includes("audio")) {
            console.warn("[v0] Response may not be audio content:", contentType)
          }

          const blob = await response.blob()

          // Create a proper audio blob if needed
          const audioBlob = new Blob([blob], { type: "audio/mpeg" })
          const url = window.URL.createObjectURL(audioBlob)

          // Create download link with sanitized filename
          const sanitizedTitle = track.title.replace(/[^a-zA-Z0-9\s-]/g, "").trim()
          const sanitizedArtist = track.artist.replace(/[^a-zA-Z0-9\s-]/g, "").trim()

          const link = document.createElement("a")
          link.href = url
          link.download = `${sanitizedArtist} - ${sanitizedTitle}.mp3`
          link.style.display = "none"

          // Add to DOM, click, and remove
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)

          // Clean up the blob URL after a delay
          setTimeout(() => {
            window.URL.revokeObjectURL(url)
          }, 2000)

          console.log("[v0] Successfully initiated download for:", track.title)
        } catch (error) {
          console.error("[v0] Error downloading track:", track.title, error)

          // Try alternative download method as fallback
          try {
            const fallbackLink = document.createElement("a")
            fallbackLink.href = track.audioUrl
            fallbackLink.download = `${track.artist} - ${track.title}.mp3`
            fallbackLink.target = "_blank"
            fallbackLink.style.display = "none"

            document.body.appendChild(fallbackLink)
            fallbackLink.click()
            document.body.removeChild(fallbackLink)

            console.log("[v0] Fallback download attempted for:", track.title)
          } catch (fallbackError) {
            console.error("[v0] Fallback download also failed:", fallbackError)
          }
        }

        // Stagger downloads to prevent browser blocking
        if (i < selectedTracks.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1500))
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

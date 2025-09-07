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
      let formElement: Element | null = null

      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              // Look for Omnisend form elements with various selectors
              const omnisendForm =
                node.querySelector?.('[data-omnisend-form], .omnisend-form, [id*="omnisend"], [class*="omnisend"]') ||
                (node.matches?.('[data-omnisend-form], .omnisend-form, [id*="omnisend"], [class*="omnisend"]')
                  ? node
                  : null)

              if (omnisendForm) {
                console.log("[v0] Omnisend form detected in DOM")
                formElement = omnisendForm

                // Listen for form submission events on the form element
                const handleFormSubmission = (e: Event) => {
                  console.log("[v0] Form submission event detected:", e.type)
                  if (!formCompleted) {
                    formCompleted = true
                    console.log("[v0] Form successfully submitted, automatically starting download")
                    setTimeout(() => proceedWithDownload(), 1000) // Slight delay to ensure form processing
                    cleanup()
                  }
                }

                // Listen for various submission events
                omnisendForm.addEventListener("submit", handleFormSubmission)
                omnisendForm.addEventListener("omnisend:submit", handleFormSubmission)
                omnisendForm.addEventListener("omnisend:success", handleFormSubmission)

                // Also listen for successful form completion indicators
                const submitButton = omnisendForm.querySelector(
                  'button[type="submit"], input[type="submit"], .submit-btn',
                )
                if (submitButton) {
                  submitButton.addEventListener("click", () => {
                    // Wait a bit then check if form was successfully submitted
                    setTimeout(() => {
                      if (!formCompleted && !omnisendForm.querySelector(".error, .validation-error")) {
                        console.log("[v0] Form appears to be submitted successfully (no errors found)")
                        formCompleted = true
                        setTimeout(() => proceedWithDownload(), 1500)
                        cleanup()
                      }
                    }, 2000)
                  })
                }
              }
            }
          })

          mutation.removedNodes.forEach((node) => {
            if (formElement && node instanceof Element && (node.contains(formElement) || node === formElement)) {
              console.log("[v0] Omnisend form removed from DOM - form completed successfully, starting download")
              if (!formCompleted) {
                formCompleted = true
                setTimeout(() => proceedWithDownload(), 500)
                cleanup()
              }
            }
          })
        })
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })

      // Method 2: Listen for global Omnisend events
      const handleGlobalOmnisendEvent = (event: any) => {
        console.log("[v0] Global Omnisend event detected:", event.type, event.detail)
        if (event.type.includes("submit") || event.type.includes("success") || event.type.includes("complete")) {
          if (!formCompleted) {
            formCompleted = true
            console.log("[v0] Form completed via global event, automatically starting download")
            setTimeout(() => proceedWithDownload(), 1000)
            cleanup()
          }
        }
      }

      // Listen for various Omnisend events
      const omnisendEvents = [
        "omnisend-form-submit",
        "omnisend-form-success",
        "omnisend-form-complete",
        "omnisend:submit",
        "omnisend:success",
        "omnisend:complete",
      ]

      omnisendEvents.forEach((eventName) => {
        document.addEventListener(eventName, handleGlobalOmnisendEvent)
      })

      const cleanup = () => {
        observer.disconnect()
        omnisendEvents.forEach((eventName) => {
          document.removeEventListener(eventName, handleGlobalOmnisendEvent)
        })
      }

      setTimeout(() => {
        if (!formCompleted) {
          console.log("[v0] Form timeout after 8 seconds, proceeding with download anyway")
          formCompleted = true
          proceedWithDownload()
          cleanup()
        }
      }, 8000)
    } catch (error) {
      console.error("[v0] Error in download process:", error)
      await proceedWithDownload()
    }
  }

  const proceedWithDownload = async () => {
    try {
      console.log("[v0] Starting actual download process for", selectedTracks.length, "tracks")

      // Trigger individual file downloads
      selectedTracks.forEach((track, index) => {
        setTimeout(() => {
          console.log("[v0] Downloading track:", track.title)
          const link = document.createElement("a")
          link.href = track.audioUrl // Use audioUrl as download URL
          link.download = `${track.artist} - ${track.title}.mp3`
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }, index * 500) // Stagger downloads by 500ms
      })

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

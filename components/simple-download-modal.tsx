"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Loader2, CheckCircle, AlertCircle, X, Mail, User } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Track {
  id: string
  title: string
  artist: string
  audioUrl: string
  downloadUrl: string
  coverArt?: string
}

interface SimpleDownloadModalProps {
  isOpen: boolean
  onClose: () => void
  tracks: Track[]
  compilationTitle?: string
}

export default function SimpleDownloadModal({
  isOpen,
  onClose,
  tracks,
  compilationTitle = "Download Tracks",
}: SimpleDownloadModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadStatus, setDownloadStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [downloadProgress, setDownloadProgress] = useState<string>("")

  const forceDownload = async (url: string, filename: string) => {
    try {
      console.log(`🎵 Starting download: ${filename}`)
      console.log(`📁 Download URL: ${url}`)

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const blob = await response.blob()
      console.log(`📦 Blob created: ${blob.size} bytes, type: ${blob.type}`)

      const downloadUrl = window.URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = downloadUrl
      link.download = filename
      link.style.display = "none"

      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      setTimeout(() => {
        window.URL.revokeObjectURL(downloadUrl)
        console.log(`✅ Download completed: ${filename}`)
      }, 1000)
    } catch (error) {
      console.error(`❌ Download failed for ${filename}:`, error)
      throw error
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage("Please enter your name")
      return false
    }
    if (!formData.email.trim()) {
      setMessage("Please enter your email")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setMessage("Please enter a valid email address")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setDownloadStatus("error")
      return
    }

    setIsDownloading(true)
    setDownloadStatus("idle")
    setMessage("")
    setDownloadProgress("")

    try {
      console.log("📊 Bulk Download Request:", {
        tracks: tracks.map((t) => ({ title: t.title, artist: t.artist })),
        user: {
          name: formData.name,
          email: formData.email,
        },
        timestamp: new Date().toISOString(),
      })

      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i]
        setDownloadProgress(`Downloading ${i + 1} of ${tracks.length}: ${track.title}`)

        const filename = `${track.artist} - ${track.title}.mp3`.replace(/[^a-zA-Z0-9\s\-_.]/g, "").replace(/\s+/g, "_")

        await forceDownload(track.downloadUrl, filename)

        if (i < tracks.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 1500))
        }
      }

      setDownloadProgress(`All ${tracks.length} tracks downloaded successfully!`)
      setDownloadStatus("success")

      setTimeout(() => {
        onClose()
      }, 3000)
    } catch (error) {
      console.error("Download error:", error)
      setMessage("Download failed. Please try again.")
      setDownloadStatus("error")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleClose = () => {
    if (!isDownloading) {
      onClose()
      setDownloadStatus("idle")
      setMessage("")
      setFormData({
        name: "",
        email: "",
      })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="font-cinzel text-xl tracking-wider flex items-center gap-2">
              <Download className="h-5 w-5 text-amber-500" />
              {compilationTitle}
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              disabled={isDownloading}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-gray-400 text-sm">
            {tracks.length} track{tracks.length !== 1 ? "s" : ""} • Enter your details to download
          </p>
        </DialogHeader>

        {downloadStatus === "success" ? (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-400">{downloadProgress}</AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {downloadStatus === "error" && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-400">{message}</AlertDescription>
              </Alert>
            )}

            {isDownloading && downloadProgress && (
              <Alert className="border-blue-500/50 bg-blue-500/10">
                <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />
                <AlertDescription className="text-blue-400">{downloadProgress}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="modal-name" className="text-white flex items-center gap-2">
                <User className="h-4 w-4" />
                Name *
              </Label>
              <Input
                id="modal-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="John"
                required
                disabled={isDownloading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="modal-email" className="text-white flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address *
              </Label>
              <Input
                id="modal-email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-gray-800 border-gray-600 text-white"
                placeholder="your@email.com"
                required
                disabled={isDownloading}
              />
            </div>

            <div className="bg-zinc-800/50 rounded-lg p-3 max-h-32 overflow-y-auto">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Tracks to download:</h4>
              <div className="space-y-1">
                {tracks.map((track, index) => (
                  <div key={index} className="text-xs text-gray-400 flex items-center gap-2">
                    <Download className="h-3 w-3" />
                    <span className="truncate">
                      {track.artist} - {track.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              type="submit"
              disabled={isDownloading}
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-cinzel tracking-wider"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Download All Tracks
                </>
              )}
            </Button>
          </form>
        )}

        <div className="pt-4 border-t border-gray-700">
          <p className="text-xs text-gray-500 text-center">Free downloads • High quality MP3 • No spam</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

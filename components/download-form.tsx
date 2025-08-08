"use client"

import type React from "react"
import { useState } from "react"
import { Download, Loader2, CheckCircle, AlertCircle, Mail, User, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Artist {
  name: string
  trackTitle: string
  downloadUrl: string
  audioUrl: string
}

interface DownloadFormProps {
  artist: Artist
  onClose?: () => void
}

// Force download function
const forceDownload = async (url: string, filename: string): Promise<void> => {
  try {
    console.log(`🎵 Starting download: ${filename}`)
    console.log(`📁 Download URL: ${url}`)

    // Fetch the file as a blob
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const blob = await response.blob()
    console.log(`📦 Blob created: ${blob.size} bytes, type: ${blob.type}`)

    // Create blob URL
    const blobUrl = window.URL.createObjectURL(blob)

    // Create download link
    const link = document.createElement("a")
    link.href = blobUrl
    link.download = filename
    link.style.display = "none"

    // Add to DOM, click, and remove
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Clean up blob URL after a short delay
    setTimeout(() => {
      window.URL.revokeObjectURL(blobUrl)
      console.log(`✅ Download completed: ${filename}`)
    }, 1000)
  } catch (error) {
    console.error(`❌ Download failed for ${filename}:`, error)
    throw error
  }
}

export default function DownloadForm({ artist, onClose }: DownloadFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setErrorMessage("Please enter your name")
      return false
    }
    if (!formData.email.trim()) {
      setErrorMessage("Please enter your email")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setErrorMessage("Please enter a valid email address")
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      setSubmitStatus("error")
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")
    setErrorMessage("")

    try {
      // Log the download request for analytics
      console.log("📊 Download Request:", {
        track: artist.trackTitle,
        artist: artist.name,
        user: {
          name: formData.name,
          email: formData.email,
          message: formData.message,
        },
        timestamp: new Date().toISOString(),
      })

      // Generate filename
      const filename = `${artist.name} - ${artist.trackTitle}.mp3`
        .replace(/[^a-zA-Z0-9\s\-_.]/g, "")
        .replace(/\s+/g, "_")

      // Start download
      await forceDownload(artist.downloadUrl, filename)

      setSubmitStatus("success")

      // Auto-close after success
      setTimeout(() => {
        onClose?.()
      }, 2000)
    } catch (error) {
      console.error("Download error:", error)
      setErrorMessage("Download failed. Please try again.")
      setSubmitStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-zinc-900 border-zinc-700">
      <CardHeader className="text-center pb-4">
        <CardTitle className="flex items-center justify-center gap-2 text-amber-500">
          <Download className="h-5 w-5" />
          Download Track
        </CardTitle>
        <div className="text-center mt-2">
          <h3 className="font-semibold text-white text-lg">{artist.trackTitle}</h3>
          <p className="text-amber-500 text-sm">{artist.name}</p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {submitStatus === "success" ? (
          <Alert className="border-green-500/50 bg-green-500/10">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <AlertDescription className="text-green-400">
              Download started successfully! Check your downloads folder.
            </AlertDescription>
          </Alert>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {submitStatus === "error" && (
              <Alert className="border-red-500/50 bg-red-500/10">
                <AlertCircle className="h-4 w-4 text-red-500" />
                <AlertDescription className="text-red-400">{errorMessage}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300 flex items-center gap-2">
                <User className="h-4 w-4" />
                Name *
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="bg-zinc-800 border-zinc-600 text-white placeholder:text-gray-400 focus:border-amber-500"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email *
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="bg-zinc-800 border-zinc-600 text-white placeholder:text-gray-400 focus:border-amber-500"
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-gray-300 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Message (Optional)
              </Label>
              <Input
                id="message"
                name="message"
                type="text"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Any message for the artist..."
                className="bg-zinc-800 border-zinc-600 text-white placeholder:text-gray-400 focus:border-amber-500"
                disabled={isSubmitting}
              />
            </div>

            <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Download Track
                </>
              )}
            </Button>
          </form>
        )}

        <div className="text-xs text-gray-500 text-center mt-4">
          <p>By downloading, you agree to our terms of use.</p>
          <p className="mt-1">High-quality MP3 format • Free download</p>
        </div>
      </CardContent>
    </Card>
  )
}

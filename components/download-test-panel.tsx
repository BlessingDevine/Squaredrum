"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle, Download, Play } from "lucide-react"

interface TestResult {
  name: string
  status: "pending" | "success" | "error" | "warning"
  message: string
}

export default function DownloadTestPanel() {
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [audioTest, setAudioTest] = useState<{ [key: string]: boolean }>({})

  const audioFiles = [
    { name: "Afro Square", url: "/audio/afro-square-volume-1.mp3" },
    { name: "Country Square", url: "/audio/country-square-volume-1.mp3" },
    { name: "Pop Square", url: "/audio/pop-square-vol-1.mp3" },
    { name: "R&B Square", url: "/audio/rnb-square-volume-1.mp3" },
  ]

  const updateResult = (name: string, status: TestResult["status"], message: string) => {
    setTestResults((prev) => {
      const existing = prev.find((r) => r.name === name)
      if (existing) {
        existing.status = status
        existing.message = message
        return [...prev]
      }
      return [...prev, { name, status, message }]
    })
  }

  const testAudioFile = async (file: { name: string; url: string }) => {
    try {
      console.log(`Testing audio file: ${file.name} at ${file.url}`)

      // Test if file exists and is accessible
      const response = await fetch(file.url, { method: "HEAD" })

      if (!response.ok) {
        updateResult(file.name, "error", `HTTP ${response.status}: File not accessible`)
        return false
      }

      // Check content type
      const contentType = response.headers.get("content-type")
      console.log(`${file.name} content-type:`, contentType)

      if (!contentType?.includes("audio") && !contentType?.includes("mpeg")) {
        updateResult(file.name, "warning", `Content-Type: ${contentType || "unknown"} - May not be audio`)
        return false
      }

      // Check file size
      const contentLength = response.headers.get("content-length")
      const fileSize = contentLength ? Number.parseInt(contentLength) : 0

      if (fileSize === 0) {
        updateResult(file.name, "error", "File appears to be empty")
        return false
      }

      updateResult(file.name, "success", `Valid audio file (${(fileSize / 1024 / 1024).toFixed(2)} MB)`)
      return true
    } catch (error) {
      console.error(`Error testing ${file.name}:`, error)
      updateResult(file.name, "error", `Network error: ${error instanceof Error ? error.message : "Unknown error"}`)
      return false
    }
  }

  const testDownloadMechanism = () => {
    try {
      // Test download link creation
      const testUrl = "/audio/afro-square-volume-1.mp3"
      const testFilename = "Test Artist - Test Track.mp3"

      const link = document.createElement("a")
      link.href = testUrl
      link.download = testFilename

      // Verify link properties
      if (link.href && link.download) {
        updateResult("Download Mechanism", "success", "Link creation works correctly")
        console.log("Download test successful:", { href: link.href, download: link.download })
        return true
      } else {
        updateResult("Download Mechanism", "error", "Link creation failed")
        return false
      }
    } catch (error) {
      updateResult("Download Mechanism", "error", `Error: ${error instanceof Error ? error.message : "Unknown error"}`)
      return false
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setTestResults([])

    console.log("🧪 Starting comprehensive download tests...")

    // Test download mechanism
    testDownloadMechanism()

    // Test all audio files
    for (const file of audioFiles) {
      await testAudioFile(file)
      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setIsRunning(false)
    console.log("✅ All tests completed")
  }

  const testAudioPlayback = (file: { name: string; url: string }) => {
    const audio = new Audio(file.url)

    audio.addEventListener("loadstart", () => {
      console.log(`${file.name}: Loading started`)
    })

    audio.addEventListener("canplay", () => {
      console.log(`${file.name}: Can play - audio file is valid`)
      setAudioTest((prev) => ({ ...prev, [file.name]: true }))
      audio.pause()
    })

    audio.addEventListener("error", (e) => {
      console.error(`${file.name}: Audio error`, e)
      setAudioTest((prev) => ({ ...prev, [file.name]: false }))
    })

    audio.load()
  }

  const triggerTestDownload = (file: { name: string; url: string }) => {
    console.log(`🔽 Triggering test download for ${file.name}`)

    const link = document.createElement("a")
    link.href = file.url
    link.download = `${file.name} - Test Download.mp3`
    link.setAttribute("crossorigin", "anonymous")

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    console.log(`Download triggered for: ${link.download}`)
  }

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "warning":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full animate-pulse" />
    }
  }

  return (
    <div className="space-y-6">
      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-amber-500 flex items-center gap-2">
            <Download className="h-5 w-5" />
            Download System Tests
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={runAllTests} disabled={isRunning} className="bg-amber-500 hover:bg-amber-600 text-black">
              {isRunning ? "Running Tests..." : "Run All Tests"}
            </Button>
          </div>

          {testResults.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-white">Test Results:</h4>
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center gap-2 p-2 bg-zinc-800 rounded">
                  {getStatusIcon(result.status)}
                  <span className="font-medium text-white">{result.name}:</span>
                  <span className="text-gray-300">{result.message}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-amber-500">Audio File Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audioFiles.map((file) => (
              <div key={file.name} className="p-4 bg-zinc-800 rounded-lg">
                <h5 className="font-semibold text-white mb-2">{file.name}</h5>
                <div className="flex gap-2 mb-2">
                  <Button size="sm" onClick={() => testAudioPlayback(file)} className="bg-blue-600 hover:bg-blue-700">
                    <Play className="h-3 w-3 mr-1" />
                    Test Playback
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => triggerTestDownload(file)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Download className="h-3 w-3 mr-1" />
                    Test Download
                  </Button>
                </div>
                <div className="text-xs text-gray-400">URL: {file.url}</div>
                {audioTest[file.name] !== undefined && (
                  <div className={`text-xs mt-1 ${audioTest[file.name] ? "text-green-400" : "text-red-400"}`}>
                    Playback: {audioTest[file.name] ? "Success" : "Failed"}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border-zinc-700">
        <CardHeader>
          <CardTitle className="text-amber-500">Console Monitoring</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-300 space-y-2">
            <p>• Open browser DevTools (F12) and check the Console tab</p>
            <p>• Look for detailed logging when testing downloads</p>
            <p>• Check Network tab to see actual file requests</p>
            <p>• Verify downloaded files in your Downloads folder</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

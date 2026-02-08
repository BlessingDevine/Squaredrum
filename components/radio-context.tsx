"use client"

import { createContext, useContext, useState, useRef, useEffect, type ReactNode, useCallback } from "react"

interface RadioTrack {
  title: string
  artist: string
  album?: string
  duration?: string
}

interface StreamQuality {
  label: string
  bitrate: string
  url: string
  priority: number
}

interface ConnectionStatus {
  status: "idle" | "connecting" | "connected" | "buffering" | "error"
  message: string
}

interface RadioContextType {
  isPlaying: boolean
  isLoading: boolean
  isRadioOpen: boolean
  isMinimized: boolean
  isDesktopHeadless: boolean
  currentTrack: RadioTrack | null
  volume: number
  currentQuality: StreamQuality
  availableQualities: StreamQuality[]
  connectionStatus: ConnectionStatus
  togglePlay: () => void
  toggleRadio: () => void
  toggleMinimized: () => void
  closeRadio: () => void
  setVolume: (volume: number) => void
  setQuality: (quality: StreamQuality) => void
  retryConnection: () => void
  setDesktopHeadless: (value: boolean) => void
}

const RadioContext = createContext<RadioContextType | undefined>(undefined)

// Stream qualities with HD as default
const STREAM_QUALITIES: StreamQuality[] = [
  {
    label: "HD",
    bitrate: "320 kbps",
    url: "https://play.radioking.io/music-square-radio/812353",
    priority: 1,
  },
  {
    label: "High",
    bitrate: "196 kbps",
    url: "https://listen.radioking.com/radio/812353/stream/1893893",
    priority: 2,
  },
  {
    label: "Standard",
    bitrate: "128 kbps",
    url: "https://play.radioking.io/music-square-radio",
    priority: 3,
  },
]

export function RadioProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isRadioOpen, setIsRadioOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(true)
  const [isDesktopHeadless, setIsDesktopHeadless] = useState(false)
  const [currentTrack, setCurrentTrack] = useState<RadioTrack | null>(null)
  const [volume, setVolumeState] = useState(0.7)
  const [currentQuality, setCurrentQuality] = useState<StreamQuality>(STREAM_QUALITIES[0]) // Start with HD
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    status: "idle",
    message: "Ready to connect to Music Square Radio",
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const connectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const retryCountRef = useRef(0)
  const fallbackIndexRef = useRef(0)

  // Initialize audio element
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("🎵 Initializing Music Square Radio with HD stream")

      audioRef.current = new Audio()
      audioRef.current.volume = volume
      audioRef.current.preload = "none"
      audioRef.current.crossOrigin = "anonymous"

      const audio = audioRef.current

      const handleLoadStart = () => {
        console.log(`🔄 Loading HD stream`)
        setIsLoading(true)
        setConnectionStatus({
          status: "connecting",
          message: "Connecting to Music Square Radio...",
        })
      }

      const handleCanPlay = () => {
        console.log(`✅ HD stream ready`)
        setIsLoading(false)
        setConnectionStatus({
          status: "connected",
          message: "Connected to Music Square Radio",
        })
        retryCountRef.current = 0
        fallbackIndexRef.current = 0
      }

      const handlePlay = () => {
        console.log(`▶️ Playing HD stream`)
        setIsPlaying(true)
        setIsLoading(false)
        setConnectionStatus({
          status: "connected",
          message: "Playing Music Square Radio",
        })
      }

      const handlePause = () => {
        console.log("⏸️ Stream paused")
        setIsPlaying(false)
      }

      const handleError = (e: Event) => {
        console.error(`❌ Stream error:`, e)
        setIsLoading(false)
        setIsPlaying(false)
        handleConnectionError()
      }

      const handleWaiting = () => {
        console.log(`⏳ Stream buffering`)
        setConnectionStatus({
          status: "buffering",
          message: "Buffering...",
        })
      }

      const handlePlaying = () => {
        console.log(`🎵 Stream playing smoothly`)
        setConnectionStatus({
          status: "connected",
          message: "Playing Music Square Radio",
        })
      }

      const handleStalled = () => {
        console.log(`⚠️ Stream stalled`)
        setConnectionStatus({
          status: "buffering",
          message: "Reconnecting...",
        })
      }

      // Add all event listeners
      audio.addEventListener("loadstart", handleLoadStart)
      audio.addEventListener("canplay", handleCanPlay)
      audio.addEventListener("play", handlePlay)
      audio.addEventListener("pause", handlePause)
      audio.addEventListener("error", handleError)
      audio.addEventListener("waiting", handleWaiting)
      audio.addEventListener("playing", handlePlaying)
      audio.addEventListener("stalled", handleStalled)

      return () => {
        // Cleanup
        audio.removeEventListener("loadstart", handleLoadStart)
        audio.removeEventListener("canplay", handleCanPlay)
        audio.removeEventListener("play", handlePlay)
        audio.removeEventListener("pause", handlePause)
        audio.removeEventListener("error", handleError)
        audio.removeEventListener("waiting", handleWaiting)
        audio.removeEventListener("playing", handlePlaying)
        audio.removeEventListener("stalled", handleStalled)
      }
    }
  }, [currentQuality, volume])

  // Handle connection errors with smart fallback
  const handleConnectionError = useCallback(() => {
    console.error(`🔴 Stream failed`)

    retryCountRef.current++

    // Try next quality in fallback order
    if (fallbackIndexRef.current < STREAM_QUALITIES.length - 1) {
      fallbackIndexRef.current++
      const fallbackQuality = STREAM_QUALITIES[fallbackIndexRef.current]

      console.log(`📻 Falling back to ${fallbackQuality.label} stream`)
      setCurrentQuality(fallbackQuality)
      setConnectionStatus({
        status: "connecting",
        message: "Trying alternative stream...",
      })
      return
    }

    // All qualities failed
    setConnectionStatus({
      status: "error",
      message:
        retryCountRef.current > 3 ? "Connection failed. Check your internet." : "Connection failed. Tap to retry.",
    })
  }, [])

  // Update audio source when quality changes
  useEffect(() => {
    if (audioRef.current && isRadioOpen) {
      const audio = audioRef.current
      const wasPlaying = isPlaying

      // Clear any existing timeout
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current)
      }

      console.log(`🔗 Setting stream: ${currentQuality.url}`)

      // Update source
      audio.src = currentQuality.url
      audio.load()

      // Set connection timeout
      connectionTimeoutRef.current = setTimeout(() => {
        if (audio.readyState < 2) {
          console.log(`⏰ Stream timeout`)
          handleConnectionError()
        }
      }, 15000)

      // Resume playback if it was playing
      if (wasPlaying) {
        setTimeout(() => {
          audio.play().catch(handleConnectionError)
        }, 1000)
      }
    }
  }, [currentQuality, isRadioOpen, isPlaying, handleConnectionError])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = useCallback(() => {
    if (!audioRef.current) return

    const audio = audioRef.current

    if (isPlaying) {
      console.log("⏸️ Pausing stream")
      audio.pause()
    } else {
      // Clear any error state when trying to play
      if (connectionStatus.status === "error") {
        console.log("🔄 Retrying connection")
        setConnectionStatus({ status: "connecting", message: "Reconnecting..." })
        retryCountRef.current = 0
        fallbackIndexRef.current = 0
        setCurrentQuality(STREAM_QUALITIES[0]) // Reset to HD
      }

      console.log(`▶️ Starting stream`)
      audio.play().catch(handleConnectionError)
    }
  }, [isPlaying, connectionStatus.status, handleConnectionError])

  const toggleRadio = useCallback(() => {
    console.log(`📻 ${isRadioOpen ? "Closing" : "Opening"} Music Square Radio`)
    setIsRadioOpen(!isRadioOpen)
    if (!isRadioOpen) {
      setIsMinimized(true) // Start minimized by default
    }
  }, [isRadioOpen])

  const toggleMinimized = useCallback(() => {
    console.log(`${isMinimized ? "🔍 Maximizing" : "🔎 Minimizing"} radio player`)
    setIsMinimized(!isMinimized)
  }, [isMinimized])

  const closeRadio = useCallback(() => {
    console.log("❌ Closing Music Square Radio")

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
    }

    // Clear timeouts
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current)
    }

    setIsRadioOpen(false)
    setIsPlaying(false)
    setIsLoading(false)
    setIsDesktopHeadless(false)
    setConnectionStatus({ status: "idle", message: "Ready to connect to Music Square Radio" })
    setCurrentQuality(STREAM_QUALITIES[0]) // Reset to HD
    retryCountRef.current = 0
    fallbackIndexRef.current = 0
  }, [])

  const setVolume = useCallback((newVolume: number) => {
    console.log(`🔊 Volume: ${Math.round(newVolume * 100)}%`)
    setVolumeState(newVolume)
  }, [])

  const setQuality = useCallback(
    (quality: StreamQuality) => {
      console.log(`🎛️ Switching to ${quality.label} stream`)
      const wasPlaying = isPlaying

      if (audioRef.current) {
        audioRef.current.pause()
      }

      setCurrentQuality(quality)
      fallbackIndexRef.current = STREAM_QUALITIES.findIndex((q) => q.label === quality.label)
      retryCountRef.current = 0

      if (wasPlaying) {
        setTimeout(() => {
          togglePlay()
        }, 500)
      }
    },
    [isPlaying, togglePlay],
  )

  const retryConnection = useCallback(() => {
    console.log("🔄 Manual retry - resetting to HD stream")

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.src = ""
    }

    setConnectionStatus({ status: "connecting", message: "Retrying connection..." })
    setCurrentQuality(STREAM_QUALITIES[0]) // Reset to HD
    retryCountRef.current = 0
    fallbackIndexRef.current = 0

    setTimeout(() => {
      togglePlay()
    }, 1000)
  }, [togglePlay])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (connectionTimeoutRef.current) {
        clearTimeout(connectionTimeoutRef.current)
      }
    }
  }, [])

  const value: RadioContextType = {
    isPlaying,
    isLoading,
    isRadioOpen,
    isMinimized,
    isDesktopHeadless,
    currentTrack,
    volume,
    currentQuality,
    availableQualities: STREAM_QUALITIES,
    connectionStatus,
    togglePlay,
    toggleRadio,
    toggleMinimized,
    closeRadio,
    setVolume,
    setQuality,
    retryConnection,
    setDesktopHeadless: setIsDesktopHeadless,
  }

  return <RadioContext.Provider value={value}>{children}</RadioContext.Provider>
}

export function useRadio() {
  const context = useContext(RadioContext)
  if (context === undefined) {
    throw new Error("useRadio must be used within a RadioProvider")
  }
  return context
}

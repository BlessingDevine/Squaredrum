"use client"

import type React from "react"
import { createContext, useContext, useRef, useEffect, useState, useCallback } from "react"
import { Play, Pause, SkipBack, SkipForward, ChevronUp, X, List, Shuffle, Repeat, Repeat1 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import Image from "next/image"

interface Track {
  id: number
  title: string
  artist: string
  duration: string
  audioUrl: string
  downloadUrl: string
  coverArt?: string
  compilationId?: string
  compilationTitle?: string
}

interface PlayerState {
  currentTrack: Track | null
  isPlaying: boolean
  currentTime: number
  duration: number
  isLoading: boolean
  isCrossfading: boolean
  playlist: Track[]
  currentIndex: number
  isVisible: boolean
  isMinimized: boolean
  isShuffled: boolean
  repeatMode: "none" | "all" | "one"
  originalPlaylist: Track[]
}

interface GlobalMusicContextType {
  state: PlayerState
  playTrack: (track: Track, playlist?: Track[]) => void
  togglePlay: () => void
  nextTrack: () => void
  previousTrack: () => void
  seek: (time: number) => void
  showPlayer: () => void
  hidePlayer: () => void
  minimizePlayer: () => void
  expandPlayer: () => void
  prefetchTrack: (track: Track) => void
  toggleShuffle: () => void
  toggleRepeat: () => void
}

const GlobalMusicContext = createContext<GlobalMusicContextType | null>(null)

export function useGlobalMusic() {
  const context = useContext(GlobalMusicContext)
  if (!context) {
    throw new Error("useGlobalMusic must be used within GlobalMusicProvider")
  }
  return context
}

interface GlobalMusicProviderProps {
  children: React.ReactNode
}

export function GlobalMusicProvider({ children }: GlobalMusicProviderProps) {
  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: false,
    isCrossfading: false,
    playlist: [],
    currentIndex: -1,
    isVisible: false,
    isMinimized: false,
    isShuffled: false,
    repeatMode: "none",
    originalPlaylist: [],
  })

  const primaryAudioRef = useRef<HTMLAudioElement | null>(null)
  const crossfadeAudioRef = useRef<HTMLAudioElement | null>(null)
  const crossfadeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isCrossfadingRef = useRef(false)
  const prefetchCacheRef = useRef<Map<string, HTMLAudioElement>>(new Map())

  // Initialize audio elements
  useEffect(() => {
    if (typeof window === "undefined") return

    // Create primary audio element
    const primaryAudio = new Audio()
    primaryAudio.preload = "metadata"
    primaryAudio.crossOrigin = "anonymous"
    primaryAudio.volume = 1

    // Create crossfade audio element
    const crossfadeAudio = new Audio()
    crossfadeAudio.preload = "metadata"
    crossfadeAudio.crossOrigin = "anonymous"
    crossfadeAudio.volume = 0

    // Mobile optimizations
    const userAgent = navigator.userAgent.toLowerCase()
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet/i.test(userAgent)
    const isIOS = /iphone|ipad|ipod/.test(userAgent)

    if (isMobile) {
      primaryAudio.playsInline = true
      crossfadeAudio.playsInline = true

      if (isIOS) {
        primaryAudio.setAttribute("webkit-playsinline", "true")
        crossfadeAudio.setAttribute("webkit-playsinline", "true")
        primaryAudio.setAttribute("playsinline", "true")
        crossfadeAudio.setAttribute("playsinline", "true")
      }
    }

    primaryAudioRef.current = primaryAudio
    crossfadeAudioRef.current = crossfadeAudio

    return () => {
      primaryAudio.pause()
      crossfadeAudio.pause()
      primaryAudio.src = ""
      crossfadeAudio.src = ""
      if (crossfadeTimeoutRef.current) {
        clearTimeout(crossfadeTimeoutRef.current)
      }
      // Clean up prefetch cache
      prefetchCacheRef.current.forEach((audio) => {
        audio.pause()
        audio.src = ""
      })
      prefetchCacheRef.current.clear()
    }
  }, [])

  // Load track metadata
  const loadTrackMetadata = useCallback(async (track: Track): Promise<Track> => {
    try {
      const audio = new Audio()
      audio.crossOrigin = "anonymous"
      audio.preload = "metadata"

      return new Promise((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error("Metadata load timeout"))
        }, 5000)

        const handleLoadedMetadata = () => {
          clearTimeout(timeout)
          audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
          audio.removeEventListener("error", handleError)

          const duration = audio.duration
          const formattedDuration = duration
            ? `${Math.floor(duration / 60)}:${Math.floor(duration % 60)
                .toString()
                .padStart(2, "0")}`
            : track.duration

          resolve({
            ...track,
            duration: formattedDuration,
          })

          audio.src = ""
        }

        const handleError = () => {
          clearTimeout(timeout)
          audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
          audio.removeEventListener("error", handleError)
          resolve(track) // Return original track if metadata fails
        }

        audio.addEventListener("loadedmetadata", handleLoadedMetadata)
        audio.addEventListener("error", handleError)
        audio.src = track.audioUrl
      })
    } catch (error) {
      return track // Return original track if anything fails
    }
  }, [])

  // Prefetch track for performance
  const prefetchTrack = useCallback((track: Track) => {
    const cacheKey = track.audioUrl
    if (prefetchCacheRef.current.has(cacheKey)) return

    try {
      const audio = new Audio()
      audio.crossOrigin = "anonymous"
      audio.preload = "metadata"
      audio.src = track.audioUrl

      prefetchCacheRef.current.set(cacheKey, audio)

      // Clean up old prefetch entries (keep max 5)
      if (prefetchCacheRef.current.size > 5) {
        const firstKey = prefetchCacheRef.current.keys().next().value
        const oldAudio = prefetchCacheRef.current.get(firstKey)
        if (oldAudio) {
          oldAudio.pause()
          oldAudio.src = ""
        }
        prefetchCacheRef.current.delete(firstKey)
      }
    } catch (error) {
      console.error("Prefetch failed:", error)
    }
  }, [])

  // Shuffle array utility
  const shuffleArray = useCallback((array: Track[]) => {
    const shuffled = [...array]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }, [])

  // Player controls
  const playTrack = useCallback(
    async (track: Track, playlist: Track[] = []) => {
      const primaryAudio = primaryAudioRef.current
      if (!primaryAudio) return

      try {
        // Stop any ongoing crossfade
        if (isCrossfadingRef.current) {
          const crossfadeAudio = crossfadeAudioRef.current
          if (crossfadeAudio) {
            crossfadeAudio.pause()
            crossfadeAudio.volume = 0
          }
          primaryAudio.volume = 1
          isCrossfadingRef.current = false
        }

        // Load metadata for the track
        const trackWithMetadata = await loadTrackMetadata(track)

        // Set up playlist
        const fullPlaylist = playlist.length > 0 ? playlist : [trackWithMetadata]
        const trackIndex = fullPlaylist.findIndex((t) => t.id === trackWithMetadata.id)

        setState((prev) => ({
          ...prev,
          currentTrack: trackWithMetadata,
          playlist: fullPlaylist,
          originalPlaylist: prev.isShuffled ? prev.originalPlaylist : fullPlaylist,
          currentIndex: trackIndex >= 0 ? trackIndex : 0,
          isLoading: true,
          isVisible: true,
          isMinimized: false,
          isCrossfading: false,
        }))

        // Load and play track
        primaryAudio.src = trackWithMetadata.audioUrl
        primaryAudio.load()

        const playPromise = primaryAudio.play()
        if (playPromise !== undefined) {
          await playPromise
        }

        // Prefetch next track
        const nextIndex = (trackIndex + 1) % fullPlaylist.length
        if (nextIndex !== trackIndex && fullPlaylist[nextIndex]) {
          prefetchTrack(fullPlaylist[nextIndex])
        }
      } catch (error) {
        console.error("Play track failed:", error)
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    },
    [loadTrackMetadata, prefetchTrack],
  )

  const togglePlay = useCallback(async () => {
    const primaryAudio = primaryAudioRef.current
    if (!primaryAudio || !state.currentTrack) return

    try {
      if (state.isPlaying) {
        primaryAudio.pause()
      } else {
        const playPromise = primaryAudio.play()
        if (playPromise !== undefined) {
          await playPromise
        }
      }
    } catch (error) {
      console.error("Toggle play failed:", error)
    }
  }, [state.isPlaying, state.currentTrack])

  const nextTrack = useCallback(() => {
    if (state.playlist.length === 0) return

    // Handle repeat one
    if (state.repeatMode === "one" && state.currentTrack) {
      playTrack(state.currentTrack, state.playlist)
      return
    }

    let nextIndex: number

    if (state.currentIndex >= state.playlist.length - 1) {
      // At end of playlist
      if (state.repeatMode === "all") {
        nextIndex = 0 // Loop to beginning
      } else {
        return // Don't play next if no repeat
      }
    } else {
      nextIndex = state.currentIndex + 1
    }

    const nextTrack = state.playlist[nextIndex]
    if (nextTrack) {
      playTrack(nextTrack, state.playlist)
    }
  }, [state.playlist, state.currentIndex, state.repeatMode, state.currentTrack, playTrack])

  const previousTrack = useCallback(() => {
    if (state.playlist.length === 0) return

    if (state.currentTime > 3) {
      // Restart current track if more than 3 seconds in
      const primaryAudio = primaryAudioRef.current
      if (primaryAudio) {
        primaryAudio.currentTime = 0
        setState((prev) => ({ ...prev, currentTime: 0 }))
      }
    } else {
      // Go to previous track
      const prevIndex = state.currentIndex === 0 ? state.playlist.length - 1 : state.currentIndex - 1
      const prevTrack = state.playlist[prevIndex]

      if (prevTrack) {
        playTrack(prevTrack, state.playlist)
      }
    }
  }, [state.playlist, state.currentIndex, state.currentTime, playTrack])

  const seek = useCallback((time: number) => {
    const primaryAudio = primaryAudioRef.current
    if (!primaryAudio) return

    try {
      primaryAudio.currentTime = time
      setState((prev) => ({ ...prev, currentTime: time }))
    } catch (error) {
      console.error("Seek failed:", error)
    }
  }, [])

  const showPlayer = useCallback(() => {
    setState((prev) => ({ ...prev, isVisible: true, isMinimized: false }))
  }, [])

  const hidePlayer = useCallback(() => {
    setState((prev) => ({ ...prev, isVisible: false }))
  }, [])

  const minimizePlayer = useCallback(() => {
    setState((prev) => ({ ...prev, isMinimized: true }))
  }, [])

  const expandPlayer = useCallback(() => {
    setState((prev) => ({ ...prev, isMinimized: false }))
  }, [])

  const toggleShuffle = useCallback(() => {
    setState((prev) => {
      if (!prev.isShuffled) {
        // Enable shuffle
        const currentTrack = prev.currentTrack
        if (!currentTrack) return prev

        // Store original playlist if not already stored
        const originalPlaylist = prev.originalPlaylist.length > 0 ? prev.originalPlaylist : prev.playlist

        // Create shuffled playlist without current track
        const otherTracks = prev.playlist.filter((_, index) => index !== prev.currentIndex)
        const shuffledOthers = shuffleArray(otherTracks)

        // Put current track first, then shuffled others
        const shuffledPlaylist = [currentTrack, ...shuffledOthers]

        return {
          ...prev,
          isShuffled: true,
          playlist: shuffledPlaylist,
          currentIndex: 0,
          originalPlaylist,
        }
      } else {
        // Disable shuffle - restore original playlist
        const currentTrack = prev.currentTrack
        if (!currentTrack || prev.originalPlaylist.length === 0) return prev

        const originalIndex = prev.originalPlaylist.findIndex((track) => track.id === currentTrack.id)

        return {
          ...prev,
          isShuffled: false,
          playlist: prev.originalPlaylist,
          currentIndex: originalIndex >= 0 ? originalIndex : 0,
          originalPlaylist: [],
        }
      }
    })
  }, [shuffleArray])

  const toggleRepeat = useCallback(() => {
    setState((prev) => {
      const modes: Array<"none" | "all" | "one"> = ["none", "all", "one"]
      const currentIndex = modes.indexOf(prev.repeatMode)
      const nextMode = modes[(currentIndex + 1) % modes.length]

      return {
        ...prev,
        repeatMode: nextMode,
      }
    })
  }, [])

  // Crossfade implementation
  const startCrossfade = useCallback(() => {
    const primaryAudio = primaryAudioRef.current
    const crossfadeAudio = crossfadeAudioRef.current

    if (!primaryAudio || !crossfadeAudio || isCrossfadingRef.current || state.playlist.length <= 1) {
      return
    }

    const nextIndex = (state.currentIndex + 1) % state.playlist.length
    const nextTrack = state.playlist[nextIndex]

    if (!nextTrack) return

    console.log("Starting crossfade to:", nextTrack.title)

    isCrossfadingRef.current = true
    setState((prev) => ({ ...prev, isCrossfading: true }))

    // Load next track
    crossfadeAudio.src = nextTrack.audioUrl
    crossfadeAudio.currentTime = 0
    crossfadeAudio.volume = 0
    crossfadeAudio.load()

    const handleCrossfadeReady = () => {
      crossfadeAudio.removeEventListener("canplay", handleCrossfadeReady)

      crossfadeAudio
        .play()
        .then(() => {
          // 2-second crossfade
          let step = 0
          const steps = 20
          const interval = 100 // 2000ms / 20 = 100ms per step

          const fadeInterval = setInterval(() => {
            step++
            const progress = step / steps

            if (primaryAudio && crossfadeAudio) {
              primaryAudio.volume = Math.max(0, 1 - progress)
              crossfadeAudio.volume = Math.min(1, progress)
            }

            if (step >= steps) {
              clearInterval(fadeInterval)

              // Complete crossfade
              try {
                const currentTime = crossfadeAudio.currentTime

                primaryAudio.pause()
                primaryAudio.src = nextTrack.audioUrl
                primaryAudio.currentTime = currentTime
                primaryAudio.volume = 1

                crossfadeAudio.pause()
                crossfadeAudio.volume = 0
                crossfadeAudio.currentTime = 0

                primaryAudio.play().catch(console.error)

                setState((prev) => ({
                  ...prev,
                  currentTrack: nextTrack,
                  currentIndex: nextIndex,
                  isCrossfading: false,
                  currentTime: currentTime,
                }))

                isCrossfadingRef.current = false
              } catch (error) {
                console.error("Crossfade completion error:", error)
                isCrossfadingRef.current = false
                setState((prev) => ({ ...prev, isCrossfading: false }))
              }
            }
          }, interval)
        })
        .catch((error) => {
          console.error("Crossfade play error:", error)
          isCrossfadingRef.current = false
          setState((prev) => ({ ...prev, isCrossfading: false }))
        })
    }

    crossfadeAudio.addEventListener("canplay", handleCrossfadeReady)
  }, [state.currentIndex, state.playlist])

  // Setup audio event listeners
  useEffect(() => {
    const primaryAudio = primaryAudioRef.current
    if (!primaryAudio) return

    const handleTimeUpdate = () => {
      if (!isCrossfadingRef.current) {
        const currentTime = primaryAudio.currentTime
        const duration = primaryAudio.duration

        setState((prev) => ({
          ...prev,
          currentTime,
          duration: duration || 0,
        }))

        // Trigger crossfade 2 seconds before end
        if (duration && currentTime > 0) {
          const timeRemaining = duration - currentTime
          if (
            timeRemaining <= 2.1 &&
            timeRemaining > 1.9 &&
            state.isPlaying &&
            !isCrossfadingRef.current &&
            state.playlist.length > 1
          ) {
            startCrossfade()
          }
        }
      }
    }

    const handleLoadedMetadata = () => {
      setState((prev) => ({
        ...prev,
        duration: primaryAudio.duration || 0,
        isLoading: false,
      }))
    }

    const handlePlay = () => {
      setState((prev) => ({ ...prev, isPlaying: true, isLoading: false }))
    }

    const handlePause = () => {
      setState((prev) => ({ ...prev, isPlaying: false }))
    }

    const handleWaiting = () => {
      setState((prev) => ({ ...prev, isLoading: true }))
    }

    const handlePlaying = () => {
      setState((prev) => ({ ...prev, isLoading: false }))
    }

    const handleEnded = () => {
      if (!isCrossfadingRef.current) {
        // Handle repeat one
        if (state.repeatMode === "one") {
          const primaryAudio = primaryAudioRef.current
          if (primaryAudio) {
            primaryAudio.currentTime = 0
            primaryAudio.play().catch(console.error)
          }
          return
        }

        nextTrack()
      }
    }

    const handleError = (e: Event) => {
      console.error("Audio error:", e)
      setState((prev) => ({ ...prev, isLoading: false, isPlaying: false }))
    }

    primaryAudio.addEventListener("timeupdate", handleTimeUpdate)
    primaryAudio.addEventListener("loadedmetadata", handleLoadedMetadata)
    primaryAudio.addEventListener("play", handlePlay)
    primaryAudio.addEventListener("pause", handlePause)
    primaryAudio.addEventListener("waiting", handleWaiting)
    primaryAudio.addEventListener("playing", handlePlaying)
    primaryAudio.addEventListener("ended", handleEnded)
    primaryAudio.addEventListener("error", handleError)

    return () => {
      primaryAudio.removeEventListener("timeupdate", handleTimeUpdate)
      primaryAudio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      primaryAudio.removeEventListener("play", handlePlay)
      primaryAudio.removeEventListener("pause", handlePause)
      primaryAudio.removeEventListener("waiting", handleWaiting)
      primaryAudio.removeEventListener("playing", handlePlaying)
      primaryAudio.removeEventListener("ended", handleEnded)
      primaryAudio.removeEventListener("error", handleError)
    }
  }, [state.isPlaying, state.playlist.length, startCrossfade, state.repeatMode, nextTrack])

  const contextValue: GlobalMusicContextType = {
    state,
    playTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    showPlayer,
    hidePlayer,
    minimizePlayer,
    expandPlayer,
    prefetchTrack,
    toggleShuffle,
    toggleRepeat,
  }

  return (
    <GlobalMusicContext.Provider value={contextValue}>
      {children}
      <GlobalMusicPlayer />
    </GlobalMusicContext.Provider>
  )
}

function GlobalMusicPlayer() {
  const {
    state,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    hidePlayer,
    minimizePlayer,
    expandPlayer,
    playTrack,
    toggleShuffle,
    toggleRepeat,
  } = useGlobalMusic()
  const [isMobile, setIsMobile] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showPlaylist, setShowPlaylist] = useState(false)
  const [dragStartY, setDragStartY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const progressRef = useRef<HTMLDivElement>(null)

  // Check if mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768
      setIsMobile(mobile)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const formatTime = (time: number) => {
    if (isNaN(time) || !isFinite(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = progressRef.current
    if (!progressBar || !state.duration) return

    const rect = progressBar.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, clickX / rect.width))
    const newTime = percentage * state.duration

    seek(newTime)
  }

  // Drag to dismiss functionality
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartY(e.touches[0].clientY)
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    const currentY = e.touches[0].clientY
    const deltaY = currentY - dragStartY

    // Only allow downward drag
    if (deltaY > 0) {
      e.currentTarget.style.transform = `translateY(${deltaY}px)`
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isDragging) return
    setIsDragging(false)

    const currentY = e.changedTouches[0].clientY
    const deltaY = currentY - dragStartY

    // If dragged down more than 100px, dismiss
    if (deltaY > 100) {
      setIsExpanded(false)
      minimizePlayer()
    }

    // Reset transform
    e.currentTarget.style.transform = ""
  }

  const handlePlaylistTrackClick = (track: Track, index: number) => {
    playTrack(track, state.playlist)
    setShowPlaylist(false)
  }

  if (!state.isVisible || !state.currentTrack) {
    return null
  }

  // Mobile bottom bar player
  if (isMobile) {
    return (
      <>
        {/* Minimized bottom bar */}
        {state.isMinimized && (
          <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 z-50">
            <div className="p-3">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={state.currentTrack.coverArt || "/placeholder.png"}
                    alt={state.currentTrack.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      if (target.src !== "/placeholder.png") {
                        target.src = "/placeholder.png"
                      }
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0" onClick={expandPlayer}>
                  <h4 className="font-medium text-white text-sm truncate">{state.currentTrack.title}</h4>
                  <p className="text-gray-400 text-xs truncate">
                    {state.currentTrack.compilationTitle || state.currentTrack.artist}
                  </p>
                </div>

                <Button
                  onClick={togglePlay}
                  size="sm"
                  className="bg-white text-black rounded-full p-0 h-10 w-10"
                  disabled={state.isLoading}
                  aria-label={
                    state.isPlaying ? `Pause ${state.currentTrack.title}` : `Play ${state.currentTrack.title}`
                  }
                >
                  {state.isLoading ? (
                    <div className="border-2 border-black border-t-transparent rounded-full animate-spin w-4 h-4" />
                  ) : state.isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5 ml-0.5" />
                  )}
                </Button>
              </div>

              {/* Mini progress bar */}
              <div className="mt-2">
                <div
                  ref={progressRef}
                  className="relative h-1 bg-zinc-700 rounded-full cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-white rounded-full"
                    style={{
                      width: state.duration > 0 ? `${(state.currentTime / state.duration) * 100}%` : "0%",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full bottom bar */}
        {!state.isMinimized && (
          <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 z-50">
            <div className="p-3">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={state.currentTrack.coverArt || "/placeholder.png"}
                    alt={state.currentTrack.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      if (target.src !== "/placeholder.png") {
                        target.src = "/placeholder.png"
                      }
                    }}
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-white text-sm truncate">{state.currentTrack.title}</h4>
                  <p className="text-gray-400 text-xs truncate">
                    {state.currentTrack.compilationTitle || state.currentTrack.artist}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={previousTrack}
                    size="sm"
                    variant="ghost"
                    className="text-white p-0 h-8 w-8"
                    aria-label="Previous track"
                  >
                    <SkipBack className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={togglePlay}
                    size="sm"
                    className="bg-white text-black rounded-full p-0 h-10 w-10"
                    disabled={state.isLoading}
                    aria-label={
                      state.isPlaying ? `Pause ${state.currentTrack.title}` : `Play ${state.currentTrack.title}`
                    }
                  >
                    {state.isLoading ? (
                      <div className="border-2 border-black border-t-transparent rounded-full animate-spin w-4 h-4" />
                    ) : state.isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="h-5 w-5 ml-0.5" />
                    )}
                  </Button>

                  <Button
                    onClick={nextTrack}
                    size="sm"
                    variant="ghost"
                    className="text-white p-0 h-8 w-8"
                    aria-label="Next track"
                  >
                    <SkipForward className="h-4 w-4" />
                  </Button>

                  <Button
                    onClick={() => setIsExpanded(true)}
                    size="sm"
                    variant="ghost"
                    className="text-white p-0 h-8 w-8"
                    aria-label="Expand player"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-2">
                <div
                  ref={progressRef}
                  className="relative h-1 bg-zinc-700 rounded-full cursor-pointer"
                  onClick={handleProgressClick}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-white rounded-full"
                    style={{
                      width: state.duration > 0 ? `${(state.currentTime / state.duration) * 100}%` : "0%",
                    }}
                  />
                  {/* Crossfade indicator */}
                  {state.duration > 2 && state.currentIndex < state.playlist.length - 1 && (
                    <div
                      className="absolute top-0 h-full bg-blue-500/30 rounded-full"
                      style={{
                        right: "0%",
                        width: `${(2 / state.duration) * 100}%`,
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Expanded mobile player */}
        {isExpanded && (
          <div
            className="fixed inset-0 bg-zinc-900 z-50 flex flex-col"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="flex items-center justify-between p-4 border-b border-zinc-800">
              <Button
                onClick={() => setIsExpanded(false)}
                size="sm"
                variant="ghost"
                className="text-white p-0 h-8 w-8"
                aria-label="Minimize player"
              >
                <ChevronUp className="h-4 w-4 rotate-180" />
              </Button>
              <h3 className="font-medium text-white">Now Playing</h3>
              <div className="flex items-center gap-2">
                <Button
                  onClick={() => setShowPlaylist(true)}
                  size="sm"
                  variant="ghost"
                  className="text-white p-0 h-8 w-8"
                  aria-label="Show playlist"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  onClick={hidePlayer}
                  size="sm"
                  variant="ghost"
                  className="text-white p-0 h-8 w-8"
                  aria-label="Close player"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="relative w-64 h-64 rounded-2xl overflow-hidden mb-8">
                <Image
                  src={state.currentTrack.coverArt || "/placeholder.png"}
                  alt={state.currentTrack.title}
                  fill
                  className="object-cover"
                  sizes="256px"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    if (target.src !== "/placeholder.png") {
                      target.src = "/placeholder.png"
                    }
                  }}
                />
              </div>

              <div className="text-center mb-8">
                <h2 className="font-bold text-white text-xl mb-2">{state.currentTrack.title}</h2>
                <p className="text-gray-400">{state.currentTrack.compilationTitle || state.currentTrack.artist}</p>
                {state.isCrossfading && <p className="text-blue-400 text-sm mt-1">Crossfading to next track...</p>}
              </div>

              <div className="w-full mb-6">
                <div
                  ref={progressRef}
                  className="relative h-2 bg-zinc-700 rounded-full cursor-pointer mb-2"
                  onClick={handleProgressClick}
                >
                  <div
                    className="absolute top-0 left-0 h-full bg-white rounded-full"
                    style={{
                      width: state.duration > 0 ? `${(state.currentTime / state.duration) * 100}%` : "0%",
                    }}
                  />
                  {/* Crossfade indicator */}
                  {state.duration > 2 && state.currentIndex < state.playlist.length - 1 && (
                    <div
                      className="absolute top-0 h-full bg-blue-500/30 rounded-full"
                      style={{
                        right: "0%",
                        width: `${(2 / state.duration) * 100}%`,
                      }}
                    />
                  )}
                </div>
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{formatTime(state.currentTime)}</span>
                  <span>{formatTime(state.duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-8">
                <Button
                  onClick={previousTrack}
                  size="sm"
                  variant="ghost"
                  className="text-white p-0 h-12 w-12"
                  aria-label="Previous track"
                >
                  <SkipBack className="h-6 w-6" />
                </Button>

                <Button
                  onClick={togglePlay}
                  size="sm"
                  className="bg-white text-black rounded-full p-0 h-16 w-16"
                  disabled={state.isLoading}
                  aria-label={
                    state.isPlaying ? `Pause ${state.currentTrack.title}` : `Play ${state.currentTrack.title}`
                  }
                >
                  {state.isLoading ? (
                    <div className="border-2 border-black border-t-transparent rounded-full animate-spin w-6 h-6" />
                  ) : state.isPlaying ? (
                    <Pause className="h-8 w-8" />
                  ) : (
                    <Play className="h-8 w-8 ml-1" />
                  )}
                </Button>

                <Button
                  onClick={nextTrack}
                  size="sm"
                  variant="ghost"
                  className="text-white p-0 h-12 w-12"
                  aria-label="Next track"
                >
                  <SkipForward className="h-6 w-6" />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-6 mt-4">
                <Button
                  onClick={toggleShuffle}
                  size="sm"
                  variant="ghost"
                  className={`p-0 h-10 w-10 ${state.isShuffled ? "text-blue-400" : "text-white"}`}
                  aria-label={state.isShuffled ? "Disable shuffle" : "Enable shuffle"}
                >
                  <Shuffle className="h-5 w-5" />
                </Button>

                <Button
                  onClick={toggleRepeat}
                  size="sm"
                  variant="ghost"
                  className={`p-0 h-10 w-10 ${state.repeatMode !== "none" ? "text-blue-400" : "text-white"}`}
                  aria-label={`Repeat: ${state.repeatMode}`}
                >
                  {state.repeatMode === "one" ? <Repeat1 className="h-5 w-5" /> : <Repeat className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Playlist Sheet */}
        <Sheet open={showPlaylist} onOpenChange={setShowPlaylist}>
          <SheetContent side="bottom" className="h-[70vh] bg-zinc-900 border-zinc-800">
            <SheetHeader>
              <SheetTitle className="text-white">Current Playlist</SheetTitle>
            </SheetHeader>
            <div className="mt-4 h-full overflow-y-auto">
              <div className="space-y-2">
                {state.playlist.map((track, index) => (
                  <div
                    key={`playlist-${track.id}`}
                    className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                      index === state.currentIndex
                        ? "bg-white/10 border border-white/20"
                        : "bg-zinc-800/50 hover:bg-zinc-800/70"
                    }`}
                    onClick={() => handlePlaylistTrackClick(track, index)}
                  >
                    <div className="relative w-10 h-10 rounded overflow-hidden flex-shrink-0">
                      <Image
                        src={track.coverArt || "/placeholder.png"}
                        alt={track.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          if (target.src !== "/placeholder.png") {
                            target.src = "/placeholder.png"
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white text-sm truncate">{track.title}</h4>
                      <p className="text-gray-400 text-xs truncate">{track.compilationTitle || track.artist}</p>
                    </div>
                    {index === state.currentIndex && state.isPlaying && (
                      <div className="flex items-center space-x-0.5">
                        <div className="w-1 h-3 bg-white animate-pulse"></div>
                        <div className="w-1 h-2 bg-white animate-pulse delay-75"></div>
                        <div className="w-1 h-3 bg-white animate-pulse delay-150"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </>
    )
  }

  // Desktop horizontal player
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zinc-900/95 backdrop-blur-sm border-t border-zinc-800 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-6">
          {/* Track info */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={state.currentTrack.coverArt || "/placeholder.png"}
                alt={state.currentTrack.title}
                fill
                className="object-cover"
                sizes="56px"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  if (target.src !== "/placeholder.png") {
                    target.src = "/placeholder.png"
                  }
                }}
              />
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-white truncate">{state.currentTrack.title}</h4>
              <p className="text-gray-400 text-sm truncate">
                {state.currentTrack.compilationTitle || state.currentTrack.artist}
              </p>
              {state.isCrossfading && <p className="text-blue-400 text-xs">Crossfading...</p>}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            <Button
              onClick={previousTrack}
              size="sm"
              variant="ghost"
              className="text-white p-0 h-10 w-10"
              aria-label="Previous track"
            >
              <SkipBack className="h-5 w-5" />
            </Button>

            <Button
              onClick={togglePlay}
              size="sm"
              className="bg-white text-black rounded-full p-0 h-12 w-12"
              disabled={state.isLoading}
              aria-label={state.isPlaying ? `Pause ${state.currentTrack.title}` : `Play ${state.currentTrack.title}`}
            >
              {state.isLoading ? (
                <div className="border-2 border-black border-t-transparent rounded-full animate-spin w-5 h-5" />
              ) : state.isPlaying ? (
                <Pause className="h-6 w-6" />
              ) : (
                <Play className="h-6 w-6 ml-0.5" />
              )}
            </Button>

            <Button
              onClick={nextTrack}
              size="sm"
              variant="ghost"
              className="text-white p-0 h-10 w-10"
              aria-label="Next track"
            >
              <SkipForward className="h-5 w-5" />
            </Button>

            <Button
              onClick={toggleShuffle}
              size="sm"
              variant="ghost"
              className={`p-0 h-10 w-10 ${state.isShuffled ? "text-blue-400" : "text-white"}`}
              aria-label={state.isShuffled ? "Disable shuffle" : "Enable shuffle"}
            >
              <Shuffle className="h-4 w-4" />
            </Button>

            <Button
              onClick={toggleRepeat}
              size="sm"
              variant="ghost"
              className={`p-0 h-10 w-10 ${state.repeatMode !== "none" ? "text-blue-400" : "text-white"}`}
              aria-label={`Repeat: ${state.repeatMode}`}
            >
              {state.repeatMode === "one" ? <Repeat1 className="h-4 w-4" /> : <Repeat className="h-4 w-4" />}
            </Button>
          </div>

          {/* Progress */}
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <span className="text-sm text-gray-400 whitespace-nowrap">{formatTime(state.currentTime)}</span>
            <div
              ref={progressRef}
              className="relative h-2 bg-zinc-700 rounded-full cursor-pointer flex-1"
              onClick={handleProgressClick}
            >
              <div
                className="absolute top-0 left-0 h-full bg-white rounded-full"
                style={{
                  width: state.duration > 0 ? `${(state.currentTime / state.duration) * 100}%` : "0%",
                }}
              />
              {/* Crossfade indicator */}
              {state.duration > 2 && state.currentIndex < state.playlist.length - 1 && (
                <div
                  className="absolute top-0 h-full bg-blue-500/30 rounded-full"
                  style={{
                    right: "0%",
                    width: `${(2 / state.duration) * 100}%`,
                  }}
                />
              )}
            </div>
            <span className="text-sm text-gray-400 whitespace-nowrap">{formatTime(state.duration)}</span>
          </div>

          {/* Close button */}
          <Button
            onClick={hidePlayer}
            size="sm"
            variant="ghost"
            className="text-white p-0 h-8 w-8"
            aria-label="Close player"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

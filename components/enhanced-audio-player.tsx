"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
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

interface EnhancedAudioPlayerProps {
  tracks: Track[]
  initialTrackIndex?: number
  onTrackChange?: (track: Track, index: number) => void
  className?: string
}

export default function EnhancedAudioPlayer({
  tracks,
  initialTrackIndex = 0,
  onTrackChange,
  className = "",
}: EnhancedAudioPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(initialTrackIndex)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const currentTrack = tracks[currentTrackIndex]

  // Initialize audio element
  useEffect(() => {
    if (typeof window === "undefined") return

    const audio = new Audio()
    audio.preload = "metadata"
    audio.crossOrigin = "anonymous"
    audio.volume = volume
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ""
    }
  }, [])

  // Load track
  const loadTrack = useCallback(
    async (trackIndex: number) => {
      const audio = audioRef.current
      const track = tracks[trackIndex]

      if (!audio || !track) return

      setIsLoading(true)
      setImageLoaded(false)

      return new Promise<void>((resolve, reject) => {
        const handleCanPlay = () => {
          audio.removeEventListener("canplay", handleCanPlay)
          audio.removeEventListener("error", handleError)
          setIsLoading(false)
          setDuration(audio.duration || 0)
          resolve()
        }

        const handleError = () => {
          audio.removeEventListener("canplay", handleCanPlay)
          audio.removeEventListener("error", handleError)
          setIsLoading(false)
          reject(new Error("Failed to load track"))
        }

        audio.addEventListener("canplay", handleCanPlay)
        audio.addEventListener("error", handleError)

        audio.src = track.audioUrl
        audio.load()
      })
    },
    [tracks],
  )

  // Setup audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime)
    }

    const handlePlay = () => {
      setIsPlaying(true)
      setIsLoading(false)
    }

    const handlePause = () => {
      setIsPlaying(false)
    }

    const handleEnded = () => {
      nextTrack()
    }

    const handleWaiting = () => {
      setIsLoading(true)
    }

    const handlePlaying = () => {
      setIsLoading(false)
    }

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0)
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("waiting", handleWaiting)
    audio.addEventListener("playing", handlePlaying)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("waiting", handleWaiting)
      audio.removeEventListener("playing", handlePlaying)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
    }
  }, [])

  // Load initial track
  useEffect(() => {
    if (tracks.length > 0 && currentTrack) {
      loadTrack(currentTrackIndex)
    }
  }, [currentTrackIndex, tracks, loadTrack, currentTrack])

  // Update volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Player controls
  const togglePlay = useCallback(async () => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    try {
      if (isPlaying) {
        audio.pause()
      } else {
        await audio.play()
      }
    } catch (error) {
      console.error("Play failed:", error)
    }
  }, [isPlaying, currentTrack])

  const nextTrack = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length
    setCurrentTrackIndex(nextIndex)
    onTrackChange?.(tracks[nextIndex], nextIndex)
  }, [currentTrackIndex, tracks, onTrackChange])

  const previousTrack = useCallback(() => {
    if (currentTime > 3) {
      // Restart current track if more than 3 seconds in
      const audio = audioRef.current
      if (audio) {
        audio.currentTime = 0
        setCurrentTime(0)
      }
    } else {
      // Go to previous track
      const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1
      setCurrentTrackIndex(prevIndex)
      onTrackChange?.(tracks[prevIndex], prevIndex)
    }
  }, [currentTime, currentTrackIndex, tracks, onTrackChange])

  const seek = useCallback((time: number) => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = time
    setCurrentTime(time)
  }, [])

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || !duration) return

      const rect = progressRef.current.getBoundingClientRect()
      const clickX = e.clientX - rect.left
      const newTime = (clickX / rect.width) * duration
      seek(newTime)
    },
    [duration, seek],
  )

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  if (!currentTrack) return null

  return (
    <Card className={`bg-zinc-900/95 backdrop-blur-sm border-zinc-800 overflow-hidden ${className}`}>
      <CardContent className="p-0">
        {isExpanded ? (
          <div className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Large artwork display for expanded view */}
              <div className="relative w-full lg:w-80 aspect-square rounded-lg overflow-hidden flex-shrink-0">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-zinc-800 animate-pulse flex items-center justify-center">
                    <div className="w-16 h-16 bg-zinc-700 rounded-full animate-pulse" />
                  </div>
                )}
                <Image
                  src={currentTrack.coverArt || "/placeholder.svg?height=320&width=320&query=music album cover"}
                  alt={currentTrack.title}
                  fill
                  className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                  sizes="320px"
                  onLoad={() => setImageLoaded(true)}
                />
              </div>

              {/* Track info and controls */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">{currentTrack.title}</h2>
                  <p className="text-lg text-gray-400 mb-1">{currentTrack.artist}</p>
                  {currentTrack.compilationTitle && (
                    <p className="text-sm text-gray-500">from {currentTrack.compilationTitle}</p>
                  )}
                </div>

                {/* Progress bar */}
                <div className="mb-6">
                  <div
                    ref={progressRef}
                    className="w-full h-2 bg-zinc-700 rounded-full cursor-pointer mb-2"
                    onClick={handleProgressClick}
                  >
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all duration-100"
                      style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button
                    onClick={previousTrack}
                    size="lg"
                    variant="ghost"
                    className="text-white hover:bg-zinc-800 p-3"
                  >
                    <SkipBack className="h-6 w-6" />
                  </Button>

                  <Button
                    onClick={togglePlay}
                    size="lg"
                    className="bg-amber-600 hover:bg-amber-700 text-white rounded-full p-4"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6 ml-0.5" />
                    )}
                  </Button>

                  <Button onClick={nextTrack} size="lg" variant="ghost" className="text-white hover:bg-zinc-800 p-3">
                    <SkipForward className="h-6 w-6" />
                  </Button>
                </div>

                {/* Volume control */}
                <div className="flex items-center gap-3">
                  <Button onClick={toggleMute} size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                    {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                  </Button>
                  <Slider
                    value={[isMuted ? 0 : volume * 100]}
                    onValueChange={(value) => setVolume(value[0] / 100)}
                    max={100}
                    step={1}
                    className="flex-1 max-w-32"
                  />
                  <Button
                    onClick={toggleExpanded}
                    size="sm"
                    variant="ghost"
                    className="text-gray-400 hover:text-white p-2"
                  >
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4">
            {/* Compact artwork display for minimized view */}
            <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
              {!imageLoaded && <div className="absolute inset-0 bg-zinc-800 animate-pulse" />}
              <Image
                src={currentTrack.coverArt || "/placeholder.svg?height=64&width=64&query=music album cover"}
                alt={currentTrack.title}
                fill
                className={`object-cover transition-opacity duration-300 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                sizes="64px"
                onLoad={() => setImageLoaded(true)}
              />
            </div>

            {/* Track info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-white text-sm truncate">{currentTrack.title}</h3>
              <p className="text-gray-400 text-xs truncate">{currentTrack.artist}</p>
              {currentTrack.compilationTitle && (
                <p className="text-gray-500 text-xs truncate">from {currentTrack.compilationTitle}</p>
              )}
            </div>

            {/* Compact controls */}
            <div className="flex items-center gap-2">
              <Button onClick={previousTrack} size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                <SkipBack className="h-4 w-4" />
              </Button>

              <Button
                onClick={togglePlay}
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white rounded-full p-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4 ml-0.5" />
                )}
              </Button>

              <Button onClick={nextTrack} size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                <SkipForward className="h-4 w-4" />
              </Button>

              <Button onClick={toggleExpanded} size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2">
                <Maximize2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Progress bar for compact view */}
        {!isExpanded && (
          <div ref={progressRef} className="w-full h-1 bg-zinc-700 cursor-pointer" onClick={handleProgressClick}>
            <div
              className="h-full bg-amber-500 transition-all duration-100"
              style={{ width: duration ? `${(currentTime / duration) * 100}%` : "0%" }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

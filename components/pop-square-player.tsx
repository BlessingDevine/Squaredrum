"use client"

import { useState, useRef, useEffect } from "react"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Shuffle,
  Repeat,
  Volume2,
  Download,
  Rewind,
  FastForward,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import type { PopSquareTrack } from "@/lib/pop-square-tracks"
import Image from "next/image"

interface PopSquarePlayerProps {
  tracks: PopSquareTrack[]
  onDownloadClick: (trackData: {
    title: string
    artist: string
    downloadUrl: string
    audioUrl: string
    coverArt?: string
  }) => void
}

export default function PopSquarePlayer({ tracks, onDownloadClick }: PopSquarePlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeat, setRepeat] = useState<"none" | "one" | "all">("none")
  const [playHistory, setPlayHistory] = useState<number[]>([])

  const audioRef = useRef<HTMLAudioElement>(null)

  const currentTrack = tracks[currentTrackIndex]

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleLoadStart = () => setIsLoading(true)
    const handleCanPlay = () => setIsLoading(false)
    const handleEnded = () => {
      if (repeat === "one") {
        audio.currentTime = 0
        audio.play()
      } else {
        handleNext()
      }
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("loadstart", handleLoadStart)
    audio.addEventListener("canplay", handleCanPlay)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("loadstart", handleLoadStart)
      audio.removeEventListener("canplay", handleCanPlay)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [repeat])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = volume
  }, [volume])

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio || isLoading) return

    // Optimistic UI update for instant feedback
    const newPlayingState = !isPlaying
    setIsPlaying(newPlayingState)

    if (newPlayingState) {
      // Starting playback
      audio.play().catch((error) => {
        console.error("Playback failed:", error)
        // Revert state if play fails
        setIsPlaying(false)
      })
    } else {
      // Pausing playback
      try {
        audio.pause()
      } catch (error) {
        console.error("Pause failed:", error)
        // Revert state if pause fails
        setIsPlaying(true)
      }
    }
  }

  const handleRewind = () => {
    const audio = audioRef.current
    if (!audio || isLoading) return

    const newTime = Math.max(0, currentTime - 15)
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleForward = () => {
    handleNext()
  }

  const getNextTrackIndex = () => {
    if (shuffle) {
      let nextIndex
      do {
        nextIndex = Math.floor(Math.random() * tracks.length)
      } while (nextIndex === currentTrackIndex && tracks.length > 1)
      return nextIndex
    } else {
      return (currentTrackIndex + 1) % tracks.length
    }
  }

  const getPreviousTrackIndex = () => {
    if (shuffle && playHistory.length > 1) {
      const previousIndex = playHistory[playHistory.length - 2]
      setPlayHistory((prev) => prev.slice(0, -1))
      return previousIndex
    } else {
      return currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1
    }
  }

  const handleNext = () => {
    if (isLoading) return

    // Instant track change for immediate UI response
    const nextIndex = getNextTrackIndex()
    const wasPlaying = isPlaying

    // Update UI immediately
    setCurrentTrackIndex(nextIndex)
    setPlayHistory((prev) => [...prev, nextIndex])
    setCurrentTime(0)

    // Handle end of playlist logic
    if (!shuffle && repeat === "none" && nextIndex === 0 && currentTrackIndex === tracks.length - 1) {
      setIsPlaying(false)
    } else if (wasPlaying) {
      // Continue playing the new track
      setTimeout(() => {
        const audio = audioRef.current
        if (audio && wasPlaying) {
          audio.play().catch(() => {
            setIsPlaying(false)
          })
        }
      }, 100)
    }
  }

  const handlePrevious = () => {
    if (isLoading) return

    // Instant track change for immediate UI response
    const prevIndex = getPreviousTrackIndex()
    const wasPlaying = isPlaying

    // Update UI immediately
    setCurrentTrackIndex(prevIndex)
    setCurrentTime(0)

    // Continue playing if was playing
    if (wasPlaying) {
      setTimeout(() => {
        const audio = audioRef.current
        if (audio && wasPlaying) {
          audio.play().catch(() => {
            setIsPlaying(false)
          })
        }
      }, 100)
    }
  }

  const handleSeek = (value: number[]) => {
    const audio = audioRef.current
    if (!audio) return

    const newTime = (value[0] / 100) * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0] / 100)
  }

  const toggleShuffle = () => {
    setShuffle(!shuffle)
    if (!shuffle) {
      setPlayHistory([currentTrackIndex])
    }
  }

  const toggleRepeat = () => {
    const modes: ("none" | "one" | "all")[] = ["none", "one", "all"]
    const currentIndex = modes.indexOf(repeat)
    setRepeat(modes[(currentIndex + 1) % modes.length])
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleDownload = () => {
    onDownloadClick({
      title: currentTrack.title,
      artist: currentTrack.artist,
      downloadUrl: currentTrack.downloadUrl,
      audioUrl: currentTrack.audioUrl,
      coverArt: currentTrack.coverArt,
    })
  }

  return (
    <div className="bg-gradient-to-br from-pink-900/20 to-purple-900/20 backdrop-blur-sm border border-pink-500/20 rounded-xl p-6">
      <audio ref={audioRef} src={currentTrack.audioUrl} preload="metadata" />

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-cinzel text-xl font-bold text-pink-400 mb-1">POP SQUARE</h3>
          <p className="text-gray-400 text-sm">{tracks.length} tracks • 2025</p>
        </div>
        <Button onClick={handleDownload} size="sm" className="bg-pink-600 hover:bg-pink-700 text-white">
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
      </div>

      {/* Current Track Info */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={currentTrack.coverArt || "/placeholder.svg"}
            alt={currentTrack.title}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-white text-lg truncate">{currentTrack.title}</h4>
          <p className="text-pink-400 text-sm truncate">{currentTrack.artist}</p>
          <p className="text-gray-400 text-xs">{currentTrack.duration}</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <Slider
          value={[duration ? (currentTime / duration) * 100 : 0]}
          onValueChange={handleSeek}
          max={100}
          step={0.1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-1 mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleShuffle}
          className={`text-gray-400 hover:text-white ${shuffle ? "text-pink-400" : ""}`}
          title="Shuffle"
        >
          <Shuffle className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handlePrevious}
          className="text-gray-400 hover:text-white"
          disabled={isLoading}
          title="Previous track"
        >
          <SkipBack className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleRewind}
          className="text-gray-400 hover:text-white"
          disabled={isLoading}
          title="Rewind 15s"
        >
          <Rewind className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="lg"
          onClick={togglePlayPause}
          className="text-white hover:text-pink-400 mx-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="w-6 h-6 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleForward}
          className="text-gray-400 hover:text-white"
          disabled={isLoading}
          title="Next track"
        >
          <FastForward className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleNext}
          className="text-gray-400 hover:text-white"
          disabled={isLoading}
          title="Next track"
        >
          <SkipForward className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={toggleRepeat}
          className={`text-gray-400 hover:text-white ${repeat !== "none" ? "text-pink-400" : ""}`}
          title={`Repeat: ${repeat}`}
        >
          <Repeat className="w-4 h-4" />
          {repeat === "one" && <span className="text-xs ml-1">1</span>}
        </Button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center space-x-2">
        <Volume2 className="w-4 h-4 text-gray-400" />
        <Slider value={[volume * 100]} onValueChange={handleVolumeChange} max={100} step={1} className="flex-1" />
      </div>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Play, Pause, SkipForward, SkipBack } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useGlobalMusic } from "@/components/global-music-player"

interface Track {
  id: number
  title: string
  artist: string
  duration: string
  audioUrl: string
  downloadUrl: string
  coverArt?: string
}

interface EnhancedCompilationPlayerProps {
  compilationId: string
  compilationTitle: string
  tracks: Track[]
  accentColor: string
}

export default function EnhancedCompilationPlayer({
  compilationId,
  compilationTitle,
  tracks,
  accentColor,
}: EnhancedCompilationPlayerProps) {
  const { playTrack, pauseTrack, nextTrack, previousTrack, state } = useGlobalMusic()
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)

  const currentTrack = tracks[currentTrackIndex]
  const isThisCompilationPlaying = state.currentTrack?.compilationId === compilationId && state.isPlaying

  const getAccentColor = (color: string) => {
    const colorMap = {
      orange: "bg-orange-600 hover:bg-orange-700",
      amber: "bg-amber-600 hover:bg-amber-700",
      pink: "bg-pink-600 hover:bg-pink-700",
      purple: "bg-purple-600 hover:bg-purple-700",
      red: "bg-red-600 hover:bg-red-700",
      cyan: "bg-cyan-600 hover:bg-cyan-700",
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.orange
  }

  const buttonColor = getAccentColor(accentColor)

  const handlePlayPause = () => {
    if (!currentTrack) return

    if (isThisCompilationPlaying) {
      pauseTrack()
    } else {
      const trackWithCompilation = {
        ...currentTrack,
        compilationId,
        compilationTitle,
      }

      const playlistWithCompilation = tracks.map((t) => ({
        ...t,
        compilationId,
        compilationTitle,
      }))

      playTrack(trackWithCompilation, playlistWithCompilation)
    }
  }

  const handleNext = () => {
    if (currentTrackIndex < tracks.length - 1) {
      const nextIndex = currentTrackIndex + 1
      setCurrentTrackIndex(nextIndex)
      handlePlayTrack(tracks[nextIndex], nextIndex)
    }
  }

  const handlePrevious = () => {
    if (currentTrackIndex > 0) {
      const prevIndex = currentTrackIndex - 1
      setCurrentTrackIndex(prevIndex)
      handlePlayTrack(tracks[prevIndex], prevIndex)
    }
  }

  const handlePlayTrack = (track: Track, index: number) => {
    setCurrentTrackIndex(index)

    const trackWithCompilation = {
      ...track,
      compilationId,
      compilationTitle,
    }

    const playlistWithCompilation = tracks.map((t) => ({
      ...t,
      compilationId,
      compilationTitle,
    }))

    playTrack(trackWithCompilation, playlistWithCompilation)
  }

  // Sync with global player state
  useEffect(() => {
    if (state.currentTrack?.compilationId === compilationId) {
      const trackIndex = tracks.findIndex((t) => t.id === state.currentTrack?.id)
      if (trackIndex !== -1) {
        setCurrentTrackIndex(trackIndex)
      }
    }
  }, [state.currentTrack, compilationId, tracks])

  return (
    <div className="bg-zinc-900/80 backdrop-blur-sm rounded-lg p-4 border border-zinc-800">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 min-w-0">
          <h4 className="text-white font-medium truncate">{currentTrack?.title || "No Track"}</h4>
          <p className="text-gray-400 text-sm truncate">{currentTrack?.artist || ""}</p>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4 mb-4">
        <Button
          onClick={handlePrevious}
          disabled={currentTrackIndex === 0}
          size="sm"
          variant="ghost"
          className="text-gray-400 hover:text-white disabled:opacity-30"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          onClick={handlePlayPause}
          disabled={!currentTrack}
          className={`${buttonColor} text-white rounded-full p-0 h-12 w-12`}
        >
          {isThisCompilationPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </Button>

        <Button
          onClick={handleNext}
          disabled={currentTrackIndex === tracks.length - 1}
          size="sm"
          variant="ghost"
          className="text-gray-400 hover:text-white disabled:opacity-30"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-center text-sm text-gray-400">
        Track {currentTrackIndex + 1} of {tracks.length}
      </div>
    </div>
  )
}

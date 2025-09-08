"use client"

import { useState, useEffect } from "react"
import { Play, Pause, Download, Clock, Calendar, Music, ChevronDown, ChevronUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { useGlobalMusic } from "@/components/global-music-player"
import { useDownload } from "@/contexts/download-context"
import DownloadFormModal from "@/components/download-form-modal"
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

interface Compilation {
  id: string
  title: string
  artist: string
  releaseDate: string
  genre: string
  description: string
  coverArt: string
  tracks: Track[]
  accentColor: string
}

interface CompilationCardProps {
  compilation: Compilation
  onDownloadClick: (trackData: {
    title: string
    artist: string
    downloadUrl: string
    audioUrl: string
    coverArt?: string
  }) => void
}

export default function CompilationCard({ compilation, onDownloadClick }: CompilationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isLocallyPlaying, setIsLocallyPlaying] = useState(false)
  const [showDownloadForm, setShowDownloadForm] = useState(false)
  const { playTrack, pauseTrack, state } = useGlobalMusic()

  const {
    selectedTracks,
    toggleTrackSelection,
    clearSelections,
    downloadSelected,
    isTrackSelected,
    getCompilationSelections,
    canSelectMore,
    canDownload,
    remainingDownloads,
    maxSelections,
  } = useDownload()

  // Safely handle tracks array
  const tracks = compilation.tracks || []
  const currentTrack = tracks[currentTrackIndex] || null

  const getAccentColors = (color: string) => {
    const colorMap = {
      orange: {
        primary: "text-orange-400",
        bg: "bg-orange-500/10",
        border: "border-orange-500/20",
        button: "bg-orange-600 hover:bg-orange-700",
        gradient: "from-orange-400 to-red-500",
      },
      amber: {
        primary: "text-amber-400",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        button: "bg-amber-600 hover:bg-amber-700",
        gradient: "from-amber-400 to-yellow-500",
      },
      pink: {
        primary: "text-pink-400",
        bg: "bg-pink-500/10",
        border: "border-pink-500/20",
        button: "bg-pink-600 hover:bg-pink-700",
        gradient: "from-pink-400 to-purple-500",
      },
      purple: {
        primary: "text-purple-400",
        bg: "bg-purple-500/10",
        border: "border-purple-500/20",
        button: "bg-purple-600 hover:bg-purple-700",
        gradient: "from-purple-400 to-indigo-500",
      },
      red: {
        primary: "text-red-400",
        bg: "bg-red-500/10",
        border: "border-red-500/20",
        button: "bg-red-600 hover:bg-red-700",
        gradient: "from-red-400 to-pink-500",
      },
      cyan: {
        primary: "text-cyan-400",
        bg: "bg-cyan-500/10",
        border: "border-cyan-500/20",
        button: "bg-cyan-600 hover:bg-cyan-700",
        gradient: "from-cyan-400 to-blue-500",
      },
    }
    return colorMap[color as keyof typeof colorMap] || colorMap.orange
  }

  const colors = getAccentColors(compilation.accentColor)

  const handlePlayPause = () => {
    if (!currentTrack) return

    const isThisCompilationPlaying = state.currentTrack?.compilationId === compilation.id && state.isPlaying

    if (isThisCompilationPlaying) {
      // If this compilation is currently playing, pause it
      pauseTrack()
      setIsLocallyPlaying(false)
    } else {
      // If this compilation is not playing, start playing it
      const trackWithCompilation = {
        ...currentTrack,
        compilationId: compilation.id,
        compilationTitle: compilation.title,
      }

      const playlistWithCompilation = tracks.map((t) => ({
        ...t,
        compilationId: compilation.id,
        compilationTitle: compilation.title,
      }))

      playTrack(trackWithCompilation, playlistWithCompilation)
      setIsLocallyPlaying(true)
    }
  }

  const handlePlayTrack = (track: Track, index: number) => {
    setCurrentTrackIndex(index)

    // Add compilation info to track
    const trackWithCompilation = {
      ...track,
      compilationId: compilation.id,
      compilationTitle: compilation.title,
    }

    // Create playlist with compilation info
    const playlistWithCompilation = tracks.map((t) => ({
      ...t,
      compilationId: compilation.id,
      compilationTitle: compilation.title,
    }))

    playTrack(trackWithCompilation, playlistWithCompilation)
    setIsLocallyPlaying(true)
  }

  const handleDownloadTrack = (track: Track) => {
    onDownloadClick({
      title: track.title,
      artist: track.artist,
      downloadUrl: track.downloadUrl,
      audioUrl: track.audioUrl,
      coverArt: track.coverArt || compilation.coverArt,
    })
  }

  const isThisCompilationPlaying = () => {
    return state.currentTrack?.compilationId === compilation.id && state.isPlaying
  }

  const isCurrentlyPlaying = (track: Track) => {
    return state.currentTrack?.id === track.id && state.isPlaying
  }

  const isCurrentTrack = (track: Track) => {
    return state.currentTrack?.id === track.id
  }

  // Calculate total duration safely
  const totalDuration = tracks.reduce((total, track) => {
    const [minutes, seconds] = track.duration.split(":").map(Number)
    return total + minutes * 60 + seconds
  }, 0)

  const formatTotalDuration = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const handleTrackSelection = (track: Track) => {
    const selectedTrack = {
      id: track.id,
      title: track.title,
      artist: track.artist,
      downloadUrl: track.downloadUrl,
      audioUrl: track.audioUrl,
      coverArt: track.coverArt || compilation.coverArt,
      compilationId: compilation.id,
    }
    toggleTrackSelection(selectedTrack)
  }

  const compilationSelectedTracks = getCompilationSelections(compilation.id)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleFormCompleted = (event: CustomEvent) => {
        const pendingDownload = localStorage.getItem("pendingDownload")
        const downloadInitiator = localStorage.getItem("downloadInitiator")

        // Only open modal if this compilation initiated the download
        if (pendingDownload && downloadInitiator === compilation.id) {
          console.log("[v0] Form completed for compilation:", compilation.id, "opening download modal")
          setShowDownloadForm(true)
          // Clean up the initiator flag
          localStorage.removeItem("downloadInitiator")
        }
      }

      window.addEventListener("omnisend-form-completed", handleFormCompleted as EventListener)

      return () => {
        window.removeEventListener("omnisend-form-completed", handleFormCompleted as EventListener)
      }
    }
  }, [compilation.id])

  return (
    <Card
      className={`bg-zinc-900/50 backdrop-blur-sm border ${colors.border} hover:border-opacity-40 transition-all duration-300 overflow-hidden group`}
    >
      <CardContent className="p-0">
        {/* Mobile-First Layout */}
        <div className="flex flex-col">
          {/* Full-Width Cover Art Section - Mobile Optimized */}
          <div className="relative w-full">
            {/* Mobile: Full square aspect ratio for maximum artwork display */}
            <div className="relative aspect-square sm:aspect-[4/3] lg:aspect-square overflow-hidden">
              {/* Loading placeholder with brand colors */}
              {!imageLoaded && (
                <div className={`absolute inset-0 ${colors.bg} animate-pulse flex items-center justify-center`}>
                  <Music className={`h-16 w-16 sm:h-20 sm:w-20 ${colors.primary} opacity-50`} />
                </div>
              )}

              {/* Full artwork display */}
              <Image
                src={compilation.coverArt || "/placeholder.svg"}
                alt={compilation.title}
                fill
                className={`object-cover transition-all duration-700 ${
                  imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
                } group-hover:scale-105`}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                priority
                onLoad={() => setImageLoaded(true)}
              />

              {/* Enhanced gradient overlay for mobile readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 sm:via-black/20 to-transparent" />

              {/* Genre badge - Mobile positioned */}
              <div className="absolute top-4 left-4 z-10">
                <Badge
                  variant="secondary"
                  className={`${colors.bg} ${colors.primary} border-0 backdrop-blur-md text-xs sm:text-sm font-medium shadow-lg`}
                >
                  {compilation.genre}
                </Badge>
              </div>

              {/* Release date - Mobile positioned */}
              <div className="absolute top-4 right-4 z-10">
                <div className="flex items-center text-white/90 text-xs sm:text-sm bg-black/40 backdrop-blur-md rounded-full px-3 py-1">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                  {compilation.releaseDate.split(" ").slice(0, 2).join(" ")}
                </div>
              </div>

              {/* Play Button Overlay - Enhanced for mobile */}
              {currentTrack && (
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <Button
                    onClick={handlePlayPause}
                    size="lg"
                    className={`${colors.button} text-white rounded-full p-0 shadow-2xl hover:scale-110 transition-all duration-200 h-16 w-16 sm:h-20 sm:w-20 backdrop-blur-sm`}
                  >
                    {isThisCompilationPlaying() ? (
                      <Pause className="h-7 w-7 sm:h-9 sm:w-9" />
                    ) : (
                      <Play className="h-7 w-7 sm:h-9 sm:w-9 ml-0.5" />
                    )}
                  </Button>
                </div>
              )}

              {/* Title overlay on mobile - Bottom positioned for full artwork visibility */}
              <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
                <h2
                  className={`font-cinzel text-xl sm:text-2xl lg:text-3xl font-bold ${colors.primary} mb-1 sm:mb-2 line-clamp-2`}
                >
                  {compilation.title}
                </h2>
                <p className="text-gray-200 text-sm sm:text-base lg:text-lg line-clamp-1 mb-2">{compilation.artist}</p>

                {/* Quick stats on mobile */}
                <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-300">
                  <div className="flex items-center">
                    <Music className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {tracks.length} tracks
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    {formatTotalDuration(totalDuration)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Section - Compact for mobile */}
          <div className="p-4 sm:p-5 lg:p-6">
            {/* Description - Mobile optimized */}
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 line-clamp-3 lg:line-clamp-none">
              {compilation.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              {/* Download Button */}
              <Button
                onClick={downloadSelected}
                disabled={compilationSelectedTracks.length === 0}
                className={`${colors.button} text-white flex-1 h-11 sm:h-12 text-sm sm:text-base font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Download className="h-4 w-4 mr-2" />
                Download ({compilationSelectedTracks.length}/{maxSelections})
              </Button>

              <Button
                onClick={() => setIsExpanded(!isExpanded)}
                variant="outline"
                className="border-zinc-600 text-gray-300 hover:bg-zinc-800 bg-transparent flex-1 sm:flex-initial h-11 sm:h-12 text-sm sm:text-base"
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Hide Tracks</span>
                    <span className="sm:hidden">Hide</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">View Tracks</span>
                    <span className="sm:hidden">Tracks</span>
                  </>
                )}
              </Button>
            </div>

            <div className="mt-3 text-xs sm:text-sm text-gray-400 space-y-1">
              <p>Downloads remaining this month: {remainingDownloads}/2</p>
              {compilationSelectedTracks.length > 0 && (
                <p>
                  Selected: {compilationSelectedTracks.length}/{maxSelections} tracks
                </p>
              )}
              {!canSelectMore && <p className="text-amber-400">Maximum selection reached</p>}
              {remainingDownloads === 0 && <p className="text-red-400">Monthly download limit reached</p>}
            </div>
          </div>

          {/* Expanded Track List - Mobile optimized */}
          {isExpanded && tracks.length > 0 && (
            <div className="border-t border-zinc-800">
              <div className="p-4 sm:p-5 lg:p-6">
                <h3 className="font-semibold text-white mb-3 sm:mb-4 flex items-center text-sm sm:text-base">
                  <Music className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Track List
                </h3>

                <div className="space-y-1 sm:space-y-2 max-h-80 sm:max-h-96 overflow-y-auto">
                  {tracks.map((track, index) => (
                    <div
                      key={track.id}
                      className={`flex items-center gap-3 sm:gap-4 p-2 sm:p-3 rounded-lg transition-all duration-200 ${
                        isCurrentTrack(track) ? `${colors.bg} border ${colors.border}` : "hover:bg-zinc-800/50"
                      }`}
                    >
                      <Checkbox
                        checked={isTrackSelected(track.id, compilation.id)}
                        onCheckedChange={() => handleTrackSelection(track)}
                        disabled={!canSelectMore && !isTrackSelected(track.id, compilation.id)}
                        className="flex-shrink-0"
                      />

                      {/* Track Number / Play Button */}
                      <div className="w-6 sm:w-8 flex items-center justify-center flex-shrink-0">
                        {isCurrentlyPlaying(track) ? (
                          <div className="flex items-center space-x-0.5">
                            <div
                              className={`w-0.5 sm:w-1 h-2 sm:h-3 ${colors.primary.replace("text-", "bg-")} animate-pulse`}
                            ></div>
                            <div
                              className={`w-0.5 sm:w-1 h-1.5 sm:h-2 ${colors.primary.replace("text-", "bg-")} animate-pulse delay-75`}
                            ></div>
                            <div
                              className={`w-0.5 sm:w-1 h-2 sm:h-3 ${colors.primary.replace("text-", "bg-")} animate-pulse delay-150`}
                            ></div>
                          </div>
                        ) : (
                          <Button
                            onClick={() => handlePlayTrack(track, index)}
                            size="sm"
                            variant="ghost"
                            className="p-0 h-6 w-6 sm:h-8 sm:w-8 text-gray-400 hover:text-white"
                          >
                            <Play className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                          </Button>
                        )}
                      </div>

                      {/* Track Info */}
                      <div className="flex-1 min-w-0">
                        <h4
                          className={`font-medium truncate text-sm sm:text-base ${isCurrentTrack(track) ? colors.primary : "text-white"}`}
                        >
                          {track.title}
                        </h4>
                        <p className="text-gray-400 text-xs sm:text-sm truncate">{track.artist}</p>
                      </div>

                      {/* Duration */}
                      <div className="text-gray-400 text-xs sm:text-sm whitespace-nowrap">{track.duration}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {tracks.length === 0 && (
            <div className="p-6 text-center text-gray-400">
              <Music className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base">No tracks available for this compilation.</p>
            </div>
          )}
        </div>
      </CardContent>

      <DownloadFormModal isOpen={showDownloadForm} onClose={() => setShowDownloadForm(false)} />
    </Card>
  )
}

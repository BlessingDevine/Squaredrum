"use client"

import type React from "react"
import { safeBlobUrl } from "@/lib/audio-url-utils"

import { createContext, useContext, useRef, useCallback, useEffect, useState } from "react"

interface Track {
  id: number
  title: string
  artist: string
  duration: string
  audioUrl: string
  downloadUrl: string
  coverArt?: string
}

interface PlayerState {
  currentTrack: number
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isCrossfading: boolean
  isLoading: boolean
}

interface MusicPlayerEngine {
  // Player state
  playerState: PlayerState

  // Player controls
  play: () => Promise<void>
  pause: () => void
  seek: (time: number) => void
  setVolume: (volume: number) => void

  // Track navigation
  nextTrack: () => void
  previousTrack: () => void
  selectTrack: (index: number) => void

  // Playlist management
  loadPlaylist: (tracks: Track[], startIndex?: number) => void

  // Events
  onStateChange: (callback: (state: PlayerState) => void) => () => void
  onTrackChange: (callback: (track: Track | null) => void) => () => void
}

const MusicPlayerContext = createContext<MusicPlayerEngine | null>(null)

export function useMusicPlayer(): MusicPlayerEngine {
  const context = useContext(MusicPlayerContext)
  if (!context) {
    throw new Error("useMusicPlayer must be used within MusicPlayerProvider")
  }
  return context
}

interface MusicPlayerProviderProps {
  children: React.ReactNode
  playerId: string
}

export function MusicPlayerProvider({ children, playerId }: MusicPlayerProviderProps) {
  // Audio elements
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Player state
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentTrack: 0,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isCrossfading: false,
    isLoading: false,
  })

  // Playlist and tracks
  const [tracks, setTracks] = useState<Track[]>([])
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0)
  const isInitializedRef = useRef(false)

  // Crossfade state
  const crossfadeStateRef = useRef({
    isActive: false,
    startTime: 0,
    duration: 4000, // 4 seconds
    animationId: null as number | null,
  })

  // Event callbacks
  const stateCallbacksRef = useRef<Set<(state: PlayerState) => void>>(new Set())
  const trackCallbacksRef = useRef<Set<(track: Track | null) => void>>(new Set())

  // Initialize audio elements
  useEffect(() => {
    if (typeof window === "undefined" || isInitializedRef.current) return

    console.log(`[${playerId}] Initializing audio element`)

    // Create audio element
    const audio = new Audio()
    audio.preload = "metadata"
    audio.crossOrigin = "anonymous"
    audio.volume = 1

    // iOS optimizations
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      audio.playsInline = true
      audio.setAttribute("webkit-playsinline", "true")
      audio.setAttribute("playsinline", "true")
    }

    audioRef.current = audio
    isInitializedRef.current = true

    console.log(`[${playerId}] Audio element initialized`)

    return () => {
      console.log(`[${playerId}] Cleaning up audio element`)
      audio.pause()
      audio.src = ""
      if (crossfadeStateRef.current.animationId) {
        cancelAnimationFrame(crossfadeStateRef.current.animationId)
      }
    }
  }, [playerId])

  // Update state and notify callbacks
  const updateState = useCallback(
    (updates: Partial<PlayerState>) => {
      setPlayerState((prev) => {
        const newState = { ...prev, ...updates }
        console.log(`[${playerId}] State update:`, updates)
        stateCallbacksRef.current.forEach((callback) => callback(newState))
        return newState
      })
    },
    [playerId],
  )

  // Notify track change
  const notifyTrackChange = useCallback(
    (track: Track | null) => {
      console.log(`[${playerId}] Track change:`, track?.title || "null")
      trackCallbacksRef.current.forEach((callback) => callback(track))
    },
    [playerId],
  )

  // Load track into audio element
  const loadTrack = useCallback(
    async (trackIndex: number) => {
      const audio = audioRef.current
      const track = tracks[trackIndex]

      if (!audio || !track) return

      updateState({ isLoading: true })

      return new Promise<void>((resolve, reject) => {
        const handleCanPlay = () => {
          audio.removeEventListener("canplay", handleCanPlay)
          audio.removeEventListener("error", handleError)
          updateState({
            isLoading: false,
            duration: audio.duration || 0,
            currentTrack: trackIndex,
          })
          resolve()
        }

        const handleError = (e: Event) => {
          console.error("Audio load error", {
            url: safeBlobUrl(track.audioUrl),
            event: e,
          })
          audio.removeEventListener("canplay", handleCanPlay)
          audio.removeEventListener("error", handleError)
          updateState({ isLoading: false })
          reject(new Error("Failed to load track"))
        }

        audio.addEventListener("canplay", handleCanPlay)
        audio.addEventListener("error", handleError)

        audio.src = safeBlobUrl(track.audioUrl)
        audio.load()
      })
    },
    [tracks, updateState, playerId],
  )

  // Start crossfade transition
  const startCrossfade = useCallback(async () => {
    const audio = audioRef.current
    const trackList = tracks

    if (!audio || !trackList.length) return
    if (crossfadeStateRef.current.isActive) return
    if (playerState.currentTrack >= trackList.length - 1) return

    const nextTrack = trackList[playerState.currentTrack + 1]
    if (!nextTrack) return

    console.log(`[${playerId}] Starting crossfade to:`, nextTrack.title)

    try {
      // Load next track
      await loadTrack(playerState.currentTrack + 1)

      // Start crossfade
      crossfadeStateRef.current.isActive = true
      crossfadeStateRef.current.startTime = performance.now()

      updateState({ isCrossfading: true })

      // Start next track
      audio.currentTime = 0
      audio.volume = 0
      await audio.play()

      // Crossfade animation
      const animate = (timestamp: number) => {
        const elapsed = timestamp - crossfadeStateRef.current.startTime
        const progress = Math.min(elapsed / crossfadeStateRef.current.duration, 1)

        if (progress >= 1) {
          // Crossfade complete
          completeCrossfade()
        } else {
          // Continue fading
          const mainVolume = (1 - progress) * playerState.volume
          const crossfadeVolume = progress * playerState.volume

          audio.volume = Math.max(0, mainVolume)

          crossfadeStateRef.current.animationId = requestAnimationFrame(animate)
        }
      }

      crossfadeStateRef.current.animationId = requestAnimationFrame(animate)
    } catch (error) {
      console.error(`[${playerId}] Crossfade failed:`, error)
      crossfadeStateRef.current.isActive = false
      updateState({ isCrossfading: false })
    }
  }, [playerState.currentTrack, playerState.volume, updateState, loadTrack, playerId])

  // Complete crossfade transition
  const completeCrossfade = useCallback(() => {
    const audio = audioRef.current

    if (!audio) return

    console.log(`[${playerId}] Completing crossfade`)

    // Get current position from audio
    const currentPosition = audio.currentTime

    // Update state
    const newTrackIndex = playerState.currentTrack + 1
    const newTrack = tracks[newTrackIndex]

    crossfadeStateRef.current.isActive = false
    if (crossfadeStateRef.current.animationId) {
      cancelAnimationFrame(crossfadeStateRef.current.animationId)
      crossfadeStateRef.current.animationId = null
    }

    updateState({
      currentTrack: newTrackIndex,
      currentTime: currentPosition,
      isCrossfading: false,
    })

    notifyTrackChange(newTrack)
  }, [playerState.currentTrack, playerState.volume, updateState, notifyTrackChange, tracks, playerId])

  // Setup audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !isInitializedRef.current) return

    console.log(`[${playerId}] Setting up audio event listeners`)

    const handleTimeUpdate = () => {
      if (!crossfadeStateRef.current.isActive) {
        const currentTime = audio.currentTime
        updateState({ currentTime })

        // Check for crossfade trigger
        const duration = audio.duration
        if (duration && currentTime > 0 && playerState.isPlaying) {
          const timeRemaining = duration - currentTime
          if (timeRemaining <= 4 && timeRemaining > 3.9 && !crossfadeStateRef.current.isActive) {
            startCrossfade()
          }
        }
      }
    }

    const handleLoadedMetadata = () => {
      console.log(`[${playerId}] Audio metadata loaded, duration:`, audio.duration)
      updateState({
        duration: audio.duration || 0,
        isLoading: false,
      })
    }

    const handlePlay = () => {
      console.log(`[${playerId}] Audio play event`)
      updateState({ isPlaying: true, isLoading: false })
    }

    const handlePause = () => {
      console.log(`[${playerId}] Audio pause event`)
      updateState({ isPlaying: false })
    }

    const handleWaiting = () => {
      console.log(`[${playerId}] Audio waiting`)
      updateState({ isLoading: true })
    }

    const handlePlaying = () => {
      console.log(`[${playerId}] Audio playing`)
      updateState({ isLoading: false })
    }

    const handleEnded = () => {
      console.log(`[${playerId}] Audio ended`)
      if (!crossfadeStateRef.current.isActive) {
        // Move to next track if available
        if (playerState.currentTrack < tracks.length - 1) {
          selectTrack(playerState.currentTrack + 1)
        } else {
          updateState({ isPlaying: false, currentTime: 0 })
        }
      }
    }

    const handleError = (e: Event) => {
      console.error(`[${playerId}] Audio error:`, e)
      updateState({ isLoading: false, isPlaying: false })
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("waiting", handleWaiting)
    audio.addEventListener("playing", handlePlaying)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)

    return () => {
      console.log(`[${playerId}] Removing audio event listeners`)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("waiting", handleWaiting)
      audio.removeEventListener("playing", handlePlaying)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
    }
  }, [playerState.currentTrack, playerState.isPlaying, updateState, startCrossfade, tracks, playerId])

  // Player controls
  const play = useCallback(async (): Promise<void> => {
    const audio = audioRef.current
    const track = tracks[currentTrackIndex]
    if (!audio || !track) {
      console.error(`[${playerId}] Cannot play: missing audio or track`)
      return
    }

    console.log(`[${playerId}] Play requested for:`, track.title)

    try {
      updateState({ isLoading: true })

      // Ensure audio is loaded
      if (audio.readyState < 2) {
        console.log(`[${playerId}] Audio not ready, loading...`)
        await loadTrack(currentTrackIndex)
      }

      await audio.play()
      console.log(`[${playerId}] Play successful`)
    } catch (error) {
      console.error(`[${playerId}] Play failed:`, error)
      updateState({ isLoading: false, isPlaying: false })
      throw error
    }
  }, [updateState, loadTrack, tracks, currentTrackIndex, playerId])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    console.log(`[${playerId}] Pause requested`)
    audio.pause()
  }, [playerId])

  const seek = useCallback(
    (time: number) => {
      const audio = audioRef.current
      if (!audio) return

      console.log(`[${playerId}] Seek to:`, time)
      audio.currentTime = time
      updateState({ currentTime: time })

      // Reset crossfade if seeking
      if (crossfadeStateRef.current.isActive) {
        audio.volume = playerState.volume
        crossfadeStateRef.current.isActive = false
        if (crossfadeStateRef.current.animationId) {
          cancelAnimationFrame(crossfadeStateRef.current.animationId)
          crossfadeStateRef.current.animationId = null
        }
        updateState({ isCrossfading: false })
      }
    },
    [playerState.volume, updateState, playerId],
  )

  const setVolume = useCallback(
    (volume: number) => {
      const audio = audioRef.current
      if (!audio) return

      console.log(`[${playerId}] Set volume:`, volume)
      if (!crossfadeStateRef.current.isActive) {
        audio.volume = volume
      }
      updateState({ volume })
    },
    [updateState, playerId],
  )

  const selectTrack = useCallback(
    async (index: number) => {
      const track = tracks[index]
      if (!track) {
        console.error(`[${playerId}] Invalid track index:`, index)
        return
      }

      const audio = audioRef.current
      if (!audio) return

      console.log(`[${playerId}] Select track:`, index, track.title)

      // Stop any ongoing crossfade
      if (crossfadeStateRef.current.isActive) {
        audio.volume = playerState.volume
        crossfadeStateRef.current.isActive = false
        if (crossfadeStateRef.current.animationId) {
          cancelAnimationFrame(crossfadeStateRef.current.animationId)
          crossfadeStateRef.current.animationId = null
        }
      }

      const wasPlaying = playerState.isPlaying

      try {
        updateState({
          isLoading: true,
          currentTrack: index,
          currentTime: 0,
          isCrossfading: false,
        })

        // Load new track
        await loadTrack(index)
        setCurrentTrackIndex(index)
        notifyTrackChange(track)

        // Resume playback if was playing
        if (wasPlaying) {
          await audio.play()
        }
      } catch (error) {
        console.error(`[${playerId}] Track selection failed:`, error)
        updateState({ isLoading: false })
      }
    },
    [playerState.isPlaying, playerState.volume, updateState, loadTrack, notifyTrackChange, tracks, playerId],
  )

  const nextTrack = useCallback(() => {
    if (playerState.currentTrack < tracks.length - 1) {
      selectTrack(playerState.currentTrack + 1)
    }
  }, [playerState.currentTrack, selectTrack, tracks])

  const previousTrack = useCallback(() => {
    if (playerState.currentTime > 3) {
      seek(0)
    } else if (playerState.currentTrack > 0) {
      selectTrack(playerState.currentTrack - 1)
    } else {
      selectTrack(tracks.length - 1)
    }
  }, [playerState.currentTrack, playerState.currentTime, selectTrack, seek, tracks])

  const loadPlaylist = useCallback(
    async (newTracks: Track[], startIndex = 0) => {
      console.log(`[${playerId}] Load playlist:`, newTracks.length, "tracks, start at:", startIndex)
      setTracks(newTracks)
      if (newTracks[startIndex]) {
        await selectTrack(startIndex)
      }
    },
    [selectTrack, playerId],
  )

  // Event subscription
  const onStateChange = useCallback((callback: (state: PlayerState) => void) => {
    stateCallbacksRef.current.add(callback)
    return () => {
      stateCallbacksRef.current.delete(callback)
    }
  }, [])

  const onTrackChange = useCallback((callback: (track: Track | null) => void) => {
    trackCallbacksRef.current.add(callback)
    return () => {
      trackCallbacksRef.current.delete(callback)
    }
  }, [])

  const engine: MusicPlayerEngine = {
    playerState,
    play,
    pause,
    seek,
    setVolume,
    nextTrack,
    previousTrack,
    selectTrack,
    loadPlaylist,
    onStateChange,
    onTrackChange,
  }

  return <MusicPlayerContext.Provider value={engine}>{children}</MusicPlayerContext.Provider>
}

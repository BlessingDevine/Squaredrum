"use client"

import type React from "react"

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
  const mainAudioRef = useRef<HTMLAudioElement | null>(null)
  const crossfadeAudioRef = useRef<HTMLAudioElement | null>(null)

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
  const tracksRef = useRef<Track[]>([])
  const currentTrackRef = useRef<Track | null>(null)
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

    console.log(`[${playerId}] Initializing audio elements`)

    // Create main audio element
    const mainAudio = new Audio()
    mainAudio.preload = "metadata"
    mainAudio.crossOrigin = "anonymous"
    mainAudio.volume = 1

    // Create crossfade audio element
    const crossfadeAudio = new Audio()
    crossfadeAudio.preload = "metadata"
    crossfadeAudio.crossOrigin = "anonymous"
    crossfadeAudio.volume = 0

    // iOS optimizations
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      mainAudio.playsInline = true
      crossfadeAudio.playsInline = true
      mainAudio.setAttribute("webkit-playsinline", "true")
      crossfadeAudio.setAttribute("webkit-playsinline", "true")
      mainAudio.setAttribute("playsinline", "true")
      crossfadeAudio.setAttribute("playsinline", "true")
    }

    mainAudioRef.current = mainAudio
    crossfadeAudioRef.current = crossfadeAudio
    isInitializedRef.current = true

    console.log(`[${playerId}] Audio elements initialized`)

    return () => {
      console.log(`[${playerId}] Cleaning up audio elements`)
      mainAudio.pause()
      crossfadeAudio.pause()
      mainAudio.src = ""
      crossfadeAudio.src = ""
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
    async (track: Track, audioElement: HTMLAudioElement): Promise<void> => {
      console.log(`[${playerId}] Loading track:`, track.title)

      return new Promise((resolve, reject) => {
        let resolved = false

        const handleCanPlay = () => {
          if (!resolved) {
            resolved = true
            cleanup()
            console.log(`[${playerId}] Track loaded successfully:`, track.title)
            resolve()
          }
        }

        const handleLoadedMetadata = () => {
          if (!resolved && audioElement.readyState >= 2) {
            resolved = true
            cleanup()
            console.log(`[${playerId}] Track metadata loaded:`, track.title)
            resolve()
          }
        }

        const handleError = (e: Event) => {
          if (!resolved) {
            resolved = true
            cleanup()
            console.error(`[${playerId}] Track load error:`, track.title, e)
            reject(new Error("Failed to load track"))
          }
        }

        const handleTimeout = () => {
          if (!resolved) {
            resolved = true
            cleanup()
            console.error(`[${playerId}] Track load timeout:`, track.title)
            reject(new Error("Timeout loading track"))
          }
        }

        const cleanup = () => {
          audioElement.removeEventListener("canplay", handleCanPlay)
          audioElement.removeEventListener("loadedmetadata", handleLoadedMetadata)
          audioElement.removeEventListener("error", handleError)
          audioElement.removeEventListener("abort", handleError)
          clearTimeout(timeoutId)
        }

        audioElement.addEventListener("canplay", handleCanPlay)
        audioElement.addEventListener("loadedmetadata", handleLoadedMetadata)
        audioElement.addEventListener("error", handleError)
        audioElement.addEventListener("abort", handleError)

        const timeoutId = setTimeout(handleTimeout, 10000) // 10 second timeout

        audioElement.src = track.audioUrl
        audioElement.load()
      })
    },
    [playerId],
  )

  // Start crossfade transition
  const startCrossfade = useCallback(async () => {
    const mainAudio = mainAudioRef.current
    const crossfadeAudio = crossfadeAudioRef.current
    const tracks = tracksRef.current

    if (!mainAudio || !crossfadeAudio || !tracks.length) return
    if (crossfadeStateRef.current.isActive) return
    if (playerState.currentTrack >= tracks.length - 1) return

    const nextTrack = tracks[playerState.currentTrack + 1]
    if (!nextTrack) return

    console.log(`[${playerId}] Starting crossfade to:`, nextTrack.title)

    try {
      // Load next track
      await loadTrack(nextTrack, crossfadeAudio)

      // Start crossfade
      crossfadeStateRef.current.isActive = true
      crossfadeStateRef.current.startTime = performance.now()

      updateState({ isCrossfading: true })

      // Start next track
      crossfadeAudio.currentTime = 0
      crossfadeAudio.volume = 0
      await crossfadeAudio.play()

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

          mainAudio.volume = Math.max(0, mainVolume)
          crossfadeAudio.volume = Math.min(1, crossfadeVolume)

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
    const mainAudio = mainAudioRef.current
    const crossfadeAudio = crossfadeAudioRef.current

    if (!mainAudio || !crossfadeAudio) return

    console.log(`[${playerId}] Completing crossfade`)

    // Get current position from crossfade audio
    const currentPosition = crossfadeAudio.currentTime

    // Swap audio sources
    const tempSrc = mainAudio.src
    mainAudio.src = crossfadeAudio.src
    mainAudio.currentTime = currentPosition
    mainAudio.volume = playerState.volume

    // Reset crossfade audio
    crossfadeAudio.src = tempSrc
    crossfadeAudio.volume = 0
    crossfadeAudio.pause()
    crossfadeAudio.currentTime = 0

    // Update state
    const newTrackIndex = playerState.currentTrack + 1
    const newTrack = tracksRef.current[newTrackIndex]

    crossfadeStateRef.current.isActive = false
    if (crossfadeStateRef.current.animationId) {
      cancelAnimationFrame(crossfadeStateRef.current.animationId)
      crossfadeStateRef.current.animationId = null
    }

    currentTrackRef.current = newTrack

    updateState({
      currentTrack: newTrackIndex,
      currentTime: currentPosition,
      isCrossfading: false,
    })

    notifyTrackChange(newTrack)
  }, [playerState.currentTrack, playerState.volume, updateState, notifyTrackChange, playerId])

  // Setup main audio event listeners
  useEffect(() => {
    const mainAudio = mainAudioRef.current
    if (!mainAudio || !isInitializedRef.current) return

    console.log(`[${playerId}] Setting up audio event listeners`)

    const handleTimeUpdate = () => {
      if (!crossfadeStateRef.current.isActive) {
        const currentTime = mainAudio.currentTime
        updateState({ currentTime })

        // Check for crossfade trigger
        const duration = mainAudio.duration
        if (duration && currentTime > 0 && playerState.isPlaying) {
          const timeRemaining = duration - currentTime
          if (timeRemaining <= 4 && timeRemaining > 3.9 && !crossfadeStateRef.current.isActive) {
            startCrossfade()
          }
        }
      }
    }

    const handleLoadedMetadata = () => {
      console.log(`[${playerId}] Audio metadata loaded, duration:`, mainAudio.duration)
      updateState({
        duration: mainAudio.duration || 0,
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
        if (playerState.currentTrack < tracksRef.current.length - 1) {
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

    mainAudio.addEventListener("timeupdate", handleTimeUpdate)
    mainAudio.addEventListener("loadedmetadata", handleLoadedMetadata)
    mainAudio.addEventListener("play", handlePlay)
    mainAudio.addEventListener("pause", handlePause)
    mainAudio.addEventListener("waiting", handleWaiting)
    mainAudio.addEventListener("playing", handlePlaying)
    mainAudio.addEventListener("ended", handleEnded)
    mainAudio.addEventListener("error", handleError)

    return () => {
      console.log(`[${playerId}] Removing audio event listeners`)
      mainAudio.removeEventListener("timeupdate", handleTimeUpdate)
      mainAudio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      mainAudio.removeEventListener("play", handlePlay)
      mainAudio.removeEventListener("pause", handlePause)
      mainAudio.removeEventListener("waiting", handleWaiting)
      mainAudio.removeEventListener("playing", handlePlaying)
      mainAudio.removeEventListener("ended", handleEnded)
      mainAudio.removeEventListener("error", handleError)
    }
  }, [playerState.currentTrack, playerState.isPlaying, updateState, startCrossfade, playerId])

  // Player controls
  const play = useCallback(async (): Promise<void> => {
    const mainAudio = mainAudioRef.current
    if (!mainAudio || !currentTrackRef.current) {
      console.error(`[${playerId}] Cannot play: missing audio or track`)
      return
    }

    console.log(`[${playerId}] Play requested for:`, currentTrackRef.current.title)

    try {
      updateState({ isLoading: true })

      // Ensure audio is loaded
      if (mainAudio.readyState < 2) {
        console.log(`[${playerId}] Audio not ready, loading...`)
        await loadTrack(currentTrackRef.current, mainAudio)
      }

      await mainAudio.play()
      console.log(`[${playerId}] Play successful`)
    } catch (error) {
      console.error(`[${playerId}] Play failed:`, error)
      updateState({ isLoading: false, isPlaying: false })
      throw error
    }
  }, [updateState, loadTrack, playerId])

  const pause = useCallback(() => {
    const mainAudio = mainAudioRef.current
    if (!mainAudio) return

    console.log(`[${playerId}] Pause requested`)
    mainAudio.pause()
  }, [playerId])

  const seek = useCallback(
    (time: number) => {
      const mainAudio = mainAudioRef.current
      if (!mainAudio) return

      console.log(`[${playerId}] Seek to:`, time)
      mainAudio.currentTime = time
      updateState({ currentTime: time })

      // Reset crossfade if seeking
      if (crossfadeStateRef.current.isActive) {
        const crossfadeAudio = crossfadeAudioRef.current
        if (crossfadeAudio) {
          crossfadeAudio.pause()
          crossfadeAudio.volume = 0
        }
        mainAudio.volume = playerState.volume
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
      const mainAudio = mainAudioRef.current
      if (!mainAudio) return

      console.log(`[${playerId}] Set volume:`, volume)
      if (!crossfadeStateRef.current.isActive) {
        mainAudio.volume = volume
      }
      updateState({ volume })
    },
    [updateState, playerId],
  )

  const selectTrack = useCallback(
    async (index: number) => {
      const tracks = tracksRef.current
      if (!tracks[index]) {
        console.error(`[${playerId}] Invalid track index:`, index)
        return
      }

      const mainAudio = mainAudioRef.current
      const crossfadeAudio = crossfadeAudioRef.current
      if (!mainAudio || !crossfadeAudio) return

      console.log(`[${playerId}] Select track:`, index, tracks[index].title)

      // Stop any ongoing crossfade
      if (crossfadeStateRef.current.isActive) {
        crossfadeAudio.pause()
        crossfadeAudio.volume = 0
        mainAudio.volume = playerState.volume
        crossfadeStateRef.current.isActive = false
        if (crossfadeStateRef.current.animationId) {
          cancelAnimationFrame(crossfadeStateRef.current.animationId)
          crossfadeStateRef.current.animationId = null
        }
      }

      const track = tracks[index]
      const wasPlaying = playerState.isPlaying

      try {
        updateState({
          isLoading: true,
          currentTrack: index,
          currentTime: 0,
          isCrossfading: false,
        })

        // Load new track
        await loadTrack(track, mainAudio)
        currentTrackRef.current = track
        notifyTrackChange(track)

        // Resume playback if was playing
        if (wasPlaying) {
          await mainAudio.play()
        }
      } catch (error) {
        console.error(`[${playerId}] Track selection failed:`, error)
        updateState({ isLoading: false })
      }
    },
    [playerState.isPlaying, playerState.volume, updateState, loadTrack, notifyTrackChange, playerId],
  )

  const nextTrack = useCallback(() => {
    const tracks = tracksRef.current
    if (playerState.currentTrack < tracks.length - 1) {
      selectTrack(playerState.currentTrack + 1)
    }
  }, [playerState.currentTrack, selectTrack])

  const previousTrack = useCallback(() => {
    const tracks = tracksRef.current
    if (playerState.currentTime > 3) {
      seek(0)
    } else if (playerState.currentTrack > 0) {
      selectTrack(playerState.currentTrack - 1)
    } else {
      selectTrack(tracks.length - 1)
    }
  }, [playerState.currentTrack, playerState.currentTime, selectTrack, seek])

  const loadPlaylist = useCallback(
    async (tracks: Track[], startIndex = 0) => {
      console.log(`[${playerId}] Load playlist:`, tracks.length, "tracks, start at:", startIndex)
      tracksRef.current = tracks
      if (tracks[startIndex]) {
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

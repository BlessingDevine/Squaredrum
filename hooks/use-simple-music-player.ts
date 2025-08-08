"use client"

import { useState, useRef, useEffect, useCallback } from "react"

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
  currentTrackIndex: number
  volume: number
}

export function useSimpleMusicPlayer(tracks: Track[]) {
  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    isLoading: false,
    isCrossfading: false,
    currentTrackIndex: 0,
    volume: 1,
  })

  const primaryAudioRef = useRef<HTMLAudioElement | null>(null)
  const crossfadeAudioRef = useRef<HTMLAudioElement | null>(null)
  const crossfadeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isCrossfadingRef = useRef(false)

  // Initialize audio elements
  useEffect(() => {
    if (typeof window === "undefined") return

    // Create primary audio element
    const primaryAudio = new Audio()
    primaryAudio.preload = "metadata"
    primaryAudio.crossOrigin = "anonymous"
    primaryAudio.volume = state.volume

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
    }
  }, [state.volume])

  // Crossfade implementation
  const startCrossfade = useCallback(() => {
    const primaryAudio = primaryAudioRef.current
    const crossfadeAudio = crossfadeAudioRef.current

    if (!primaryAudio || !crossfadeAudio || isCrossfadingRef.current || tracks.length <= 1) {
      return
    }

    const nextIndex = (state.currentTrackIndex + 1) % tracks.length
    const nextTrack = tracks[nextIndex]

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
              primaryAudio.volume = Math.max(0, (1 - progress) * state.volume)
              crossfadeAudio.volume = Math.min(state.volume, progress * state.volume)
            }

            if (step >= steps) {
              clearInterval(fadeInterval)

              // Complete crossfade
              try {
                const currentTime = crossfadeAudio.currentTime

                primaryAudio.pause()
                primaryAudio.src = nextTrack.audioUrl
                primaryAudio.currentTime = currentTime
                primaryAudio.volume = state.volume

                crossfadeAudio.pause()
                crossfadeAudio.volume = 0
                crossfadeAudio.currentTime = 0

                primaryAudio.play().catch(console.error)

                setState((prev) => ({
                  ...prev,
                  currentTrack: nextTrack,
                  currentTrackIndex: nextIndex,
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
  }, [state.currentTrackIndex, state.volume, tracks])

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
            tracks.length > 1
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
  }, [state.isPlaying, tracks.length, startCrossfade])

  // Player controls
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

  const selectTrack = useCallback(
    async (trackIndex: number, shouldPlay = true) => {
      const primaryAudio = primaryAudioRef.current
      if (!primaryAudio || trackIndex < 0 || trackIndex >= tracks.length) return

      const track = tracks[trackIndex]

      try {
        // Stop any ongoing crossfade
        if (isCrossfadingRef.current) {
          const crossfadeAudio = crossfadeAudioRef.current
          if (crossfadeAudio) {
            crossfadeAudio.pause()
            crossfadeAudio.volume = 0
          }
          primaryAudio.volume = state.volume
          isCrossfadingRef.current = false
        }

        setState((prev) => ({
          ...prev,
          currentTrack: track,
          currentTrackIndex: trackIndex,
          isLoading: true,
          isCrossfading: false,
        }))

        primaryAudio.src = track.audioUrl
        primaryAudio.load()

        if (shouldPlay) {
          const playPromise = primaryAudio.play()
          if (playPromise !== undefined) {
            await playPromise
          }
        }
      } catch (error) {
        console.error("Select track failed:", error)
        setState((prev) => ({ ...prev, isLoading: false }))
      }
    },
    [tracks, state.volume],
  )

  const nextTrack = useCallback(() => {
    if (tracks.length === 0) return

    const nextIndex = (state.currentTrackIndex + 1) % tracks.length
    selectTrack(nextIndex, state.isPlaying)
  }, [tracks.length, state.currentTrackIndex, state.isPlaying, selectTrack])

  const previousTrack = useCallback(() => {
    if (tracks.length === 0) return

    if (state.currentTime > 3) {
      // Restart current track if more than 3 seconds in
      const primaryAudio = primaryAudioRef.current
      if (primaryAudio) {
        primaryAudio.currentTime = 0
        setState((prev) => ({ ...prev, currentTime: 0 }))
      }
    } else {
      // Go to previous track
      const prevIndex = state.currentTrackIndex === 0 ? tracks.length - 1 : state.currentTrackIndex - 1
      selectTrack(prevIndex, state.isPlaying)
    }
  }, [tracks.length, state.currentTrackIndex, state.currentTime, state.isPlaying, selectTrack])

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

  const setVolume = useCallback((volume: number) => {
    const primaryAudio = primaryAudioRef.current
    if (!primaryAudio) return

    const clampedVolume = Math.max(0, Math.min(1, volume))
    primaryAudio.volume = clampedVolume
    setState((prev) => ({ ...prev, volume: clampedVolume }))
  }, [])

  return {
    state,
    currentTrack: state.currentTrack,
    togglePlay,
    selectTrack,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
  }
}

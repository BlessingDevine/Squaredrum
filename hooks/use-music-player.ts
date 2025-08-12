"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { safeBlobUrl } from "@/lib/audio-url-utils"

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
  currentTrackIndex: number
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  isLoading: boolean
  isCrossfading: boolean
}

export function useMusicPlayer(tracks: Track[], playerId: string) {
  const [state, setState] = useState<PlayerState>({
    currentTrackIndex: 0,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    isLoading: false,
    isCrossfading: false,
  })

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const nextAudioRef = useRef<HTMLAudioElement | null>(null)
  const crossfadeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitializedRef = useRef(false)

  // Initialize audio elements
  useEffect(() => {
    if (typeof window === "undefined" || isInitializedRef.current) return

    const audio = new Audio()
    audio.preload = "metadata"
    audio.crossOrigin = "anonymous"
    audio.volume = state.volume

    const nextAudio = new Audio()
    nextAudio.preload = "metadata"
    nextAudio.crossOrigin = "anonymous"
    nextAudio.volume = 0

    // iOS optimizations
    if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
      audio.playsInline = true
      nextAudio.playsInline = true
      audio.setAttribute("webkit-playsinline", "true")
      nextAudio.setAttribute("webkit-playsinline", "true")
    }

    audioRef.current = audio
    nextAudioRef.current = nextAudio
    isInitializedRef.current = true

    return () => {
      audio.pause()
      nextAudio.pause()
      audio.src = ""
      nextAudio.src = ""
      if (crossfadeTimeoutRef.current) {
        clearTimeout(crossfadeTimeoutRef.current)
      }
    }
  }, [])

  // Load track
  const loadTrack = useCallback(
    async (trackIndex: number) => {
      const audio = audioRef.current
      const track = tracks[trackIndex]

      if (!audio || !track) return

      setState((prev) => ({ ...prev, isLoading: true }))

      return new Promise<void>((resolve, reject) => {
        const handleCanPlay = () => {
          audio.removeEventListener("canplay", handleCanPlay)
          audio.removeEventListener("error", handleError)
          setState((prev) => ({
            ...prev,
            isLoading: false,
            duration: audio.duration || 0,
            currentTrackIndex: trackIndex,
          }))
          resolve()
        }

        const handleError = (e: Event) => {
          console.error("Audio load error", {
            url: safeBlobUrl(track.audioUrl),
            event: e,
          })
          audio.removeEventListener("canplay", handleCanPlay)
          audio.removeEventListener("error", handleError)
          setState((prev) => ({ ...prev, isLoading: false }))
          reject(new Error("Failed to load track"))
        }

        audio.addEventListener("canplay", handleCanPlay)
        audio.addEventListener("error", handleError)

        audio.src = safeBlobUrl(track.audioUrl)
        audio.load()
      })
    },
    [tracks],
  )

  // Setup audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !isInitializedRef.current) return

    const handleTimeUpdate = () => {
      if (!state.isCrossfading) {
        setState((prev) => ({ ...prev, currentTime: audio.currentTime }))

        // Check for crossfade trigger (4 seconds before end)
        const timeRemaining = audio.duration - audio.currentTime
        if (
          timeRemaining <= 4 &&
          timeRemaining > 3.9 &&
          state.currentTrackIndex < tracks.length - 1 &&
          state.isPlaying &&
          !state.isCrossfading
        ) {
          startCrossfade()
        }
      }
    }

    const handlePlay = () => {
      setState((prev) => ({ ...prev, isPlaying: true, isLoading: false }))
    }

    const handlePause = () => {
      setState((prev) => ({ ...prev, isPlaying: false }))
    }

    const handleEnded = () => {
      if (!state.isCrossfading) {
        if (state.currentTrackIndex < tracks.length - 1) {
          selectTrack(state.currentTrackIndex + 1)
        } else {
          setState((prev) => ({ ...prev, isPlaying: false, currentTime: 0 }))
        }
      }
    }

    const handleWaiting = () => {
      setState((prev) => ({ ...prev, isLoading: true }))
    }

    const handlePlaying = () => {
      setState((prev) => ({ ...prev, isLoading: false }))
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("waiting", handleWaiting)
    audio.addEventListener("playing", handlePlaying)

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("waiting", handleWaiting)
      audio.removeEventListener("playing", handlePlaying)
    }
  }, [state.currentTrackIndex, state.isPlaying, state.isCrossfading, tracks.length])

  // Crossfade function
  const startCrossfade = useCallback(async () => {
    const audio = audioRef.current
    const nextAudio = nextAudioRef.current
    const nextTrack = tracks[state.currentTrackIndex + 1]

    if (!audio || !nextAudio || !nextTrack || state.isCrossfading) return

    setState((prev) => ({ ...prev, isCrossfading: true }))

    try {
      nextAudio.src = safeBlobUrl(nextTrack.audioUrl)
      nextAudio.volume = 0
      await nextAudio.play()

      // Crossfade over 4 seconds
      const startTime = Date.now()
      const crossfadeDuration = 4000

      const fade = () => {
        const elapsed = Date.now() - startTime
        const progress = Math.min(elapsed / crossfadeDuration, 1)

        audio.volume = (1 - progress) * state.volume
        nextAudio.volume = progress * state.volume

        if (progress >= 1) {
          // Crossfade complete - swap audio elements
          const currentTime = nextAudio.currentTime
          audio.src = nextAudio.src
          audio.currentTime = currentTime
          audio.volume = state.volume

          nextAudio.pause()
          nextAudio.volume = 0
          nextAudio.currentTime = 0

          setState((prev) => ({
            ...prev,
            currentTrackIndex: prev.currentTrackIndex + 1,
            isCrossfading: false,
            currentTime: currentTime,
          }))
        } else {
          requestAnimationFrame(fade)
        }
      }

      requestAnimationFrame(fade)
    } catch (error) {
      setState((prev) => ({ ...prev, isCrossfading: false }))
      console.error("Crossfade failed:", error)
    }
  }, [state.currentTrackIndex, state.volume, state.isCrossfading, tracks])

  // Load initial track
  useEffect(() => {
    if (tracks.length > 0 && isInitializedRef.current) {
      loadTrack(0)
    }
  }, [tracks, loadTrack])

  // Player controls
  const play = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return

    try {
      await audio.play()
    } catch (error) {
      console.error("Play failed:", error)
    }
  }, [])

  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
  }, [])

  const togglePlay = useCallback(async () => {
    if (state.isPlaying) {
      pause()
    } else {
      await play()
    }
  }, [state.isPlaying, play, pause])

  const selectTrack = useCallback(
    async (index: number) => {
      if (index < 0 || index >= tracks.length) return

      const wasPlaying = state.isPlaying
      if (wasPlaying) pause()

      await loadTrack(index)

      if (wasPlaying) {
        setTimeout(() => play(), 100)
      }
    },
    [tracks.length, state.isPlaying, pause, loadTrack, play],
  )

  const nextTrack = useCallback(() => {
    const nextIndex = state.currentTrackIndex + 1
    if (nextIndex < tracks.length) {
      selectTrack(nextIndex)
    }
  }, [state.currentTrackIndex, tracks.length, selectTrack])

  const previousTrack = useCallback(() => {
    if (state.currentTime > 3) {
      // Restart current track if more than 3 seconds in
      const audio = audioRef.current
      if (audio) {
        audio.currentTime = 0
        setState((prev) => ({ ...prev, currentTime: 0 }))
      }
    } else {
      // Go to previous track
      const prevIndex = state.currentTrackIndex - 1
      if (prevIndex >= 0) {
        selectTrack(prevIndex)
      } else {
        selectTrack(tracks.length - 1) // Loop to last track
      }
    }
  }, [state.currentTime, state.currentTrackIndex, tracks.length, selectTrack])

  const seek = useCallback(
    (time: number) => {
      const audio = audioRef.current
      if (!audio) return

      audio.currentTime = time
      setState((prev) => ({ ...prev, currentTime: time }))

      // Reset crossfade if seeking
      if (state.isCrossfading) {
        const nextAudio = nextAudioRef.current
        if (nextAudio) {
          nextAudio.pause()
          nextAudio.volume = 0
        }
        audio.volume = state.volume
        setState((prev) => ({ ...prev, isCrossfading: false }))
      }
    },
    [state.volume, state.isCrossfading],
  )

  const setVolume = useCallback(
    (volume: number) => {
      const audio = audioRef.current
      if (!audio) return

      if (!state.isCrossfading) {
        audio.volume = volume
      }
      setState((prev) => ({ ...prev, volume }))
    },
    [state.isCrossfading],
  )

  return {
    state,
    currentTrack: tracks[state.currentTrackIndex] || null,
    togglePlay,
    play,
    pause,
    nextTrack,
    previousTrack,
    selectTrack,
    seek,
    setVolume,
  }
}

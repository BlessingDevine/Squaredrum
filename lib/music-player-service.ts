import { musicLibraryCache } from "./music-library-cache"
import { safeBlobUrl } from "@/lib/audio-url-utils"

interface PlayerState {
  currentTrackId: number | null
  compilation: string | null
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  shuffle: boolean
  repeat: "none" | "one" | "all"
  playHistory: number[]
}

class MusicPlayerService {
  private static instance: MusicPlayerService
  private playerStates: Map<string, PlayerState> = new Map()
  private audioCache: Map<string, HTMLAudioElement> = new Map()

  private constructor() {}

  static getInstance(): MusicPlayerService {
    if (!MusicPlayerService.instance) {
      MusicPlayerService.instance = new MusicPlayerService()
    }
    return MusicPlayerService.instance
  }

  async initialize() {
    await musicLibraryCache.initialize()
  }

  getPlayerState(playerId: string): PlayerState {
    if (!this.playerStates.has(playerId)) {
      this.playerStates.set(playerId, {
        currentTrackId: null,
        compilation: null,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 1,
        shuffle: false,
        repeat: "none",
        playHistory: [],
      })
    }
    return this.playerStates.get(playerId)!
  }

  updatePlayerState(playerId: string, updates: Partial<PlayerState>) {
    const currentState = this.getPlayerState(playerId)
    this.playerStates.set(playerId, { ...currentState, ...updates })
  }

  getOptimizedTrackData(compilation: string, trackId: number) {
    return musicLibraryCache.getTrack(compilation, trackId)
  }

  getOptimizedCompilationTracks(compilation: string) {
    return musicLibraryCache.getCompilationTracks(compilation)
  }

  preloadAudio(audioUrl: string): HTMLAudioElement {
    if (this.audioCache.has(audioUrl)) {
      return this.audioCache.get(audioUrl)!
    }

    const audio = new Audio()
    audio.preload = "metadata"
    audio.src = safeBlobUrl(audioUrl)
    audio.addEventListener("error", (e) => {
      console.error("Audio load error", { url: safeBlobUrl(audioUrl), event: e })
    })
    this.audioCache.set(audioUrl, audio)
    return audio
  }

  getNextTrackId(playerId: string, compilation: string): number | null {
    const state = this.getPlayerState(playerId)
    const tracks = this.getOptimizedCompilationTracks(compilation)

    if (!tracks.length || state.currentTrackId === null) return null

    const currentIndex = tracks.findIndex((track) => track.id === state.currentTrackId)
    if (currentIndex === -1) return null

    if (state.shuffle) {
      let nextIndex
      do {
        nextIndex = Math.floor(Math.random() * tracks.length)
      } while (nextIndex === currentIndex && tracks.length > 1)
      return tracks[nextIndex].id
    } else {
      const nextIndex = (currentIndex + 1) % tracks.length
      return tracks[nextIndex].id
    }
  }

  getPreviousTrackId(playerId: string, compilation: string): number | null {
    const state = this.getPlayerState(playerId)
    const tracks = this.getOptimizedCompilationTracks(compilation)

    if (!tracks.length || state.currentTrackId === null) return null

    const currentIndex = tracks.findIndex((track) => track.id === state.currentTrackId)
    if (currentIndex === -1) return null

    if (state.shuffle && state.playHistory.length > 1) {
      return state.playHistory[state.playHistory.length - 2]
    } else {
      const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1
      return tracks[prevIndex].id
    }
  }

  searchTracks(query: string, compilation?: string) {
    return musicLibraryCache.searchTracks(query, compilation)
  }

  getRandomTrack(compilation?: string) {
    return musicLibraryCache.getRandomTrack(compilation)
  }

  clearCache() {
    this.audioCache.clear()
    this.playerStates.clear()
  }

  // Batch preload for better performance
  preloadCompilationAudio(compilation: string, limit = 5) {
    const tracks = this.getOptimizedCompilationTracks(compilation).slice(0, limit)
    tracks.forEach((track) => {
      this.preloadAudio(safeBlobUrl(track.audioUrl))
    })
  }
}

export const musicPlayerService = MusicPlayerService.getInstance()
export type { PlayerState }

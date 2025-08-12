// Music library cache for optimized access
interface TrackCache {
  [key: string]: {
    id: number
    title: string
    artist: string
    duration: string
    audioUrl: string
    downloadUrl: string
    coverArt?: string
    compilation: string
  }
}

interface CompilationCache {
  [key: string]: {
    tracks: number[]
    metadata: {
      title: string
      artist: string
      genre: string
      releaseDate: string
      totalTracks: number
    }
  }
}

class MusicLibraryCache {
  private static instance: MusicLibraryCache
  private trackCache: TrackCache = {}
  private compilationCache: CompilationCache = {}
  private initialized = false

  private constructor() {}

  static getInstance(): MusicLibraryCache {
    if (!MusicLibraryCache.instance) {
      MusicLibraryCache.instance = new MusicLibraryCache()
    }
    return MusicLibraryCache.instance
  }

  async initialize() {
    if (this.initialized) return

    const [afroTracks, countryTracks, popTracks, rnbTracks, dancehallTracks] = await Promise.all([
      import("./afro-square-tracks"),
      import("./country-square-tracks"),
      import("./pop-square-tracks"),
      import("./rnb-square-tracks"),
      import("./dancehall-square-tracks"),
    ])

    this.buildTrackCache("afro-square", afroTracks.afroSquareTracks)
    this.buildTrackCache("country-square", countryTracks.countrySquareTracks)
    this.buildTrackCache("pop-square", popTracks.popSquareTracks)
    this.buildTrackCache("rnb-square", rnbTracks.rnbSquareTracks)
    this.buildTrackCache("dancehall-square", dancehallTracks.dancehallSquareTracks)

    // Build compilation cache
    this.buildCompilationCache()

    this.initialized = true
  }

  private buildTrackCache(compilation: string, tracks: any[]) {
    tracks.forEach((track) => {
      const cacheKey = `${compilation}-${track.id}`
      this.trackCache[cacheKey] = {
        ...track,
        compilation,
      }
    })
  }

  private buildCompilationCache() {
    const compilations = {
      "afro-square": {
        title: "AFRO SQUARE",
        artist: "Various AI Artists",
        genre: "Afrobeat",
        releaseDate: "January 14, 2025",
      },
      "country-square": {
        title: "COUNTRY SQUARE",
        artist: "Various AI Artists",
        genre: "Country",
        releaseDate: "February 19, 2025",
      },
      "pop-square": {
        title: "POP SQUARE",
        artist: "Various AI Artists",
        genre: "Pop",
        releaseDate: "March 9, 2025",
      },
      "rnb-square": {
        title: "R&B SQUARE",
        artist: "Various AI Artists",
        genre: "R&B",
        releaseDate: "April 4, 2025",
      },
      "dancehall-square": {
        title: "DANCEHALL SQUARE",
        artist: "Various AI Artists",
        genre: "Dancehall",
        releaseDate: "June 20, 2025",
      },
    }

    Object.entries(compilations).forEach(([key, metadata]) => {
      const tracks = Object.keys(this.trackCache)
        .filter((cacheKey) => cacheKey.startsWith(key))
        .map((cacheKey) => this.trackCache[cacheKey].id)
        .sort((a, b) => a - b)

      this.compilationCache[key] = {
        tracks,
        metadata: {
          ...metadata,
          totalTracks: tracks.length,
        },
      }
    })
  }

  getTrack(compilation: string, trackId: number) {
    const cacheKey = `${compilation}-${trackId}`
    return this.trackCache[cacheKey] || null
  }

  getCompilationTracks(compilation: string) {
    const comp = this.compilationCache[compilation]
    if (!comp) return []

    return comp.tracks.map((trackId) => this.getTrack(compilation, trackId)).filter(Boolean)
  }

  getCompilationMetadata(compilation: string) {
    return this.compilationCache[compilation]?.metadata || null
  }

  searchTracks(query: string, compilation?: string) {
    const searchTerm = query.toLowerCase()
    const tracks = Object.values(this.trackCache)

    return tracks.filter((track) => {
      if (compilation && track.compilation !== compilation) return false

      return track.title.toLowerCase().includes(searchTerm) || track.artist.toLowerCase().includes(searchTerm)
    })
  }

  getRandomTrack(compilation?: string) {
    const tracks = compilation ? this.getCompilationTracks(compilation) : Object.values(this.trackCache)

    if (tracks.length === 0) return null

    const randomIndex = Math.floor(Math.random() * tracks.length)
    return tracks[randomIndex]
  }

  preloadAudioMetadata(tracks: any[]) {
    // Preload audio metadata for better performance
    tracks.forEach((track) => {
      if (track.audioUrl) {
        const audio = new Audio()
        audio.preload = "metadata"
        audio.src = track.audioUrl
      }
    })
  }

  isInitialized() {
    return this.initialized
  }
}

export const musicLibraryCache = MusicLibraryCache.getInstance()
export type { TrackCache }

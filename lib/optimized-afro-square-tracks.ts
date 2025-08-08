export interface AfroSquareTrack {
  id: number
  title: string
  artist: string
  duration: string
  audioUrl: string
  downloadUrl: string
  coverArt?: string
}

// Optimized track data with indexed access
const trackData: Record<number, Omit<AfroSquareTrack, "id">> = {
  1: {
    title: "Bottle Poppin",
    artist: "Afro Square Artist",
    duration: "3:45",
    audioUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bottle%20Poppin-FROv7IP2rMTXSzTmq8SFhGK1kWh7KV.mp3",
    downloadUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bottle%20Poppin-FROv7IP2rMTXSzTmq8SFhGK1kWh7KV.mp3",
    coverArt: "/afro-square.jpg",
  },
  2: {
    title: "Biva",
    artist: "Afro Square Artist",
    duration: "3:42",
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Biva-lFKk0tLMkHIcUd5hAn4MEdQWMg3y1B.mp3",
    downloadUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Biva-lFKk0tLMkHIcUd5hAn4MEdQWMg3y1B.mp3",
    coverArt: "/afro-square.jpg",
  },
  3: {
    title: "Body Dey Go Round",
    artist: "Afro Square Artist",
    duration: "4:12",
    audioUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Body%20Dey%20Go%20Round-8gX4KUzGGS8WztaOT9FKeBdcxGmXpm.mp3",
    downloadUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Body%20Dey%20Go%20Round-8gX4KUzGGS8WztaOT9FKeBdcxGmXpm.mp3",
    coverArt: "/afro-square.jpg",
  },
  4: {
    title: "Can I Live",
    artist: "Afro Square Artist",
    duration: "3:58",
    audioUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Can%20I%20live-zOZUTtCsYmsvNZZ5XeXR7ZHAK75Y3j.mp3",
    downloadUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Can%20I%20live-zOZUTtCsYmsvNZZ5XeXR7ZHAK75Y3j.mp3",
    coverArt: "/afro-square.jpg",
  },
  5: {
    title: "Call Me",
    artist: "Afro Square Artist",
    duration: "3:33",
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Call%20Me-hOk1QvyWVUCbpvMhM61IOo4y8pA5YP.mp3",
    downloadUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Call%20Me-hOk1QvyWVUCbpvMhM61IOo4y8pA5YP.mp3",
    coverArt: "/afro-square.jpg",
  },
  6: {
    title: "Come Through",
    artist: "Afro Square Artist",
    duration: "4:05",
    audioUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Come%20Through-Hu9WAK9w9gBbLO2yQfUHXjqwe3Qny4.mp3",
    downloadUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Come%20Through-Hu9WAK9w9gBbLO2yQfUHXjqwe3Qny4.mp3",
    coverArt: "/afro-square.jpg",
  },
  7: {
    title: "Do You See Mi (Kizomba Remix)",
    artist: "Afro Square Artist",
    duration: "4:28",
    audioUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Do%20You%20See%20Mi%20%28Kizomba%20Remix%29-4AkVpsFTyrHvmT70S6aTgE8eYVYY2T.mp3",
    downloadUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Do%20You%20See%20Mi%20%28Kizomba%20Remix%29-4AkVpsFTyrHvmT70S6aTgE8eYVYY2T.mp3",
    coverArt: "/afro-square.jpg",
  },
  8: {
    title: "Enjoyment Zone",
    artist: "Afro Square Artist",
    duration: "3:52",
    audioUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Enjoyment%20Zone-1tehgNGE8YF3ofYara3JWaOa7OMYUM.mp3",
    downloadUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Enjoyment%20Zone-1tehgNGE8YF3ofYara3JWaOa7OMYUM.mp3",
    coverArt: "/afro-square.jpg",
  },
  9: {
    title: "Come Correct",
    artist: "Afro Square Artist",
    duration: "3:47",
    audioUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Come%20Correct-oDtfOenmVQYI2kR4Yx0cwTmxLWCjr7.mp3",
    downloadUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Come%20Correct-oDtfOenmVQYI2kR4Yx0cwTmxLWCjr7.mp3",
    coverArt: "/afro-square.jpg",
  },
  10: {
    title: "E Sweet Like Suga",
    artist: "Afro Square Artist",
    duration: "4:15",
    audioUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/E%20Sweet%20Like%20Suga-w8OJqiortop8tqT0SyvjqmqJtt7NC4.mp3",
    downloadUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/E%20Sweet%20Like%20Suga-w8OJqiortop8tqT0SyvjqmqJtt7NC4.mp3",
    coverArt: "/afro-square.jpg",
  },
  16: {
    title: "Intliziyo Nye",
    artist: "Afro Square Artist",
    duration: "4:25",
    audioUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Intliziyo%20Nye-oSc5m10qszUCgt5JQ1DjsNwdcjtCpv.mp3",
    downloadUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Intliziyo%20Nye-oSc5m10qszUCgt5JQ1DjsNwdcjtCpv.mp3",
    coverArt: "/afro-square.jpg",
  },
  17: {
    title: "It Was Always You",
    artist: "Afro Square Artist",
    duration: "3:51",
    audioUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/It%20Was%20Always%20You-krD6j94m96Dby84FDm4HPcut8F3fvv.mp3",
    downloadUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/It%20Was%20Always%20You-krD6j94m96Dby84FDm4HPcut8F3fvv.mp3",
    coverArt: "/afro-square.jpg",
  },
  18: {
    title: "Levitar Aqui",
    artist: "Afro Square Artist",
    duration: "4:08",
    audioUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Levitar%20Aqui-GHSk7so4v5MyVswD4gSW4TV6XKBwCH.mp3",
    downloadUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Levitar%20Aqui-GHSk7so4v5MyVswD4gSW4TV6XKBwCH.mp3",
    coverArt: "/afro-square.jpg",
  },
  19: {
    title: "Intliziyo",
    artist: "Afro Square Artist",
    duration: "4:33",
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Intliziyo-CbR5pM7FuLhoLgFbzIWiedBwnpsRub.mp3",
    downloadUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Intliziyo-CbR5pM7FuLhoLgFbzIWiedBwnpsRub.mp3",
    coverArt: "/afro-square.jpg",
  },
  21: {
    title: "Jackpot",
    artist: "Afro Square Artist",
    duration: "3:42",
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Jackpot-UoVbXAJo7p3kr4k1L25Xi8Au4rfe2z.mp3",
    downloadUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Jackpot-UoVbXAJo7p3kr4k1L25Xi8Au4rfe2z.mp3",
    coverArt: "/afro-square.jpg",
  },
  22: {
    title: "Love Overdose",
    artist: "Afro Square Artist",
    duration: "4:15",
    audioUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Love%20Overdose-pPUUz7vV4HjBulMTSubEjRsC2SrTZD.mp3",
    downloadUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Love%20Overdose-pPUUz7vV4HjBulMTSubEjRsC2SrTZD.mp3",
    coverArt: "/afro-square.jpg",
  },
  23: {
    title: "Memories",
    artist: "Afro Square Artist",
    duration: "3:58",
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Memories-zJI3JoOHb2HwApvhi2zCXqa9wscBrH.mp3",
    downloadUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Memories-zJI3JoOHb2HwApvhi2zCXqa9wscBrH.mp3",
    coverArt: "/afro-square.jpg",
  },
  24: {
    title: "Loyal",
    artist: "Afro Square Artist",
    duration: "4:22",
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Loyal-JT2UvmDfRLUW5P2Qsse35S1UgY268i.mp3",
    downloadUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Loyal-JT2UvmDfRLUW5P2Qsse35S1UgY268i.mp3",
    coverArt: "/afro-square.jpg",
  },
  25: {
    title: "Ngonanga",
    artist: "Afro Square Artist",
    duration: "3:35",
    audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ngonanga-1UtvO0bDu50Ofq4G5DHIUHUgqgcc0y.mp3",
    downloadUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Ngonanga-1UtvO0bDu50Ofq4G5DHIUHUgqgcc0y.mp3",
    coverArt: "/afro-square.jpg",
  },
}

// Optimized access functions
export const afroSquareTracks: AfroSquareTrack[] = Object.entries(trackData).map(([id, data]) => ({
  id: Number.parseInt(id),
  ...data,
}))

export function getAllAfroSquareTracks(): AfroSquareTrack[] {
  return afroSquareTracks
}

export function getAfroSquareTrackById(id: number): AfroSquareTrack | undefined {
  const data = trackData[id]
  return data ? { id, ...data } : undefined
}

export function getAfroSquareTracksByIds(ids: number[]): AfroSquareTrack[] {
  return ids.map((id) => getAfroSquareTrackById(id)).filter(Boolean) as AfroSquareTrack[]
}

// Batch operations for better performance
export function getAfroSquareTracksRange(start: number, end: number): AfroSquareTrack[] {
  const tracks: AfroSquareTrack[] = []
  for (let id = start; id <= end; id++) {
    const track = getAfroSquareTrackById(id)
    if (track) tracks.push(track)
  }
  return tracks
}

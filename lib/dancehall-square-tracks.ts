export interface DancehallSquareTrack {
  id: number
  title: string
  artist: string
  duration: string
  audioUrl: string
  downloadUrl: string
  coverArt?: string
}

export const dancehallSquareTracks: DancehallSquareTrack[] = [
  {
    id: 1,
    title: "Island Vibes",
    artist: "Dancehall Square Artist",
    duration: "3:28",
    audioUrl: "/audio/dancehall-square/island-vibes.mp3",
    downloadUrl: "/audio/dancehall-square/island-vibes.mp3",
    coverArt: "/images/dancehall-square.jpg",
  },
  {
    id: 2,
    title: "Bashment Flow",
    artist: "Dancehall Square Artist",
    duration: "3:45",
    audioUrl: "/audio/dancehall-square/bashment-flow.mp3",
    downloadUrl: "/audio/dancehall-square/bashment-flow.mp3",
    coverArt: "/images/dancehall-square.jpg",
  },
  {
    id: 3,
    title: "Riddim Master",
    artist: "Dancehall Square Artist",
    duration: "4:02",
    audioUrl: "/audio/dancehall-square/riddim-master.mp3",
    downloadUrl: "/audio/dancehall-square/riddim-master.mp3",
    coverArt: "/images/dancehall-square.jpg",
  },
  {
    id: 4,
    title: "Caribbean Dreams",
    artist: "Dancehall Square Artist",
    duration: "3:33",
    audioUrl: "/audio/dancehall-square/caribbean-dreams.mp3",
    downloadUrl: "/audio/dancehall-square/caribbean-dreams.mp3",
    coverArt: "/images/dancehall-square.jpg",
  },
  {
    id: 5,
    title: "Digital Dancehall",
    artist: "Dancehall Square Artist",
    duration: "3:51",
    audioUrl: "/audio/dancehall-square/digital-dancehall.mp3",
    downloadUrl: "/audio/dancehall-square/digital-dancehall.mp3",
    coverArt: "/images/dancehall-square.jpg",
  },
  {
    id: 6,
    title: "Tropical Thunder",
    artist: "Dancehall Square Artist",
    duration: "3:42",
    audioUrl: "/audio/dancehall-square/tropical-thunder.mp3",
    downloadUrl: "/audio/dancehall-square/tropical-thunder.mp3",
    coverArt: "/images/dancehall-square.jpg",
  },
  {
    id: 7,
    title: "Sunset Riddim",
    artist: "Dancehall Square Artist",
    duration: "4:15",
    audioUrl: "/audio/dancehall-square/sunset-riddim.mp3",
    downloadUrl: "/audio/dancehall-square/sunset-riddim.mp3",
    coverArt: "/images/dancehall-square.jpg",
  },
  {
    id: 8,
    title: "Fire Pon Babylon",
    artist: "Dancehall Square Artist",
    duration: "3:38",
    audioUrl: "/audio/dancehall-square/fire-pon-babylon.mp3",
    downloadUrl: "/audio/dancehall-square/fire-pon-babylon.mp3",
    coverArt: "/images/dancehall-square.jpg",
  },
  {
    id: 9,
    title: "Gyal Dem Sugar",
    artist: "Dancehall Square Artist",
    duration: "3:55",
    audioUrl: "/audio/dancehall-square/gyal-dem-sugar.mp3",
    downloadUrl: "/audio/dancehall-square/gyal-dem-sugar.mp3",
    coverArt: "/images/dancehall-square.jpg",
  },
  {
    id: 10,
    title: "Badman Ting",
    artist: "Dancehall Square Artist",
    duration: "4:08",
    audioUrl: "/audio/dancehall-square/badman-ting.mp3",
    downloadUrl: "/audio/dancehall-square/badman-ting.mp3",
    coverArt: "/images/dancehall-square.jpg",
  },
]

export function getAllDancehallSquareTracks(): DancehallSquareTrack[] {
  return dancehallSquareTracks
}

export function getDancehallSquareTrackById(id: number): DancehallSquareTrack | undefined {
  return dancehallSquareTracks.find((track) => track.id === id)
}

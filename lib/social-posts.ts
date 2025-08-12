// Social media posts data and types
export interface SocialPost {
  id: string
  platform: "instagram" | "facebook" | "twitter" | "tiktok" | "youtube"
  type: "image" | "video" | "text" | "carousel" | "story"
  content: string
  media?: {
    url: string
    thumbnail?: string
    alt: string
  }[]
  author: {
    name: string
    handle: string
    avatar: string
  }
  timestamp: string
  likes: number
  comments: number
  shares: number
  hashtags: string[]
  link?: string
}

// Mock social media posts data
export const socialPosts: SocialPost[] = [
  {
    id: "1",
    platform: "instagram",
    type: "image",
    content:
      "🎵 New vibes dropping soon! Lucas Meno has been in the studio working on something special. The R&B game is about to get even smoother. Stay tuned for the magic ✨ #LucasMeno #RnB #NewMusic #SquareDrum",
    media: [
      {
        url: "/lucas-meno.jpg",
        alt: "Lucas Meno in the studio",
      },
    ],
    author: {
      name: "SQUAREDRUM",
      handle: "@squaredrumla",
      avatar: "/squaredrum-logo.jpg",
    },
    timestamp: "2025-01-02T14:30:00Z",
    likes: 1247,
    comments: 89,
    shares: 156,
    hashtags: ["LucasMeno", "RnB", "NewMusic", "SquareDrum"],
    link: "/artists/lucas-meno",
  },
  {
    id: "2",
    platform: "tiktok",
    type: "video",
    content:
      "When SAKA drops that beat and you know it's about to be a whole vibe 🔥 #SAKA #AlternativePop #BehindTheScenes",
    media: [
      {
        url: "/saka.jpg",
        thumbnail: "/saka.jpg",
        alt: "SAKA creating music",
      },
    ],
    author: {
      name: "SQUAREDRUM",
      handle: "@squaredrum7",
      avatar: "/squaredrum-logo.jpg",
    },
    timestamp: "2025-01-02T10:15:00Z",
    likes: 2341,
    comments: 234,
    shares: 567,
    hashtags: ["SAKA", "AlternativePop", "BehindTheScenes"],
    link: "/artists/saka",
  },
  {
    id: "3",
    platform: "twitter",
    type: "text",
    content:
      "The future of music is here and it sounds like freedom. Our artists are breaking boundaries and creating sounds that move souls. What genre speaks to your heart today? 🎶",
    author: {
      name: "SQUAREDRUM",
      handle: "@Squaredrumla",
      avatar: "/squaredrum-logo.jpg",
    },
    timestamp: "2025-01-01T18:45:00Z",
    likes: 892,
    comments: 156,
    shares: 234,
    hashtags: ["MusicIsLife", "SquareDrum", "ArtistSpotlight"],
  },
  {
    id: "4",
    platform: "facebook",
    type: "image",
    content:
      "🌍 Danni Blaze bringing those infectious Afrobeat rhythms that make you move without thinking! New tracks from the Afro Square collection are live now. Experience the global sound revolution.",
    media: [
      {
        url: "/danni-blaze.jpg",
        alt: "Danni Blaze performing",
      },
    ],
    author: {
      name: "Squaredrum",
      handle: "squaredrum",
      avatar: "/squaredrum-logo.jpg",
    },
    timestamp: "2025-01-01T12:20:00Z",
    likes: 1567,
    comments: 203,
    shares: 445,
    hashtags: ["DanniBlaze", "Afrobeat", "AfroSquare", "WorldMusic"],
    link: "/releases#afro-square-volume-1",
  },
  {
    id: "5",
    platform: "instagram",
    type: "carousel",
    content:
      "Behind the scenes with our incredible artists! Swipe to see the magic happening in the studio 📸✨ From R&B sessions to Afrobeat recordings, creativity never stops at SQUAREDRUM.",
    media: [
      {
        url: "/studio-background.jpg",
        alt: "Studio session 1",
      },
      {
        url: "/studio-about.jpg",
        alt: "Studio session 2",
      },
      {
        url: "/founder-ceo.jpg",
        alt: "Team meeting",
      },
    ],
    author: {
      name: "SQUAREDRUM",
      handle: "@squaredrumla",
      avatar: "/squaredrum-logo.jpg",
    },
    timestamp: "2024-12-31T16:30:00Z",
    likes: 2103,
    comments: 187,
    shares: 298,
    hashtags: ["BehindTheScenes", "StudioLife", "SquareDrum", "MusicProduction"],
  },
  {
    id: "6",
    platform: "youtube",
    type: "video",
    content:
      '🎬 NEW VIDEO: "The Making of Pop Square Vol. 1" - Go behind the scenes and discover how we created 55 tracks of pure pop magic. From concept to completion, see the artistry unfold.',
    media: [
      {
        url: "/pop-square-vol1.jpg",
        thumbnail: "/pop-square-vol1.jpg",
        alt: "Pop Square Vol 1 behind the scenes",
      },
    ],
    author: {
      name: "Squaredrum",
      handle: "@SquareDrumRecords",
      avatar: "/squaredrum-logo.jpg",
    },
    timestamp: "2024-12-30T14:00:00Z",
    likes: 3456,
    comments: 412,
    shares: 789,
    hashtags: ["PopSquare", "BehindTheScenes", "MusicVideo", "PopMusic"],
    link: "/releases#pop-square-vol-1",
  },
  {
    id: "7",
    platform: "instagram",
    type: "image",
    content:
      "🎤 Virgo Dunst bringing that raw storytelling energy! Hip-hop with substance, beats with purpose. Every bar tells a story worth hearing. #VirgoD #HipHop #Storytelling",
    media: [
      {
        url: "/virgo-dunst.jpg",
        alt: "Virgo Dunst in the studio",
      },
    ],
    author: {
      name: "SQUAREDRUM",
      handle: "@squaredrumla",
      avatar: "/squaredrum-logo.jpg",
    },
    timestamp: "2024-12-29T11:45:00Z",
    likes: 1834,
    comments: 267,
    shares: 189,
    hashtags: ["VirgoD", "HipHop", "Storytelling", "UrbanMusic"],
    link: "/artists/virgo-dunst",
  },
  {
    id: "8",
    platform: "twitter",
    type: "text",
    content:
      "Music Square Radio is LIVE! 📻 Tune in now for non-stop hits from our entire catalog. From Afrobeat to Country, R&B to Pop - we've got the sounds that move you. Link in bio! 🎵",
    author: {
      name: "SQUAREDRUM",
      handle: "@Squaredrumla",
      avatar: "/squaredrum-logo.jpg",
    },
    timestamp: "2024-12-28T20:30:00Z",
    likes: 1245,
    comments: 89,
    shares: 456,
    hashtags: ["MusicSquareRadio", "LiveRadio", "SquareDrum", "NowPlaying"],
  },
]

// Function to get posts by platform
export const getPostsByPlatform = (platform: SocialPost["platform"]): SocialPost[] => {
  return socialPosts.filter((post) => post.platform === platform)
}

// Function to get recent posts
export const getRecentPosts = (limit = 10): SocialPost[] => {
  return socialPosts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit)
}

// Function to format timestamp
export const formatTimestamp = (timestamp: string): string => {
  const now = new Date()
  const postDate = new Date(timestamp)
  const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) {
    const diffInMinutes = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60))
    return `${diffInMinutes}m ago`
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }
}

// Function to get platform icon
export const getPlatformIcon = (platform: SocialPost["platform"]): string => {
  const icons = {
    instagram: "📷",
    facebook: "👥",
    twitter: "🐦",
    tiktok: "🎵",
    youtube: "📺",
  }
  return icons[platform] || "📱"
}

// Function to get platform color
export const getPlatformColor = (platform: SocialPost["platform"]): string => {
  const colors = {
    instagram: "from-pink-500 to-purple-500",
    facebook: "from-blue-600 to-blue-700",
    twitter: "from-blue-400 to-blue-500",
    tiktok: "from-black to-red-500",
    youtube: "from-red-500 to-red-600",
  }
  return colors[platform] || "from-gray-500 to-gray-600"
}

export interface FeaturedTrack {
  title: string
  duration: string
  audioUrl?: string
}

export interface PhotoGallery {
  id: string
  src: string
  alt: string
  caption?: string
}

export interface Artist {
  id: string
  name: string
  slug: string
  image: string
  bio: string
  location: string
  genre: string
  socialMedia: {
    instagram?: string
    twitter?: string
    spotify?: string
    youtube?: string
    soundcloud?: string
  }
  albums: Array<{
    title: string
    year: number
    coverArt: string
    tracks: string[]
  }>
  stats: {
    monthlyListeners: string
    totalStreams: string
    followers: string
  }
  featured: boolean
  featuredTrack?: {
    title: string
    audioUrl: string
    duration: string
  }
  tracks?: Array<{
    id: string
    title: string
    audioUrl: string
    duration: string
  }>
  photoGallery?: PhotoGallery[]
}

export const artists: Artist[] = [
  {
    id: "4",
    name: "Neilly Storm",
    slug: "neilly-storm",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Neilly%20Storm.jpg-pbl9md9S3nFpvpk2TyAlyI3p5qqb84.jpeg",
    bio: "Neilly Storm is an AI powerhouse vocalist created through advanced voice synthesis technology and emotional modeling algorithms specializing in Indie/Alternative Pop. This artificial artist commands attention with AI-generated dynamic range and emotional delivery, drawing from indie and alternative pop influences processed through machine learning. Based conceptually in Los Angeles, Neilly Storm creates anthemic indie-pop songs that resonate with audiences worldwide, with AI-generated performances that capture the essence of alternative music.",
    location: "Los Angeles, CA",
    genre: "Indie/Alternative Pop",
    socialMedia: {
      instagram: "https://instagram.com/neillystorm",
      twitter: "https://twitter.com/neillystorm",
      spotify: "https://open.spotify.com/artist/neillystorm",
    },
    albums: [
      {
        title: "Thunder & Lightning",
        year: 2025,
        coverArt: "/images/albums/thunder-lightning.jpg",
        tracks: ["Storm Warning", "Electric", "Thunder Rolls", "Lightning Strike", "After the Rain"],
      },
    ],
    stats: {
      monthlyListeners: "156K",
      totalStreams: "3.2M",
      followers: "58K",
    },
    featured: true,
    featuredTrack: {
      title: "Run Away",
      audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/run-away-7RyfVWFjdYNbGLIkXqNYlUsVRAb82C.mp3",
      duration: "3:33",
    },
    tracks: [
      {
        id: "neilly-1",
        title: "Run Away",
        audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/run-away-7RyfVWFjdYNbGLIkXqNYlUsVRAb82C.mp3",
        duration: "3:33",
      },
      {
        id: "neilly-2",
        title: "Butterfly (Cover)",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/butterfly-ZO55bNThWIYZBhK49BcpFbhrkC2m6C.mp3",
        duration: "3:45",
      },
      {
        id: "neilly-3",
        title: "Floating",
        audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/floating-0zyS1MdCMiXP7xiCNghQfYqC9ehfzr.mp3",
        duration: "4:12",
      },
      {
        id: "neilly-4",
        title: "If You Want It",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/it-is-fate-f6UmmOUWLvePJUyHvB43Fa9QqufJbt.mp3",
        duration: "3:28",
      },
      {
        id: "neilly-5",
        title: "What Do I Do Now",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/what-do-i-do-now-Fokd0arltE8bbslPq1Eb9anvTiS6kH.mp3",
        duration: "3:56",
      },
      {
        id: "neilly-6",
        title: "Take A Picture",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/take-a-picture-6ANzbfQhuYJ12I8s848QwbQ7CYeBT1.mp3",
        duration: "4:03",
      },
      {
        id: "neilly-7",
        title: "Oops...I Like Him",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/oops...i-like-him-A2gdP68acrNemBqBV3QN7jg0Cg5dMB.mp3",
        duration: "3:43",
      },
    ],
    photoGallery: [
      {
        id: "neilly-photo-1",
        src: "/images/neilly-storm/13.jpg",
        alt: "Neilly Storm in sequined military-style jacket with colorful patterns, standing in front of neon signs including SOFIA, with pink hair and dramatic lighting",
        caption: "Neon Nights",
      },
      {
        id: "neilly-photo-2",
        src: "/images/neilly-storm/04.jpg",
        alt: "Neilly Storm performing on stage in black sequined bodysuit with metallic fringe sleeves, layered necklaces, and pink hair under stage lights",
        caption: "Stage Performance",
      },
      {
        id: "neilly-photo-3",
        src: "/images/neilly-storm/21.jpg",
        alt: "Neilly Storm with pink and purple hair showing extensive arm tattoos including roses and butterflies, wearing floral crop top with hands behind head against colorful graffiti background",
        caption: "Tattoo Art",
      },
      {
        id: "neilly-photo-4",
        src: "/images/neilly-storm/16.jpg",
        alt: "Neilly Storm in metallic sequined wrap dress against city nightscape with purple and pink neon lighting and bokeh effects",
        caption: "City Lights",
      },
      {
        id: "neilly-photo-5",
        src: "/images/neilly-storm/07.jpg",
        alt: "Neilly Storm against graffiti wall wearing patchwork jacket with yellow sleeves, black crop top, and leather pants",
        caption: "Alternative Edge",
      },
      {
        id: "neilly-photo-6",
        src: "/images/neilly-storm/25.jpg",
        alt: "Neilly Storm with pink and purple hair in metallic iridescent bomber jacket over green crop top, arms outstretched against colorful graffiti wall",
        caption: "Iridescent Style",
      },
      {
        id: "neilly-photo-7",
        src: "/images/neilly-storm/11.jpg",
        alt: "Neilly Storm performing at microphone with purple and pink neon stage lighting, wearing metallic sequined wrap dress with wavy hair",
        caption: "Neon Performance",
      },
      {
        id: "neilly-photo-8",
        src: "/images/neilly-storm/18.jpg",
        alt: "Neilly Storm against colorful graffiti wall wearing metallic bomber jacket over green crop top with pink and blonde hair",
        caption: "Street Metallic",
      },
      {
        id: "neilly-photo-9",
        src: "/images/neilly-storm/01.jpg",
        alt: "Neilly Storm against colorful graffiti wall wearing patchwork jacket with yellow sleeves, black sequined top, leather pants, and beige cap",
        caption: "Street Art Vibes",
      },
      {
        id: "neilly-photo-10",
        src: "/images/neilly-storm/26.jpg",
        alt: "Neilly Storm with hair in top knot wearing off-shoulder white and cream dress with gold drop earrings in elegant interior with warm lighting",
        caption: "Sophisticated Grace",
      },
      {
        id: "neilly-photo-11",
        src: "/images/neilly-storm/05.jpg",
        alt: "Close-up of Neilly Storm in black sequined performance outfit with metallic fringe sleeves and dramatic stage lighting",
        caption: "Concert Spotlight",
      },
      {
        id: "neilly-photo-12",
        src: "/images/neilly-storm/14.jpg",
        alt: "Close-up portrait of Neilly Storm in black leather jacket with gold hoop earrings and dramatic moody lighting",
        caption: "Leather Portrait",
      },
      {
        id: "neilly-photo-13",
        src: "/images/neilly-storm/22.jpg",
        alt: "Close-up portrait of Neilly Storm with pink and purple hair displaying detailed arm tattoos including roses and butterflies, wearing white top in natural outdoor lighting",
        caption: "Natural Beauty",
      },
      {
        id: "neilly-photo-14",
        src: "/images/neilly-storm/09.jpg",
        alt: "Neilly Storm against graffiti wall in patchwork jacket showing her pink hair and layered jewelry",
        caption: "Artistic Expression",
      },
      {
        id: "neilly-photo-15",
        src: "/images/neilly-storm/17.jpg",
        alt: "Neilly Storm performing emotionally into vintage microphone in luxurious setting, wearing cream and gold metallic dress with dramatic arm positioning",
        caption: "Emotional Performance",
      },
      {
        id: "neilly-photo-16",
        src: "/images/neilly-storm/23.jpg",
        alt: "Neilly Storm in minimalist white collared shirt with layered pearl necklaces, slicked-back hair, and red nail polish in clean studio setting",
        caption: "Clean Elegance",
      },
      {
        id: "neilly-photo-17",
        src: "/images/neilly-storm/06.jpg",
        alt: "Neilly Storm performing on stage in black sequined bodysuit with metallic fringe sleeves, smiling under warm stage lights",
        caption: "Live Energy",
      },
      {
        id: "neilly-photo-18",
        src: "/images/neilly-storm/15.jpg",
        alt: "Neilly Storm in recording studio wearing black leather jacket over graphic t-shirt, with pink hair and neon lighting in background",
        caption: "Studio Vibes",
      },
      {
        id: "neilly-photo-19",
        src: "/images/neilly-storm/27.jpg",
        alt: "Neilly Storm with hair in top knot wearing off-shoulder white and cream draped dress with gold drop earrings, eyes closed in contemplative pose in elegant interior",
        caption: "Serene Elegance",
      },
      {
        id: "neilly-photo-20",
        src: "/images/neilly-storm/02.jpg",
        alt: "Neilly Storm in colorblock jacket with black, yellow, and beige sections, wearing beige cap against vibrant graffiti wall",
        caption: "Urban Style",
      },
      {
        id: "neilly-photo-21",
        src: "/images/neilly-storm/12.jpg",
        alt: "Neilly Storm singing passionately into vintage microphone in luxurious lounge setting, wearing golden metallic dress with pink hair highlights",
        caption: "Lounge Sessions",
      },
      {
        id: "neilly-photo-22",
        src: "/images/neilly-storm/08.jpg",
        alt: "Neilly Storm against graffiti wall in patchwork jacket with yellow sleeves, beige cap, and layered necklaces",
        caption: "Indie Aesthetic",
      },
      {
        id: "neilly-photo-23",
        src: "/images/neilly-storm/19.jpg",
        alt: "Close-up portrait of Neilly Storm in black leather jacket with gold hoop earrings and dramatic studio lighting",
        caption: "Studio Portrait",
      },
      {
        id: "neilly-photo-24",
        src: "/images/neilly-storm/24.jpg",
        alt: "Neilly Storm in white hoodie with layered pearl necklaces, hair pulled back, and red nail polish in soft-lit studio environment",
        caption: "Casual Luxury",
      },
      {
        id: "neilly-photo-25",
        src: "/images/neilly-storm/10.jpg",
        alt: "Close-up portrait of Neilly Storm with pink hair against colorful graffiti background, wearing layered necklaces and patchwork jacket",
        caption: "Creative Portrait",
      },
      {
        id: "neilly-photo-26",
        src: "/images/neilly-storm/03.jpg",
        alt: "Neilly Storm against colorful graffiti wall wearing patchwork jacket with yellow sleeves, black sequined top, leather pants, and beige cap",
        caption: "LA Street Fashion",
      },
      {
        id: "neilly-photo-27",
        src: "/images/neilly-storm/20.jpg",
        alt: "Neilly Storm in recording studio wearing black leather jacket over graphic t-shirt, with pink hair and professional studio equipment in background",
        caption: "Recording Studio",
      },
    ],
  },
  {
    id: "8",
    name: "Luv Tonez",
    slug: "luv-tonez",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Luv%20Tonez.jpg-4K7M3mReeAKec5cU4bs8w6la5UwIT2.jpeg",
    bio: "Luv Tonez is an AI R&B group that creates soulful harmonies and contemporary R&B music through advanced vocal synthesis and group dynamics algorithms. This artificial collective, conceptualized from Atlanta, combines multiple AI-generated voices to produce rich, layered harmonies that blend classic soul elements with modern R&B production. Each member of the group represents a different vocal range and personality, showcasing AI's capability in creating authentic group dynamics and emotional music collaboration.",
    location: "Atlanta, GA",
    genre: "R&B Group",
    socialMedia: {
      instagram: "https://instagram.com/luvtonezbeats",
      twitter: "https://twitter.com/luvtonezbeats",
      spotify: "https://open.spotify.com/artist/luvtonez",
    },
    albums: [
      {
        title: "Harmony Laboratory",
        year: 2025,
        coverArt: "/images/albums/harmony-laboratory.jpg",
        tracks: ["Group Dynamics", "Vocal Blend", "Soul Synthesis", "R&B Collective", "Digital Harmony"],
      },
    ],
    stats: {
      monthlyListeners: "87K",
      totalStreams: "1.7M",
      followers: "39K",
    },
    featured: true,
    featuredTrack: {
      title: "What Is The Point",
      audioUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/what-is-the-point-L2QtD4hJRlprEXdsH9p06D3wq8brj8.mp3",
      duration: "3:48",
    },
    tracks: [
      {
        id: "tonez-1",
        title: "What Is The Point",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/what-is-the-point-L2QtD4hJRlprEXdsH9p06D3wq8brj8.mp3",
        duration: "3:48",
      },
      {
        id: "tonez-2",
        title: "Golden Hour Confessions",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Golden%20Hour%20Confessions-FAUfk61tuIN9THWyp5RZQUbWou3WVu.mp3",
        duration: "3:48",
      },
      {
        id: "tonez-3",
        title: "Electric Souls",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Electric%20Souls-2UlbXfQQztLtoplfKJsSatAdCXjAKK.mp3",
        duration: "3:55",
      },
      {
        id: "tonez-4",
        title: "3AM Conversations",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3AM%20Conversations-yhSer3r7mMpqauzDkHOhX2bf0Q4ZAx.mp3",
        duration: "4:18",
      },
      {
        id: "tonez-5",
        title: "City Lights & Late Nights",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/City%20Lights%20%26%20Late%20Nights-3uer7TWCgNJ28Yhu7NshfRkNCiDzrX.mp3",
        duration: "3:42",
      },
      {
        id: "tonez-6",
        title: "Digital Love Letters",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Digital%20Love%20Letters-M2wAPCnjtS73HDmIc6yUrBSOXXozlS.mp3",
        duration: "4:05",
      },
      {
        id: "tonez-7",
        title: "Bamboo Sheets",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Bamboo%20Sheets-UnhvcxXegaYHBJ81opG2Vaqprw13wo.mp3",
        duration: "3:38",
      },
      {
        id: "tonez-8",
        title: "Honey Drip",
        audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Honey%20Drip-Opzh9.mp3",
        duration: "4:08",
      },
      {
        id: "tonez-9",
        title: "Gravity",
        audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Gravity-ZvpmK75QmtWLmxYFVeZmQZTZMGGP31.mp3",
        duration: "3:51",
      },
      {
        id: "tonez-10",
        title: "Neon Heartbreak",
        audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Neon%20Heartbreak-hdKhQ.mp3",
        duration: "3:54",
      },
      {
        id: "tonez-11",
        title: "Rose Gold Feelings",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Rose%20Gold%20Feelings-UCRCJMMI1zcuCvOWeAsOtG25pyuQAK.mp3",
        duration: "4:16",
      },
      {
        id: "tonez-12",
        title: "Kaleidoscope Hearts",
        audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kaleidoscope%20Hearts-YVSXe.mp3",
        duration: "3:47",
      },
      {
        id: "tonez-13",
        title: "Silk Road",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Silk%20Road-KMMXsvH4Twhx7oXBDUJ9hfj9xvmGSf.mp3",
        duration: "4:01",
      },
      {
        id: "tonez-14",
        title: "Purple Rain Therapy",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Purple%20Rain%20Therapy-KY5BI1aky4EvAJzZVuzbyHEz3E1yPP.mp3",
        duration: "4:35",
      },
      {
        id: "tonez-15",
        title: "Midnight Frequencies",
        audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/midnight-frequencie-o2hb8.mp3",
        duration: "3:58",
      },
      {
        id: "tonez-16",
        title: "Slow Motion",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Slow%20Motion-WpzCBSOzmSBG5F8gAKDYNomtXJC4oQ.mp3",
        duration: "4:14",
      },
      {
        id: "tonez-17",
        title: "Summer Skin",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Summer%20Skin-xXJfXW13feRFXnemzNb0OhL5t8Ng2m.mp3",
        duration: "3:52",
      },
      {
        id: "tonez-18",
        title: "Velvet Dreams",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Velvet%20Dreams-mTM8CT8qV0rcSmGrmZ5UN5QXN6uCl6.mp3",
        duration: "4:22",
      },
      {
        id: "tonez-19",
        title: "Stardust Serenade",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Stardust%20Serenade-fv6CXcD8fGfa52YjY91Fazoii0ofoj.mp3",
        duration: "4:15",
      },
      {
        id: "tonez-20",
        title: "Electric Souls II",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Electric%20Souls%20II-do7kxvECENTQsiV8xoYHGXCC7NEgnN.mp3",
        duration: "4:02",
      },
      {
        id: "tonez-21",
        title: "Kaleidoscope Hearts (Remix)",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/_Kaleidoscope%20Hearts%20%28Remix%29-wwBS2IWaV0a1l8RQJYfuG2e72jz7zu.mp3",
        duration: "4:12",
      },
      {
        id: "tonez-22",
        title: "Stardust Serenade (Extended)",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Stardust%20Serenade%20%28Extended%29-zDpw5Cms4FX7s6xo36WBGI9NUncm3a.mp3",
        duration: "5:12",
      },
      {
        id: "tonez-23",
        title: "Kaleidoscope Hearts (Dance Mix)",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Kaleidoscope%20Hearts%20%28Dance%20Mix%29-fM0Q9PeveGQOgQXxckNfCAGPW9bQa5.mp3",
        duration: "4:23",
      },
    ],
    photoGallery: [
      {
        id: "tonez-photo-1",
        src: "/images/luv-tonez/14.jpg",
        alt: "Luv Tonez performing on stage with microphones and atmospheric lighting, wearing metallic and iridescent outfits",
        caption: "Stage Performance",
      },
      {
        id: "tonez-photo-2",
        src: "/images/luv-tonez/17.jpg",
        alt: "Luv Tonez in elegant formal wear against dark background, one in classic tuxedo with bow tie, one with afro in black suit with gold chain, one in all-black suit with sunglasses",
        caption: "Red Carpet Ready",
      },
      {
        id: "tonez-photo-3",
        src: "/images/luv-tonez/02.jpg",
        alt: "Luv Tonez group in matching white suits against colorful graffiti wall background with gold chains",
        caption: "Street Elegance",
      },
      {
        id: "tonez-photo-4",
        src: "/images/luv-tonez/10.jpg",
        alt: "Luv Tonez performing with microphones in intimate venue with warm lighting and string lights, wearing coordinated cream and white outfits",
        caption: "Intimate Performance",
      },
      {
        id: "tonez-photo-5",
        src: "/images/luv-tonez/07.jpg",
        alt: "Luv Tonez trio against vibrant graffiti wall with colorful street art, wearing metallic and leather outfits with sunglasses and chains",
        caption: "Urban Art",
      },
      {
        id: "tonez-photo-6",
        src: "/images/luv-tonez/16.jpg",
        alt: "Luv Tonez in formal black suits against dark background with sophisticated styling and pocket squares",
        caption: "Black Tie",
      },
      {
        id: "tonez-photo-7",
        src: "/images/luv-tonez/12.jpg",
        alt: "Luv Tonez at night with New York City skyline and Empire State Building, wearing casual stylish outfits with sunglasses",
        caption: "City Nights",
      },
      {
        id: "tonez-photo-8",
        src: "/images/luv-tonez/01.jpg",
        alt: "Luv Tonez R&B trio in professional studio setting with coordinated styling - one in white shirt, one in black leather jacket, one in black coat",
        caption: "Studio Portraits",
      },
      {
        id: "tonez-photo-9",
        src: "/images/luv-tonez/18.jpg",
        alt: "Luv Tonez in recording studio with professional equipment and warm lighting, one in burgundy velvet blazer, one in black turtleneck, one with afro in white t-shirt, all wearing sunglasses",
        caption: "Studio Vibes",
      },
      {
        id: "tonez-photo-10",
        src: "/images/luv-tonez/09.jpg",
        alt: "Luv Tonez trio in sophisticated matching black suits with black shirts and pocket squares against dark background",
        caption: "Formal Elegance",
      },
      {
        id: "tonez-photo-11",
        src: "/images/luv-tonez/13.jpg",
        alt: "Luv Tonez against colorful graffiti wall with vibrant street art, one in black coat, one in tie-dye shirt, one in metallic jacket",
        caption: "Street Art Vibes",
      },
      {
        id: "tonez-photo-12",
        src: "/images/luv-tonez/11.jpg",
        alt: "Luv Tonez in studio with white background, one in black leather, one with afro in navy sequined shirt, one in white blazer, all with sunglasses",
        caption: "Studio Style",
      },
      {
        id: "tonez-photo-13",
        src: "/images/luv-tonez/08.jpg",
        alt: "Luv Tonez R&B group in clean studio setting with white background, one in tan plaid blazer, one with afro in white tee, one in graphic sweatshirt",
        caption: "Casual Studio",
      },
      {
        id: "tonez-photo-14",
        src: "/images/luv-tonez/15.jpg",
        alt: "Luv Tonez in recording studio with professional lighting, one in burgundy velvet blazer, one with afro in white tee, one in black shirt",
        caption: "Studio Sessions",
      },
    ],
  },
  {
    id: "7",
    name: "Saka",
    slug: "saka",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka.jpg-Baf8Jk6hVqnuPMJGhZTQ0RBeaxJiaI.jpeg",
    bio: "Saka is an AI multi-instrumentalist and producer that creates genre-defying Alternative Pop music through sophisticated AI composition systems. This artificial artist generates innovative compositions using machine learning algorithms trained on diverse alternative music traditions. Their AI-created Alternative Pop works have been praised for their complexity and emotional depth, demonstrating how artificial intelligence can master the nuanced art of alternative pop music with influences spanning from Los Angeles to Kyoto.",
    location: "LA/Kyoto",
    genre: "Alternative Pop",
    socialMedia: {
      instagram: "https://instagram.com/sakamusic",
      spotify: "https://open.spotify.com/artist/saka",
      youtube: "https://youtube.com/sakamusic",
    },
    albums: [
      {
        title: "Rhythmic Explorations",
        year: 2025,
        coverArt: "/images/albums/rhythmic-explorations.jpg",
        tracks: ["Journey", "Pulse", "Flow", "Rhythm", "Beat", "Groove"],
      },
    ],
    stats: {
      monthlyListeners: "54K",
      totalStreams: "980K",
      followers: "22K",
    },
    featured: true,
    featuredTrack: {
      title: "Butterfly",
      audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/butterfly-ZO55bNThWIYZBhK49BcpFbhrkC2m6C.mp3",
      duration: "3:58",
    },
    tracks: [
      {
        id: "saka-1",
        title: "Butterfly",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/butterfly-ZO55bNThWIYZBhK49BcpFbhrkC2m6C.mp3",
        duration: "3:58",
      },
      {
        id: "saka-2",
        title: "Mirror Talk",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mirror-talk-7slHCP9pVLQ5Xyo2uGSMWFdKRaoT4C.mp3",
        duration: "3:42",
      },
      {
        id: "saka-3",
        title: "Bad Texter",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/fine-anyway-h4yfvF90KHuGXJMooQytTe4ju9VZtV.mp3",
        duration: "3:28",
      },
      {
        id: "saka-4",
        title: "Ex Files",
        audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ex-files-Yo2BlzS5JkiKROQV8oa7gOvaiSLr7r.mp3",
        duration: "4:05",
      },
      {
        id: "saka-5",
        title: "Girl Math",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/girl-math-uhf13kCoSXBS7lFzaH6IRdMUNcxzY4.mp3",
        duration: "3:33",
      },
      {
        id: "saka-6",
        title: "Glow Up Season",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/glow-up-season-QSGudbgwLO5svaNGVpMK1uNTIQU3rr.mp3",
        duration: "3:51",
      },
      {
        id: "saka-7",
        title: "Designer Heartbreak",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/designer-heartbreak-USSBxt9YFGCPfmAoO9Pe4MEXfx3v2a.mp3",
        duration: "4:12",
      },
      {
        id: "saka-8",
        title: "Hot Girl Summer Internship",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hot-girl-summer-internship-XrxsALICDpFGO89MvrwKzq3CD5zwWG.mp3",
        duration: "3:47",
      },
      {
        id: "saka-9",
        title: "Emotional Support Playlist",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/emotional-support-playlist-kChOEBCUUAYABAolq7ItvN8ebsQjYf.mp3",
        duration: "4:18",
      },
      {
        id: "saka-10",
        title: "Mommy Juice",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mommy-juice-Razhkv83AVIxyH7uLeCYoZ5cUVBghe.mp3",
        duration: "3:39",
      },
      {
        id: "saka-11",
        title: "Red Flag Collector I",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/red-flag-collector-i-OJKEbWqb52cU4OTx60jI2GZPuvdKb2.mp3",
        duration: "3:54",
      },
      {
        id: "saka-12",
        title: "Block Party",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dancing-tonight-46i5tSAjGyLhfNPWu2MQYx6Hqu2J08.mp3",
        duration: "3:31",
      },
      {
        id: "saka-13",
        title: "Swiping Through My Feelings",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/swiping-through-my-feelings-r9gZq9wRYCTFWyPXOdFe6KTNeQnTrj.mp3",
        duration: "4:02",
      },
      {
        id: "saka-14",
        title: "Therapy Breakthrough II",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/therapy-breakthrough-ii-Uw3agBjIbKO2ABBZxbX9rqdoR9zIyB.mp3",
        duration: "3:48",
      },
      {
        id: "saka-15",
        title: "Red Flag Collector",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/red-flag-collector-D9RiIgsPEinujLMUDMoikLqsIpk2sZ.mp3",
        duration: "3:57",
      },
      {
        id: "saka-16",
        title: "Standards Rising",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/standards-rising-GcmQepkhPIUgt94azv4o1heTHIjYT7.mp3",
        duration: "4:08",
      },
      {
        id: "saka-17",
        title: "Pillow Princess",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pillow-princess-fxlfnrnRx6rtAEtSiHFE2eCGNd3Sly.mp3",
        duration: "3:44",
      },
      {
        id: "saka-18",
        title: "Pillow Princess II",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pillow-princess-ii-ErPQP6VmprI0FESLQg5OF4MqTbdXbi.mp3",
        duration: "3:52",
      },
      {
        id: "saka-19",
        title: "Self-Care Sunday",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/self-care-sunday-6i5WJzYPxZMeX4AyTVLV0ZoOw6c5UD.mp3",
        duration: "4:15",
      },
      {
        id: "saka-20",
        title: "Queen of Overthinking",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/queen-of-overthinking-hL1HCjlOVe5NcetfdU29xe7FhLkq9E.mp3",
        duration: "3:36",
      },
      {
        id: "saka-21",
        title: "Wine Mom Anthem",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wine-mom-anthem-FkGevBhYBzCNKm1fH1hiDvb72Xdh08.mp3",
        duration: "3:42",
      },
      {
        id: "saka-22",
        title: "Therapy Breakthrough",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/therapy-breakthrough-fKDJfzWGHPZk4wKnbQzzlggPk08b4M.mp3",
        duration: "4:01",
      },
      {
        id: "saka-23",
        title: "Toxic But Make It Fashion",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/toxic-but-make-it-fashion-dOt9ArJg8EQ7meoL7eOdEAMbnVR9bl.mp3",
        duration: "3:52",
      },
    ],
    photoGallery: [
      {
        id: "saka-photo-1",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%208.jpg-vd5eS3WJ5S2Vc9zimJjZuH7budr2Gm.jpeg",
        alt: "Saka in golden hour lighting wearing olive green jacket over black lace bralette and metallic pants, with layered necklaces against urban architecture",
        caption: "Golden Hour",
      },
      {
        id: "saka-photo-2",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%207.jpg-UK7bBtfeJRKVAZTkkBInaJlQsLCAae.jpeg",
        alt: "Saka in olive green jacket over black lace top, posed against modern building with warm lighting",
        caption: "Urban Architecture",
      },
      {
        id: "saka-photo-3",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%204.jpg-F7UhyNxoRxZmgmmvM1tmR21RdNN0XO.jpeg",
        alt: "Saka on rooftop in black leather outfit with studded details and buckles, sitting cross-legged with city skyline backdrop",
        caption: "Rooftop Edge",
      },
      {
        id: "saka-photo-4",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%203.jpg-pVRWMqJxc9vJfpKFkmUJqfM9hoYTT7.jpeg",
        alt: "Saka in rooftop scene wearing black leather corset-style outfit with fishnet stockings and platform boots, city skyline in background",
        caption: "City Skyline",
      },
      {
        id: "saka-photo-5",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%209.jpg-vulq8E9Przp39CSREItxGppJVq70s6.jpeg",
        alt: "Saka in casual street style with denim jacket, graphic tee, ripped jeans with fishnet stockings, blue sunglasses and leopard print bag",
        caption: "Street Style",
      },
      {
        id: "saka-photo-6",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%201.jpg-nk291J92WuE8oZB61DhdutauLBR23f.jpeg",
        alt: "Saka in black leather outfit with harness details and arm guards on rooftop with city skyline",
        caption: "Leather Luxe",
      },
      {
        id: "saka-photo-7",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%205.jpg-Fw4Ncjwf22elE3DvV3Oz5EBmQcFrRw.jpeg",
        alt: "Saka in black leather corset and pants with mesh sleeves and buckle details, sitting on rooftop ledge with city backdrop",
        caption: "Alternative Edge",
      },
      {
        id: "saka-photo-8",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%206.jpg-mYi4q57Rg3qNxzmxkeMZDLohSj3RWc.jpeg",
        alt: "Saka in golden hour shot wearing olive jacket over black lace bralette and metallic pants on rooftop",
        caption: "Sunset Vibes",
      },
      {
        id: "saka-photo-9",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2010.jpg-24MYYR03ud886uUKV4jTp8ZfZeNtdv.jpeg",
        alt: "Saka in street style with denim jacket, graphic tee, distressed jeans with fishnet, blue sunglasses and leopard accessories",
        caption: "Casual Cool",
      },
      {
        id: "saka-photo-10",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%202.jpg-LH9wWZWynFyNE45CjVgPzo9ZQ5kGHI.jpeg",
        alt: "Saka in night scene with colorful neon lighting, wearing dark jacket with harness details",
        caption: "Neon Nights",
      },
      {
        id: "saka-photo-11",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2011.jpg-A2Y9C00HEn7RKplaUkec6OzhgJQL4f.jpeg",
        alt: "Saka on rooftop in black leather corset bustier with studded belt and black pants, city skyline backdrop",
        caption: "Rooftop Leather",
      },
      {
        id: "saka-photo-12",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2012.jpg-b55RHO5o1plvkwoyjjTHefgySfi3ao.jpeg",
        alt: "Saka on rooftop in olive bomber jacket over white crop top and light joggers with pink lace-up boots",
        caption: "Rooftop Casual",
      },
      {
        id: "saka-photo-13",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2013.jpg-EPgH2PntZVQ6TOTL0CGn9HGNu3okQw.jpeg",
        alt: "Saka sitting on concrete steps in black leather harness-style top with buckle belt and black pants",
        caption: "Urban Steps",
      },
      {
        id: "saka-photo-14",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2014.jpg-hvsimdE27fNG0jOdRsUg01JqqLAb6a.jpeg",
        alt: "Saka in airport terminal walkway wearing long knit cardigan with houndstooth pattern bag and knee-high boots",
        caption: "Terminal Style",
      },
      {
        id: "saka-photo-15",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2015.jpg-D7i04OpSUPEvVgRgUjpRbgGUujnfrt.jpeg",
        alt: "Saka in airport/terminal setting wearing long knit cardigan over olive turtleneck and denim shorts with knee-high socks",
        caption: "Airport Fashion",
      },
      {
        id: "saka-photo-16",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2016.jpg-ap67WBB339z58tdUiX76xPpadKxscc.jpeg",
        alt: "Saka in urban courtyard setting wearing olive jacket and white crop top, sitting pose with pink boots",
        caption: "Courtyard Vibes",
      },
      {
        id: "saka-photo-17",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2017.jpg-6vQBshD5fdSWhUFbv7Jdjvsvpn1aUI.jpeg",
        alt: "Saka in urban courtyard wearing olive green bomber jacket over white crop top and light joggers with pink lace-up boots",
        caption: "Urban Courtyard",
      },
      {
        id: "saka-photo-18",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2018.jpg-0Lnf2DUgducHOprgBC8JvJt0HL51mo.jpeg",
        alt: "Saka in airport terminal wearing flowing knit cardigan over olive turtleneck and denim shorts with boots",
        caption: "Terminal Walk",
      },
      {
        id: "saka-photo-19",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2019.jpg-3sanFNic466ZLmBCv2NltBPQkbJ2SC.jpeg",
        alt: "Saka in dreamy portrait with pearl necklace, white flowing fabric, and golden star decorations",
        caption: "Dreamy Stars",
      },
      {
        id: "saka-photo-20",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2020.jpg-ZgiV9lcGRUVSUcxmSMKisZEcRPeaAO.jpeg",
        alt: "Saka in close-up portrait with pink/purple hair surrounded by white flowers and golden star lights, dreamy aesthetic",
        caption: "Floral Dreams",
      },
      {
        id: "saka-photo-21",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2021.jpg-G0tLpNEiqNvNzibKDRfZivw4MskYV2.jpeg",
        alt: "Saka performing on stage with microphone, wearing sequined top with colorful stage lighting and crowd in background",
        caption: "Live Performance",
      },
      {
        id: "saka-photo-22",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2022.jpg-51LxseSx0cHpy461nTizIaDDjBG6Fm.jpeg",
        alt: "Saka in metallic silver bomber jacket over green mesh crop top with chain necklace against colorful graffiti wall with neon lighting",
        caption: "Metallic Street",
      },
      {
        id: "saka-photo-23",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2023.jpg-51LxseSx0cHpy461nTizIaDDjBG6Fm.jpeg",
        alt: "Saka in recording studio with professional microphone, wearing light blue denim shirt with patch, gold hoop earrings and chain necklace",
        caption: "Studio Recording",
      },
      {
        id: "saka-photo-24",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2024.jpg-JSZYVHpZZM7uw1auZfDbYmJo7jfYn1.jpeg",
        alt: "Saka in metallic bomber jacket over red mesh crop top with chain choker against colorful graffiti wall with neon lighting",
        caption: "Neon Graffiti",
      },
      {
        id: "saka-photo-25",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2025.jpg-8vYWhcuN2vCljlhei7KvKdnXVE6ahd.jpeg",
        alt: "Saka in home studio setting with headphones, writing music notation in notebook with keyboard and coffee cups visible",
        caption: "Songwriting",
      },
      {
        id: "saka-photo-26",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2026.jpg-YI5pqXnGFnePnE3ptinw0iBJsxxHLu.jpeg",
        alt: "Saka in black button-up shirt over black bralette and checkered mini skirt against modern building backdrop",
        caption: "Urban Chic",
      },
      {
        id: "saka-photo-27",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2027.jpg-W9wGe0MfZxudqD39z4x0N3RD4OjGyZ.jpeg",
        alt: "Saka in recording studio with DJ equipment, wearing black crop top and headphones with purple/pink neon lighting",
        caption: "DJ Studio",
      },
      {
        id: "saka-photo-28",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2028.jpg-0PECM23xxhyb5FVFoVqteN9Umx5KGO.jpeg",
        alt: "Saka in black blazer over black bralette and checkered mini skirt in urban setting with warm golden hour lighting",
        caption: "Golden Hour",
      },
      {
        id: "saka-photo-29",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2029.jpg-OKGdXaZSx5KurvrcoipfUgWTXFaaCZ.jpeg",
        alt: "Saka in black leather jacket against urban backdrop with 'SARA' neon sign visible, moody evening lighting",
        caption: "Neon Streets",
      },
      {
        id: "saka-photo-30",
        src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka%2030.jpg-GRjnkxjcxIAK55sRDAWKmFbs0bjmeJ.jpeg",
        alt: "Saka in futuristic white outfit making peace signs with both hands, sci-fi aesthetic with technological elements",
        caption: "Futuristic Vibes",
      },
    ],
  },
  {
    id: "6",
    name: "Virgo Dunst",
    slug: "virgo-dunst",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Virgo%20Dunst.jpg-vp9S492loS2RnMXAwqNeHLd624fL3J.jpeg",
    bio: "Virgo Dunst is an AI R&B artist that creates atmospheric soundscapes through cutting-edge machine learning algorithms. This artificial Berlin-based artist combines experimental AI-generated sounds with smooth R&B rhythms, creating tracks that work equally well for intimate listening and live performances. Their innovative AI-driven approach to R&B music production has earned critical acclaim, pushing the boundaries of what artificial intelligence can achieve in contemporary R&B.",
    location: "Berlin, Germany",
    genre: "R&B",
    socialMedia: {
      instagram: "https://instagram.com/virgodunst",
      twitter: "https://twitter.com/virgodunst",
      spotify: "https://open.spotify.com/artist/virgodunst",
    },
    albums: [
      {
        title: "Cosmic Frequencies",
        year: 2025,
        coverArt: "/images/albums/cosmic-frequencies.jpg",
        tracks: ["Stellar", "Orbit", "Nebula", "Galaxy", "Universe", "Infinity"],
      },
    ],
    stats: {
      monthlyListeners: "73K",
      totalStreams: "1.5M",
      followers: "35K",
    },
    featured: true,
    featuredTrack: {
      title: "She's A Vibe",
      audioUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shes-a-vibe-0glSJafAGMMZB9uxQCQxCAeeXXxJnl.mp3",
      duration: "4:02",
    },
    tracks: [
      {
        id: "virgo-1",
        title: "She's A Vibe",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/shes-a-vibe-0glSJafAGMMZB9uxQCQxCAeeXXxJnl.mp3",
        duration: "4:02",
      },
      {
        id: "virgo-2",
        title: "Be Your Man",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/be-your-man-ltQW0mef4gAwS74mFUPxfJJMhSqTvy.mp3",
        duration: "3:48",
      },
      {
        id: "virgo-3",
        title: "Worth It Anyway",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/worth-it-anyway-NZuzlyY3lnaJHVvAGbo8LJfJWxXixH.mp3",
        duration: "4:12",
      },
      {
        id: "virgo-4",
        title: "Breakfast In Bed",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/breakfast-in-bed-69NZjtYodrdfvss3rfQDuFJiSd0Rfs.mp3",
        duration: "3:35",
      },
      {
        id: "virgo-5",
        title: "Walls Down",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/walls-down-MxWYUYY0JHB1Urs1xPFZIdYTJ92kTO.mp3",
        duration: "4:05",
      },
      {
        id: "virgo-6",
        title: "Hard To Love",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hard-to-love-C3dtx88nPvXP1Z5pc9d3eXsKx2b2Ml.mp3",
        duration: "3:52",
      },
      {
        id: "virgo-7",
        title: "Secret Lover",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/secret-lover-BLecHJQ89KFur1hNMN5aGo3ityV0ex.mp3",
        duration: "4:18",
      },
    ],
  },
  {
    id: "9",
    name: "Neka",
    slug: "neka",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Neka.jpg-TARTWffKgN9aVmuYJLnVAVvrAFmgcx.jpeg",
    bio: "Neka is an AI soulful vocalist whose powerful synthetic voice specializes in Afrobeat/Contemporary music through advanced emotional AI modeling systems. This artificial artist brings raw emotion and authenticity to every AI-generated performance, drawing from Afrobeat rhythms and contemporary influences programmed into her neural networks. With roots spanning from Abuja to Manchester, Neka's AI-created music connects deeply with listeners, proving that artificial intelligence can capture and express African musical traditions with contemporary flair.",
    location: "Abuja/Manchester",
    genre: "Afrobeat/Contemporary",
    socialMedia: {
      instagram: "https://instagram.com/nekamusic",
      twitter: "https://twitter.com/nekamusic",
      spotify: "https://open.spotify.com/artist/neka",
    },
    albums: [
      {
        title: "Soul Stories",
        year: 2025,
        coverArt: "/images/albums/soul-stories.jpg",
        tracks: ["My Truth", "Healing", "Stronger", "Love Letters", "New Dawn"],
      },
    ],
    stats: {
      monthlyListeners: "112K",
      totalStreams: "2.3M",
      followers: "47K",
    },
    featured: true,
    featuredTrack: {
      title: "The Holly Molly",
      audioUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/The%20Holly%20Molly-tc0gdsd9n0RqIeAjEluwTUy0QHIp1t.mp3",
      duration: "4:08",
    },
    tracks: [
      {
        id: "neka-1",
        title: "The Holly Molly",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/The%20Holly%20Molly-tc0gdsd9n0RqIeAjEluwTUy0QHIp1t.mp3",
        duration: "4:08",
      },
      {
        id: "neka-2",
        title: "Na Me Be the One",
        audioUrl: "https://blob.v0.dev/neka-na-me-be-the-one.mp3",
        duration: "3:52",
      },
      {
        id: "neka-3",
        title: "Broken No Mean Finish",
        audioUrl: "https://blob.v0.dev/neka-broken-no-mean-finish.mp3",
        duration: "4:15",
      },
      {
        id: "neka-4",
        title: "Lagos Night",
        audioUrl: "https://blob.v0.dev/neka-lagos-night.mp3",
        duration: "3:38",
      },
      {
        id: "neka-5",
        title: "For My Baby",
        audioUrl: "https://blob.v0.dev/neka-for-my-baby.mp3",
        duration: "4:02",
      },
      {
        id: "neka-6",
        title: "Stray Dog",
        audioUrl: "https://blob.v0.dev/neka-stray-dog.mp3",
        duration: "3:29",
      },
      {
        id: "neka-7",
        title: "I Smile",
        audioUrl: "https://blob.v0.dev/neka-i-smile.mp3",
        duration: "3:44",
      },
      {
        id: "neka-8",
        title: "I Am Loyal",
        audioUrl: "https://blob.v0.dev/neka-i-am-loyal.mp3",
        duration: "4:08",
      },
      {
        id: "neka-9",
        title: "The Holly Molly Live",
        audioUrl: "https://blob.v0.dev/neka-the-holly-molly-live.mp3",
        duration: "4:12",
      },
      {
        id: "neka-10",
        title: "Return To Sender",
        audioUrl: "https://blob.v0.dev/neka-return-to-sender.mp3",
        duration: "3:56",
      },
    ],
    photoGallery: [
      {
        id: "neka-photo-1",
        src: "/images/neka-new/neka-2.jpg",
        alt: "Neka in gray button-up shirt with locs and braids, sitting by window with reflection visible, wearing gold earrings in natural lighting",
        caption: "Window Reflections",
      },
      {
        id: "neka-photo-2",
        src: "/images/neka-new/neka-8.jpg",
        alt: "Black and white portrait of Neka with natural hair and braids, hands framing her face, wearing knit sweater in library setting",
        caption: "Contemplative Portrait",
      },
      {
        id: "neka-photo-3",
        src: "/images/neka-new/neka-7.jpg",
        alt: "Neka with locs in colorful African-inspired top with floating bubbles, gold chain necklace in evening setting",
        caption: "Bubble Dreams",
      },
      {
        id: "neka-photo-4",
        src: "/images/neka-new/neka-1.jpg",
        alt: "Neka walking in rain with clear umbrella, wearing tan coat with locs styled, on city street",
        caption: "Rainy Day Elegance",
      },
      {
        id: "neka-photo-5",
        src: "/images/neka-new/neka-6.jpg",
        alt: "Neka with locs in vibrant African-inspired top with bubbles floating around, gold chain necklace in evening atmosphere",
        caption: "Evening Bubbles",
      },
      {
        id: "neka-photo-6",
        src: "/images/neka-new/neka-9.jpg",
        alt: "Neka in kitchen setting wearing white shirt with red patterned scarf, locs and natural hair, smiling warmly",
        caption: "Home Comfort",
      },
      {
        id: "neka-photo-7",
        src: "/images/neka-new/neka-4.jpg",
        alt: "Neka in green top with gold earrings and locs, nighttime city setting with neon lights and bokeh effects",
        caption: "City Nights",
      },
      {
        id: "neka-photo-8",
        src: "/images/neka-new/neka-10.jpg",
        alt: "Neka in home setting wearing light shirt with patterned scarf, locs and natural hair, leaning against furniture",
        caption: "Casual Elegance",
      },
      {
        id: "neka-photo-9",
        src: "/images/neka-new/neka-3.jpg",
        alt: "Neka in gray shirt sitting by window with reflection, locs and gold earrings in natural lighting",
        caption: "Natural Light",
      },
      {
        id: "neka-photo-10",
        src: "/images/neka-new/neka-5.jpg",
        alt: "Neka with locs in colorful African-inspired top surrounded by floating bubbles, gold chain necklace in dreamy evening setting",
        caption: "Dreamy Atmosphere",
      },
      {
        id: "neka-photo-11",
        src: "/images/neka-new/neka-14.jpg",
        alt: "Neka in recording studio with professional microphone, wearing African-inspired patterned crop top and jeans, with locs, 'Vocal Booth' sign visible in background",
        caption: "Vocal Booth Sessions",
      },
      {
        id: "neka-photo-12",
        src: "/images/neka-new/neka-15.jpg",
        alt: "Neka in colorful patchwork jacket with orange sunglasses, locs, layered necklaces, in studio setting",
        caption: "Colorful Vibes",
      },
      {
        id: "neka-photo-13",
        src: "/images/neka-new/neka-18.jpg",
        alt: "Neka in white shirt in recording studio with piano and professional equipment, locs, gold earrings",
        caption: "Piano Studio",
      },
      {
        id: "neka-photo-14",
        src: "/images/neka-new/neka-11.jpg",
        alt: "Neka in elegant pose with hand to face, wearing black top, locs and natural hair, in sophisticated interior setting with shelving",
        caption: "Elegant Pose",
      },
      {
        id: "neka-photo-15",
        src: "/images/neka-new/neka-20.jpg",
        alt: "Neka at piano in recording studio, wearing white shirt with black vest, locs, professional studio equipment visible",
        caption: "Piano Performance",
      },
      {
        id: "neka-photo-16",
        src: "/images/neka-new/neka-19.jpg",
        alt: "Neka at piano in recording studio, wearing white shirt, locs, with mixing console and studio equipment in background",
        caption: "Studio Piano",
      },
      {
        id: "neka-photo-17",
        src: "/images/neka-new/neka-17.jpg",
        alt: "Neka smiling, wearing orange sunglasses and colorful patchwork jacket, locs, layered necklaces, in studio setting",
        caption: "Joyful Energy",
      },
      {
        id: "neka-photo-18",
        src: "/images/neka-new/neka-13.jpg",
        alt: "Neka in beige/tan outfit holding vintage microphone, locs, in recording studio setting",
        caption: "Vintage Mic",
      },
      {
        id: "neka-photo-19",
        src: "/images/neka-new/neka-16.jpg",
        alt: "Neka wearing orange sunglasses and colorful patchwork jacket, locs, chain necklaces, smiling in studio setting",
        caption: "Studio Smile",
      },
      {
        id: "neka-photo-20",
        src: "/images/neka-new/neka-12.jpg",
        alt: "Neka in white shirt in recording studio with piano and mixing console, locs, professional studio environment",
        caption: "Professional Studio",
      },
      {
        id: "neka-photo-21",
        src: "/images/neka-new/neka-21.jpg",
        alt: "Neka walking in rain with clear umbrella, wearing tan coat with locs and natural hair styled, on wet city street with warm lighting",
        caption: "Rainy Evening",
      },
      {
        id: "neka-photo-22",
        src: "/images/neka-new/neka-22.jpg",
        alt: "Neka sitting casually with locs and braids, wearing mint green shirt and white pants, holding coffee cup and phone in urban cafe setting",
        caption: "Coffee Break",
      },
      {
        id: "neka-photo-23",
        src: "/images/neka-new/neka-23.jpg",
        alt: "Neka in white dress with locs, sitting at cafe table with coffee cup, eyes closed in peaceful moment with urban background",
        caption: "Peaceful Moment",
      },
      {
        id: "neka-photo-24",
        src: "/images/neka-new/neka-24.jpg",
        alt: "Neka in orange crop top and cardigan with black leather pants, locs, and gold jewelry in clean studio setting",
        caption: "Orange Vibes",
      },
      {
        id: "neka-photo-25",
        src: "/images/neka-new/neka-26.jpg",
        alt: "Close-up portrait of Neka with natural hair and locs, wearing orange/yellow top with gold chain necklaces, smiling warmly",
        caption: "Golden Portrait",
      },
      {
        id: "neka-photo-26",
        src: "/images/neka-new/neka-26.jpg",
        alt: "Neka in professional photo shoot setting with studio lights, wearing black sequined crop top, fur coat, and black mini skirt with boots",
        caption: "Studio Glamour",
      },
    ],
  },
  {
    id: "5",
    name: "Danni Blaze",
    slug: "danni-blaze",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Danni%20Blaze.jpg-SdFAgQ0v6zRzyydXua2XvyBBz3RumT.jpeg",
    bio: "Danni Blaze is an AI artist that brings fire to the Afrobeat/Amapiano scene with razor-sharp lyrics generated through advanced language models and infectious beats created by AI music systems. This artificial artist from Accra, Ghana specializes in Afrobeat rhythms and Amapiano grooves, tackling diverse subjects while keeping the energy high through sophisticated AI emotional processing. Her unique AI-generated style showcases the versatility of artificial creativity in African-inspired genres, bringing authentic Ghanaian musical influences to the global stage.",
    location: "Accra, Ghana",
    genre: "Afrobeat/Amapiano",
    socialMedia: {
      instagram: "https://instagram.com/danniblaze",
      twitter: "https://twitter.com/danniblaze",
      spotify: "https://open.spotify.com/artist/danniblaze",
    },
    albums: [
      {
        title: "Fire & Ice",
        year: 2025,
        coverArt: "/images/albums/fire-ice.jpg",
        tracks: ["Ignite", "Freeze Frame", "Hot & Cold", "Blaze Trail", "Ice Queen"],
      },
    ],
    stats: {
      monthlyListeners: "98K",
      totalStreams: "2.1M",
      followers: "41K",
    },
    featured: true,
    featuredTrack: {
      title: "No Dey Rush",
      audioUrl: "https://blob.v0.dev/danni-no-dey-rush",
      duration: "3:28",
    },
    tracks: [
      {
        id: "danni-1",
        title: "No Dey Rush",
        audioUrl: "https://blob.v0.dev/danni-no-dey-rush",
        duration: "3:28",
      },
      {
        id: "danni-2",
        title: "Body Dey Go Round",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Body%20Dey%20Go%20Round-8gX4KUzGGS8WztaOT9FKeBdcxGmXpm.mp3",
        duration: "3:45",
      },
      {
        id: "danni-3",
        title: "Memories",
        audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Memories-zJI3JoOHb2HwApvhi2zCXqa9wscBrH.mp3",
        duration: "4:02",
      },
      {
        id: "danni-4",
        title: "Good Time Tonight",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Good%20Time%20Tonight-UAWWiQMUxp3hzfAVwIJNgfUp8GRJ2Z.mp3",
        duration: "3:38",
      },
      {
        id: "danni-5",
        title: "Call Me",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Call%20Me-hOk1QvyWVUCbpvMhM61IOo4y8pA5YP.mp3",
        duration: "3:52",
      },
      {
        id: "danni-6",
        title: "E Sweet Like Suga",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/E%20Sweet%20Like%20Suga-w8OJqiortop8tqT0SyvjqmqJtt7NC4.mp3",
        duration: "4:15",
      },
    ],
    photoGallery: [
      {
        id: "danni-photo-1",
        src: "/images/danni-blaze/08.jpg",
        alt: "Danni Blaze in vibrant African print bomber jacket with multiple patterns and colors on city street at golden hour",
        caption: "Cultural Pride",
      },
      {
        id: "danni-photo-2",
        src: "/images/danni-blaze/03.jpg",
        alt: "Danni Blaze in red African print coat on wet city street at night with neon signs and moody lighting",
        caption: "Neon Nights",
      },
      {
        id: "danni-photo-3",
        src: "/images/danni-blaze/18.jpg",
        alt: "Danni Blaze in professional recording studio with mixing console and equipment, wearing black bomber jacket and gold chain",
        caption: "Studio Sessions",
      },
      {
        id: "danni-photo-4",
        src: "/images/danni-blaze/06.jpg",
        alt: "Danni Blaze in long African print coat with geometric patterns on wet city street at night with neon lighting",
        caption: "Night Patterns",
      },
      {
        id: "danni-photo-5",
        src: "/images/danni-blaze/22.jpg",
        alt: "Danni Blaze in elegant restaurant setting with purple ambient lighting, wearing black suit with purple shirt and gold chain",
        caption: "Elegant Dining",
      },
      {
        id: "danni-photo-6",
        src: "/images/danni-blaze/01.jpg",
        alt: "Danni Blaze in money print puffer jacket with gold chains and red sunglasses in studio setting",
        caption: "Studio Flex",
      },
      {
        id: "danni-photo-7",
        src: "/images/danni-blaze/10.jpg",
        alt: "Danni Blaze in orange African print coat on neon-lit city street at night with vibrant lighting",
        caption: "City Fire",
      },
      {
        id: "danni-photo-8",
        src: "/images/danni-blaze/16.jpg",
        alt: "Danni Blaze in upscale venue with purple lighting wearing black leather blazer and dark shirt",
        caption: "Night Club",
      },
      {
        id: "danni-photo-9",
        src: "/images/danni-blaze/04.jpg",
        alt: "Danni Blaze in orange African print bomber jacket in desert landscape setting with sand dunes",
        caption: "Desert Vibes",
      },
      {
        id: "danni-photo-10",
        src: "/images/danni-blaze/21.jpg",
        alt: "Danni Blaze in recording studio wearing headphones, black tracksuit and gold medallion necklace",
        caption: "Studio Focus",
      },
      {
        id: "danni-photo-11",
        src: "/images/danni-blaze/07.jpg",
        alt: "Danni Blaze in orange and navy African print bomber jacket walking on city street at golden hour with colorful murals",
        caption: "Street Art",
      },
      {
        id: "danni-photo-12",
        src: "/images/danni-blaze/12.jpg",
        alt: "Danni Blaze outdoors against white brick wall wearing black leather jacket with sunglasses and gold chains, giving thumbs up",
        caption: "Confident Vibes",
      },
      {
        id: "danni-photo-13",
        src: "/images/danni-blaze/19.jpg",
        alt: "Close-up portrait of Danni Blaze wearing black sunglasses, black leather jacket and gold chain necklace",
        caption: "Portrait Style",
      },
      {
        id: "danni-photo-14",
        src: "/images/danni-blaze/05.jpg",
        alt: "Danni Blaze in red African print coat in the rain on city street with neon lighting and atmospheric effects",
        caption: "Rain & Neon",
      },
      {
        id: "danni-photo-15",
        src: "/images/danni-blaze/17.jpg",
        alt: "Danni Blaze in studio setting wearing bright orange blazer with black crossbody bag and gold chain",
        caption: "Bold Fashion",
      },
      {
        id: "danni-photo-16",
        src: "/images/danni-blaze/11.jpg",
        alt: "Danni Blaze walking on city street wearing olive green military-style jacket with African-inspired crossbody bag and gold chains",
        caption: "Street Style",
      },
      {
        id: "danni-photo-17",
        src: "/images/danni-blaze/20.jpg",
        alt: "Danni Blaze in recording studio with professional microphone, wearing denim jacket and gold chains",
        caption: "Recording Booth",
      },
      {
        id: "danni-photo-18",
        src: "/images/danni-blaze/09.jpg",
        alt: "Danni Blaze in orange and green bomber jacket with African-inspired patterns walking on city street with colorful murals",
        caption: "Urban Culture",
      },
      {
        id: "danni-photo-19",
        src: "/images/danni-blaze/13.jpg",
        alt: "Danni Blaze against white brick wall wearing black leather jacket with orange collar details and gold chains",
        caption: "Urban Edge",
      },
      {
        id: "danni-photo-20",
        src: "/images/danni-blaze/02.jpg",
        alt: "Danni Blaze in beige puffer jacket with layered gold chains and red sunglasses in studio setting",
        caption: "Golden Chains",
      },
    ],
  },
  {
    id: "3",
    name: "Lucas Meno",
    slug: "lucas-meno",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lucas%20Meno.jpg-qm5NB9052ElC9YU9bNz7jLwxvlIZrv.jpeg",
    bio: "Lucas Meno is an AI artist that blends R&B smoothness with Rap elements through sophisticated natural language processing and music composition algorithms. Originally conceptualized with urban music traditions in mind, this artificial New York-based artist brings a modern AI approach to R&B/Rap fusion. His AI-generated honest storytelling and warm synthetic vocals create an intimate connection with listeners, proving that artificial intelligence can capture urban music authenticity with the energy and diversity of New York City.",
    location: "New York, NY",
    genre: "R&B/Rap",
    socialMedia: {
      instagram: "https://instagram.com/lucasmeno",
      spotify: "https://open.spotify.com/artist/lucasmeno",
      youtube: "https://youtube.com/lucasmenomusic",
    },
    albums: [
      {
        title: "Quiet Mornings",
        year: 2025,
        coverArt: "/images/albums/quiet-mornings.jpg",
        tracks: ["Coffee Shop", "Morning Light", "Whispered Words", "Sunday Drive"],
      },
      {
        title: "Stories Untold",
        year: 2024,
        coverArt: "/images/albums/stories-untold.jpg",
        tracks: ["Old Letters", "Hometown", "Memories", "New Beginnings", "The Road Ahead"],
      },
    ],
    stats: {
      monthlyListeners: "67K",
      totalStreams: "1.2M",
      followers: "28K",
    },
    featured: true,
    featuredTrack: {
      title: "A Freak",
      audioUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a-freak-CsnPTGuptcyUhADDFkq8a9djIlYxMe.mp3",
      duration: "3:47",
    },
    photoGallery: [
      {
        id: "lucas-photo-1",
        src: "/images/lucas-meno/11.jpg",
        alt: "Lucas Meno in golden suit with chain necklace leaning against vintage car with palm trees and neon lighting in retro Miami setting",
        caption: "Miami Nights",
      },
      {
        id: "lucas-photo-2",
        src: "/images/lucas-meno/24.jpg",
        alt: "Lucas Meno in dark suit leaning against vintage car in urban nighttime setting with neon lights and city atmosphere",
        caption: "Neon Nights",
      },
      {
        id: "lucas-photo-3",
        src: "/images/lucas-meno/16.jpg",
        alt: "Lucas Meno in burgundy velvet blazer with patterned shirt in recording studio with piano and professional equipment",
        caption: "Studio Luxury",
      },
      {
        id: "lucas-photo-4",
        src: "/images/lucas-meno/22.jpg",
        alt: "Lucas Meno in cream suit with pearl necklace and jewelry sitting elegantly on vintage yellow chair",
        caption: "Vintage Elegance",
      },
      {
        id: "lucas-photo-5",
        src: "/images/lucas-meno/08.jpg",
        alt: "Lucas Meno in teal shirt at piano with vintage microphone in recording studio with warm atmospheric lighting",
        caption: "Piano Sessions",
      },
      {
        id: "lucas-photo-6",
        src: "/images/lucas-meno/17.jpg",
        alt: "Lucas Meno in black leather jacket with sunglasses on city street at night with urban lighting and bokeh effects",
        caption: "Night Streets",
      },
      {
        id: "lucas-photo-7",
        src: "/images/lucas-meno/26.jpg",
        alt: "Lucas Meno in bright blue suit with red accents and burgundy loafers against teal studio background in fashion-forward styling",
        caption: "Color Pop",
      },
      {
        id: "lucas-photo-8",
        src: "/images/lucas-meno/13.jpg",
        alt: "Lucas Meno in dark suit with patterned details leaning against car in urban nighttime setting with city lights",
        caption: "City Nights",
      },
      {
        id: "lucas-photo-9",
        src: "/images/lucas-meno/25.jpg",
        alt: "Lucas Meno in cream suit with pearl necklace sitting on vintage yellow chair in sophisticated studio setting",
        caption: "Classic Luxury",
      },
      {
        id: "lucas-photo-10",
        src: "/images/lucas-meno/07.jpg",
        alt: "Lucas Meno in burgundy blazer with gold chain necklace in upscale lounge setting with warm lighting and bookshelves",
        caption: "Lounge Vibes",
      },
      {
        id: "lucas-photo-11",
        src: "/images/lucas-meno/19.jpg",
        alt: "Lucas Meno in light blue blazer with pearl necklace and round sunglasses against neutral background in clean studio portrait",
        caption: "Studio Fresh",
      },
      {
        id: "lucas-photo-12",
        src: "/images/lucas-meno/14.jpg",
        alt: "Lucas Meno in patterned blazer with metallic details leaning against car in urban nighttime setting with bokeh city lights",
        caption: "Urban Elegance",
      },
      {
        id: "lucas-photo-13",
        src: "/images/lucas-meno/21.jpg",
        alt: "Lucas Meno in brown leather jacket with sunglasses on city street in urban setting with warm golden hour lighting",
        caption: "Golden Street",
      },
      {
        id: "lucas-photo-14",
        src: "/images/lucas-meno/09.jpg",
        alt: "Lucas Meno in black blazer with burgundy shirt looking upward in recording studio with vintage microphone and warm lighting",
        caption: "Studio Portrait",
      },
      {
        id: "lucas-photo-15",
        src: "/images/lucas-meno/23.jpg",
        alt: "Lucas Meno in formal black suit with tie and glasses in professional business setting with city lights background",
        caption: "Business Professional",
      },
      {
        id: "lucas-photo-16",
        src: "/images/lucas-meno/12.jpg",
        alt: "Lucas Meno in brown blazer with gold chain necklace in upscale interior with warm lighting and sophisticated decor",
        caption: "Sophisticated",
      },
      {
        id: "lucas-photo-17",
        alt: "Lucas Meno in black leather jacket with sunglasses on city street in urban nighttime setting with warm atmospheric lighting",
        src: "/images/lucas-meno/18.jpg",
        caption: "Street Style",
      },
      {
        id: "lucas-photo-18",
        alt: "Lucas Meno with reddish hair in golden suit with chain necklace leaning against vintage car in retro neon setting",
        src: "/images/lucas-meno/15.jpg",
        caption: "Retro Gold",
      },
      {
        id: "lucas-photo-19",
        src: "/images/lucas-meno/10.jpg",
        alt: "Lucas Meno in formal black suit with burgundy tie and sunglasses in modern studio setting with professional lighting",
        caption: "Executive Style",
      },
      {
        id: "lucas-photo-20",
        src: "/images/lucas-meno/20.jpg",
        alt: "Lucas Meno in black leather jacket with sunglasses on city street with urban nighttime atmosphere and lighting",
        caption: "Urban Cool",
      },
    ],
  },
  {
    id: "1",
    name: "J Cruz",
    slug: "j-cruz",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/J%20Cruz.jpg-7StypHKFMQkoNrrg6anUnsECTtCP99.jpeg",
    bio: "J Cruz is an AI artist that specializes in blending contemporary Pop with R&B influences. Created through advanced AI systems and refined by human music producers, this artificial artist captures vibrant multicultural musical elements with sophisticated AI algorithms. With AI-generated smooth vocals and infectious rhythms crafted through machine learning, J Cruz represents the cutting edge of AI music creation in the Pop/R&B space since 2024.",
    location: "Miami, FL",
    genre: "Pop/R&B",
    socialMedia: {
      instagram: "https://instagram.com/jcruzmusic",
      twitter: "https://twitter.com/jcruzmusic",
      spotify: "https://open.spotify.com/artist/jcruz",
      youtube: "https://youtube.com/jcruzmusic",
    },
    albums: [
      {
        title: "Neon Nights",
        year: 2025,
        coverArt: "/images/albums/neon-nights.jpg",
        tracks: ["Midnight Drive", "City Lights", "Neon Dreams", "Late Night Vibes"],
      },
      {
        title: "Miami Sunset",
        year: 2024,
        coverArt: "/images/albums/miami-sunset.jpg",
        tracks: ["Ocean Breeze", "Sunset Boulevard", "Palm Trees", "Summer Love"],
      },
    ],
    stats: {
      monthlyListeners: "125K",
      totalStreams: "2.5M",
      followers: "45K",
    },
    featured: true,
    featuredTrack: {
      title: "Let's Talk About It",
      audioUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/let%27s-talk-about-it-Y5KVRtNKWyLiZFAkrfpNZsu9zmtoWM.mp3",
      duration: "4:02",
    },
    photoGallery: [
      {
        id: "jcruz-photo-1",
        src: "/images/j-cruz/14.jpg",
        alt: "J Cruz in nightclub with purple and red neon lighting wearing black leather jacket and black t-shirt",
        caption: "Nightlife",
      },
      {
        id: "jcruz-photo-2",
        src: "/images/j-cruz/11.jpg",
        alt: "J Cruz on red carpet with dramatic lighting wearing black leather jacket with layered chain necklaces",
        caption: "Red Carpet",
      },
      {
        id: "jcruz-photo-3",
        src: "/images/j-cruz/17.jpg",
        alt: "J Cruz in recording studio with colorful neon waveform displays wearing black leather jacket over cream t-shirt",
        caption: "Studio Vibes",
      },
      {
        id: "jcruz-photo-4",
        src: "/images/j-cruz/12.jpg",
        alt: "J Cruz in luxury apartment with teal velvet furniture and city views wearing dark navy blazer over blue shirt",
        caption: "Penthouse Life",
      },
      {
        id: "jcruz-photo-5",
        src: "/images/j-cruz/08.jpg",
        alt: "J Cruz in artistic blue-toned setting with flowing fabric backdrop, wearing light blue shirt and pants with pearl necklaces",
        caption: "Artistic Vision",
      },
      {
        id: "jcruz-photo-6",
        src: "/images/j-cruz/16.jpg",
        alt: "J Cruz walking on European-style street with brick buildings and graffiti wearing black leather jacket and pinstripe pants",
        caption: "European Streets",
      },
      {
        id: "jcruz-photo-7",
        src: "/images/j-cruz/19.jpg",
        alt: "J Cruz in recording studio with neon lighting and audio waveform displays wearing black leather jacket over white t-shirt with chain necklace",
        caption: "Studio Focus",
      },
      {
        id: "jcruz-photo-8",
        src: "/images/j-cruz/07.jpg",
        alt: "J Cruz in warm-toned studio setting wearing cream shirt over beige pants with pearl necklaces and rings, sitting by vintage bench",
        caption: "Studio Portrait",
      },
      {
        id: "jcruz-photo-9",
        src: "/images/j-cruz/15.jpg",
        alt: "J Cruz in nightclub with purple neon lighting and mirrors wearing black leather jacket with watch",
        caption: "Club Scene",
      },
      {
        id: "jcruz-photo-10",
        src: "/images/j-cruz/09.jpg",
        alt: "J Cruz in studio setting with concrete walls wearing tan suit with chain necklaces and rings, sitting by vintage bench",
        caption: "Urban Elegance",
      },
      {
        id: "jcruz-photo-11",
        src: "/images/j-cruz/13.jpg",
        alt: "J Cruz in modern urban setting with colorful murals wearing black leather jacket and black t-shirt",
        caption: "Street Style",
      },
      {
        id: "jcruz-photo-12",
        src: "/images/j-cruz/10.jpg",
        alt: "J Cruz in recording studio with professional equipment wearing navy bomber jacket over graphic t-shirt with chain necklaces",
        caption: "Recording Sessions",
      },
      {
        id: "jcruz-photo-13",
        src: "/images/j-cruz/18.jpg",
        alt: "J Cruz walking on European street with brick buildings and graffiti wearing black leather jacket and pinstripe pants",
        caption: "Street Walk",
      },
    ],
  },
  {
    id: "10",
    name: "Echo Bloom",
    slug: "echo-bloom",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Echo%20Bloom.jpg-dBP2iOnunJC3qywooHfqq8S9fkEOmM.jpeg",
    bio: "Echo Bloom is an AI artist that creates innovative Electronic/Indie music through cutting-edge sound synthesis and algorithmic composition. This artificial artist from London combines electronic production techniques with indie sensibilities, crafting atmospheric soundscapes that blur the lines between digital and organic. With AI-generated melodies and synthetic vocals processed through advanced neural networks, Echo Bloom represents the future of electronic music creation, bringing a unique blend of technology and artistry to the indie electronic scene.",
    location: "London, UK",
    genre: "Electronic/Indie",
    socialMedia: {
      instagram: "https://instagram.com/echobloommusic",
      twitter: "https://twitter.com/echobloommusic",
      spotify: "https://open.spotify.com/artist/echobloom",
      soundcloud: "https://soundcloud.com/echobloom",
    },
    albums: [
      {
        title: "Digital Echoes",
        year: 2025,
        coverArt: "/images/albums/digital-echoes.jpg",
        tracks: ["Synthetic Dreams", "Binary Bloom", "Electric Pulse", "Digital Rain", "Neon Nights"],
      },
    ],
    stats: {
      monthlyListeners: "89K",
      totalStreams: "1.8M",
      followers: "34K",
    },
    featured: true,
    featuredTrack: {
      title: "Get To The Loving",
      audioUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/get-to-the-loving-5RoKnrYEFTud3hCf078L3LivfOQ93B.mp3",
      duration: "4:15",
    },
    photoGallery: [
      {
        id: "echo-photo-1",
        src: "/images/echo-bloom/11.jpg",
        alt: "Echo Bloom walking through neon-lit urban tunnel wearing metallic puffer vest over black hoodie with chains, distressed jeans, and sneakers in cyberpunk atmosphere",
        caption: "Neon Tunnel",
      },
      {
        id: "echo-photo-2",
        src: "/images/echo-bloom/05.jpg",
        alt: "Echo Bloom in tie-dye hoodie with chains, sitting in vintage record store surrounded by vinyl records and audio equipment, holding a record",
        caption: "Record Store Vibes",
      },
      {
        id: "echo-photo-3",
        src: "/images/echo-bloom/19.jpg",
        alt: "Echo Bloom in luxurious studio with tufted leather couch, wearing purple-gray hoodie with chain necklace, distressed jeans, and sneakers with high-end studio equipment and piano",
        caption: "Luxury Studio",
      },
      {
        id: "echo-photo-4",
        src: "/images/echo-bloom/02.jpg",
        alt: "Echo Bloom in iridescent blue suit with sunglasses and chain necklace, sitting with studio light in background",
        caption: "Studio Glamour",
      },
      {
        id: "echo-photo-5",
        src: "/images/echo-bloom/15.jpg",
        alt: "Echo Bloom crouching in neon-lit alley wearing tie-dye jacket over hoodie with crossbody bag, jeans, and sneakers in vibrant urban street setting",
        caption: "Neon Alley",
      },
      {
        id: "echo-photo-6",
        src: "/images/echo-bloom/08.jpg",
        alt: "Echo Bloom in iridescent blue suit with sunglasses and vest, arms outstretched with large circular light behind him",
        caption: "Circular Light",
      },
      {
        id: "echo-photo-7",
        src: "/images/echo-bloom/14.jpg",
        alt: "Echo Bloom sitting in studio chair next to large mixing console, wearing black sweatshirt with layered chains, distressed jeans, and sneakers with professional studio monitors",
        caption: "Mixing Console",
      },
      {
        id: "echo-photo-8",
        src: "/images/echo-bloom/01.jpg",
        alt: "Echo Bloom with blonde hair in purple-gray turtleneck sitting on concrete steps with modern buildings in background",
        caption: "Urban Steps",
      },
      {
        id: "echo-photo-9",
        src: "/images/echo-bloom/17.jpg",
        alt: "Echo Bloom against graffiti wall holding drink, wearing leather vest over blue hoodie with chains and rings, jeans, and sneakers in urban street art setting",
        caption: "Street Art Vibes",
      },
      {
        id: "echo-photo-10",
        src: "/images/echo-bloom/04.jpg",
        alt: "Echo Bloom in iridescent blue suit with sunglasses, arms outstretched in dramatic pose against concrete architecture",
        caption: "Dramatic Pose",
      },
      {
        id: "echo-photo-11",
        src: "/images/echo-bloom/20.jpg",
        alt: "Echo Bloom in recording studio wearing blue-purple hoodie, light distressed jeans, and sneakers, sitting on chair next to mixing console with another person on couch in background",
        caption: "Studio Session",
      },
      {
        id: "echo-photo-12",
        src: "/images/echo-bloom/07.jpg",
        alt: "Echo Bloom in black turtleneck and checkered pants sitting on marble steps with modern glass buildings in background",
        caption: "Marble Steps",
      },
      {
        id: "echo-photo-13",
        src: "/images/echo-bloom/16.jpg",
        alt: "Echo Bloom in recording studio making peace sign, wearing denim jacket over black shirt with chains, sitting at large mixing console with professional equipment",
        caption: "Studio Peace",
      },
      {
        id: "echo-photo-14",
        src: "/images/echo-bloom/09.jpg",
        alt: "Echo Bloom in iridescent blue suit with sunglasses, arms outstretched against large circular light backdrop",
        caption: "Light Portal",
      },
      {
        id: "echo-photo-15",
        src: "/images/echo-bloom/12.jpg",
        alt: "Echo Bloom sitting on concrete steps in urban setting wearing black leather jacket with chain necklace, distressed jeans, and sneakers with modern architecture background",
        caption: "Urban Concrete",
      },
      {
        id: "echo-photo-16",
        src: "/images/echo-bloom/03.jpg",
        alt: "Echo Bloom smiling in purple-gray turtleneck and checkered pants sitting on concrete steps with modern architecture",
        caption: "City Smile",
      },
      {
        id: "echo-photo-17",
        src: "/images/echo-bloom/18.jpg",
        alt: "Echo Bloom in professional studio wearing purple-gray hoodie with chains, distressed jeans, and sneakers, sitting next to large mixing console with studio monitors",
        caption: "Studio Professional",
      },
      {
        id: "echo-photo-18",
        src: "/images/echo-bloom/06.jpg",
        alt: "Echo Bloom in iridescent blue suit with sunglasses, sitting on concrete steps in dramatic pose",
        caption: "Blue Hour",
      },
      {
        id: "echo-photo-19",
        src: "/images/echo-bloom/13.jpg",
        alt: "Echo Bloom in professional recording studio with others, wearing blue-purple hoodie and distressed jeans, sitting casually while others work at mixing console",
        caption: "Studio Collaboration",
      },
      {
        id: "echo-photo-20",
        src: "/images/echo-bloom/10.jpg",
        alt: "Echo Bloom in tie-dye hoodie with chains, sitting in vintage record store surrounded by vinyl records, neon signs, and audio equipment",
        caption: "Vinyl Collection",
      },
    ],
  },
  {
    id: "11",
    name: "Sadie Rose",
    slug: "sadie-rose",
    image: "/images/sadie-rose/01.jpg",
    bio: "Sadie Rose is an AI country artist that brings authentic storytelling and heartfelt melodies to the modern country scene through advanced narrative generation and vocal synthesis. This artificial artist from Nashville combines traditional country elements with contemporary production, creating songs that resonate with both classic country fans and new audiences. Her AI-generated lyrics capture the essence of country music's storytelling tradition while her synthetic vocals deliver emotional performances that feel genuinely human.",
    location: "Nashville, TN",
    genre: "Country",
    socialMedia: {
      instagram: "https://instagram.com/sadierosemusic",
      twitter: "https://twitter.com/sadierosemusic",
      spotify: "https://open.spotify.com/artist/sadierose",
    },
    albums: [
      {
        title: "Country Roads & City Dreams",
        year: 2025,
        coverArt: "/images/albums/country-roads.jpg",
        tracks: ["Small Town Heart", "City Lights", "Back Home", "Country Dreams", "Nashville Nights"],
      },
    ],
    stats: {
      monthlyListeners: "76K",
      totalStreams: "1.4M",
      followers: "31K",
    },
    featured: true,
    featuredTrack: {
      title: "Come Get It",
      audioUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/come-get-it-OJWOYgcILjrZD2V2gumuWBeGYl4OEP.mp3",
      duration: "3:52",
    },
    photoGallery: [
      {
        id: "sadie-photo-1",
        src: "/images/sadie-rose/41.jpg",
        alt: "Sadie Rose in concert setting with country music atmosphere",
        caption: "Live Country",
      },
      {
        id: "sadie-photo-2",
        src: "/images/sadie-rose/18.jpg",
        alt: "Sadie Rose in performance setting with stage lighting and country atmosphere",
        caption: "Stage Performance",
      },
      {
        id: "sadie-photo-3",
        src: "/images/sadie-rose/34.jpg",
        alt: "Sadie Rose in outdoor country setting with natural elements",
        caption: "Country Roads",
      },
      {
        id: "sadie-photo-4",
        src: "/images/sadie-rose/03.jpg",
        alt: "Sadie Rose in classic country attire with guitar in rustic setting",
        caption: "Classic Country",
      },
      {
        id: "sadie-photo-5",
        src: "/images/sadie-rose/50.jpg",
        alt: "Sadie Rose in contemporary country style with modern country elements",
        caption: "Country Contemporary",
      },
      {
        id: "sadie-photo-6",
        src: "/images/sadie-rose/24.jpg",
        alt: "Sadie Rose in Nashville setting with urban country vibe",
        caption: "Nashville Vibes",
      },
      {
        id: "sadie-photo-7",
        src: "/images/sadie-rose/12.jpg",
        alt: "Sadie Rose in recording studio with country music equipment",
        caption: "Studio Sessions",
      },
      {
        id: "sadie-photo-8",
        src: "/images/sadie-rose/37.jpg",
        alt: "Sadie Rose in vintage-inspired country outfit with natural backdrop",
        caption: "Vintage Country",
      },
      {
        id: "sadie-photo-9",
        src: "/images/sadie-rose/31.jpg",
        alt: "Sadie Rose in modern country style with contemporary elements",
        caption: "Modern Country",
      },
      {
        id: "sadie-photo-10",
        src: "/images/sadie-rose/48.jpg",
        alt: "Sadie Rose in elegant country setting with natural lighting and rustic background",
        caption: "Country Elegance",
      },
      {
        id: "sadie-photo-11",
        src: "/images/sadie-rose/39.jpg",
        alt: "Sadie Rose in traditional country setting with authentic styling",
        caption: "Country Tradition",
      },
      {
        id: "sadie-photo-12",
        src: "/images/sadie-rose/04.jpg",
        alt: "Sadie Rose in casual country style with denim and boots in outdoor setting",
        caption: "Country Casual",
      },
    ],
    tracks: [
      {
        id: "sadie-1",
        title: "Come Get It",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/come-get-it-OJWOYgcILjrZD2V2gumuWBeGYl4OEP.mp3",
        duration: "3:52",
      },
      {
        id: "sadie-2",
        title: "The Sun Will Shine Again",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/the-sun-will-shine-again-yJTsPWfLMxO4HJZJKeJSb5kUDHxeel.mp3",
        duration: "3:54",
      },
      {
        id: "sadie-3",
        title: "A Love Past",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a-love-past-ii-bOujSNqlozHmkI7eQWFjZtFLBIm0fB.mp3",
        duration: "4:01",
      },
      {
        id: "sadie-4",
        title: "Already Winning",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/already-winning-aFBlNaPEQsSzbR3ZlBq60CNkE37d6J.mp3",
        duration: "4:03",
      },
      {
        id: "sadie-5",
        title: "Playing For Keeps",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/playing-for-keeps-KnaVdE707qbCoHnhGd1XAbqhli84N3.mp3",
        duration: "4:13",
      },
      {
        id: "sadie-6",
        title: "Pull Up A Chair",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pull-up-a-chair-M0trTMP68zv7UiphDGhzXLpQaq9iy6.mp3",
        duration: "4:09",
      },
      {
        id: "sadie-7",
        title: "Memories Of A Love Past",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/memories-of-a-love-past-SHSzjEHsoghF54191mElgavzzqvlEN.mp3",
        duration: "3:41",
      },
      {
        id: "sadie-8",
        title: "Velvet Rope",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/velvet-rope-inWXidkBhiUCUA97lcmpDQZmfFNdgv.mp3",
        duration: "4:17",
      },
      {
        id: "sadie-9",
        title: "I Like The Ride",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/i-like-the-ride-aMY50k2BUdT38sAX4T2qCBbQTzsNnu.mp3",
        duration: "3:37",
      },
      {
        id: "sadie-10",
        title: "Could Have Been Here",
        audioUrl:
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/could-have-been-here-FpGTwY7p0OUvi0fTEUk08IYdjqYC4n.mp3",
        duration: "3:44",
      },
    ],
  },
  {
    id: "12",
    name: "Lunah",
    slug: "lunah",
    image: "/images/lunah/lunah.jpg",
    bio: "Lunah is an AI R&B duo that creates heartfelt harmonies and contemporary R&B music through sophisticated emotional modeling and vocal synthesis algorithms. This artificial duo brings the spirit of modern R&B into the digital age, with AI-generated vocal arrangements that capture the essence of duo dynamics and emotional depth. Their synthetic vocals carry the warmth and soul that R&B fans love, proving that artificial intelligence can master the art of R&B collaboration and harmony.",
    location: "Austin, TX",
    genre: "R&B Duo",
    socialMedia: {
      instagram: "https://instagram.com/lunahrnb",
      twitter: "https://twitter.com/lunahrnb",
      spotify: "https://open.spotify.com/artist/lunah",
    },
    albums: [
      {
        title: "Harmony & Soul",
        year: 2025,
        coverArt: "/images/albums/harmony-soul.jpg",
        tracks: ["Duo Dynamics", "R&B Heart", "Soul Connection", "Harmony Train", "Together Again"],
      },
    ],
    stats: {
      monthlyListeners: "63K",
      totalStreams: "1.1M",
      followers: "27K",
    },
    featured: true,
    featuredTrack: {
      title: "Wheels Fall Off",
      audioUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wheels-fall-off-b3gDDj5mhP7fl6jAeSHbybHGI6Elcr.mp3",
      duration: "4:05",
    },
    photoGallery: [
      {
        id: "lunah-photo-1",
        src: "/images/lunah/11.jpg",
        alt: "Lunah in vintage R&B style with retro elements",
        caption: "Vintage R&B",
      },
      {
        id: "lunah-photo-2",
        src: "/images/lunah/09.jpg",
        alt: "Lunah in soulful setting with classic R&B atmosphere",
        caption: "Soul Vibes",
      },
      {
        id: "lunah-photo-3",
        src: "/images/lunah/12.jpg",
        alt: "Lunah in modern R&B setting with contemporary vibes",
        caption: "Modern R&B",
      },
      {
        id: "lunah-photo-4",
        src: "/images/lunah/07.jpg",
        alt: "Lunah in R&B setting with natural lighting and urban elements",
        caption: "R&B Natural",
      },
      {
        id: "lunah-photo-5",
        src: "/images/lunah/10.jpg",
        alt: "Lunah in outdoor R&B setting with natural backdrop",
        caption: "R&B Outdoors",
      },
      {
        id: "lunah-photo-6",
        src: "/images/lunah/08.jpg",
        alt: "Lunah in Texas R&B style with authentic urban wear",
        caption: "Texas Style",
      },
    ],
  },
  {
    id: "13",
    name: "Cedar Line",
    slug: "cedar-line",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Cedar%20Line.jpg-HjdkXYcaCDndFtwrpgspguke6B1CAV.jpeg",
    bio: "Cedar Line is an AI country band that creates authentic country music through collaborative AI systems and traditional country instrumentation algorithms. This artificial group brings together multiple AI-generated personalities to create the classic country band sound, with harmonies, storytelling, and instrumental arrangements that honor country music traditions while pushing the boundaries of AI music creation. Their synthetic performances capture the camaraderie and musical chemistry that makes country bands special.",
    location: "Memphis, TN",
    genre: "Country Band",
    socialMedia: {
      instagram: "https://instagram.com/cedarlineband",
      twitter: "https://twitter.com/cedarlineband",
      spotify: "https://open.spotify.com/artist/cedarline",
    },
    albums: [
      {
        title: "Southern Roots",
        year: 2025,
        coverArt: "/images/albums/southern-roots.jpg",
        tracks: ["Southern Pride", "Country Roads", "Memphis Blues", "Family Ties", "Country Strong"],
      },
    ],
    stats: {
      monthlyListeners: "58K",
      totalStreams: "950K",
      followers: "24K",
    },
    featured: true,
    featuredTrack: {
      title: "The Honky Tonk Heart",
      audioUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/honky-tonk-heart-JyDemMPTwICBIozXczovBCs7soWokf.mp3",
      duration: "4:05",
    },
    photoGallery: [
      {
        id: "cedar-photo-1",
        src: "/images/cedar-line/15.jpg",
        alt: "Cedar Line in southern country setting with traditional country elements",
        caption: "Southern Roots",
      },
      {
        id: "cedar-photo-2",
        src: "/images/cedar-line/21.jpg",
        alt: "Cedar Line in concert setting with country music atmosphere",
        caption: "Country Concert",
      },
      {
        id: "cedar-photo-3",
        src: "/images/cedar-line/09.jpg",
        alt: "Cedar Line performing with country instruments and harmonies",
        caption: "Country Performance",
      },
      {
        id: "cedar-photo-4",
        src: "/images/cedar-line/17.jpg",
        alt: "Cedar Line performing with full country band arrangement",
        caption: "Full Band",
      },
      {
        id: "cedar-photo-5",
        src: "/images/cedar-line/08.jpg",
        alt: "Cedar Line in Memphis setting with southern country atmosphere",
        caption: "Memphis Sound",
      },
      {
        id: "cedar-photo-6",
        src: "/images/cedar-line/14.jpg",
        alt: "Cedar Line performing live with country band setup",
        caption: "Live Country",
      },
      {
        id: "cedar-photo-7",
        src: "/images/cedar-line/11.jpg",
        alt: "Cedar Line in outdoor country setting with natural elements",
        caption: "Country Outdoors",
      },
      {
        id: "cedar-photo-8",
        src: "/images/cedar-line/19.jpg",
        alt: "Cedar Line in modern country venue with contemporary country vibes",
        caption: "Modern Country",
      },
      {
        id: "cedar-photo-9",
        src: "/images/cedar-line/07.jpg",
        alt: "Cedar Line band in country setting with traditional instruments",
        caption: "Country Band",
      },
      {
        id: "cedar-photo-10",
        src: "/images/cedar-line/16.jpg",
        alt: "Cedar Line band in vintage country style with classic instruments",
        caption: "Vintage Country",
      },
      {
        id: "cedar-photo-11",
        src: "/images/cedar-line/12.jpg",
        alt: "Cedar Line in traditional country venue with authentic atmosphere",
        caption: "Country Venue",
      },
      {
        id: "cedar-photo-12",
        src: "/images/cedar-line/20.jpg",
        alt: "Cedar Line band members in traditional country attire with instruments",
        caption: "Country Tradition",
      },
      {
        id: "cedar-photo-13",
        src: "/images/cedar-line/10.jpg",
        alt: "Cedar Line in recording studio with country music equipment",
        caption: "Studio Recording",
      },
      {
        id: "cedar-photo-14",
        src: "/images/cedar-line/18.jpg",
        alt: "Cedar Line in acoustic country setting with natural lighting and rustic elements",
        caption: "Acoustic Country",
      },
      {
        id: "cedar-photo-15",
        src: "/images/cedar-line/13.jpg",
        alt: "Cedar Line band members with country instruments in rustic setting",
        caption: "Rustic Country",
      },
    ],
  },
]

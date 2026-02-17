"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Play, Download, Users, Radio, Calendar, MapPin, ChevronDown, Clock, Pause } from "lucide-react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageBlurOverlay from "@/components/page-blur-overlay"
import AnimatedBanner from "@/components/animated-banner"
import dynamic from "next/dynamic"

const Hero3DBackground = dynamic(() => import("@/components/hero-3d-background"), {
  ssr: false,
  loading: () => <div className="absolute inset-0 z-0 bg-black" />,
})
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { artists } from "@/lib/artists-data"
import { afroSquareTracks } from "@/lib/afro-square-tracks"
import { countrySquareTracks } from "@/lib/country-square-tracks"
import { popSquareTracks } from "@/lib/pop-square-tracks"
import { rnbSquareTracks } from "@/lib/rnb-square-tracks"
import Link from "next/link"
import Image from "next/image"
import { useRadio } from "@/components/radio-context"

// Hero background images - Updated to use artist page background images
const heroImages = [
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/25-HzK6wNy2rPJ9vMK8JR5WWtm2HfqtG2.jpg",
    alt: "Luv Tonez - R&B group in black leather jackets with ornate embroidery",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Virgo%20Dunst.jpg-vp9S492loS2RnMXAwqNeHLd624fL3J.jpeg",
    alt: "Virgo Dunst - R&B artist in orange jacket and sunglasses",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/J%20Cruz.jpg-7StypHKFMQkoNrrg6anUnsECTtCP99.jpeg",
    alt: "J Cruz - Pop/R&B artist in light blue outfit in icy environment",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Saka.jpg-Baf8Jk6hVqnuPMJGhZTQ0RBeaxJiaI.jpeg",
    alt: "Saka - Alternative Pop artist in black leather on urban steps",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Neka.jpg-TARTWffKgN9aVmuYJLnVAVvrAFmgcx.jpeg",
    alt: "Neka - Afrobeat artist with gold jewelry and floating orbs",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Danni%20Blaze.jpg-SdFAgQ0v6zRzyydXua2XvyBBz3RumT.jpeg",
    alt: "Danni Blaze - Afrobeat artist in cream puffer jacket with chains",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Echo%20Bloom.jpg-dBP2iOnunJC3qywooHfqq8S9fkEOmM.jpeg",
    alt: "RIVEN COLE - Electronic artist in blue suit with arms outstretched",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/31-EQaG0I4PFm5Tll7bJmw8nZpJ21sWxx.jpg",
    alt: "Lucas Meno - R&B/Rap artist",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Neilly%20Storm.jpg-pbl9md9S3nFpvpk2TyAlyI3p5qqb84.jpeg",
    alt: "Neilly Storm - Indie/Alternative artist in dramatic red feathered coat",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/22-mCZzZ3Cl8ju46UAbWa3mLkyXpjg9y1.jpeg",
    alt: "Cedar Line - Country band",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Lunah18-gD5PNUSmeEkrq7UC0Wl2kyiL7h7kwx.jpeg",
    alt: "Lunah - R&B duo",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/14-asaVJLiSUcRtW2by0FwVUgjFzv5yjX.jpg",
    alt: "ELKANA - R&B/Hip-Hop artist",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/20-d1SeTvK9UkPOcFv8EC03DhWWdhc1De.jpg",
    alt: "Lea Babi - Afro R&B artist in red velvet cardigan",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Fizz%2001-RczHsY5ILBPm6hvVZRkQw6Rj91ugda.jpg",
    alt: "FIZZ - Afrobeat Swahili artist",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/05-HPLAMhHejSLZoh63h6siMaHcaJIjrU.jpg",
    alt: "Echo Rae - Alternative Pop artist",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/19-TcNVRL0eKvJrOTLNixNSu5meN9uz2I.jpg",
    alt: "LUMI ASTRA - Pop artist in black turtleneck with silver chain bracelets",
  },
  {
    src: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0-40v2Ggy0YKWfIl7wTFE8xHHuQvR2I7.jpg",
    alt: "NOVA LIYAH - Pop artist with platinum blonde hair, round sunglasses, geometric diamond earrings, floral jacket",
  },
]

export default function HomePage() {
  const [isPageBlurred, setIsPageBlurred] = useState(false)
  const [featuredArtistIndex, setFeaturedArtistIndex] = useState(0)
  const [showSchedule, setShowSchedule] = useState(false)
  const { toggleRadio, togglePlay, isRadioOpen, isPlaying } = useRadio()
  const [isPlayingFeatured, setIsPlayingFeatured] = useState(false)
  const [featuredAudio, setFeaturedAudio] = useState<HTMLAudioElement | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Rotate featured artist every 24 hours
  useEffect(() => {
    const now = new Date()
    const dayOfYear = Math.floor((now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24))
    setFeaturedArtistIndex(dayOfYear % (artists?.length || 1))
  }, [])

  // Auto-rotate background images every 4 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % heroImages.length)
    }, 4000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const featuredArtist = artists && artists.length > 0 ? artists[featuredArtistIndex] || artists[0] : null

  const handleListenLive = () => {
    if (!isRadioOpen) {
      // Open radio first
      toggleRadio()
      // Start playing after a short delay to ensure radio is initialized
      setTimeout(() => {
        if (!isPlaying) {
          togglePlay()
        }
      }, 500)
    } else if (!isPlaying) {
      // Radio is open but not playing, start playing
      togglePlay()
    }
  }

  const handleViewSchedule = () => {
    setShowSchedule(!showSchedule)
  }

  // Handle click outside to close schedule
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showSchedule) {
        const target = event.target as HTMLElement
        if (!target.closest(".schedule-dropdown") && !target.closest(".schedule-button")) {
          setShowSchedule(false)
        }
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showSchedule])

  // Handle escape key
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && showSchedule) {
        setShowSchedule(false)
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [showSchedule])

  const programSchedule = [
    { start: "05:00", end: "07:00", show: "Afrobeat Mix", description: "Start your day with vibrant Afrobeat rhythms" },
    { start: "07:00", end: "09:00", show: "Country Mix", description: "Morning country classics and new hits" },
    { start: "09:00", end: "11:00", show: "R&B Mix", description: "Smooth R&B to keep you going" },
    { start: "11:00", end: "13:00", show: "Pop Mix", description: "The biggest pop hits of today" },
    { start: "13:00", end: "15:00", show: "Afrobeat Mix", description: "Afternoon Afrobeat energy boost" },
    { start: "15:00", end: "17:00", show: "Country Mix", description: "Country sounds for your afternoon" },
    { start: "17:00", end: "19:00", show: "R&B Mix", description: "Evening R&B vibes" },
    { start: "19:00", end: "21:00", show: "Pop Mix", description: "Prime time pop favorites" },
    { start: "21:00", end: "00:00", show: "Afrobeat", description: "Late night Afrobeat party" },
    { start: "00:00", end: "05:00", show: "Variety Mix", description: "Overnight mix of all genres" },
  ]

  // Updated releases array with new album covers
  const releases = [
    {
      id: "afro-square",
      title: "Afro Square",
      artist: "Various Artists",
      year: "2025",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Afrobeat.jpg-RGjSYRGm2Ax7GzCvIgl6TGBzrSUz8B.jpeg",
      tracks: afroSquareTracks.length,
      genre: "Afrobeat",
      color: "from-orange-500 to-red-600",
    },
    {
      id: "country-square",
      title: "Country Square",
      artist: "Various Artists",
      year: "2025",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Country.jpg-Y74tKbTs09Vvd2ZtQc4a5GePRNODgD.jpeg",
      tracks: countrySquareTracks.length,
      genre: "Country",
      color: "from-amber-500 to-yellow-600",
    },
    {
      id: "pop-square",
      title: "Pop Square Vol. 1",
      artist: "Various Artists",
      year: "2025",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pop.jpg-DJQTTu2qb1hvXy3n0J7Ixw53nrO8gt.jpeg",
      tracks: popSquareTracks.length,
      genre: "Pop",
      color: "from-pink-500 to-purple-600",
    },
    {
      id: "rnb-square",
      title: "R&B Square",
      artist: "Various Artists",
      year: "2025",
      image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/R%26B.jpg-465Ppu2BX5kxmQZ2uQgapX0gQjg5si.jpeg",
      tracks: rnbSquareTracks.length,
      genre: "R&B",
      color: "from-purple-500 to-indigo-600",
    },
  ]

  const handlePlayFeaturedTrack = () => {
    if (!featuredArtist?.featuredTrack) return

    if (isPlayingFeatured && featuredAudio) {
      // Pause the track
      featuredAudio.pause()
      setIsPlayingFeatured(false)
    } else {
      // Stop any existing audio
      if (featuredAudio) {
        featuredAudio.pause()
        featuredAudio.currentTime = 0
      }

      // Create new audio element
      const audio = new Audio(featuredArtist.featuredTrack.audioUrl)
      audio.crossOrigin = "anonymous"
      audio.volume = 0.7

      // Set up event listeners
      audio.addEventListener("play", () => {
        setIsPlayingFeatured(true)
      })

      audio.addEventListener("pause", () => {
        setIsPlayingFeatured(false)
      })

      audio.addEventListener("ended", () => {
        setIsPlayingFeatured(false)
        setFeaturedAudio(null)
      })

      audio.addEventListener("error", (e) => {
        console.error("Error playing featured track:", e)
        setIsPlayingFeatured(false)
        setFeaturedAudio(null)
      })

      // Play the track
      audio.play().catch((error) => {
        console.error("Error playing featured track:", error)
        setIsPlayingFeatured(false)
      })

      setFeaturedAudio(audio)
    }
  }

  useEffect(() => {
    return () => {
      if (featuredAudio) {
        featuredAudio.pause()
        featuredAudio.currentTime = 0
      }
    }
  }, [featuredAudio])

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header onBlurChange={setIsPageBlurred} />

      <PageBlurOverlay isBlurred={isPageBlurred}>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <Hero3DBackground />

          {/* Background Image Carousel */}
          <div className="absolute inset-0 z-[1] opacity-80">
            <div className="relative w-full h-full">
              {heroImages.map((image, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={image.src || "/placeholder.svg"}
                    alt={image.alt}
                    fill
                    className="object-cover"
                    priority={index < 3}
                    sizes="100vw"
                    quality={85}
                  />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-8xl font-bold tracking-wider mb-6">
                <span className="text-amber-500">SQUARE</span>DRUM
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-4 font-light">THE FUTURE OF MUSIC</p>
              <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                Where AI innovation meets human creativity. Experience the revolutionary collaboration between
                artificial intelligence and talented music professionals.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-3 text-lg"
                >
                  <Link href="/releases">
                    <Play className="mr-2 h-5 w-5" />
                    Explore Music
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black px-8 py-3 text-lg bg-transparent"
                >
                  <Link href="/artists">
                    <Users className="mr-2 h-5 w-5" />
                    Meet Our AI Artists
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Animated Banner */}
          <div className="absolute bottom-0 left-0 right-0 z-20">
            <AnimatedBanner />
          </div>
        </section>

        {/* Featured Releases */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wider mb-4">
                FEATURED <span className="text-amber-500">RELEASES</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Discover our latest AI-generated music compilations, crafted through the perfect collaboration of
                artificial intelligence and human expertise.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {releases.map((release, index) => (
                <motion.div
                  key={release.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="bg-zinc-900 border-zinc-800 hover:border-amber-500/50 transition-all duration-300 group overflow-hidden">
                    <Link href={`/releases#${release.id}`}>
                      <div className="relative aspect-square overflow-hidden">
                        <Image
                          src={release.image || "/placeholder.svg"}
                          alt={`${release.title} - ${release.genre} compilation album cover`}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          quality={90}
                        />
                        <div
                          className={`absolute inset-0 bg-gradient-to-t ${release.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`}
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button size="lg" className="bg-white/90 text-black hover:bg-white">
                            <Play className="mr-2 h-5 w-5" />
                            Listen Now
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {release.genre}
                          </Badge>
                          <span className="text-xs text-gray-500">{release.year}</span>
                        </div>
                        <h3 className="font-cinzel text-xl font-bold mb-1">{release.title}</h3>
                        <p className="text-gray-400 text-sm mb-3">{release.artist}</p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>{release.tracks} tracks</span>
                          <span>AI + Human</span>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Artist Spotlight */}
        {featuredArtist && (
          <section className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-900/50">
            <div className="max-w-7xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-center mb-16"
              >
                <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wider mb-4">
                  ARTIST <span className="text-amber-500">SPOTLIGHT</span>
                </h2>
                <p className="text-lg text-gray-400">Featuring a different AI artist every day</p>
              </motion.div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="relative"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden">
                    <Image
                      src={featuredArtist.image || "/placeholder.svg"}
                      alt={featuredArtist.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-amber-500 text-black px-4 py-2 rounded-full font-semibold">
                    AI ARTIST
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6 }}
                  className="space-y-6"
                >
                  <div>
                    <Badge variant="outline" className="mb-4 text-amber-500 border-amber-500">
                      {featuredArtist.genre}
                    </Badge>
                    <h3 className="font-cinzel text-3xl sm:text-4xl font-bold mb-4">{featuredArtist.name}</h3>
                    <p className="text-gray-300 text-lg leading-relaxed text-justify">{featuredArtist.bio}</p>
                  </div>

                  {featuredArtist.featuredTrack && (
                    <div className="relative bg-black/40 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6 hover:border-amber-500/50 transition-all duration-300">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="text-amber-500 text-sm font-cinzel tracking-wider mb-2 uppercase">
                            Featured Track
                          </div>
                          <h4 className="text-white text-xl font-bold mb-1">{featuredArtist.featuredTrack.title}</h4>
                          <p className="text-gray-400 text-sm">{featuredArtist.featuredTrack.duration}</p>
                        </div>
                        <Button
                          onClick={handlePlayFeaturedTrack}
                          className={`
                            w-11 h-11 p-0 
                            bg-gradient-to-br from-amber-400 to-amber-600 
                            hover:from-amber-500 hover:to-amber-700 
                            text-black 
                            rounded-2xl 
                            shadow-lg hover:shadow-xl 
                            border-0 
                            transition-all duration-200 
                            ${isPlayingFeatured ? "scale-105 shadow-amber-500/25" : "hover:scale-105"}
                            active:scale-95
                          `}
                        >
                          {isPlayingFeatured ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
                        </Button>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button asChild className="bg-amber-500 hover:bg-amber-600 text-black">
                      <Link href={`/artists/${featuredArtist.slug}`}>View Profile</Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black bg-transparent"
                    >
                      <Link href="/artists">All Artists</Link>
                    </Button>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Radio Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="font-cinzel text-3xl sm:text-4xl lg:text-5xl font-bold tracking-wider mb-4">
                MUSIC SQUARE <span className="text-amber-500">RADIO</span>
              </h2>
              <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                Tune in to our 24/7 AI-curated radio station featuring the best of SQUAREDRUM artists
              </p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              <Card className="bg-gradient-to-r from-zinc-900 to-zinc-800 border-amber-500/30">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row items-center gap-8">
                    <div className="relative">
                      <div className="w-32 h-32 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 flex items-center justify-center">
                        <Radio className="h-16 w-16 text-black" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse" />
                    </div>

                    <div className="flex-1 text-center lg:text-left">
                      <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                        <span className="text-red-500 font-semibold">LIVE NOW</span>
                      </div>
                      <h3 className="font-cinzel text-2xl font-bold mb-2">Music Square Radio</h3>
                      <p className="text-gray-400 mb-6">
                        Broadcasting the latest AI-generated hits 24/7. Discover new tracks, exclusive releases, and
                        behind-the-scenes content.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start relative">
                        <Button onClick={handleListenLive} className="bg-amber-500 hover:bg-amber-600 text-black">
                          <Radio className="mr-2 h-4 w-4" />
                          Listen Live
                        </Button>

                        <div className="relative">
                          <Button
                            onClick={handleViewSchedule}
                            variant="outline"
                            className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black bg-transparent schedule-button"
                          >
                            <Calendar className="mr-2 h-4 w-4" />
                            View Schedule
                            <ChevronDown
                              className={`ml-2 h-4 w-4 transition-transform duration-300 ${showSchedule ? "rotate-180" : ""}`}
                            />
                          </Button>

                          {/* Schedule Dropdown */}
                          {showSchedule && (
                            <>
                              {/* Backdrop */}
                              <div className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm" />

                              {/* Schedule Menu */}
                              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 sm:w-96 bg-black/95 backdrop-blur-xl border border-amber-500/30 rounded-lg py-4 z-[61] shadow-2xl animate-in slide-in-from-top-2 duration-300 schedule-dropdown">
                                <div className="px-4 pb-3 mb-3 border-b border-amber-500/20">
                                  <h3 className="font-cinzel text-lg tracking-wider text-amber-500 text-center">
                                    MUSIC SQUARE RADIO PROGRAMMING
                                  </h3>
                                </div>

                                <div className="max-h-80 overflow-y-auto px-2">
                                  {programSchedule.map((program, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between px-3 py-3 mx-1 rounded-md hover:bg-amber-500/10 transition-all duration-200"
                                    >
                                      <div className="flex items-center">
                                        <Clock className="h-4 w-4 text-amber-500 mr-3 flex-shrink-0" />
                                        <div>
                                          <div className="text-white font-medium text-sm">
                                            {program.start} - {program.end}
                                          </div>
                                          <div className="text-gray-400 text-xs">{program.description}</div>
                                        </div>
                                      </div>
                                      <div className="text-amber-500 font-semibold text-sm ml-4 flex-shrink-0">
                                        {program.show}
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                <div className="px-4 pt-3 mt-3 border-t border-amber-500/20 text-center">
                                  <p className="text-xs text-gray-400">All times in Pacific Standard Time (PST)</p>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-wider mb-6">
                EXPERIENCE THE <span className="text-amber-500">FUTURE</span>
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-3"
                >
                  <Link href="/releases">
                    <Download className="mr-2 h-5 w-5" />
                    Download Music
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black px-8 py-3 bg-transparent"
                >
                  <Link href="/about">
                    <MapPin className="mr-2 h-5 w-5" />
                    Learn More
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </PageBlurOverlay>
    </div>
  )
}

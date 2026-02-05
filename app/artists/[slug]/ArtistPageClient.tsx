"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Play,
  Pause,
  Download,
  ArrowLeft,
  Music,
  MapPin,
  Camera,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Calendar,
  User,
  Eye,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import Link from "next/link"
import Image from "next/image"
import type { Artist } from "@/lib/artists-data"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageBlurOverlay from "@/components/page-blur-overlay"
import GalleryClient from "./GalleryClient"

interface ArtistPageClientProps {
  artist: Artist
}

export default function ArtistPageClient({ artist }: ArtistPageClientProps) {
  const [isPageBlurred, setIsPageBlurred] = useState(false)
  const [isPlayingFeatured, setIsPlayingFeatured] = useState(false)
  const [featuredAudio, setFeaturedAudio] = useState<HTMLAudioElement | null>(null)
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null)
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"music" | "gallery" | "video">("gallery")
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0)

  // Gallery pagination states
  const [visibleImageCount, setVisibleImageCount] = useState(16)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showAllImages, setShowAllImages] = useState(false)
  const [dynamicGalleryFiles, setDynamicGalleryFiles] = useState<string[]>([])

  const IMAGES_PER_LOAD = 12 // Number of images to load each time

  // Fetch dynamic gallery files
  useEffect(() => {
    fetch(`/api/gallery/${artist.slug}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((arr) => setDynamicGalleryFiles(Array.isArray(arr) ? arr : []))
      .catch(() => setDynamicGalleryFiles([]))
  }, [artist.slug])

  const handlePlayPause = () => {
    if (!artist.featuredTrack) return

    if (isPlayingFeatured && featuredAudio) {
      featuredAudio.pause()
      setIsPlayingFeatured(false)
    } else {
      if (featuredAudio) {
        featuredAudio.pause()
        featuredAudio.currentTime = 0
      }

      const audio = new Audio(artist.featuredTrack.audioUrl)
      audio.crossOrigin = "anonymous"
      audio.volume = 0.7

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

      audio.play().catch((error) => {
        console.error("Error playing featured track:", error)
        setIsPlayingFeatured(false)
      })

      setFeaturedAudio(audio)
    }
  }

  const handleTrackPlayPause = (track: { id: string; title: string; audioUrl: string; duration: string }) => {
    if (currentTrack === track.id && isPlaying && currentAudio) {
      currentAudio.pause()
      setIsPlaying(false)
    } else {
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }

      if (featuredAudio) {
        featuredAudio.pause()
        setIsPlayingFeatured(false)
      }

      const audio = new Audio(track.audioUrl)
      audio.crossOrigin = "anonymous"
      audio.volume = 0.7

      audio.addEventListener("play", () => {
        setIsPlaying(true)
        setCurrentTrack(track.id)
      })

      audio.addEventListener("pause", () => {
        setIsPlaying(false)
      })

      audio.addEventListener("ended", () => {
        setIsPlaying(false)
        setCurrentTrack(null)
        setCurrentAudio(null)
      })

      audio.addEventListener("error", (e) => {
        console.error("Error playing track:", e)
        setIsPlaying(false)
        setCurrentTrack(null)
        setCurrentAudio(null)
      })

      audio.play().catch((error) => {
        console.error("Error playing track:", error)
        setIsPlaying(false)
        setCurrentTrack(null)
      })

      setCurrentAudio(audio)
    }
  }

  const handlePhotoClick = (photoSrc: string) => {
    setSelectedPhoto(photoSrc)
    setIsLightboxOpen(true)
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    setSelectedPhoto(null)
  }

  const nextGalleryImage = () => {
    if (dynamicGalleryFiles.length > 0) {
      setCurrentGalleryIndex((prev) => (prev + 1) % dynamicGalleryFiles.length)
    }
  }

  const prevGalleryImage = () => {
    if (dynamicGalleryFiles.length > 0) {
      setCurrentGalleryIndex((prev) => (prev - 1 + dynamicGalleryFiles.length) % dynamicGalleryFiles.length)
    }
  }

  // Handle "See More" functionality
  const handleSeeMore = async () => {
    if (!dynamicGalleryFiles.length || isLoadingMore) return

    setIsLoadingMore(true)

    // Simulate loading delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800))

    const newCount = Math.min(visibleImageCount + IMAGES_PER_LOAD, dynamicGalleryFiles.length)
    setVisibleImageCount(newCount)

    // If we've loaded all images, set showAllImages to true
    if (newCount >= dynamicGalleryFiles.length) {
      setShowAllImages(true)
    }

    setIsLoadingMore(false)
  }

  // Handle "Show Less" functionality
  const handleShowLess = () => {
    setVisibleImageCount(16)
    setShowAllImages(false)
    // Scroll back to gallery section smoothly
    const gallerySection = document.getElementById("gallery-section")
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  // Reset gallery state when switching tabs
  useEffect(() => {
    if (activeTab !== "gallery") {
      setVisibleImageCount(16)
      setShowAllImages(false)
      setIsLoadingMore(false)
    }
  }, [activeTab])

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      if (featuredAudio) {
        featuredAudio.pause()
        featuredAudio.currentTime = 0
      }
      if (currentAudio) {
        currentAudio.pause()
        currentAudio.currentTime = 0
      }
    }
  }, [featuredAudio, currentAudio])

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header onBlurChange={setIsPageBlurred} />

      <PageBlurOverlay isBlurred={isPageBlurred}>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src={artist.heroImage || artist.image || "/placeholder.svg"}
              alt={`${artist.name} hero image`}
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={85}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90" />
          </div>

          <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Badge variant="outline" className="mb-6 text-amber-500 border-amber-500 text-lg px-4 py-2">
                AI ARTIST
              </Badge>
              <h1 className="font-cinzel text-4xl sm:text-6xl lg:text-8xl font-bold tracking-wider mb-6">
                {artist.name}
              </h1>
              <p className="text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-4 font-light">{artist.genre}</p>
              <p className="text-lg sm:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
                {artist.tagline ||
                  `Experience the innovative sound of ${artist.name}, where AI creativity meets musical excellence.`}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-amber-500 hover:bg-amber-600 text-black font-semibold px-8 py-3 text-lg"
                >
                  <Link href="#content">
                    <Music className="mr-2 h-5 w-5" />
                    Explore Artist
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black px-8 py-3 text-lg bg-transparent"
                >
                  <Link href="/artists">
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    All Artists
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Main Content Section */}
        <section id="content" className="py-20 px-4 sm:px-6 lg:px-8 bg-zinc-950">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-2xl p-6 sticky top-8">
                  {/* Artist Image */}
                  <div className="relative aspect-square rounded-xl overflow-hidden mb-6">
                    <Image
                      src={artist.image || "/placeholder.svg"}
                      alt={artist.name}
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                  </div>

                  {/* Artist Name */}
                  <h2 className="font-cinzel text-2xl font-bold tracking-wider mb-6 text-center">
                    {artist.name.toUpperCase()}
                  </h2>

                  {/* Artist Details */}
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3 text-amber-500">
                      <User className="h-4 w-4" />
                      <span className="text-sm">AI-Generated Artist</span>
                    </div>
                    <div className="flex items-center gap-3 text-amber-500">
                      <Music className="h-4 w-4" />
                      <span className="text-sm">{artist.genre}</span>
                    </div>
                    <div className="flex items-center gap-3 text-amber-500">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">Joined {artist.debutYear || "2024"}</span>
                    </div>
                    <div className="flex items-center gap-3 text-amber-500">
                      <Camera className="h-4 w-4" />
                      <span className="text-sm">{dynamicGalleryFiles.length} Photos</span>
                    </div>
                  </div>

                  {/* About Section */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">About</h3>
                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-6">{artist.bio}</p>
                  </div>

                  {/* Connect Section */}
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Connect</h3>
                    <div className="flex flex-wrap gap-2">
                      {artist.socialMedia.instagram && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="border-zinc-700 text-gray-400 hover:text-white hover:border-amber-500 text-xs bg-transparent"
                        >
                          <a href={artist.socialMedia.instagram} target="_blank" rel="noopener noreferrer">
                            Instagram
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      )}
                      {artist.socialMedia.twitter && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="border-zinc-700 text-gray-400 hover:text-white hover:border-amber-500 text-xs bg-transparent"
                        >
                          <a href={artist.socialMedia.twitter} target="_blank" rel="noopener noreferrer">
                            Twitter
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      )}
                      {artist.socialMedia.youtube && (
                        <Button
                          asChild
                          variant="outline"
                          size="sm"
                          className="border-zinc-700 text-gray-400 hover:text-white hover:border-amber-500 text-xs bg-transparent"
                        >
                          <a href={artist.socialMedia.youtube} target="_blank" rel="noopener noreferrer">
                            YouTube
                            <ExternalLink className="ml-1 h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Main Content */}
              <div className="lg:col-span-3">
                {/* Tab Navigation */}
                <div className="flex gap-1 mb-8 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 rounded-xl p-1">
                  <button
                    onClick={() => setActiveTab("music")}
                    className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === "music"
                        ? "bg-amber-500 text-black"
                        : "text-gray-400 hover:text-white hover:bg-zinc-800/50"
                    }`}
                  >
                    Music
                  </button>
                  <button
                    onClick={() => setActiveTab("gallery")}
                    className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === "gallery"
                        ? "bg-amber-500 text-black"
                        : "text-gray-400 hover:text-white hover:bg-zinc-800/50"
                    }`}
                  >
                    Gallery
                  </button>
                  <button
                    onClick={() => setActiveTab("video")}
                    className={`flex-1 py-3 px-6 rounded-lg text-sm font-medium transition-all duration-200 ${
                      activeTab === "video"
                        ? "bg-amber-500 text-black"
                        : "text-gray-400 hover:text-white hover:bg-zinc-800/50"
                    }`}
                  >
                    Video
                  </button>
                </div>

                {/* Tab Content */}
                <div className="min-h-[600px]">
                  {/* Music Tab */}
                  {activeTab === "music" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="font-cinzel text-2xl font-bold tracking-wider mb-6">MUSIC</h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Featured Track */}
                        {artist.featuredTrack && (
                          <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4 md:col-span-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-4">
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                                  <Image
                                    src={artist.image || "/placeholder.svg"}
                                    alt={artist.featuredTrack.title}
                                    fill
                                    className="object-cover"
                                    sizes="64px"
                                  />
                                </div>
                                <div>
                                  <div className="text-amber-500 text-xs font-semibold uppercase tracking-wider mb-1">
                                    Featured Track
                                  </div>
                                  <h3 className="text-white text-lg font-semibold mb-1">
                                    {artist.featuredTrack.title}
                                  </h3>
                                  <p className="text-gray-400 text-sm">
                                    {artist.name} • {artist.featuredTrack.duration}
                                  </p>
                                </div>
                              </div>
                              <Button
                                onClick={handlePlayPause}
                                className="w-12 h-12 p-0 bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black rounded-xl shadow-lg hover:shadow-xl border-0 transition-all duration-200"
                              >
                                {isPlayingFeatured ? (
                                  <Pause className="h-5 w-5" />
                                ) : (
                                  <Play className="h-5 w-5 ml-0.5" />
                                )}
                              </Button>
                            </div>
                          </div>
                        )}

                        {/* Other Tracks */}
                        {artist.tracks &&
                          artist.tracks.map((track) => (
                            <div
                              key={track.id}
                              className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 hover:border-amber-500/50 rounded-xl p-4 transition-all duration-300 group"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                    <Image
                                      src={artist.image || "/placeholder.svg"}
                                      alt={track.title}
                                      fill
                                      className="object-cover"
                                      sizes="48px"
                                    />
                                  </div>
                                  <div>
                                    <h3 className="text-white font-semibold group-hover:text-amber-500 transition-colors">
                                      {track.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm">
                                      {artist.name} • {track.duration}
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  onClick={() => handleTrackPlayPause(track)}
                                  className="w-10 h-10 p-0 bg-gradient-to-br from-amber-400 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-black rounded-lg shadow-lg hover:shadow-xl border-0 transition-all duration-200"
                                >
                                  {currentTrack === track.id && isPlaying ? (
                                    <Pause className="h-4 w-4" />
                                  ) : (
                                    <Play className="h-4 w-4 ml-0.5" />
                                  )}
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Gallery Tab */}
                  {activeTab === "gallery" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      id="gallery-section"
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h2 className="font-cinzel text-2xl font-bold tracking-wider">GALLERY</h2>
                        {dynamicGalleryFiles.length > 0 && (
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Eye className="h-4 w-4" />
                            <span>
                              Showing {Math.min(visibleImageCount, dynamicGalleryFiles.length)} of{" "}
                              {dynamicGalleryFiles.length} photos
                            </span>
                          </div>
                        )}
                      </div>

                      {dynamicGalleryFiles.length > 0 ? (
                        <div className="space-y-6">
                          {/* Featured Image */}
                          <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800">
                            <Image
                              src={
                                dynamicGalleryFiles[currentGalleryIndex].startsWith("http")
                                  ? dynamicGalleryFiles[currentGalleryIndex]
                                  : dynamicGalleryFiles[currentGalleryIndex].startsWith("/")
                                    ? dynamicGalleryFiles[currentGalleryIndex]
                                    : `/images/${artist.slug}/${encodeURIComponent(dynamicGalleryFiles[currentGalleryIndex])}`
                              }
                              alt={`${artist.name} gallery image`}
                              fill
                              className="object-contain"
                              sizes="(max-width: 768px) 100vw, 66vw"
                              unoptimized={dynamicGalleryFiles[currentGalleryIndex].startsWith("http")}
                            />

                            {/* Navigation Arrows */}
                            {dynamicGalleryFiles.length > 1 && (
                              <>
                                <button
                                  onClick={prevGalleryImage}
                                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                                >
                                  <ChevronLeft className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={nextGalleryImage}
                                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-all duration-200 hover:scale-110"
                                >
                                  <ChevronRight className="h-5 w-5" />
                                </button>
                              </>
                            )}

                            {/* Image Counter */}
                            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1 text-white text-sm">
                              {currentGalleryIndex + 1} / {dynamicGalleryFiles.length}
                            </div>
                          </div>

                          {/* Thumbnail Grid */}
                          <GalleryClient
                            slug={artist.slug}
                            currentGalleryIndex={currentGalleryIndex}
                            visibleImageCount={visibleImageCount}
                            isLoadingMore={isLoadingMore}
                            showAllImages={showAllImages}
                            onImageClick={setCurrentGalleryIndex}
                            onSeeMore={handleSeeMore}
                            onShowLess={handleShowLess}
                            IMAGES_PER_LOAD={IMAGES_PER_LOAD}
                          />
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Camera className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                          <p className="text-gray-400 text-lg">No gallery images available</p>
                          <p className="text-gray-500 text-sm mt-2">
                            Check back later for exclusive photos from {artist.name}
                          </p>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* Video Tab */}
                  {activeTab === "video" && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 className="font-cinzel text-2xl font-bold tracking-wider mb-6">VIDEO</h2>

                      <div className="text-center py-12">
                        <div className="relative inline-block">
                          <Play className="h-16 w-16 mx-auto mb-4 text-gray-600" />
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center">
                            <span className="text-black text-xs font-bold">!</span>
                          </div>
                        </div>
                        <p className="text-gray-400 text-lg">Music videos coming soon</p>
                        <p className="text-gray-500 text-sm mt-2">
                          We're working on AI-generated music videos for {artist.name}
                        </p>
                        <div className="mt-6">
                          <Button
                            variant="outline"
                            className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black bg-transparent"
                          >
                            Get Notified
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
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
                DISCOVER MORE <span className="text-amber-500">AI ARTISTS</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Explore our growing roster of AI-generated artists and experience the future of music creation.
              </p>
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
                  <Link href="/artists">
                    <MapPin className="mr-2 h-5 w-5" />
                    All Artists
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </PageBlurOverlay>

      {/* Photo Lightbox */}
      <Dialog open={isLightboxOpen} onOpenChange={setIsLightboxOpen}>
        <DialogContent className="max-w-4xl w-full h-full max-h-[90vh] p-0 bg-black/95 border-0">
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              onClick={closeLightbox}
              className="absolute top-4 right-4 z-50 bg-black/50 hover:bg-black/70 text-white border-0 rounded-full w-10 h-10 p-0"
            >
              <X className="h-5 w-5" />
            </Button>
            {selectedPhoto && (
              <div className="relative w-full h-full flex items-center justify-center p-4">
                <img
                  src={selectedPhoto || "/placeholder.svg"}
                  alt="Gallery photo"
                  className="max-w-full max-h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = "/placeholder.svg?height=800&width=1200&text=Photo+Not+Found"
                  }}
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

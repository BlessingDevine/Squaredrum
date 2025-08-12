"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageBlurOverlay from "@/components/page-blur-overlay"
import DownloadForm from "@/components/download-form"
import CompilationCard from "@/components/compilation-card"
import { useScrollLock } from "@/hooks/use-scroll-lock"
import { afroSquareTracks } from "@/lib/afro-square-tracks"
import { countrySquareTracks } from "@/lib/country-square-tracks"
import { popSquareTracks } from "@/lib/pop-square-tracks"
import { rnbSquareTracks } from "@/lib/rnb-square-tracks"
import { reggaetonSquareTracks } from "@/lib/reggaeton-square-tracks"
import { dancehallSquareTracks } from "@/lib/dancehall-square-tracks"

interface CurrentTrack {
  title: string
  artist: string
  downloadUrl: string
  audioUrl: string
  coverArt?: string
}

export default function ReleasesPage() {
  const [isPageBlurred, setIsPageBlurred] = useState(false)
  const [activeDownload, setActiveDownload] = useState<string | null>(null)
  const [currentTrackData, setCurrentTrackData] = useState<CurrentTrack | null>(null)

  // Lock scroll when download form is open
  useScrollLock(!!activeDownload)

  const handleDownloadClick = (trackData: CurrentTrack) => {
    setActiveDownload("track-download")
    setCurrentTrackData(trackData)
  }

  const handleCloseDownload = () => {
    setActiveDownload(null)
    setCurrentTrackData(null)
  }

  // Safely get track counts with fallback to empty arrays
  const safeAfroTracks = afroSquareTracks || []
  const safeCountryTracks = countrySquareTracks || []
  const safePopTracks = popSquareTracks || []
  const safeRnbTracks = rnbSquareTracks || []
  const safeReggaetonTracks = reggaetonSquareTracks || []
  const safeDancehallTracks = dancehallSquareTracks || []

  const compilations = [
    {
      id: "afro-square",
      title: "AFRO SQUARE",
      artist: "Various AI Artists",
      releaseDate: "January 14, 2025",
      genre: "Afrobeat",
      description:
        "AI-generated Afrobeat rhythms and contemporary African sounds with human production expertise, featuring diverse AI artists and collaborations that showcase the evolution of modern African music through the perfect blend of artificial intelligence and human creativity.",
      coverArt: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Afrobeat.jpg-RGjSYRGm2Ax7GzCvIgl6TGBzrSUz8B.jpeg",
      tracks: safeAfroTracks,
      accentColor: "orange",
    },
    {
      id: "country-square",
      title: "COUNTRY SQUARE",
      artist: "Various AI Artists",
      releaseDate: "February 19, 2025",
      genre: "Country",
      description:
        "AI-generated modern country sounds with traditional roots and human production polish, featuring AI solo artists and collaborations that capture the heart of American storytelling through the seamless fusion of artificial intelligence and human musical craftsmanship.",
      coverArt: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Country.jpg-Y74tKbTs09Vvd2ZtQc4a5GePRNODgD.jpeg",
      tracks: safeCountryTracks,
      accentColor: "amber",
    },
    {
      id: "pop-square",
      title: "POP SQUARE",
      artist: "Various AI Artists",
      releaseDate: "March 9, 2025",
      genre: "Pop",
      description:
        "AI-crafted pop anthems and catchy melodies enhanced by human production techniques, featuring innovative AI artists who push the boundaries of contemporary pop music through machine learning algorithms refined by human musical expertise.",
      coverArt: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Pop.jpg-DJQTTu2qb1hvXy3n0J7Ixw53nrO8gt.jpeg",
      tracks: safePopTracks,
      accentColor: "pink",
    },
    {
      id: "rnb-square",
      title: "R&B SQUARE",
      artist: "Various AI Artists",
      releaseDate: "April 4, 2025",
      genre: "R&B",
      description:
        "AI-powered smooth R&B grooves and soulful melodies perfected through human production mastery, featuring talented AI artists who blend classic soul with contemporary AI-generated techniques and human-guided vocal synthesis for an authentic sound.",
      coverArt: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/R%26B.jpg-465Ppu2BX5kxmQZ2uQgapX0gQjg5si.jpeg",
      tracks: safeRnbTracks,
      accentColor: "purple",
    },
    {
      id: "reggaeton-square",
      title: "REGGAETON SQUARE",
      artist: "Various AI Artists",
      releaseDate: "May 15, 2025",
      genre: "Reggaeton",
      description:
        "AI-generated reggaeton beats and Latin urban rhythms enhanced by human production expertise, featuring cutting-edge AI artists who capture the essence of Latin street culture through innovative machine learning algorithms and authentic perreo flows.",
      coverArt: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Reggaton%20I.jpg-UkdxvBplWuxUExqZUOa6a0crPOtuYi.jpeg",
      tracks: safeReggaetonTracks,
      accentColor: "red",
    },
    {
      id: "dancehall-square",
      title: "DANCEHALL SQUARE",
      artist: "Various AI Artists",
      releaseDate: "June 20, 2025",
      genre: "Dancehall",
      description:
        "AI-crafted dancehall riddims and Caribbean vibes perfected through human production mastery, featuring revolutionary AI artists who blend traditional Jamaican sounds with futuristic digital elements for an authentic bashment experience.",
      coverArt: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DancehallI.jpg-SIzFBVr2tMJK5jrNkblAtrOEqRq7Hq.jpeg",
      tracks: safeDancehallTracks,
      accentColor: "cyan",
    },
  ]

  // Handle scrolling to specific compilation on page load
  useEffect(() => {
    const hash = window.location.hash.substring(1) // Remove the # symbol
    if (hash) {
      // Small delay to ensure the page has rendered
      setTimeout(() => {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
        }
      }, 100)
    }
  }, [])

  // Calculate total tracks safely
  const totalTracks = safeAfroTracks.length + safeCountryTracks.length + safePopTracks.length + safeRnbTracks.length + safeReggaetonTracks.length + safeDancehallTracks.length

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header onBlurChange={setIsPageBlurred} />

      <PageBlurOverlay isBlurred={isPageBlurred}>
        <main className="pt-24 sm:pt-28 lg:pt-32">
          {/* Hero Section - Reduced padding for more artwork space */}
          <section className="relative overflow-hidden py-6 sm:py-8 lg:py-12">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
              style={{
                backgroundImage: "url('/squaredrum-bg.jpg')",
              }}
            />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-full px-3 sm:px-4 lg:px-6 py-2 mb-3 sm:mb-4">
                  <span className="text-amber-500 font-cinzel text-xs sm:text-sm tracking-wider">
                    AI-GENERATED + HUMAN PRODUCED
                  </span>
                </div>
                <h1 className="font-cinzel tracking-widest text-3xl sm:text-4xl lg:text-5xl xl:text-6xl mb-3 sm:mb-4">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
                    RELEASES
                  </span>
                </h1>
                <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full" />
                <p className="text-gray-400 text-sm sm:text-base lg:text-lg mt-4 sm:mt-6 max-w-2xl mx-auto px-2">
                  Discover our latest music compilations featuring innovative artificial intelligence artists across
                  multiple genres, AI-generated with a human production touch, showcasing the future of music creation.
                </p>
              </div>
            </div>
          </section>

          {/* Compilations Grid - Mobile-first with minimal padding */}
          <section className="py-4 sm:py-6 lg:py-8">
            <div className="container mx-auto px-2 sm:px-4 lg:px-6 xl:px-8">
              {/* Responsive grid: single column on mobile, 2 columns on tablet, 3 columns on desktop for better layout with 6 cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
                {compilations.map((compilation) => (
                  <div key={compilation.id} id={compilation.id} className="w-full">
                    <CompilationCard compilation={compilation} onDownloadClick={handleDownloadClick} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-8 sm:py-12 border-t border-zinc-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-amber-500 mb-2">6</div>
                  <div className="text-gray-400 text-xs sm:text-sm">AI Compilations</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-amber-500 mb-2">{totalTracks}</div>
                  <div className="text-gray-400 text-xs sm:text-sm">AI-Generated Tracks</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-amber-500 mb-2">75+</div>
                  <div className="text-gray-400 text-xs sm:text-sm">AI Artists</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold text-amber-500 mb-2">2025</div>
                  <div className="text-gray-400 text-xs sm:text-sm">Release Year</div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </PageBlurOverlay>

      {/* Download Modal */}
      {activeDownload && currentTrackData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleCloseDownload} />
          <div className="relative bg-zinc-900 border border-zinc-700 rounded-xl p-6 sm:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <button
              onClick={handleCloseDownload}
              className="absolute top-4 right-4 text-gray-400 hover:text-white z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-800 transition-colors"
            >
              ✕
            </button>

            <DownloadForm
              artist={{
                name: currentTrackData.artist,
                trackTitle: currentTrackData.title,
                downloadUrl: currentTrackData.downloadUrl,
                audioUrl: currentTrackData.audioUrl,
              }}
              onClose={handleCloseDownload}
            />
          </div>
        </div>
      )}
    </div>
  )
}

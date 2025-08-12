"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Search, Filter, Music, Users, MapPin } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageBlurOverlay from "@/components/page-blur-overlay"
import { artists } from "@/lib/artists-data"

export default function ArtistsPageClient() {
  const [isPageBlurred, setIsPageBlurred] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState("all")
  const [sortBy, setSortBy] = useState("name")

  // Get unique genres
  const genres = Array.from(new Set(artists.map((artist) => artist.genre)))

  // Filter and sort artists
  const filteredArtists = artists
    .filter((artist) => {
      const matchesSearch =
        artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.genre.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGenre = selectedGenre === "all" || artist.genre === selectedGenre
      return matchesSearch && matchesGenre
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "genre":
          return a.genre.localeCompare(b.genre)
        default:
          return 0
      }
    })

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header onBlurChange={setIsPageBlurred} />

      <PageBlurOverlay isBlurred={isPageBlurred}>
        <main className="pt-32 sm:pt-36">
          <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12 sm:mb-16 text-center">
                <div className="inline-flex items-center bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-full px-4 sm:px-6 py-2 mb-4 sm:mb-6">
                  <Users className="h-4 w-4 text-amber-500 mr-2" />
                  <span className="text-amber-500 font-cinzel text-xs sm:text-sm tracking-wider">OUR ROSTER</span>
                </div>
                <h1 className="font-cinzel tracking-widest text-4xl sm:text-5xl md:text-6xl mb-4">
                  <span className="text-amber-500">ARTISTS</span>
                </h1>
                <p className="font-cormorant text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
                  Meet the talented artists who make up the SQUAREDRUM family
                </p>
              </div>

              {/* Search and Filter Controls */}
              <div className="mb-8 sm:mb-12">
                <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search artists or genres..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500 h-12 text-base"
                    />
                  </div>

                  {/* Genre Filter */}
                  <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                    <SelectTrigger className="w-full sm:w-48 bg-gray-900/50 border-gray-700 text-white focus:border-amber-500 focus:ring-amber-500 h-12">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by genre" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="all" className="text-white hover:bg-amber-500/20">
                        All Genres
                      </SelectItem>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre} className="text-white hover:bg-amber-500/20">
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Sort */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full sm:w-48 bg-gray-900/50 border-gray-700 text-white focus:border-amber-500 focus:ring-amber-500 h-12">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem value="name" className="text-white hover:bg-amber-500/20">
                        Name
                      </SelectItem>
                      <SelectItem value="genre" className="text-white hover:bg-amber-500/20">
                        Genre
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Results Count */}
                <div className="text-center mt-4">
                  <p className="text-gray-400 text-sm">
                    Showing {filteredArtists.length} of {artists.length} artists
                  </p>
                </div>
              </div>

              {/* Artists Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
                {filteredArtists.map((artist) => (
                  <Card
                    key={artist.id}
                    className="bg-gray-900/50 border-gray-800 hover:border-amber-500/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl group overflow-hidden"
                  >
                    <CardContent className="p-0">
                      {/* Artist Image - Keep this Link */}
                      <Link href={`/artists/${artist.slug}`} onClick={() => window.scrollTo(0, 0)} className="block">
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={artist.image || "/placeholder.svg"}
                            alt={artist.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                          {/* Genre Badge */}
                          <Badge className="absolute top-3 sm:top-4 left-3 sm:left-4 bg-amber-500 text-black font-cinzel text-xs tracking-wider">
                            {artist.genre}
                          </Badge>

                          {/* Hover Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button
                              size="lg"
                              className="bg-amber-500 hover:bg-amber-600 text-black rounded-full w-12 h-12 sm:w-16 sm:h-16 p-0 shadow-2xl transform hover:scale-110 transition-all duration-300"
                            >
                              <Music className="h-4 w-4 sm:h-6 sm:w-6" />
                            </Button>
                          </div>
                        </div>
                      </Link>

                      {/* Artist Info - Remove the outer Link wrapper */}
                      <div className="p-4 sm:p-6">
                        <h3 className="font-cinzel text-lg sm:text-xl font-bold mb-2 group-hover:text-amber-500 transition-colors duration-300">
                          {artist.name}
                        </h3>

                        <div className="flex items-center text-gray-400 text-sm mb-3">
                          <MapPin className="h-3 w-3 mr-1" />
                          <span>{artist.location}</span>
                        </div>

                        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">{artist.bio}</p>

                        {artist.featuredTrack && (
                          <div className="mb-4 p-3 bg-black/30 rounded-lg border border-amber-500/20">
                            <p className="text-amber-500 text-xs font-cinzel tracking-wider mb-1">FEATURED TRACK</p>
                            <p className="text-white font-medium text-sm">{artist.featuredTrack.title}</p>
                            <p className="text-gray-400 text-xs">{artist.featuredTrack.duration}</p>
                          </div>
                        )}

                        <Link href={`/artists/${artist.slug}`} onClick={() => window.scrollTo(0, 0)}>
                          <Button
                            variant="outline"
                            className="w-full border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-black font-cinzel tracking-wider text-sm transition-all duration-300 bg-transparent"
                          >
                            VIEW PROFILE
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* No Results */}
              {filteredArtists.length === 0 && (
                <div className="text-center py-12 sm:py-16">
                  <div className="mb-4">
                    <Users className="h-12 w-12 sm:h-16 sm:w-16 text-gray-600 mx-auto" />
                  </div>
                  <h3 className="font-cinzel text-xl sm:text-2xl font-bold mb-2 text-gray-400">No Artists Found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria</p>
                  <Button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedGenre("all")
                    }}
                    variant="outline"
                    className="border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-cinzel tracking-wider bg-transparent"
                  >
                    CLEAR FILTERS
                  </Button>
                </div>
              )}
            </div>
          </section>
        </main>
      </PageBlurOverlay>

      <Footer />
    </div>
  )
}

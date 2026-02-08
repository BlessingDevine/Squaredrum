"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, Radio, Play, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useMobile } from "@/hooks/use-mobile"
import { useRadio } from "@/components/radio-context"
import EnhancedMobileMenu from "@/components/enhanced-mobile-menu"
import { artists } from "@/lib/artists-data"

interface HeaderProps {
  onBlurChange?: (isBlurred: boolean) => void
}

export default function Header({ onBlurChange }: HeaderProps) {
  const isMobile = useMobile()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showSchedule, setShowSchedule] = useState(false)
  const [showArtistsDropdown, setShowArtistsDropdown] = useState(false)
  const [hoveredArtist, setHoveredArtist] = useState<number | null>(null)

  const { toggleRadio, togglePlay, isPlaying: radioPlaying, isRadioOpen, setDesktopHeadless } = useRadio()

  // Refs for click outside detection
  const desktopArtistsRef = useRef<HTMLDivElement>(null)
  const radioScheduleRef = useRef<HTMLDivElement>(null)

  // Only blur for desktop dropdowns - mobile menu handles its own backdrop
  useEffect(() => {
    const shouldBlur = !isMobile && (showSchedule || showArtistsDropdown)
    onBlurChange?.(shouldBlur)
  }, [isMobile, showSchedule, showArtistsDropdown, onBlurChange])

  // Close desktop dropdowns when switching to mobile
  useEffect(() => {
    if (isMobile) {
      setShowArtistsDropdown(false)
      setShowSchedule(false)
      setHoveredArtist(null)
    }
  }, [isMobile])

  const handleRadioClick = () => {
    if (!isMobile) {
      // Desktop: toggle play/pause directly without opening the player UI
      if (!isRadioOpen) {
        setDesktopHeadless(true)
        toggleRadio() // Opens radio (sets isRadioOpen) so the audio source gets set
        // Small delay to allow audio source to initialize before playing
        setTimeout(() => {
          togglePlay()
        }, 300)
      } else if (radioPlaying) {
        // If playing, stop and close radio
        togglePlay()
        setTimeout(() => {
          toggleRadio()
          setDesktopHeadless(false)
        }, 100)
      } else {
        // If radio is open but not playing, start playing
        togglePlay()
      }
    } else {
      // Mobile: open/close the radio player as before
      toggleRadio()
    }
    setShowSchedule(false)
  }

  const handleArtistClick = (artistSlug: string) => {
    setShowArtistsDropdown(false)
    setHoveredArtist(null)
  }

  const handleMenuClose = () => {
    setIsMenuOpen(false)
  }

  const handleDesktopArtistsClick = () => {
    // Only allow desktop dropdown on non-mobile devices
    if (!isMobile) {
      setShowArtistsDropdown(!showArtistsDropdown)
    }
  }

  // Handle click outside for desktop dropdowns only
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !isMobile &&
        showArtistsDropdown &&
        desktopArtistsRef.current &&
        !desktopArtistsRef.current.contains(event.target as Node)
      ) {
        setShowArtistsDropdown(false)
        setHoveredArtist(null)
      }

      if (
        !isMobile &&
        showSchedule &&
        radioScheduleRef.current &&
        !radioScheduleRef.current.contains(event.target as Node)
      ) {
        setShowSchedule(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isMobile, showArtistsDropdown, showSchedule])

  // Handle escape key for desktop dropdowns only
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (!isMobile && showArtistsDropdown) {
          setShowArtistsDropdown(false)
          setHoveredArtist(null)
        }
        if (!isMobile && showSchedule) {
          setShowSchedule(false)
        }
      }
    }

    document.addEventListener("keydown", handleEscapeKey)
    return () => {
      document.removeEventListener("keydown", handleEscapeKey)
    }
  }, [isMobile, showArtistsDropdown, showSchedule])

  return (
    <header className="fixed top-0 z-50 w-full bg-black/90 backdrop-blur-md border-b border-amber-500/10">
      <div className="container mx-auto flex h-16 sm:h-20 items-center justify-between spacing-mobile">
        <Link href="/" className="flex items-center mobile-tap group touch-target">
          <Image
            src="/squaredrum-logo.png"
            alt="SQUAREDRUM"
            width={28}
            height={28}
            className="mr-2 sm:mr-3 sm:w-10 sm:h-10 transition-transform duration-200 group-hover:scale-105 object-contain"
          />
          <span className="font-cinzel text-base sm:text-lg lg:text-xl tracking-widest">
            <span className="text-amber-500 transition-colors duration-200 group-hover:text-amber-400">SQUARE</span>
            <span className="text-white transition-colors duration-200 group-hover:text-gray-200">DRUM</span>
          </span>
        </Link>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="text-white touch-target mobile-tap relative overflow-hidden group w-11 h-11"
            onClick={() => setIsMenuOpen(true)}
          >
            <div className="absolute inset-0 bg-amber-500/20 scale-0 group-active:scale-100 transition-transform duration-150 rounded-full"></div>
            <Menu className="h-6 w-6 transition-transform duration-200 group-hover:scale-110" />
            <span className="sr-only">Toggle menu</span>
          </Button>

          {/* Enhanced Mobile Menu */}
          <EnhancedMobileMenu
            isOpen={isMenuOpen}
            onClose={handleMenuClose}
            onToggleRadio={handleRadioClick}
            radioPlaying={radioPlaying}
            isRadioOpen={isRadioOpen}
            onToggleMinimized={() => {}}
          />
        </div>

        {/* Enhanced Desktop Menu */}
        <nav className="hidden space-x-4 lg:space-x-6 xl:space-x-8 md:flex">
          <Link
            href="/"
            onClick={() => setShowArtistsDropdown(false)}
            className="font-cinzel text-sm tracking-widest text-white hover:text-amber-500 transition-all duration-300 relative group py-2"
          >
            HOME
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></div>
          </Link>

          <div className="relative" ref={desktopArtistsRef}>
            <button
              onClick={handleDesktopArtistsClick}
              className="font-cinzel text-sm tracking-widest text-white hover:text-amber-500 transition-all duration-300 flex items-center relative group py-2"
            >
              ARTISTS
              <ChevronDown
                className={`h-3 w-3 ml-1 transition-all duration-300 ${showArtistsDropdown ? "rotate-180 text-amber-500" : ""}`}
              />
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></div>
            </button>

            {!isMobile && showArtistsDropdown && (
              <>
                <div
                  className="fixed inset-0 z-[58] bg-black/80 backdrop-blur-sm"
                  onClick={() => setShowArtistsDropdown(false)}
                  aria-hidden="true"
                />

                <div className="absolute top-full left-0 mt-2 w-80 bg-black/95 backdrop-blur-xl border border-amber-500/30 rounded-lg py-4 z-[59] shadow-2xl animate-in slide-in-from-top-2 duration-300">
                  <div className="px-4 pb-2 mb-2 border-b border-amber-500/20">
                    <span className="font-cinzel text-xs tracking-wider text-amber-500">OUR ARTISTS</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto enhanced-scrollbar">
                    <div className="px-1">
                      {artists.map((artist, index) => (
                        <Link
                          key={artist.id}
                          href={`/artists/${artist.slug}`}
                          onClick={() => handleArtistClick(artist.slug)}
                          onMouseEnter={() => setHoveredArtist(artist.id)}
                          onMouseLeave={() => setHoveredArtist(null)}
                          className={`block px-3 py-3 mx-1 rounded-md font-cinzel text-sm transition-all duration-300 cursor-pointer select-none transform ${
                            hoveredArtist === artist.id
                              ? "text-amber-500 bg-amber-500/15 border-l-2 border-amber-500 translate-x-1 scale-105"
                              : "text-gray-300 hover:text-amber-500 hover:bg-amber-500/10 hover:translate-x-1"
                          }`}
                          style={{ animationDelay: `${index * 30}ms` }}
                        >
                          <div className="flex justify-between items-center">
                            <span className="font-medium">{artist.name}</span>
                            <span
                              className={`text-xs transition-colors duration-300 ${
                                hoveredArtist === artist.id ? "text-amber-400" : "text-gray-500"
                              }`}
                            >
                              {artist.genre}
                            </span>
                          </div>
                          {index < artists.length - 1 && <div className="mt-2 border-b border-gray-800/50"></div>}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="px-4 pt-2 mt-2 border-t border-amber-500/20">
                    <Link
                      href="/artists"
                      onClick={() => handleArtistClick("all")}
                      className="font-cinzel text-xs tracking-wider text-amber-500 hover:text-amber-400 transition-all duration-300 cursor-pointer flex items-center group"
                    >
                      VIEW ALL ARTISTS
                      <div className="ml-1 transform group-hover:translate-x-1 transition-transform duration-300">
                        →
                      </div>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          <Link
            href="/releases"
            onClick={() => setShowArtistsDropdown(false)}
            className="font-cinzel text-sm tracking-widest text-white hover:text-amber-500 transition-all duration-300 relative group py-2"
          >
            RELEASES
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link
            href="/about"
            onClick={() => setShowArtistsDropdown(false)}
            className="font-cinzel text-sm tracking-widest text-white hover:text-amber-500 transition-all duration-300 relative group py-2"
          >
            ABOUT
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link
            href="/news"
            onClick={() => setShowArtistsDropdown(false)}
            className="font-cinzel text-sm tracking-widest text-white hover:text-amber-500 transition-all duration-300 relative group py-2"
          >
            NEWS
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <Link
            href="/contact"
            onClick={() => setShowArtistsDropdown(false)}
            className="font-cinzel text-sm tracking-widest text-white hover:text-amber-500 transition-all duration-300 relative group py-2"
          >
            CONTACT
            <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></div>
          </Link>
          <div className="relative">
            <button
              onClick={() => {
                handleRadioClick()
                setShowArtistsDropdown(false)
              }}
              className="flex items-center font-cinzel text-sm tracking-widest text-amber-500 hover:text-amber-400 transition-all duration-300 relative group py-2"
            >
              <div className="flex items-center mr-1">
                <Radio className="h-4 w-4" />
                {radioPlaying ? (
                  <div className="flex items-center ml-1">
                    <div className="flex space-x-0.5">
                      <div className="w-0.5 h-2 bg-amber-500 animate-pulse"></div>
                      <div className="w-0.5 h-1.5 bg-amber-500 animate-pulse delay-75"></div>
                      <div className="w-0.5 h-3 bg-amber-500 animate-pulse delay-150"></div>
                    </div>
                  </div>
                ) : (
                  <Play className="h-3 w-3 ml-1" />
                )}
              </div>
              RADIO
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-amber-500 group-hover:w-full transition-all duration-300"></div>
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}

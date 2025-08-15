"use client"

import type React from "react"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import Image from "next/image"
import {
  Radio,
  Play,
  ChevronDown,
  Search,
  Pause,
  X,
  Mic,
  ArrowUp,
  Wifi,
  WifiOff,
  Battery,
  Signal,
  Maximize2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { artists } from "@/lib/artists-data"

interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
  onToggleRadio: () => void
  radioPlaying: boolean
  isRadioOpen: boolean
  onToggleMinimized?: () => void
}

export default function EnhancedMobileMenu({
  isOpen,
  onClose,
  onToggleRadio,
  radioPlaying,
  isRadioOpen,
  onToggleMinimized,
}: MobileMenuProps) {
  const [showArtists, setShowArtists] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showSearch, setShowSearch] = useState(false)
  const [isVoiceSearch, setIsVoiceSearch] = useState(false)
  const [menuAnimation, setMenuAnimation] = useState("")
  const [touchStart, setTouchStart] = useState<{ x: number; y: number; time: number } | null>(null)
  const [touchEnd, setTouchEnd] = useState<{ x: number; y: number; time: number } | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("down")
  const [lastScrollY, setLastScrollY] = useState(0)
  const [isOnline, setIsOnline] = useState(true)
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null)
  const [isLowPowerMode, setIsLowPowerMode] = useState(false)
  const [deviceInfo, setDeviceInfo] = useState<{
    isIOS: boolean
    isAndroid: boolean
    supportsHaptics: boolean
    supportsVoice: boolean
  }>({
    isIOS: false,
    isAndroid: false,
    supportsHaptics: false,
    supportsVoice: false,
  })

  const menuRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  // Device detection and capabilities
  useEffect(() => {
    const userAgent = navigator.userAgent
    const isIOS = /iPad|iPhone|iPod/.test(userAgent)
    const isAndroid = /Android/.test(userAgent)
    const supportsHaptics = "vibrate" in navigator
    const supportsVoice = "webkitSpeechRecognition" in window || "SpeechRecognition" in window

    setDeviceInfo({
      isIOS,
      isAndroid,
      supportsHaptics,
      supportsVoice,
    })

    // Battery API (if available)
    if ("getBattery" in navigator) {
      ;(navigator as any).getBattery().then((battery: any) => {
        setBatteryLevel(Math.round(battery.level * 100))
        setIsLowPowerMode(battery.level < 0.2)

        battery.addEventListener("levelchange", () => {
          setBatteryLevel(Math.round(battery.level * 100))
          setIsLowPowerMode(battery.level < 0.2)
        })
      })
    }

    // Network status
    const updateOnlineStatus = () => setIsOnline(navigator.onLine)
    window.addEventListener("online", updateOnlineStatus)
    window.addEventListener("offline", updateOnlineStatus)

    return () => {
      window.removeEventListener("online", updateOnlineStatus)
      window.removeEventListener("offline", updateOnlineStatus)
    }
  }, [])

  // Haptic feedback
  const triggerHaptic = useCallback(
    (type: "light" | "medium" | "heavy" = "light") => {
      if (!deviceInfo.supportsHaptics) return

      const patterns = {
        light: [10],
        medium: [20],
        heavy: [50],
      }

      navigator.vibrate(patterns[type])
    },
    [deviceInfo.supportsHaptics],
  )

  // Voice search
  const startVoiceSearch = useCallback(() => {
    if (!deviceInfo.supportsVoice) return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition()
      recognitionRef.current.continuous = false
      recognitionRef.current.interimResults = false
      recognitionRef.current.lang = "en-US"
    }

    setIsVoiceSearch(true)
    triggerHaptic("medium")

    recognitionRef.current.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setSearchQuery(transcript)
      setShowSearch(true)
      setIsVoiceSearch(false)
      triggerHaptic("light")
    }

    recognitionRef.current.onerror = () => {
      setIsVoiceSearch(false)
      triggerHaptic("heavy")
    }

    recognitionRef.current.onend = () => {
      setIsVoiceSearch(false)
    }

    recognitionRef.current.start()
  }, [deviceInfo.supportsVoice, triggerHaptic])

  // Enhanced touch handling
  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    })
    setTouchEnd(null)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0]
    setTouchEnd({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    })
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const deltaX = touchStart.x - touchEnd.x
    const deltaY = touchStart.y - touchEnd.y
    const deltaTime = touchEnd.time - touchStart.time
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
    const velocity = distance / deltaTime

    // Fast swipe left to close
    if (deltaX > 100 && Math.abs(deltaY) < 100 && velocity > 0.5) {
      triggerHaptic("medium")
      handleClose()
    }

    // Swipe up for search
    if (deltaY > 80 && Math.abs(deltaX) < 50 && velocity > 0.3) {
      triggerHaptic("light")
      setShowSearch(true)
      setTimeout(() => searchInputRef.current?.focus(), 100)
    }
  }

  // Smart scroll handling
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const currentScrollY = e.currentTarget.scrollTop
      const direction = currentScrollY > lastScrollY ? "down" : "up"

      setScrollDirection(direction)
      setLastScrollY(currentScrollY)
      setIsScrolling(true)

      // Debounce scroll end
      setTimeout(() => setIsScrolling(false), 150)
    },
    [lastScrollY],
  )

  // Optimized animations based on device performance
  const getAnimationClass = () => {
    if (isLowPowerMode) return "duration-150" // Faster animations on low battery
    return "duration-300"
  }

  const handleClose = () => {
    setMenuAnimation(`animate-out slide-out-to-left ${getAnimationClass()}`)

    // Reset all menu states
    setShowArtists(false)
    setShowSearch(false)
    setSearchQuery("")

    setTimeout(
      () => {
        onClose()
        setMenuAnimation("")
      },
      isLowPowerMode ? 150 : 300,
    )
  }

  const handleMenuItemClick = (callback?: () => void) => {
    triggerHaptic("light")
    callback?.()
    handleClose()
  }

  const handleRadioClick = () => {
    onToggleRadio()
    triggerHaptic("medium")
    handleClose()
  }

  // Filter artists based on search
  const filteredArtists = artists.filter(
    (artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artist.genre.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Featured artist (rotates daily)
  const getFeaturedArtist = () => {
    const today = new Date().getDate()
    return artists[today % artists.length]
  }

  const featuredArtist = getFeaturedArtist()

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any ongoing voice recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [])

  if (!isOpen) return null

  return (
    <>
      {/* Solid Black Backdrop - Maximum Z-Index and Coverage */}
      <div
        className="fixed top-0 left-0 right-0 bottom-0 bg-black"
        onClick={handleClose}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#000000",
          zIndex: 99998,
          touchAction: "none",
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
          opacity: isOpen ? 1 : 0,
          transition: `opacity ${isLowPowerMode ? "150ms" : "300ms"} ease-in-out`,
        }}
      />

      {/* Enhanced Mobile Menu */}
      <div
        ref={menuRef}
        className={`fixed top-0 left-0 bottom-0 bg-gradient-to-br from-gray-900/98 via-gray-800/95 to-gray-900/98 backdrop-blur-xl mobile-scroll border-r border-amber-500/20 shadow-2xl ${
          menuAnimation || `animate-in slide-in-from-left ${getAnimationClass()}`
        }`}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: "85vw",
          maxWidth: "320px",
          zIndex: 99999,
          overscrollBehavior: "contain",
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-black/20 text-xs text-gray-400">
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {isOnline ? <Wifi className="h-3 w-3 text-green-500" /> : <WifiOff className="h-3 w-3 text-red-500" />}
              <Signal className="h-3 w-3" />
            </div>
            <span className="text-xs">SQUAREDRUM</span>
          </div>
          <div className="flex items-center space-x-2">
            {batteryLevel !== null && (
              <div className="flex items-center space-x-1">
                <Battery className={`h-3 w-3 ${batteryLevel < 20 ? "text-red-500" : "text-green-500"}`} />
                <span>{batteryLevel}%</span>
              </div>
            )}
          </div>
        </div>

        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-500/10 via-transparent to-amber-500/5"></div>
          {!isLowPowerMode && (
            <>
              <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-amber-500/5 rounded-full blur-xl animate-pulse"></div>
              <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-amber-500/5 rounded-full blur-xl animate-pulse delay-1000"></div>
            </>
          )}
        </div>

        {/* Header with Close Button */}
        <div className="relative flex items-center justify-between px-6 py-4 border-b border-amber-500/10">
          <Link href="/" className="flex items-center group" onClick={() => handleMenuItemClick()}>
            <div className="relative">
              <Image
                src="/squaredrum-logo.png"
                alt="SQUAREDRUM"
                width={24}
                height={24}
                className="mr-3 rounded-sm ring-2 ring-amber-500/30 group-hover:ring-amber-500/60 transition-all duration-200"
              />
            </div>
            <span className="font-cinzel text-lg tracking-widest text-white">
              <span className="text-amber-500">SQUARE</span>
              <span className="text-white">DRUM</span>
            </span>
          </Link>

          <Button
            onClick={handleClose}
            className="text-gray-400 hover:text-white touch-target p-2"
            variant="ghost"
            size="icon"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Quick Actions Bar */}
        <div className="px-6 py-4 border-b border-amber-500/10">
          <div className="flex space-x-2">
            <Button
              onClick={() => {
                setShowSearch(!showSearch)
                triggerHaptic("light")
                if (!showSearch) {
                  setTimeout(() => searchInputRef.current?.focus(), 100)
                }
              }}
              className="flex-1 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-600 text-gray-300 hover:text-white transition-all duration-200 touch-target"
              size="sm"
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>

            {deviceInfo.supportsVoice && (
              <Button
                onClick={startVoiceSearch}
                className={`bg-amber-500/20 hover:bg-amber-500/30 text-amber-500 touch-target ${
                  isVoiceSearch ? "animate-pulse" : ""
                }`}
                size="sm"
              >
                <Mic className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Search Input */}
          {showSearch && (
            <div className="mt-3 animate-in slide-in-from-top-2 duration-200">
              <Input
                ref={searchInputRef}
                type="text"
                placeholder={isVoiceSearch ? "Listening..." : "Search artists, genres..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-800/70 border-amber-500/30 text-white placeholder:text-gray-400 focus:border-amber-500 touch-target"
                disabled={isVoiceSearch}
              />

              {searchQuery && (
                <div className="mt-2 max-h-32 overflow-y-auto space-y-1 enhanced-scrollbar">
                  {filteredArtists.map((artist) => (
                    <Link
                      key={artist.id}
                      href={`/artists/${artist.slug}`}
                      className="block p-3 text-sm text-gray-300 hover:text-amber-500 hover:bg-amber-500/10 rounded transition-all duration-200 touch-target"
                      onClick={() => handleMenuItemClick()}
                    >
                      <div className="font-medium">{artist.name}</div>
                      <div className="text-xs text-gray-500">{artist.genre}</div>
                    </Link>
                  ))}
                  {filteredArtists.length === 0 && (
                    <div className="p-3 text-sm text-gray-500 text-center">No artists found</div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Featured Artist */}
        <div className="px-6 py-4 border-b border-amber-500/10">
          <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
            <div className="text-xs font-cinzel tracking-wider text-amber-500 mb-2">FEATURED TODAY</div>
            <Link
              href={`/artists/${featuredArtist.slug}`}
              className="flex items-center group touch-target"
              onClick={() => handleMenuItemClick()}
            >
              <Image
                src={featuredArtist.image || "/placeholder.svg"}
                alt={featuredArtist.name}
                width={40}
                height={40}
                className="rounded-full mr-3 group-hover:scale-110 transition-transform duration-200 object-cover"
              />
              <div>
                <div className="text-white text-sm font-medium group-hover:text-amber-500 transition-colors duration-200">
                  {featuredArtist.name}
                </div>
                <div className="text-gray-400 text-xs">{featuredArtist.genre}</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav
          ref={scrollContainerRef}
          className="flex-1 px-6 py-4 space-y-4 overflow-y-auto enhanced-scrollbar"
          onScroll={handleScroll}
          style={{ overscrollBehavior: "contain" }}
        >
          <Link
            href="/"
            className="flex items-center text-white hover:text-amber-500 transition-all duration-300 touch-target text-lg group transform hover:translate-x-2 py-3"
            onClick={() => handleMenuItemClick()}
          >
            <span className="text-gray-400 mr-4 text-xl transition-colors duration-300 group-hover:text-amber-500">
              —
            </span>
            <span className="font-light tracking-wide">Home</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            </div>
          </Link>

          {/* Artists Section */}
          <div>
            <button
              onClick={() => {
                setShowArtists(!showArtists)
                triggerHaptic("light")
              }}
              className="flex items-center justify-between w-full text-white hover:text-amber-500 transition-all duration-300 touch-target text-lg group transform hover:translate-x-2 py-3"
            >
              <div className="flex items-center">
                <span className="text-gray-400 mr-4 text-xl transition-colors duration-300 group-hover:text-amber-500">
                  —
                </span>
                <span className="font-light tracking-wide">Artists</span>
              </div>
              <ChevronDown
                className={`h-4 w-4 transition-all duration-300 ${
                  showArtists ? "rotate-180 text-amber-500" : "group-hover:text-amber-500"
                }`}
              />
            </button>

            {showArtists && (
              <div className="mt-4 ml-8 space-y-3 animate-in slide-in-from-top-2 duration-300">
                <div
                  className="max-h-64 overflow-y-auto enhanced-scrollbar space-y-3 pr-2"
                  style={{ overscrollBehavior: "contain" }}
                >
                  {artists.map((artist, index) => (
                    <Link
                      key={artist.id}
                      href={`/artists/${artist.slug}`}
                      className="block text-gray-300 hover:text-amber-500 transition-all duration-300 touch-target text-base group transform hover:translate-x-1 py-2"
                      onClick={() => handleMenuItemClick()}
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <div className="flex items-center">
                        <div className="w-1 h-1 bg-gray-600 rounded-full mr-3 group-hover:bg-amber-500 transition-colors duration-300"></div>
                        <span className="font-light tracking-wide">{artist.name}</span>
                      </div>
                      <div className="text-xs text-gray-500 ml-4 group-hover:text-gray-400 transition-colors duration-300">
                        {artist.genre}
                      </div>
                    </Link>
                  ))}
                </div>
                <Link
                  href="/artists"
                  className="block text-amber-500 hover:text-amber-400 transition-all duration-300 touch-target text-base group transform hover:translate-x-1 py-2"
                  onClick={() => handleMenuItemClick()}
                >
                  <div className="flex items-center">
                    <div className="w-1 h-1 bg-amber-500 rounded-full mr-3 animate-pulse"></div>
                    <span className="font-light tracking-wide">View Artists Page ({artists.length} total) →</span>
                  </div>
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/releases"
            className="flex items-center text-white hover:text-amber-500 transition-all duration-300 touch-target text-lg group transform hover:translate-x-2 py-3"
            onClick={() => handleMenuItemClick()}
          >
            <span className="text-gray-400 mr-4 text-xl transition-colors duration-300 group-hover:text-amber-500">
              —
            </span>
            <span className="font-light tracking-wide">Releases</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            </div>
          </Link>

          <Link
            href="/about"
            className="flex items-center text-white hover:text-amber-500 transition-all duration-300 touch-target text-lg group transform hover:translate-x-2 py-3"
            onClick={() => handleMenuItemClick()}
          >
            <span className="text-gray-400 mr-4 text-xl transition-colors duration-300 group-hover:text-amber-500">
              —
            </span>
            <span className="font-light tracking-wide">About</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            </div>
          </Link>

          <Link
            href="/news"
            className="flex items-center text-white hover:text-amber-500 transition-all duration-300 touch-target text-lg group transform hover:translate-x-2 py-3"
            onClick={() => handleMenuItemClick()}
          >
            <span className="text-gray-400 mr-4 text-xl transition-colors duration-300 group-hover:text-amber-500">
              —
            </span>
            <span className="font-light tracking-wide">News</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            </div>
          </Link>

          <Link
            href="/contact"
            className="flex items-center text-white hover:text-amber-500 transition-all duration-300 touch-target text-lg group transform hover:translate-x-2 py-3"
            onClick={() => handleMenuItemClick()}
          >
            <span className="text-gray-400 mr-4 text-xl transition-colors duration-300 group-hover:text-amber-500">
              —
            </span>
            <span className="font-light tracking-wide">Contact</span>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            </div>
          </Link>

          <button
            onClick={handleRadioClick}
            className="flex items-center text-amber-500 hover:text-amber-400 transition-all duration-300 touch-target text-lg group transform hover:translate-x-2 w-full py-3"
          >
            <span className="text-gray-400 mr-4 text-xl transition-colors duration-300 group-hover:text-amber-500">
              —
            </span>
            <span className="font-light tracking-wide">Radio</span>
            <div className="flex items-center ml-3">
              <Radio className="h-4 w-4" />
              {radioPlaying ? (
                <div className="flex items-center ml-2">
                  <div className="flex space-x-1">
                    <div className="w-1 h-3 bg-amber-500 animate-pulse"></div>
                    <div className="w-1 h-2 bg-amber-500 animate-pulse delay-75"></div>
                    <div className="w-1 h-4 bg-amber-500 animate-pulse delay-150"></div>
                  </div>
                </div>
              ) : (
                <Play className="h-3 w-3 ml-1" />
              )}
            </div>
            <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            </div>
          </button>
        </nav>

        {/* Now Playing Footer - Enhanced for mobile */}
        {isRadioOpen && radioPlaying && (
          <div className="px-6 py-4 border-t border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center mr-3">
                  <Radio className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <div className="text-white text-sm font-medium">Music Square Radio</div>
                  <div className="text-gray-400 text-xs flex items-center">
                    <div className="w-1 h-1 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                    LIVE • Minimized by default
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-gray-400 hover:text-white touch-target"
                  onClick={() => {
                    onToggleMinimized?.()
                    triggerHaptic("light")
                  }}
                >
                  <Maximize2 className="h-3 w-3" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-10 w-10 text-amber-500 hover:text-amber-400 touch-target"
                  onClick={() => {
                    onToggleRadio()
                    triggerHaptic("light")
                  }}
                >
                  {radioPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Gesture Hints */}
        <div className="px-6 py-2 border-t border-gray-800/50">
          <div className="flex items-center justify-center text-gray-500 text-xs space-x-4">
            <div className="flex items-center space-x-1">
              <ArrowUp className="h-3 w-3" />
              <span>Swipe up for search</span>
            </div>
            <div className="w-px h-3 bg-gray-600"></div>
            <div className="flex items-center space-x-1">
              <span>Swipe left to close</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

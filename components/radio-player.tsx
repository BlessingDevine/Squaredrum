"use client"

import { Play, Pause, Minimize2, Maximize2, X, Volume2, Wifi } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import Image from "next/image"
import { useRadio } from "./radio-context"

export default function RadioPlayer() {
  const {
    isPlaying,
    isLoading,
    isRadioOpen,
    isMinimized,
    volume,
    connectionStatus,
    togglePlay,
    toggleMinimized,
    closeRadio,
    setVolume,
    retryConnection,
  } = useRadio()

  if (!isRadioOpen) return null

  const getStatusColor = () => {
    switch (connectionStatus.status) {
      case "connected":
        return "text-green-400"
      case "connecting":
      case "buffering":
        return "text-blue-400"
      case "error":
        return "text-red-400"
      default:
        return "text-gray-400"
    }
  }

  const isConnecting = connectionStatus.status === "connecting" || connectionStatus.status === "buffering"
  const hasError = connectionStatus.status === "error"
  const isConnected = connectionStatus.status === "connected"

  // Minimized view
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-2 duration-300">
        <div className="bg-gradient-to-r from-zinc-900/95 via-zinc-800/95 to-zinc-900/95 backdrop-blur-xl border border-amber-500/30 rounded-2xl p-4 flex items-center space-x-4 shadow-2xl">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-xl flex items-center justify-center border border-amber-500/30">
                <Image
                  src="/music-square-radio-logo-neon.png"
                  alt="Music Square Radio"
                  width={24}
                  height={24}
                  className="rounded-lg"
                />
              </div>
              {isPlaying && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-zinc-900" />
              )}
              {isConnected && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-zinc-900" />
              )}
              {hasError && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-500 rounded-full animate-pulse border-2 border-zinc-900" />
              )}
            </div>
            <div>
              <span className="font-cinzel text-amber-400 text-sm tracking-wider font-medium">MUSIC SQUARE RADIO</span>
              {hasError && <div className="text-xs text-yellow-400">Connection Issue</div>}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              onClick={hasError ? retryConnection : togglePlay}
              disabled={isLoading && !hasError}
              className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-400 rounded-xl w-10 h-10 p-0 border border-amber-500/30 transition-all duration-200"
            >
              {isLoading && !hasError ? (
                <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 ml-0.5" />
              )}
            </Button>
            <Button
              onClick={toggleMinimized}
              className="text-gray-400 hover:text-white w-8 h-8 p-0 transition-colors"
              variant="ghost"
            >
              <Maximize2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Full view
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-zinc-900/95 via-zinc-800/95 to-zinc-900/95 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-6 shadow-2xl w-96">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-xl flex items-center justify-center border border-amber-500/30">
                <Image
                  src="/music-square-radio-logo-neon.png"
                  alt="Music Square Radio"
                  width={28}
                  height={28}
                  className="rounded-lg"
                />
              </div>
              {isPlaying && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse border-2 border-zinc-900" />
              )}
              {isConnected && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900" />
              )}
            </div>
            <div>
              <h3 className="font-cinzel text-amber-400 text-lg tracking-wider font-medium">MUSIC SQUARE RADIO</h3>
              <div className="flex items-center space-x-2 text-sm">
                <Wifi className={`h-3 w-3 ${getStatusColor()}`} />
                <span className={`text-xs ${getStatusColor()}`}>
                  {connectionStatus.status === "connected" ? "Live Stream" : connectionStatus.message}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <Button
              onClick={toggleMinimized}
              className="text-gray-400 hover:text-white w-8 h-8 p-0 transition-colors rounded-lg"
              variant="ghost"
            >
              <Minimize2 className="h-4 w-4" />
            </Button>
            <Button
              onClick={closeRadio}
              className="text-gray-400 hover:text-white w-8 h-8 p-0 transition-colors rounded-lg"
              variant="ghost"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Connection Status */}
        {(isConnecting || hasError) && (
          <div
            className={`rounded-2xl p-3 mb-4 border ${
              hasError
                ? "bg-gradient-to-r from-red-900/30 to-red-800/30 border-red-500/30"
                : "bg-gradient-to-r from-blue-900/30 to-blue-800/30 border-blue-500/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isConnecting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                    <span className="text-blue-400 text-sm font-medium">{connectionStatus.message}</span>
                  </>
                ) : (
                  <>
                    <div className="w-4 h-4 bg-red-400 rounded-full animate-pulse" />
                    <span className="text-red-400 text-sm font-medium">{connectionStatus.message}</span>
                  </>
                )}
              </div>
              {hasError && (
                <Button
                  onClick={retryConnection}
                  className="text-red-400 hover:text-red-300 text-xs px-2 py-1 h-auto"
                  variant="ghost"
                >
                  Retry
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Volume Control */}
        <div className="mb-6 p-3 bg-gradient-to-r from-zinc-800/50 to-zinc-700/50 rounded-2xl border border-amber-500/10">
          <div className="flex items-center space-x-3">
            <Volume2 className="h-4 w-4 text-amber-400" />
            <Slider
              value={[volume * 100]}
              onValueChange={(value) => setVolume(value[0] / 100)}
              max={100}
              step={1}
              className="flex-1"
            />
            <span className="text-amber-400 text-sm font-medium w-8">{Math.round(volume * 100)}</span>
          </div>
        </div>

        {/* Play Button */}
        <div className="flex items-center justify-center">
          <Button
            onClick={hasError ? retryConnection : togglePlay}
            disabled={isLoading && !hasError}
            className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 hover:from-amber-500/30 hover:to-amber-600/30 text-amber-400 rounded-2xl w-16 h-16 border border-amber-500/30 transition-all duration-200 shadow-lg hover:shadow-amber-500/20 hover:scale-105"
          >
            {isLoading && !hasError ? (
              <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            ) : isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageBlurOverlay from "@/components/page-blur-overlay"
import DownloadTestPanel from "@/components/download-test-panel"
import DownloadForm from "@/components/download-form"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Play, Download, Music, TestTube } from "lucide-react"

interface CurrentTrack {
  title: string
  artist: string
  downloadUrl: string
  audioUrl: string
  coverArt?: string
}

// Mock music player components for testing
function MockMusicPlayer({
  title,
  onDownloadClick,
}: {
  title: string
  onDownloadClick: (trackData: CurrentTrack) => void
}) {
  const mockTracks = [
    {
      title: "Test Track 1",
      artist: "AI Artist 1",
      downloadUrl: "/audio/test-track-1.mp3",
      audioUrl: "/audio/test-track-1.mp3",
    },
    {
      title: "Test Track 2",
      artist: "AI Artist 2",
      downloadUrl: "/audio/test-track-2.mp3",
      audioUrl: "/audio/test-track-2.mp3",
    },
  ]

  const [currentTrack, setCurrentTrack] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const handleDownload = () => {
    const track = mockTracks[currentTrack]
    if (track) {
      onDownloadClick(track)
    }
  }

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % mockTracks.length)
  }

  const currentTrackData = mockTracks[currentTrack]

  return (
    <div className="bg-zinc-800 rounded-xl p-6 space-y-4">
      <div className="text-center">
        <h3 className="font-cinzel text-lg font-bold text-amber-500 mb-2">{title}</h3>
        <div className="w-32 h-32 bg-zinc-700 rounded-lg mx-auto mb-4 flex items-center justify-center">
          <Music className="h-12 w-12 text-gray-400" />
        </div>
      </div>

      {currentTrackData && (
        <div className="text-center space-y-2">
          <h4 className="font-semibold text-white">{currentTrackData.title}</h4>
          <p className="text-amber-500 text-sm">{currentTrackData.artist}</p>
        </div>
      )}

      <div className="flex justify-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleNext}
          className="border-zinc-600 text-gray-300 hover:bg-zinc-700 bg-transparent"
        >
          Next
        </Button>
        <Button
          size="sm"
          onClick={handlePlay}
          className={`${isPlaying ? "bg-amber-500 text-black" : "bg-zinc-700 text-white"}`}
        >
          <Play className="h-4 w-4" />
        </Button>
        <Button size="sm" onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <div className="text-xs text-gray-500 text-center">
        Track {currentTrack + 1} of {mockTracks.length}
      </div>
    </div>
  )
}

export default function TestDownloadsPage() {
  const [isPageBlurred, setIsPageBlurred] = useState(false)
  const [activeDownload, setActiveDownload] = useState<string | null>(null)
  const [currentTrackData, setCurrentTrackData] = useState<CurrentTrack | null>(null)

  const handleDownloadClick = (playerId: string, trackData: CurrentTrack) => {
    console.log(`🎵 Download Test - ${playerId}:`, {
      title: trackData.title,
      artist: trackData.artist,
      downloadUrl: trackData.downloadUrl,
      audioUrl: trackData.audioUrl,
    })

    setActiveDownload(playerId)
    setCurrentTrackData(trackData)
  }

  const handleCloseDownload = () => {
    setActiveDownload(null)
    setCurrentTrackData(null)
  }

  const players = [
    {
      id: "afro-test",
      title: "Afro Square Player Test",
      component: (
        <MockMusicPlayer
          title="Afro Square"
          onDownloadClick={(trackData) => handleDownloadClick("afro-test", trackData)}
        />
      ),
      color: "border-orange-500/30",
    },
    {
      id: "country-test",
      title: "Country Square Player Test",
      component: (
        <MockMusicPlayer
          title="Country Square"
          onDownloadClick={(trackData) => handleDownloadClick("country-test", trackData)}
        />
      ),
      color: "border-amber-500/30",
    },
    {
      id: "pop-test",
      title: "Pop Square Player Test",
      component: (
        <MockMusicPlayer
          title="Pop Square"
          onDownloadClick={(trackData) => handleDownloadClick("pop-test", trackData)}
        />
      ),
      color: "border-pink-500/30",
    },
    {
      id: "rnb-test",
      title: "R&B Square Player Test",
      component: (
        <MockMusicPlayer
          title="R&B Square"
          onDownloadClick={(trackData) => handleDownloadClick("rnb-test", trackData)}
        />
      ),
      color: "border-purple-500/30",
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header onBlurChange={setIsPageBlurred} />

      <PageBlurOverlay isBlurred={isPageBlurred}>
        <main className="pt-32 sm:pt-36 pb-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <TestTube className="h-8 w-8 text-amber-500" />
                <h1 className="font-cinzel tracking-widest text-3xl sm:text-4xl md:text-5xl">
                  DOWNLOAD <span className="text-amber-500">TESTING</span>
                </h1>
              </div>
              <p className="text-lg text-gray-300 max-w-2xl mx-auto">
                Comprehensive testing environment for music download functionality
              </p>
            </div>

            {/* Test Panel */}
            <div className="mb-12">
              <DownloadTestPanel />
            </div>

            {/* Player Tests */}
            <div className="space-y-8">
              <h2 className="font-cinzel tracking-wider text-2xl text-center mb-8">
                PLAYER <span className="text-amber-500">DOWNLOAD TESTS</span>
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {players.map((player) => (
                  <Card key={player.id} className={`bg-zinc-900 border ${player.color} relative`}>
                    <CardHeader>
                      <CardTitle className="text-amber-500 flex items-center gap-2">
                        <Music className="h-5 w-5" />
                        {player.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-black/20 rounded-xl p-4 border border-white/10 mb-4">{player.component}</div>
                      <div className="text-sm text-gray-400 space-y-1">
                        <p>• Play different tracks using the controls</p>
                        <p>• Click download button to test download flow</p>
                        <p>• Verify correct track info appears in form</p>
                        <p>• Check browser console for detailed logs</p>
                      </div>
                    </CardContent>

                    {/* Download Form Overlay */}
                    {activeDownload === player.id && currentTrackData && (
                      <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
                        <div
                          className="absolute inset-0 bg-black/80 backdrop-blur-sm rounded-lg"
                          onClick={handleCloseDownload}
                        />
                        <div className="relative bg-zinc-800 border border-zinc-600 rounded-xl p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleCloseDownload}
                            className="absolute top-2 right-2 text-gray-400 hover:text-white"
                          >
                            <X className="h-4 w-4" />
                          </Button>

                          <div className="text-center mb-4">
                            <h3 className="font-cinzel tracking-wider text-lg mb-2">TEST DOWNLOAD</h3>
                            <div className="text-center">
                              <h4 className="font-semibold text-white text-base mb-1">{currentTrackData.title}</h4>
                              <p className="text-amber-500 text-sm">{currentTrackData.artist}</p>
                              <p className="text-xs text-gray-400 mt-2 break-all">
                                URL: {currentTrackData.downloadUrl}
                              </p>
                            </div>
                          </div>

                          <DownloadForm
                            artist={{
                              name: currentTrackData.artist,
                              trackTitle: currentTrackData.title,
                              downloadUrl: currentTrackData.downloadUrl,
                              audioUrl: currentTrackData.audioUrl,
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <Card className="mt-12 bg-zinc-900 border-zinc-700">
              <CardHeader>
                <CardTitle className="text-amber-500 flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Testing Instructions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300">
                <div>
                  <h4 className="font-semibold text-white mb-2">1. Automated Tests</h4>
                  <p>Run the automated test suite above to verify file accessibility and download mechanisms.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">2. Manual Player Testing</h4>
                  <p>Test each music player by switching tracks and triggering downloads to verify the flow.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">3. Console Monitoring</h4>
                  <p>Open DevTools (F12) to monitor detailed logging and network requests during testing.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">4. File Verification</h4>
                  <p>
                    Check your Downloads folder to verify the downloaded files are actual audio files with correct
                    names.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-2">5. Form Testing</h4>
                  <p>Test the download form with various inputs to ensure proper validation and submission handling.</p>
                </div>
              </CardContent>
            </Card>

            {/* Test Results */}
            <Card className="mt-8 bg-green-900/20 border-green-500/30">
              <CardHeader>
                <CardTitle className="text-green-400">Test Environment Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Mock Players: Active</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Download Forms: Ready</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Test Data: Loaded</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </PageBlurOverlay>
    </div>
  )
}

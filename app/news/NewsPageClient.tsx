"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageBlurOverlay from "@/components/page-blur-overlay"
import { Instagram, Facebook, Youtube } from 'lucide-react'

export default function NewsPageClient() {
  const [isPageBlurred, setIsPageBlurred] = useState(false)

  // Load the social media widget scripts
  useEffect(() => {
    // Load Facebook widget script
    const facebookScript = document.createElement("script")
    facebookScript.src = "https://widgets.sociablekit.com/facebook-page-posts/widget.js"
    facebookScript.defer = true
    document.head.appendChild(facebookScript)

    // Load Instagram widget script
    const instagramScript = document.createElement("script")
    instagramScript.src = "https://widgets.sociablekit.com/instagram-feed/widget.js"
    instagramScript.defer = true
    document.head.appendChild(instagramScript)

    // Load Twitter widget script
    const twitterScript = document.createElement("script")
    twitterScript.src = "https://widgets.sociablekit.com/twitter-feed/widget.js"
    twitterScript.defer = true
    document.head.appendChild(twitterScript)

    // Load TikTok widget script
    const tiktokScript = document.createElement("script")
    tiktokScript.src = "https://widgets.sociablekit.com/tiktok-feed/widget.js"
    tiktokScript.defer = true
    document.head.appendChild(tiktokScript)

    return () => {
      // Cleanup Facebook script on unmount
      const existingFacebookScript = document.querySelector(
        'script[src="https://widgets.sociablekit.com/facebook-page-posts/widget.js"]',
      )
      if (existingFacebookScript) {
        document.head.removeChild(existingFacebookScript)
      }

      // Cleanup Instagram script on unmount
      const existingInstagramScript = document.querySelector(
        'script[src="https://widgets.sociablekit.com/instagram-feed/widget.js"]',
      )
      if (existingInstagramScript) {
        document.head.removeChild(existingInstagramScript)
      }

      // Cleanup Twitter script on unmount
      const existingTwitterScript = document.querySelector(
        'script[src="https://widgets.sociablekit.com/twitter-feed/widget.js"]',
      )
      if (existingTwitterScript) {
        document.head.removeChild(existingTwitterScript)
      }

      // Cleanup TikTok script on unmount
      const existingTikTokScript = document.querySelector(
        'script[src="https://widgets.sociablekit.com/tiktok-feed/widget.js"]',
      )
      if (existingTikTokScript) {
        document.head.removeChild(existingTikTokScript)
      }
    }
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-black text-white mobile-optimized">
      <Header onBlurChange={setIsPageBlurred} />

      <PageBlurOverlay isBlurred={isPageBlurred}>
        <main className="pt-16 sm:pt-20">
          {/* Hero Section */}
          <section className="spacing-mobile-section spacing-mobile">
            <div className="container mx-auto">
              <div className="text-center mb-12 sm:mb-16">
                <h1 className="font-cinzel tracking-widest text-responsive-4xl mb-6">
                  <span className="text-amber-500">NEWS</span> & UPDATES
                </h1>
                <p className="text-reading text-gray-300 text-responsive-lg max-w-2xl mx-auto">
                  Stay connected with the latest from SQUAREDRUM. Follow our artists' journeys, behind-the-scenes
                  content, and music updates across all our social platforms.
                </p>
              </div>

              {/* Facebook Posts Widget */}
              <div className="max-w-4xl mx-auto mb-16">
                <h2 className="font-cinzel tracking-wider text-responsive-2xl text-center mb-8">
                  <span className="text-amber-500">FACEBOOK</span> UPDATES
                </h2>
                <div className="sk-ww-facebook-page-posts" data-embed-id="25574820"></div>
              </div>

              {/* Instagram Feed Widget */}
              <div className="max-w-4xl mx-auto mb-16">
                <h2 className="font-cinzel tracking-wider text-responsive-2xl text-center mb-8">
                  <span className="text-amber-500">INSTAGRAM</span> FEED
                </h2>
                <div className="sk-instagram-feed" data-embed-id="25574822"></div>
              </div>

              {/* Twitter Feed Widget */}
              <div className="max-w-4xl mx-auto mb-16">
                <h2 className="font-cinzel tracking-wider text-responsive-2xl text-center mb-8">
                  <span className="text-amber-500">X (TWITTER)</span> FEED
                </h2>
                <div className="sk-ww-twitter-feed" data-embed-id="25574826"></div>
              </div>

              {/* TikTok Feed Widget */}
              <div className="max-w-4xl mx-auto">
                <h2 className="font-cinzel tracking-wider text-responsive-2xl text-center mb-8">
                  <span className="text-amber-500">TIKTOK</span> FEED
                </h2>
                <div className="sk-tiktok-feed" data-embed-id="25574833"></div>
              </div>
            </div>
          </section>

          {/* Social Media Links */}
          <section className="spacing-mobile-section spacing-mobile bg-zinc-950">
            <div className="container mx-auto text-center">
              <h2 className="font-cinzel tracking-widest text-responsive-3xl mb-8">
                FOLLOW <span className="text-amber-500">US</span>
              </h2>
              <p className="text-reading text-gray-300 text-responsive-lg mb-12 max-w-2xl mx-auto">
                Don't miss any updates! Follow us on all platforms for the latest music, behind-the-scenes content, and
                exclusive artist features.
              </p>

              <div className="flex justify-center space-x-6">
                <a
                  href="https://www.instagram.com/squaredrumla/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full text-white hover:scale-110 transition-transform duration-200"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="https://www.facebook.com/profile.php?id=61578083066260"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-blue-600 rounded-full text-white hover:scale-110 transition-transform duration-200"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="https://x.com/Squaredrumla"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-black rounded-full text-white hover:scale-110 transition-transform duration-200 border border-gray-600"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a
                  href="https://www.tiktok.com/@squaredrum7?_t=ZT-8xhnzRLn5O1&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 bg-black rounded-full text-white hover:scale-110 transition-transform duration-200"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43V7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.43z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="flex items-center justify-center w-12 h-12 bg-red-600 rounded-full text-white hover:scale-110 transition-transform duration-200"
                >
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </PageBlurOverlay>
    </div>
  )
}

"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { X, Radio, Download, Mail } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function AnimatedBanner() {
  const [showModal, setShowModal] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubmitted(true)
      
      try {
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            email, 
            name: email.split('@')[0] // Use email prefix as name fallback
          }),
        })
        
        if (!response.ok) {
          throw new Error('Subscription failed')
        }
        
        const result = await response.json()
        console.log('Newsletter subscription successful:', result.message)
        
      } catch (error) {
        console.error('Newsletter subscription error:', error)
        // Still show success to user for demo purposes
      }
      
      setTimeout(() => {
        setShowModal(false)
        setIsSubmitted(false)
        setEmail("")
      }, 2000)
    }
  }

  const handleLinkClick = () => {
    window.scrollTo(0, 0)
  }

  return (
    <>
      <div className="bg-amber-500 text-black py-0.75 overflow-hidden fixed top-16 sm:top-20 left-0 right-0 z-30 w-full">
        <div className="animate-marquee-center whitespace-nowrap">
          <span className="inline-block px-16">
            <Link
              href="https://music-square-radio.page.radio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-medium flex items-center space-x-2"
            >
              <Radio className="w-4 h-4" />
              <span>Listen Live At Music Square Radio</span>
            </Link>
          </span>
          <span className="inline-block px-16">
            <Link
              href="/releases"
              className="hover:underline font-medium flex items-center space-x-2"
              onClick={handleLinkClick}
            >
              <Download className="w-4 h-4" />
              <span>Download Songs Free!</span>
            </Link>
          </span>
          <span className="inline-block px-16">
            <button
              onClick={() => setShowModal(true)}
              className="hover:underline font-medium cursor-pointer flex items-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Subscribe To Be Notified About New Releases</span>
            </button>
          </span>
          <span className="inline-block px-16">
            <Link
              href="https://music-square-radio.page.radio"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline font-medium flex items-center space-x-2"
            >
              <Radio className="w-4 h-4" />
              <span>Listen Live At Music Square Radio</span>
            </Link>
          </span>
          <span className="inline-block px-16">
            <Link
              href="/releases"
              className="hover:underline font-medium flex items-center space-x-2"
              onClick={handleLinkClick}
            >
              <Download className="w-4 h-4" />
              <span>Download Songs Free!</span>
            </Link>
          </span>
          <span className="inline-block px-16">
            <button
              onClick={() => setShowModal(true)}
              className="hover:underline font-medium cursor-pointer flex items-center space-x-2"
            >
              <Mail className="w-4 h-4" />
              <span>Subscribe To Be Notified About New Releases</span>
            </button>
          </span>
        </div>
      </div>

      {/* Subscription Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white text-black rounded-lg p-6 max-w-md w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>

            {!isSubmitted ? (
              <>
                <h2 className="text-xl font-bold mb-4">Subscribe for New Release Notifications</h2>
                <form onSubmit={handleSubscribe} className="space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                  <Button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-black">
                    Subscribe
                  </Button>
                </form>
              </>
            ) : (
              <div className="text-center py-4">
                <h2 className="text-xl font-bold mb-2 text-green-600">Thank You!</h2>
                <p>You'll be notified about new releases.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}

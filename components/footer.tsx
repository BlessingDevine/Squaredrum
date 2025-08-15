"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Instagram, Youtube, Mail, MapPin, Phone, Facebook } from "lucide-react"
import { Button } from "@/components/ui/button"

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
  </svg>
)

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

export default function Footer() {
  const [currentYear] = useState(new Date().getFullYear())

  const handleJoinClick = () => {
    // Open external form in new tab
    window.open("https://forms.gle/your-form-id", "_blank", "noopener,noreferrer")
  }

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <Image src="/squaredrum-logo.png" alt="SquareDrum Records" width={40} height={40} className="mr-3" />
              <div>
                <h3 className="font-cinzel text-xl font-bold text-amber-500">SQUAREDRUM</h3>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-amber-500 p-2" asChild>
                <a href="https://www.instagram.com/squaredrumla/" target="_blank" rel="noopener noreferrer">
                  <Instagram className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-amber-500 p-2" asChild>
                <a href="https://x.com/Squaredrumla" target="_blank" rel="noopener noreferrer">
                  <XIcon className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-amber-500 p-2" asChild>
                <a href="https://www.youtube.com/@squaredrum" target="_blank" rel="noopener noreferrer">
                  <Youtube className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-amber-500 p-2" asChild>
                <a
                  href="https://www.tiktok.com/@squaredrum7?_t=ZT-8xhnzRLn5O1&_r=1"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TikTokIcon className="h-4 w-4" />
                </a>
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-amber-500 p-2" asChild>
                <a
                  href="https://www.facebook.com/profile.php?id=61578083066260"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-amber-500 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/releases" className="text-gray-400 hover:text-amber-500 text-sm transition-colors">
                  Releases
                </Link>
              </li>
              <li>
                <Link href="/artists" className="text-gray-400 hover:text-amber-500 text-sm transition-colors">
                  Artists
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-amber-500 text-sm transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-400 hover:text-amber-500 text-sm transition-colors">
                  News
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-amber-500 text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Releases */}
          <div>
            <h4 className="font-semibold text-white mb-4">Latest Releases</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/releases#afro-square"
                  className="text-gray-400 hover:text-amber-500 text-sm transition-colors"
                >
                  Afro Square
                </Link>
              </li>
              <li>
                <Link
                  href="/releases#country-square"
                  className="text-gray-400 hover:text-amber-500 text-sm transition-colors"
                >
                  Country Square
                </Link>
              </li>
              <li>
                <Link
                  href="/releases#pop-square"
                  className="text-gray-400 hover:text-amber-500 text-sm transition-colors"
                >
                  Pop Square
                </Link>
              </li>
              <li>
                <Link
                  href="/releases#rnb-square"
                  className="text-gray-400 hover:text-amber-500 text-sm transition-colors"
                >
                  R&B Square
                </Link>
              </li>
            </ul>
          </div>

          {/* Join The Music Square */}
          <div>
            <h4 className="font-semibold text-white mb-4">Join The Music Square</h4>
            <p className="text-gray-400 text-sm mb-4">
              Connect with us and be part of the AI music revolution. Follow our journey as we explore the intersection
              of artificial intelligence and human creativity.
            </p>
            <Button onClick={handleJoinClick} className="bg-amber-600 hover:bg-amber-700 text-white text-sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              Join Now
            </Button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t border-zinc-800 mt-8 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
            <div className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              <a href="mailto:info@squaredrumrecords.com" className="hover:text-amber-500 transition-colors">
                info@squaredrumrecords.com
              </a>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              <a href="tel:+1234567890" className="hover:text-amber-500 transition-colors">
                +1 (234) 567-8900
              </a>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Los Angeles, CA</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-zinc-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">© {currentYear} SquareDrum Records. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/privacy" className="text-gray-400 hover:text-amber-500 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-amber-500 text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

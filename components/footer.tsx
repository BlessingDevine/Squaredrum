"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, Instagram, Twitter, Youtube, Mail, MapPin, Phone } from 'lucide-react'
import { Button } from "@/components/ui/button"

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
              <a href="https://instagram.com/squaredrumrecords" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-amber-500 p-2" asChild>
              <a href="https://twitter.com/squaredrumrec" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-amber-500 p-2" asChild>
              <a href="https://youtube.com/@squaredrumrecords" target="_blank" rel="noopener noreferrer">
                <Youtube className="h-4 w-4" />
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

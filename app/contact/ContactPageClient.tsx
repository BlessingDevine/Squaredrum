"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageBlurOverlay from "@/components/page-blur-overlay"
import { MapPin, Phone, VoicemailIcon as Fax, Mail } from 'lucide-react'

export default function ContactPageClient() {
  const [isPageBlurred, setIsPageBlurred] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      if (!response.ok) {
        throw new Error('Failed to send message')
      }
      
      const result = await response.json()
      console.log('Contact form submitted successfully:', result.message)
      
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        message: "",
      })
      
      alert("Thank you for your message! We'll get back to you soon.")
      
    } catch (error) {
      console.error('Contact form error:', error)
      alert("Sorry, there was an error sending your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-black text-white">
      <Header onBlurChange={setIsPageBlurred} />

      <PageBlurOverlay isBlurred={isPageBlurred}>
        <main className="pt-32 sm:pt-36">
          <section className="py-16 sm:py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-12 sm:mb-16 text-center">
                <h1 className="font-cinzel tracking-widest text-4xl sm:text-5xl md:text-6xl mb-8">
                  <span className="text-amber-500">CONTACT</span>
                </h1>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 max-w-6xl mx-auto">
                {/* Contact Information */}
                <div className="space-y-6 sm:space-y-8">
                  {/* Address */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 text-amber-500 mt-1">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-cinzel tracking-wider text-lg sm:text-xl mb-2 text-amber-500">ADDRESS</h3>
                      <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                        9350 Wilshire Blvd, Suite 203
                        <br />
                        Beverly Hills, CA 90212
                        <br />
                        United States
                      </p>
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 text-amber-500 mt-1">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-cinzel tracking-wider text-lg sm:text-xl mb-2 text-amber-500">PHONE</h3>
                      <p className="text-gray-300 text-base sm:text-lg">(424) 500-0396</p>
                    </div>
                  </div>

                  {/* Fax */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 text-amber-500 mt-1">
                      <Fax className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-cinzel tracking-wider text-lg sm:text-xl mb-2 text-amber-500">FAX</h3>
                      <p className="text-gray-300 text-base sm:text-lg">(424) 500-0397</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-6 h-6 text-amber-500 mt-1">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-cinzel tracking-wider text-lg sm:text-xl mb-2 text-amber-500">EMAIL</h3>
                      <p className="text-gray-300 text-base sm:text-lg">info@squaredrum.com</p>
                    </div>
                  </div>
                </div>

                {/* Contact Form */}
                <div>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name Field */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block font-cinzel tracking-wider text-base sm:text-lg mb-2 text-gray-300"
                      >
                        NAME
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Your name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="bg-transparent border-gray-600 text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500 h-12 text-base"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Email Field */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block font-cinzel tracking-wider text-base sm:text-lg mb-2 text-gray-300"
                      >
                        EMAIL
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Your email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-transparent border-gray-600 text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500 h-12 text-base"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Message Field */}
                    <div>
                      <label
                        htmlFor="message"
                        className="block font-cinzel tracking-wider text-base sm:text-lg mb-2 text-gray-300"
                      >
                        MESSAGE
                      </label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Your message"
                        value={formData.message}
                        onChange={handleInputChange}
                        rows={6}
                        className="bg-transparent border-gray-600 text-white placeholder:text-gray-500 focus:border-amber-500 focus:ring-amber-500 resize-none text-base"
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-transparent border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-cinzel tracking-widest text-base sm:text-lg py-3 h-12 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        </main>
      </PageBlurOverlay>

      <Footer />
    </div>
  )
}

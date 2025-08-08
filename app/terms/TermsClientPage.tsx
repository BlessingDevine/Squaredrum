"use client"

import Link from "next/link"
import { ArrowLeft, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsClientPage() {
  const handleBackClick = () => {
    window.scrollTo(0, 0)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Back Button */}
        <Link
          href="/"
          onClick={handleBackClick}
          className="inline-flex items-center text-amber-500 hover:text-amber-400 transition-colors duration-300 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="font-cinzel text-4xl sm:text-5xl font-bold text-amber-500 mb-4 tracking-wider">
            TERMS OF SERVICE
          </h1>
          <p className="text-gray-400 text-lg">Effective Date: July 5, 2025</p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="prose prose-invert prose-amber max-w-none">
            <p className="text-gray-300 leading-relaxed mb-6">
              These Terms of Service ("Terms") govern your access to and use of the website Squaredrum.com ("Site"),
              owned and operated by SQUAREDUM LLC ("Company," "we," "us," or "our"). By accessing or using the Site, you
              agree to be bound by these Terms and our Privacy Policy. If you do not agree, do not use the Site.
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">1. Use of the Site</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You may access and use the Site for lawful, personal, and non-commercial purposes only. You agree not
                to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Use the Site in a manner that violates any applicable law or regulation</li>
                <li>Copy, distribute, or reproduce content from the Site without express written permission</li>
                <li>Use any automated system (e.g., bots, crawlers) to access the Site</li>
                <li>Interfere with the Site's functionality or attempt to access restricted areas</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                We reserve the right to restrict or terminate your access at any time without notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">2. Intellectual Property Rights</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                All content on the Site, including but not limited to music, text, graphics, logos, images, video clips,
                audio files, downloads, and digital media ("Content"), is owned by or licensed to SQUAREDUM LLC and
                protected by intellectual property laws.
              </p>
              <p className="text-gray-300 leading-relaxed">
                You may download free music and materials for personal use only. You may not reproduce, modify,
                distribute, display, perform, or use any Content for commercial purposes without our written consent.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">3. Free Downloads</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Squaredrum.com may offer free music downloads. These are intended for personal, non-commercial use only.
                By downloading, you agree not to:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Share, resell, or redistribute the files</li>
                <li>Alter the content in any way</li>
                <li>Use the music in commercial productions without permission or licensing</li>
              </ul>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mt-6">
                <p className="text-amber-200 font-medium mb-2">Download Agreement:</p>
                <p className="text-gray-300 text-sm italic">
                  "I understand that this content is for personal, non-commercial use only. I agree not to share,
                  resell, alter, or use this content in any commercial setting without permission from Squaredrum LLC."
                </p>
              </div>
              <p className="text-gray-300 leading-relaxed mt-4">
                For licensing inquiries, contact:{" "}
                <a href="mailto:licensing@squaredrum.com" className="text-amber-500 hover:text-amber-400">
                  licensing@squaredrum.com
                </a>
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">4. Licensing and Commercial Use</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                If you are interested in using any music, media, or content from Squaredrum.com in a commercial project
                — including advertising, podcasts, films, video games, or public performances — you must obtain prior
                written permission or a license from SQUAREDUM LLC.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">We offer licensing packages that may include:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-6">
                <li>Synchronization rights (for video, film, ads)</li>
                <li>Streaming and broadcast rights</li>
                <li>Mechanical reproduction licenses</li>
                <li>Custom commercial-use agreements</li>
              </ul>

              {/* Licensing Form */}
              <Card className="bg-gray-900 border-amber-500/20 mt-6">
                <CardHeader>
                  <CardTitle className="text-amber-500 font-cinzel">Commercial License Request Form</CardTitle>
                  <p className="text-gray-400 text-sm">
                    Please fill out this form and email it to{" "}
                    <a href="mailto:licensing@squaredrum.com" className="text-amber-500 hover:text-amber-400">
                      licensing@squaredrum.com
                    </a>{" "}
                    with the subject line "Commercial License Inquiry"
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">1. Full Name:</label>
                      <Input className="bg-gray-800 border-gray-700 text-white" placeholder="Your full name" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        2. Company/Organization (if applicable):
                      </label>
                      <Input className="bg-gray-800 border-gray-700 text-white" placeholder="Company name" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">3. Contact Email:</label>
                      <Input
                        type="email"
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="your@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">4. Project Title or Name:</label>
                      <Input className="bg-gray-800 border-gray-700 text-white" placeholder="Project name" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">5. Intended Use:</label>
                    <Input
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="e.g., podcast, film, ad, event, etc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">6. Distribution Channels:</label>
                    <Input
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="e.g., YouTube, TV, Spotify, Website"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        7. Expected Reach/Audience Size:
                      </label>
                      <Input className="bg-gray-800 border-gray-700 text-white" placeholder="if known" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">9. Duration of Use:</label>
                      <Input
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="e.g., 6 months, perpetual"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      8. Specific Tracks or Content You Wish to License:
                    </label>
                    <Textarea
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="List the specific tracks or content"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">10. Geographic Scope:</label>
                      <Input
                        className="bg-gray-800 border-gray-700 text-white"
                        placeholder="e.g., worldwide, North America only"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        11. Budget Range (optional):
                      </label>
                      <Input className="bg-gray-800 border-gray-700 text-white" placeholder="Your budget range" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      12. Additional Notes or Questions:
                    </label>
                    <Textarea
                      className="bg-gray-800 border-gray-700 text-white"
                      placeholder="Any additional information"
                    />
                  </div>

                  <div className="flex items-center justify-center pt-4">
                    <Button
                      className="bg-amber-500 hover:bg-amber-600 text-black font-cinzel tracking-wider"
                      onClick={() => {
                        const subject = encodeURIComponent("Commercial License Inquiry")
                        const body = encodeURIComponent(
                          "Please find my licensing request details below:\n\n[Copy and paste your form details here]",
                        )
                        window.open(`mailto:licensing@squaredrum.com?subject=${subject}&body=${body}`)
                      }}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Send License Request
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">5. Purchases</h2>
              <p className="text-gray-300 leading-relaxed">
                All purchases of music, merchandise, or services are subject to availability and our refund or exchange
                policy, if applicable. We use third-party payment processors. We are not responsible for errors, delays,
                or security issues arising from their systems.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">6. User Submissions</h2>
              <p className="text-gray-300 leading-relaxed">
                If you submit any content (e.g., feedback, demo music, messages), you grant SQUAREDUM LLC a
                non-exclusive, royalty-free, worldwide license to use, reproduce, and display such content for business
                and promotional purposes. Do not submit anything you do not have rights to.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">7. AI-Generated Content</h2>
              <p className="text-gray-300 leading-relaxed">
                Some content available on the Site may be partially or fully generated using artificial intelligence
                (AI) tools or processes. All such content is the intellectual property of SQUAREDUM LLC and is subject
                to the same use restrictions and protections described in these Terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">8. Disclaimer of Warranties</h2>
              <p className="text-gray-300 leading-relaxed">
                The Site and its content are provided "as is" and "as available." We make no guarantees regarding
                accuracy, reliability, or availability. We disclaim all warranties, express or implied, including
                merchantability and fitness for a particular purpose.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">9. Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                To the maximum extent permitted by law, SQUAREDUM LLC shall not be liable for any direct, indirect,
                incidental, or consequential damages resulting from your use of the Site or content downloaded from it.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">10. Third-Party Links</h2>
              <p className="text-gray-300 leading-relaxed">
                The Site may contain links to third-party websites. We are not responsible for the content, privacy
                policies, or practices of any third-party site.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">11. Governing Law</h2>
              <p className="text-gray-300 leading-relaxed">
                These Terms are governed by the laws of the State of California, United States, without regard to
                conflict of laws principles. Any disputes must be resolved in the state or federal courts located in
                California.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">12. Changes to the Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                We reserve the right to modify or update these Terms at any time. Changes will be posted on this page
                with a revised effective date. Continued use of the Site after changes indicates your acceptance.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">13. Plain Language Summary</h2>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-6">
                <p className="text-amber-200 font-medium mb-3">Informal Overview:</p>
                <ul className="list-disc list-inside text-gray-300 space-y-2">
                  <li>Use our site responsibly. Don't copy, steal, or abuse our content.</li>
                  <li>Downloads are free for personal use only. Commercial use requires a license.</li>
                  <li>Don't redistribute or edit our music.</li>
                  <li>If you buy something, it's handled securely by a trusted partner.</li>
                  <li>AI-made content is still our content.</li>
                  <li>We're not liable for damages from using our site or content.</li>
                  <li>You agree to our Terms by using the site.</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">14. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">For questions about these Terms, contact:</p>
              <div className="mt-4 p-4 bg-gray-900 rounded-lg border border-amber-500/20">
                <p className="text-white font-medium">SQUAREDUM LLC</p>
                <p className="text-gray-300">
                  Email:{" "}
                  <a href="mailto:legal@squaredrum.com" className="text-amber-500 hover:text-amber-400">
                    legal@squaredrum.com
                  </a>
                </p>
                <p className="text-gray-300">
                  Website:{" "}
                  <a href="https://www.squaredrum.com" className="text-amber-500 hover:text-amber-400">
                    https://www.squaredrum.com
                  </a>
                </p>
              </div>
            </section>
          </div>
        </div>

        {/* Back Button at Bottom */}
        <div className="text-center mt-12">
          <Link
            href="/"
            onClick={handleBackClick}
            className="inline-flex items-center bg-amber-500 hover:bg-amber-600 text-black px-6 py-3 rounded-lg font-cinzel tracking-wider transition-colors duration-300 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 transition-transform duration-300 group-hover:-translate-x-1" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

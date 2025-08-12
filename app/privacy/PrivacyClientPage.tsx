"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function PrivacyClientPage() {
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
            PRIVACY POLICY
          </h1>
          <div className="text-gray-400 text-lg space-y-1">
            <p>Effective Date: July 5, 2025</p>
            <p>Last Updated: July 5, 2025</p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="prose prose-invert prose-amber max-w-none">
            <p className="text-gray-300 leading-relaxed mb-6">
              Welcome to Squaredrum.com ("Site"), operated by SQUAREDUM LLC ("Company," "we," "us," or "our"). This
              Privacy Policy explains how we collect, use, share, and protect your information, and what rights you have
              under data protection laws including the General Data Protection Regulation (GDPR) and the California
              Consumer Privacy Act (CCPA)/California Privacy Rights Act (CPRA).
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">1. Information We Collect</h2>

              <h3 className="text-xl font-semibold text-amber-400 mb-3">
                a) Personal Information (Collected With Consent)
              </h3>
              <p className="text-gray-300 leading-relaxed mb-4">We may collect personal information when you:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Download free music or digital content</li>
                <li>Purchase music, merchandise, or services</li>
                <li>Subscribe to newsletters or promotional communications</li>
                <li>Submit forms or contact us directly</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mb-4">This may include:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-6">
                <li>Name</li>
                <li>Email address</li>
                <li>Postal address</li>
                <li>Payment details (processed securely through third parties, where applicable)</li>
                <li>IP address</li>
              </ul>

              <h3 className="text-xl font-semibold text-amber-400 mb-3">b) Automatically Collected Data</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                We collect data automatically through cookies and similar technologies:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Browser/device type</li>
                <li>Geographic location (approximate)</li>
                <li>Pages visited, time on site</li>
                <li>Referring website</li>
                <li>Clickstream data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">
                2. Legal Basis for Processing (GDPR)
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We only process your data when we have a lawful basis to do so, including:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Consent (e.g., for marketing emails)</li>
                <li>Contractual necessity (e.g., fulfilling downloads or purchases)</li>
                <li>Legal obligations</li>
                <li>Legitimate interest (e.g., site analytics, fraud prevention)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">3. How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">We use your information to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4">
                <li>Deliver and improve our music, content, and services</li>
                <li>Communicate with you about releases, promotions, or updates</li>
                <li>Fulfill purchases and free downloads, and process payments</li>
                <li>Protect against fraud and maintain security</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">4. How We Share Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We do not sell your personal data. However, we may share your data with:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Service providers (e.g., payment processors, email platforms, cloud hosting)</li>
                <li>Analytics providers (e.g., Google Analytics)</li>
                <li>Legal authorities (only when required by law)</li>
                <li>Business successors in case of a merger, acquisition, or sale</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                All third parties are required to safeguard your information.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">5. Your Rights</h2>

              <h3 className="text-xl font-semibold text-amber-400 mb-3">For EU/EEA Residents (GDPR):</h3>
              <p className="text-gray-300 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Access your data</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your data</li>
                <li>Object to or restrict processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mb-6">
                Contact us at{" "}
                <a href="mailto:privacy@squaredrum.com" className="text-amber-500 hover:text-amber-400">
                  privacy@squaredrum.com
                </a>{" "}
                to exercise your rights.
              </p>

              <h3 className="text-xl font-semibold text-amber-400 mb-3">For California Residents (CCPA/CPRA):</h3>
              <p className="text-gray-300 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Know what personal data we collect and how we use it</li>
                <li>Request access to your personal data</li>
                <li>Request deletion of your data</li>
                <li>Opt out of the "sale" or "sharing" of your data (we do not sell data)</li>
                <li>Limit use of sensitive personal information (if applicable)</li>
              </ul>
              <p className="text-gray-300 leading-relaxed">
                To make a request, email{" "}
                <a href="mailto:privacy@squaredrum.com" className="text-amber-500 hover:text-amber-400">
                  privacy@squaredrum.com
                </a>
                .
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">
                6. Cookies and Tracking Technologies
              </h2>
              <p className="text-gray-300 leading-relaxed mb-4">We use cookies and similar tools to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 ml-4 mb-4">
                <li>Enable site functionality</li>
                <li>Analyze traffic</li>
                <li>Remember preferences</li>
                <li>Deliver relevant content and marketing</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mb-4">
                By using our Site, you consent to the use of cookies. You can manage cookie preferences using your
                browser settings or by using our cookie banner.
              </p>
              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                <p className="text-amber-200 font-medium mb-2">Cookie Consent Tool:</p>
                <p className="text-gray-300 text-sm">
                  A cookie banner will appear on your first visit, allowing you to accept or reject specific categories
                  of cookies (e.g., functional, performance, marketing).
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">7. Data Retention</h2>
              <p className="text-gray-300 leading-relaxed">
                We retain your personal data only for as long as necessary to fulfill the purposes outlined in this
                policy or as required by law. You can request deletion at any time.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">8. Data Security</h2>
              <p className="text-gray-300 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal data. However,
                no system can be 100% secure. Use of the Site is at your own risk.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">9. International Data Transfers</h2>
              <p className="text-gray-300 leading-relaxed">
                If you are located outside the United States, your data may be transferred and processed in the U.S. We
                ensure appropriate safeguards are in place, such as Standard Contractual Clauses (SCCs) where required.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">10. Children's Privacy</h2>
              <p className="text-gray-300 leading-relaxed">
                Our services are not intended for children under 13. We do not knowingly collect data from children. If
                we become aware of such data collection, we will delete it promptly.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">11. Changes to This Privacy Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We may update this Privacy Policy from time to time. We encourage you to review this page regularly. If
                material changes are made, we'll notify you via the Site or email.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-amber-500 mb-4 font-cinzel">12. Contact Us</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                For any questions, concerns, or data requests, contact:
              </p>
              <div className="bg-gray-900 rounded-lg p-4 border border-amber-500/20">
                <p className="text-white font-medium">SQUAREDUM LLC</p>
                <p className="text-gray-300">
                  Email:{" "}
                  <a href="mailto:privacy@squaredrum.com" className="text-amber-500 hover:text-amber-400">
                    privacy@squaredrum.com
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

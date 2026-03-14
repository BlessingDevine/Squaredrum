import type { Metadata } from 'next'
import ContactPageClient from './ContactPageClient'

export const metadata: Metadata = {
  title: 'Contact | SQUAREDRUM Records',
  description: 'Get in touch with SQUAREDRUM Records, the world\'s first fully AI-driven music label. Contact us for licensing, partnerships, or questions about our AI-generated music.',
  keywords: 'contact SQUAREDRUM, AI music label contact, AI music licensing, AI music partnerships, AI record label',
  openGraph: {
    title: 'Contact | SQUAREDRUM Records',
    description: 'Get in touch with SQUAREDRUM Records, the world\'s first fully AI-driven music label.',
    type: 'website',
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}

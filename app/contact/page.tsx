import type { Metadata } from 'next'
import ContactPageClient from './ContactPageClient'

export const metadata: Metadata = {
  title: 'Contact | SQUAREDRUM Records',
  description: 'Get in touch with SQUAREDRUM Records. Contact us for artist inquiries, business partnerships, or general information about our global music collective.',
  keywords: 'contact SQUAREDRUM, music label contact, artist inquiries, business partnerships, record label contact',
  openGraph: {
    title: 'Contact | SQUAREDRUM Records',
    description: 'Get in touch with SQUAREDRUM Records for artist inquiries and partnerships.',
    type: 'website',
  },
}

export default function ContactPage() {
  return <ContactPageClient />
}

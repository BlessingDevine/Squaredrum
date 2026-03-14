import type { Metadata } from 'next'
import ArtistsPageClient from './ArtistsPageClient'

export const metadata: Metadata = {
  title: 'AI Artists | SQUAREDRUM Records',
  description: 'Meet our roster of AI artists at SQUAREDRUM Records. Each artist is fully AI-generated with unique personalities, voices, and musical styles—created entirely without human involvement.',
  keywords: 'AI artists, AI musicians, AI-generated artists, artificial intelligence music creators, virtual artists, machine-generated music, AI vocalists, AI composers',
  openGraph: {
    title: 'AI Artists | SQUAREDRUM Records',
    description: 'Meet our roster of fully AI-generated artists at SQUAREDRUM Records.',
    type: 'website',
  },
}

export default function ArtistsPage() {
  return <ArtistsPageClient />
}

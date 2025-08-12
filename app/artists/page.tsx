import type { Metadata } from 'next'
import ArtistsPageClient from './ArtistsPageClient'

export const metadata: Metadata = {
  title: 'Artists | SQUAREDRUM Records',
  description: 'Discover our talented roster of artists at SQUAREDRUM Records. From Afro-fusion to R&B, Country to Pop, explore the diverse sounds of our global music collective.',
  keywords: 'SQUAREDRUM artists, music artists, record label artists, Afro-fusion, R&B artists, country music, pop artists, global music',
  openGraph: {
    title: 'Artists | SQUAREDRUM Records',
    description: 'Discover our talented roster of artists at SQUAREDRUM Records.',
    type: 'website',
  },
}

export default function ArtistsPage() {
  return <ArtistsPageClient />
}

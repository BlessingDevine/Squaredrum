import type { Metadata } from 'next'
import NewsPageClient from './NewsPageClient'

export const metadata: Metadata = {
  title: 'News | SQUAREDRUM Records',
  description: 'Stay updated with the latest AI-generated music releases and news from SQUAREDRUM Records. Discover the evolution of our fully autonomous AI music label.',
  keywords: 'AI music news, SQUAREDRUM news, AI-generated releases, AI music updates, artificial intelligence music news',
  openGraph: {
    title: 'News | SQUAREDRUM Records',
    description: 'Stay updated with the latest AI-generated music releases from SQUAREDRUM Records.',
    type: 'website',
  },
}

export default function NewsPage() {
  return <NewsPageClient />
}

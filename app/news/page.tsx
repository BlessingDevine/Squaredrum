import type { Metadata } from 'next'
import NewsPageClient from './NewsPageClient'

export const metadata: Metadata = {
  title: 'News | SQUAREDRUM Records',
  description: 'Stay updated with the latest news, releases, and updates from SQUAREDRUM Records. Follow our artists and discover what\'s happening in our global music community.',
  keywords: 'SQUAREDRUM news, music news, record label updates, artist news, new releases, music industry',
  openGraph: {
    title: 'News | SQUAREDRUM Records',
    description: 'Stay updated with the latest news and releases from SQUAREDRUM Records.',
    type: 'website',
  },
}

export default function NewsPage() {
  return <NewsPageClient />
}

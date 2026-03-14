import type { Metadata } from 'next'
import NewsPageClient from './NewsPageClient'

export const metadata: Metadata = {
  title: 'AI Music News | SQUAREDRUM Records',
  description: 'The latest industry news on AI music generation, curated by SQUAREDRUM Records with insider analysis from our team.',
  keywords: 'AI music news, AI music industry, music technology, AI artists, music generation, Suno, Udio, AI copyright',
  openGraph: {
    title: 'AI Music News | SQUAREDRUM Records',
    description: 'The latest industry news on AI music generation, curated by SQUAREDRUM Records.',
    type: 'website',
  },
}

interface Article {
  id: string
  title: string
  description: string
  link: string
  pubDate: string
  image?: string
  source: string
  category: string
  aiSummary?: string
}

interface NewsResponse {
  articles: Article[]
  lastUpdated: string
  totalCount: number
}

async function getNews(): Promise<NewsResponse> {
  try {
    const baseUrl = process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    
    const response = await fetch(`${baseUrl}/api/news`, {
      next: { revalidate: 21600 }, // Cache for 6 hours
    })
    
    if (!response.ok) {
      throw new Error('Failed to fetch news')
    }
    
    return response.json()
  } catch (error) {
    console.error('Error fetching news:', error)
    return {
      articles: [],
      lastUpdated: new Date().toISOString(),
      totalCount: 0,
    }
  }
}

export default async function NewsPage() {
  const newsData = await getNews()
  
  return <NewsPageClient initialData={newsData} />
}

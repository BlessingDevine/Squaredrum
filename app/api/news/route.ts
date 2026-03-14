import { NextResponse } from "next/server"

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

const AI_KEYWORDS = [
  "ai music",
  "generative",
  "suno",
  "udio",
  "machine learning",
  "neural",
  "music ai",
  "ai-generated",
  "music generation",
  "artificial intelligence",
  "ai tool",
  "ai artist",
  "ai song",
  "ai album",
  "ai copyright",
  "ai streaming",
  "ai voice",
  "ai label",
  "synthetic voice",
  "deepfake",
]

// Using RSS feeds that are more reliable and don't block server requests
const RSS_SOURCES = [
  { url: "https://news.google.com/rss/search?q=AI+music+industry&hl=en-US&gl=US&ceid=US:en", name: "Google News", category: "Industry" },
  { url: "https://news.google.com/rss/search?q=Suno+AI+music&hl=en-US&gl=US&ceid=US:en", name: "Google News", category: "Tools & Tech" },
  { url: "https://news.google.com/rss/search?q=Udio+AI+music&hl=en-US&gl=US&ceid=US:en", name: "Google News", category: "Tools & Tech" },
  { url: "https://news.google.com/rss/search?q=AI+music+copyright&hl=en-US&gl=US&ceid=US:en", name: "Google News", category: "Copyright" },
  { url: "https://news.google.com/rss/search?q=generative+AI+music&hl=en-US&gl=US&ceid=US:en", name: "Google News", category: "Tools & Tech" },
  { url: "https://news.google.com/rss/search?q=AI+music+streaming&hl=en-US&gl=US&ceid=US:en", name: "Google News", category: "Business" },
]

function extractTextContent(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>|<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'gi')
  const match = regex.exec(xml)
  if (match) {
    return (match[1] || match[2] || '').trim()
  }
  return ''
}

function extractImageFromContent(content: string): string | undefined {
  // Try to extract image from content HTML
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/i
  const match = imgRegex.exec(content)
  if (match && match[1]) {
    return match[1]
  }
  return undefined
}

function parseRSSXML(xml: string, sourceName: string, category: string): Article[] {
  const articles: Article[] = []
  
  // Split by <item> tags
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi
  let match
  
  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1]
    
    const title = extractTextContent(itemXml, 'title')
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
    
    const link = extractTextContent(itemXml, 'link')
    const description = extractTextContent(itemXml, 'description')
      .replace(/<[^>]*>/g, '')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .substring(0, 300)
    
    const pubDate = extractTextContent(itemXml, 'pubDate')
    const content = extractTextContent(itemXml, 'content:encoded') || extractTextContent(itemXml, 'content')
    
    // Try to get image from media:content or enclosure
    let image: string | undefined
    const mediaRegex = /<media:content[^>]+url=["']([^"']+)["']/i
    const mediaMatch = mediaRegex.exec(itemXml)
    if (mediaMatch) {
      image = mediaMatch[1]
    }
    
    if (!image) {
      const enclosureRegex = /<enclosure[^>]+url=["']([^"']+)["']/i
      const enclosureMatch = enclosureRegex.exec(itemXml)
      if (enclosureMatch) {
        image = enclosureMatch[1]
      }
    }
    
    if (!image) {
      image = extractImageFromContent(content || description)
    }

    // Extract actual source from Google News title (format: "Title - Source")
    let actualSource = sourceName
    const sourceMatch = title.match(/ - ([^-]+)$/)
    if (sourceMatch && sourceName === "Google News") {
      actualSource = sourceMatch[1].trim()
    }
    
    if (title && link) {
      articles.push({
        id: `${sourceName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        title: title.replace(/ - [^-]+$/, ''), // Remove source suffix from title
        description,
        link,
        pubDate: pubDate || new Date().toISOString(),
        image,
        source: actualSource,
        category,
      })
    }
  }
  
  return articles
}

async function fetchRSSFeed(source: { url: string; name: string; category: string }): Promise<Article[]> {
  try {
    const response = await fetch(source.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; SquaredrumBot/1.0)',
        'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      },
      next: { revalidate: 21600 }, // Cache for 6 hours
    })

    if (!response.ok) {
      console.error(`Failed to fetch RSS from ${source.url}: ${response.status}`)
      return []
    }

    const xml = await response.text()
    return parseRSSXML(xml, source.name, source.category)
  } catch (error) {
    console.error(`Error fetching RSS from ${source.url}:`, error)
    return []
  }
}

async function generateSummaries(articles: Article[]): Promise<Article[]> {
  const anthropicKey = process.env.ANTHROPIC_API_KEY

  if (!anthropicKey || articles.length === 0) {
    return articles
  }

  try {
    const headlinesText = articles
      .map((a, i) => `${i + 1}. "${a.title}" - ${a.description.substring(0, 100)}`)
      .join("\n")

    const prompt = `You are a music industry insider writing for SQUAREDRUM Records, a pioneering AI-human collaborative music label. Generate exactly one short, punchy insider summary (max 20 words) for each headline below. Be witty and knowledgeable. Format response as valid JSON object with keys "1", "2", etc.

Headlines:
${headlinesText}

Respond ONLY with valid JSON, no markdown, no explanation.`

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    })

    if (!response.ok) {
      console.error(`Anthropic API error: ${response.status}`)
      return articles
    }

    const data = await response.json()
    const summaryText = data.content?.[0]?.text || ""

    try {
      const summaries = JSON.parse(summaryText)
      return articles.map((article, index) => ({
        ...article,
        aiSummary: summaries[String(index + 1)] || "",
      }))
    } catch {
      console.error("Failed to parse Anthropic response as JSON")
      return articles
    }
  } catch (error) {
    console.error("Error generating summaries:", error)
    return articles
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const refresh = searchParams.get("refresh")

  try {
    // Fetch all RSS feeds in parallel
    const feedPromises = RSS_SOURCES.map((source) => fetchRSSFeed(source))
    const feedResults = await Promise.all(feedPromises)

    // Flatten and deduplicate articles by title
    const seenTitles = new Set<string>()
    const allArticles: Article[] = []

    for (const articles of feedResults) {
      for (const article of articles) {
        const normalizedTitle = article.title.toLowerCase().trim()
        if (!seenTitles.has(normalizedTitle)) {
          seenTitles.add(normalizedTitle)
          allArticles.push(article)
        }
      }
    }

    // Sort by date (newest first)
    const sortedArticles = allArticles.sort(
      (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    )

    // Generate AI summaries for top 8 articles
    const topArticles = sortedArticles.slice(0, 8)
    const remainingArticles = sortedArticles.slice(8)

    const articlesWithSummaries = await generateSummaries(topArticles)

    const finalArticles = [...articlesWithSummaries, ...remainingArticles]

    return NextResponse.json({
      articles: finalArticles,
      lastUpdated: new Date().toISOString(),
      totalCount: finalArticles.length,
      refresh: refresh === "1",
    })
  } catch (error) {
    console.error("Error in news API:", error)
    return NextResponse.json(
      { error: "Failed to fetch news", articles: [] },
      { status: 500 }
    )
  }
}

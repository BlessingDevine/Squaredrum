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
]

const RSS_SOURCES = [
  "https://musictech.com/feed/",
  "https://www.musicbusinessworldwide.com/feed/",
  "https://hypebot.com/feed/",
  "https://techcrunch.com/feed/",
  "https://www.theverge.com/rss/index.xml",
  "https://www.billboard.com/feed/",
]

const CATEGORY_MAP: Record<string, string> = {
  musictech: "Tools & Tech",
  musicbusinessworldwide: "Business",
  hypebot: "Industry",
  techcrunch: "Tools & Tech",
  theverge: "Tools & Tech",
  billboard: "Industry",
}

function isAIMusicArticle(text: string): boolean {
  const lowerText = text.toLowerCase()
  return AI_KEYWORDS.some((keyword) => lowerText.includes(keyword))
}

function getCategoryFromSource(source: string): string {
  for (const [key, category] of Object.entries(CATEGORY_MAP)) {
    if (source.toLowerCase().includes(key)) {
      return category
    }
  }
  return "Industry"
}

async function fetchRSSFeed(rssUrl: string): Promise<Article[]> {
  const articles: Article[] = []

  try {
    const encodedUrl = encodeURIComponent(rssUrl)
    const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodedUrl}&count=25&api_key=ktaqpe7tzqbdvhrcbgnfpfwntm5qzwmw7y9l2vha`

    const response = await fetch(apiUrl, {
      next: { revalidate: 21600 }, // Cache for 6 hours
    })

    if (!response.ok) {
      console.error(`Failed to fetch RSS from ${rssUrl}: ${response.status}`)
      return articles
    }

    const data = await response.json()

    if (data.items && Array.isArray(data.items)) {
      for (const item of data.items) {
        const title = item.title || ""
        const description = item.description || ""
        const fullText = `${title} ${description}`

        if (isAIMusicArticle(fullText)) {
          const sourceName =
            new URL(rssUrl).hostname?.replace("www.", "").split(".")[0] || "News"
          const category = getCategoryFromSource(rssUrl)

          articles.push({
            id: `${sourceName}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            title,
            description: item.description?.replace(/<[^>]*>/g, "").substring(0, 250) || "",
            link: item.link || "",
            pubDate: item.pubDate || new Date().toISOString(),
            image: item.thumbnail || item.enclosure?.link,
            source: sourceName,
            category,
          })
        }
      }
    }
  } catch (error) {
    console.error(`Error fetching RSS from ${rssUrl}:`, error)
  }

  return articles
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
    const feedPromises = RSS_SOURCES.map((url) => fetchRSSFeed(url))
    const feedResults = await Promise.all(feedPromises)

    // Flatten and deduplicate articles
    const seenTitles = new Set<string>()
    const allArticles: Article[] = []

    for (const articles of feedResults) {
      for (const article of articles) {
        if (!seenTitles.has(article.title)) {
          seenTitles.add(article.title)
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

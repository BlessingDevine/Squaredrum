"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageBlurOverlay from "@/components/page-blur-overlay"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, ExternalLink, Loader2 } from 'lucide-react'
import Image from "next/image"

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
  "music generation"
]

const RSS_SOURCES = [
  "https://musictech.com/feed/",
  "https://www.musicbusinessworldwide.com/feed/",
  "https://hypebot.com/feed/",
  "https://techcrunch.com/feed/",
  "https://www.theverge.com/rss/index.xml",
  "https://www.billboard.com/feed/",
]

const CATEGORY_MAP: { [key: string]: string } = {
  "musictech": "Tools & Tech",
  "musicbusinessworldwide": "Business",
  "hypebot": "Industry",
  "techcrunch": "Tools & Tech",
  "theverge": "Tools & Tech",
  "billboard": "Industry",
}

const CATEGORIES = ["All", "Industry", "Tools & Tech", "Copyright", "Releases", "Business"]

function isAIMusicArticle(text: string): boolean {
  const lowerText = text.toLowerCase()
  return AI_KEYWORDS.some(keyword => lowerText.includes(keyword))
}

function getCategoryFromSource(source: string): string {
  for (const [key, category] of Object.entries(CATEGORY_MAP)) {
    if (source.toLowerCase().includes(key)) {
      return category
    }
  }
  return "Industry"
}

export default function NewsPageClient() {
  const [isPageBlurred, setIsPageBlurred] = useState(false)
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  const fetchNewsArticles = async () => {
    setLoading(true)
    try {
      const allArticles: Article[] = []
      const seenTitles = new Set<string>()

      for (const rssUrl of RSS_SOURCES) {
        try {
          const encodedUrl = encodeURIComponent(rssUrl)
          const apiUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodedUrl}&count=25&api_key=ktaqpe7tzqbdvhrcbgnfpfwntm5qzwmw7y9l2vha`
          
          const response = await fetch(apiUrl)
          const data = await response.json()

          if (data.items && Array.isArray(data.items)) {
            for (const item of data.items) {
              const title = item.title || ""
              const description = item.description || ""
              const fullText = `${title} ${description}`

              if (isAIMusicArticle(fullText) && !seenTitles.has(title)) {
                seenTitles.add(title)
                const sourceName = new URL(rssUrl).hostname?.replace("www.", "").split(".")[0] || "News"
                const category = getCategoryFromSource(rssUrl)

                allArticles.push({
                  id: `${sourceName}-${item.pubDate}`,
                  title,
                  description: item.description?.substring(0, 200) || "",
                  link: item.link || "",
                  pubDate: item.pubDate || new Date().toISOString(),
                  image: item.image?.url || item.enclosure?.link,
                  source: sourceName,
                  category,
                })
              }
            }
          }
        } catch (error) {
          console.error(`[v0] Error fetching from ${rssUrl}:`, error)
        }
      }

      // Sort by date and get top articles
      const sorted = allArticles.sort(
        (a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
      )

      // Generate AI summaries for top 8 articles
      const topArticles = sorted.slice(0, 8)
      const articlesWithSummaries = await generateSummaries(topArticles)

      setArticles(articlesWithSummaries)
      setLastUpdated(new Date().toLocaleTimeString())
    } catch (error) {
      console.error("[v0] Error fetching news:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateSummaries = async (articlesToSummarize: Article[]): Promise<Article[]> => {
    try {
      const headlinesText = articlesToSummarize
        .map((a, i) => `${i + 1}. "${a.title}" - ${a.description}`)
        .join("\n")

      const prompt = `You are a music industry insider writing for SQUAREDRUM Records, a pioneering AI music label. Generate 1-sentence insider summaries for each headline below in a witty, knowledgeable tone. Format as JSON with keys "1", "2", etc.

Headlines:
${headlinesText}

Respond ONLY with valid JSON, no other text.`

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.ANTHROPIC_API_KEY || "",
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1024,
          messages: [
            {
              role: "user",
              content: prompt
            }
          ]
        })
      })

      if (!response.ok) {
        throw new Error(`Anthropic API error: ${response.status}`)
      }

      const data = await response.json()
      const summaryText = data.content?.[0]?.text || ""

      try {
        const summaries = JSON.parse(summaryText)
        return articlesToSummarize.map((article, index) => ({
          ...article,
          aiSummary: summaries[String(index + 1)] || ""
        }))
      } catch {
        return articlesToSummarize
      }
    } catch (error) {
      console.error("[v0] Error generating summaries:", error)
      return articlesToSummarize
    }
  }

  useEffect(() => {
    fetchNewsArticles()
  }, [])

  const filteredArticles = selectedCategory === "All"
    ? articles
    : articles.filter(a => a.category === selectedCategory)

  const featuredArticles = filteredArticles.slice(0, 4)
  const remainingArticles = filteredArticles.slice(4)

  const ArticleSkeleton = () => (
    <Card className="bg-zinc-900/50 border-zinc-700 animate-pulse">
      <div className="h-48 bg-zinc-800 rounded-t-lg" />
      <CardContent className="p-4">
        <div className="h-6 bg-zinc-800 rounded mb-3" />
        <div className="h-4 bg-zinc-800 rounded mb-2" />
        <div className="h-4 bg-zinc-800 rounded w-3/4" />
      </CardContent>
    </Card>
  )

  return (
    <div className="flex min-h-screen flex-col bg-black text-white mobile-optimized">
      <Header onBlurChange={setIsPageBlurred} />

      <PageBlurOverlay isBlurred={isPageBlurred}>
        <main className="pt-16 sm:pt-20">
          {/* Hero Section */}
          <section className="spacing-mobile-section spacing-mobile">
            <div className="container mx-auto">
              <div className="text-center mb-12 sm:mb-16">
                <h1 className="font-cinzel tracking-widest text-responsive-4xl mb-6">
                  <span className="text-amber-500">AI MUSIC</span> NEWS
                </h1>
                <p className="text-reading text-gray-300 text-responsive-lg max-w-2xl mx-auto">
                  The latest industry news on AI music generation, curated by SQUAREDRUM and powered by insider analysis
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2 mb-12">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-amber-500 text-black"
                        : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Refresh Button */}
              <div className="text-center mb-8">
                <Button
                  onClick={fetchNewsArticles}
                  disabled={loading}
                  className="bg-amber-500 hover:bg-amber-600 text-black font-medium"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh News
                    </>
                  )}
                </Button>
                {lastUpdated && (
                  <p className="text-gray-400 text-sm mt-2">Last updated: {lastUpdated}</p>
                )}
              </div>

              {/* Featured Articles Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {[...Array(4)].map((_, i) => (
                    <ArticleSkeleton key={i} />
                  ))}
                </div>
              ) : featuredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {featuredArticles.map(article => (
                    <Card key={article.id} className="bg-zinc-900/80 border-zinc-700 hover:border-amber-500/50 transition-all overflow-hidden">
                      {article.image && (
                        <div className="relative w-full h-48 bg-zinc-800">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                            }}
                          />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Badge className="bg-amber-500 text-black text-xs font-bold">✦ AI DIGEST</Badge>
                          <Badge variant="outline" className="text-xs">{article.category}</Badge>
                        </div>
                        <h3 className="font-cinzel text-lg font-bold mb-2 line-clamp-2">{article.title}</h3>
                        {article.aiSummary && (
                          <div className="border-l-4 border-amber-500 pl-3 py-2 mb-3 bg-amber-500/5">
                            <p className="text-sm text-gray-300 italic">{article.aiSummary}</p>
                          </div>
                        )}
                        <a
                          href={article.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-amber-400 hover:text-amber-300 text-sm font-medium inline-flex items-center gap-1"
                        >
                          Read Full Story
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : null}

              {/* Articles List */}
              {!loading && remainingArticles.length > 0 && (
                <div className="max-w-4xl mx-auto">
                  <h2 className="font-cinzel text-2xl mb-6 text-amber-500">More Articles</h2>
                  <div className="space-y-4">
                    {remainingArticles.map(article => (
                      <Card key={article.id} className="bg-zinc-900/50 border-zinc-700 hover:border-amber-500/30 transition-all">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge className="bg-amber-500 text-black text-xs">✦ AI</Badge>
                                <span className="text-xs text-gray-400">{article.source}</span>
                              </div>
                              <h3 className="font-cinzel text-base font-bold mb-2">{article.title}</h3>
                              {article.aiSummary && (
                                <p className="text-sm text-gray-300 italic border-l-2 border-amber-500 pl-2 mb-2">
                                  {article.aiSummary}
                                </p>
                              )}
                              <a
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-amber-400 hover:text-amber-300 text-xs font-medium inline-flex items-center gap-1"
                              >
                                Read
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {!loading && filteredArticles.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-400 text-lg">No articles found in this category.</p>
                </div>
              )}
            </div>
          </section>
        </main>

        <Footer />
      </PageBlurOverlay>
    </div>
  )
}

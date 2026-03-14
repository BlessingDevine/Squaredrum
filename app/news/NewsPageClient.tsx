"use client"

import { useState } from "react"
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

interface NewsResponse {
  articles: Article[]
  lastUpdated: string
  totalCount: number
}

interface NewsPageClientProps {
  initialData: NewsResponse
}

const CATEGORIES = ["All", "Industry", "Tools & Tech", "Copyright", "Releases", "Business"]

export default function NewsPageClient({ initialData }: NewsPageClientProps) {
  const [isPageBlurred, setIsPageBlurred] = useState(false)
  const [articles, setArticles] = useState<Article[]>(initialData.articles)
  const [loading, setLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [lastUpdated, setLastUpdated] = useState<string>(
    initialData.lastUpdated 
      ? new Date(initialData.lastUpdated).toLocaleTimeString() 
      : new Date().toLocaleTimeString()
  )

  const refreshNews = async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/news?refresh=1")
      const data: NewsResponse = await response.json()
      setArticles(data.articles)
      setLastUpdated(new Date(data.lastUpdated).toLocaleTimeString())
    } catch (error) {
      console.error("Error refreshing news:", error)
    } finally {
      setLoading(false)
    }
  }

  const filteredArticles = selectedCategory === "All"
    ? articles
    : articles.filter(a => a.category === selectedCategory)

  const featuredArticles = filteredArticles.slice(0, 4)
  const remainingArticles = filteredArticles.slice(4)

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    } catch {
      return ""
    }
  }

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
                <div className="inline-flex items-center bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-full px-6 py-2 mb-6">
                  <span className="text-amber-500 font-cinzel text-sm tracking-wider">INDUSTRY INTELLIGENCE</span>
                </div>
                <h1 className="font-cinzel tracking-widest text-responsive-4xl mb-6">
                  <span className="text-amber-500">AI MUSIC</span> NEWS
                </h1>
                <p className="text-reading text-gray-300 text-responsive-lg max-w-2xl mx-auto">
                  The latest industry news on AI music generation, curated by SQUAREDRUM and powered by insider analysis
                </p>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full font-medium text-sm transition-all ${
                      selectedCategory === cat
                        ? "bg-amber-500 text-black"
                        : "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Refresh Button and Status */}
              <div className="flex items-center justify-center gap-4 mb-12">
                <Button
                  onClick={refreshNews}
                  disabled={loading}
                  variant="outline"
                  className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Refreshing...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Refresh
                    </>
                  )}
                </Button>
                <span className="text-gray-500 text-sm">
                  Updated: {lastUpdated}
                </span>
              </div>

              {/* Featured Articles Grid */}
              {loading && articles.length === 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {[...Array(4)].map((_, i) => (
                    <ArticleSkeleton key={i} />
                  ))}
                </div>
              ) : featuredArticles.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {featuredArticles.map(article => (
                    <Card 
                      key={article.id} 
                      className="bg-zinc-900/80 border-zinc-700 hover:border-amber-500/50 transition-all overflow-hidden group"
                    >
                      {article.image && (
                        <div className="relative w-full h-48 bg-zinc-800 overflow-hidden">
                          <Image
                            src={article.image}
                            alt={article.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement
                              target.style.display = "none"
                            }}
                          />
                        </div>
                      )}
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-amber-500 text-black text-xs font-bold px-2 py-0.5">AI DIGEST</Badge>
                            <Badge variant="outline" className="text-xs border-zinc-600">{article.category}</Badge>
                          </div>
                          <span className="text-xs text-gray-500">{formatDate(article.pubDate)}</span>
                        </div>
                        <h3 className="font-cinzel text-lg font-bold mb-3 line-clamp-2 group-hover:text-amber-400 transition-colors">
                          {article.title}
                        </h3>
                        {article.aiSummary && (
                          <div className="border-l-4 border-amber-500 pl-3 py-2 mb-4 bg-amber-500/5 rounded-r">
                            <p className="text-sm text-gray-300 italic leading-relaxed">{article.aiSummary}</p>
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500 capitalize">{article.source}</span>
                          <a
                            href={article.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-400 hover:text-amber-300 text-sm font-medium inline-flex items-center gap-1 transition-colors"
                          >
                            Read Full Story
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : null}

              {/* More Articles List */}
              {remainingArticles.length > 0 && (
                <div className="max-w-4xl mx-auto">
                  <h2 className="font-cinzel text-2xl mb-6">
                    <span className="text-amber-500">MORE</span> ARTICLES
                  </h2>
                  <div className="space-y-4">
                    {remainingArticles.map(article => (
                      <Card 
                        key={article.id} 
                        className="bg-zinc-900/50 border-zinc-700 hover:border-amber-500/30 transition-all"
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-amber-500/20 text-amber-400 text-xs border-amber-500/30">AI</Badge>
                                <span className="text-xs text-gray-500 capitalize">{article.source}</span>
                                <span className="text-xs text-gray-600">|</span>
                                <span className="text-xs text-gray-500">{formatDate(article.pubDate)}</span>
                              </div>
                              <h3 className="font-medium text-base mb-2 hover:text-amber-400 transition-colors">
                                <a href={article.link} target="_blank" rel="noopener noreferrer">
                                  {article.title}
                                </a>
                              </h3>
                              {article.aiSummary && (
                                <p className="text-sm text-gray-400 italic border-l-2 border-amber-500/50 pl-3 mb-2">
                                  {article.aiSummary}
                                </p>
                              )}
                            </div>
                            <a
                              href={article.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-amber-400 hover:text-amber-300 p-2 hover:bg-amber-500/10 rounded transition-colors flex-shrink-0"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {filteredArticles.length === 0 && !loading && (
                <div className="text-center py-16">
                  <p className="text-gray-400 text-lg mb-4">No articles found in this category.</p>
                  <Button
                    onClick={() => setSelectedCategory("All")}
                    variant="outline"
                    className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
                  >
                    View All Articles
                  </Button>
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

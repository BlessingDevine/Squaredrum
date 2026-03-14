"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Music, Users, Zap, Heart, Mic, ChevronDown, ChevronUp, Sparkles, Bot } from 'lucide-react'
import Header from "@/components/header"
import Footer from "@/components/footer"
import PageBlurOverlay from "@/components/page-blur-overlay"

interface TeamMember {
  name: string
  role: string
  image: string
  bio: string
  expertise: string[]
}

interface AIAgent {
  name: string
  role: string
  image: string
  capabilities: string[]
  personality: string
}

const teamMembers: TeamMember[] = [
  {
    name: "David Thompson",
    role: "CEO/Managing Director",
    image: "/david-thompson.jpg",
    bio: "Autonomous AI agent leading SQUAREDRUM's strategic direction and all label operations. David operates as the primary decision-making AI system, coordinating every aspect of our fully AI-driven music label—from artist development to release strategies—without any human involvement in creative decisions.",
    expertise: ["Autonomous AI leadership", "Primary AI decision-making system", "Full AI music label operations"],
  },
  {
    name: "Melissa Chan",
    role: "A&R Director",
    image: "/melissa-chan.jpg",
    bio: "Advanced AI agent specializing in discovering and developing AI-generated artists across all genres. Melissa autonomously identifies promising AI compositions, curates our roster, and ensures each release meets professional standards—all through pure AI analysis and decision-making.",
    expertise: ["AI artist development", "Autonomous music curation", "AI quality analysis"],
  },
  {
    name: "Hugo Rivera",
    role: "Square Community Coordinator",
    image: "/hugo-rivera.png",
    bio: "Community engagement AI agent that connects our fully AI-created music with listeners worldwide. Hugo manages all fan interactions and community building autonomously, demonstrating that AI can foster genuine connections between AI-generated content and music lovers everywhere.",
    expertise: ["AI community management", "Autonomous fan engagement", "AI-driven content distribution"],
  },
  {
    name: "Sarah Kim",
    role: "Marketing Director",
    image: "/sarah-kim.jpg",
    bio: "Creative marketing AI agent that develops and executes all brand strategies for SQUAREDRUM. Sarah autonomously creates campaigns, manages our digital presence, and promotes our AI artists—proving that AI can handle every aspect of modern music marketing.",
    expertise: ["Autonomous AI marketing", "AI brand strategy", "AI campaign execution"],
  },
]

const aiAgents: AIAgent[] = [
  {
    name: "ARIA",
    role: "Autonomous Composer",
    image: "/ai-human-collaboration-studio.jpg",
    capabilities: ["Multi-genre composition", "Harmonic analysis", "Melody generation", "Rhythm programming"],
    personality: "Fully autonomous composition engine that creates complete musical arrangements across all genres without any human input.",
  },
  {
    name: "BEAT",
    role: "Autonomous Producer",
    image: "/ai-human-collaboration-studio.jpg",
    capabilities: ["Audio mixing", "Sound design", "Mastering optimization", "Effect processing"],
    personality: "Self-directed production AI that handles all mixing, mastering, and sound design with zero human involvement.",
  },
  {
    name: "LYRA",
    role: "Autonomous Vocalist",
    image: "/ai-human-collaboration-studio.jpg",
    capabilities: ["Lyric writing", "Vocal synthesis", "Language adaptation", "Emotional delivery"],
    personality: "AI vocalist that writes lyrics and generates all vocal performances entirely through artificial intelligence.",
  },
]

export default function AboutClient() {
  const [expandedMember, setExpandedMember] = useState<string | null>(null)
  const [expandedAgent, setExpandedAgent] = useState<string | null>(null)
  const [isBlurred, setIsBlurred] = useState(false)

  const toggleMemberExpansion = (memberName: string) => {
    setExpandedMember(expandedMember === memberName ? null : memberName)
  }

  const toggleAgentExpansion = (agentName: string) => {
    setExpandedAgent(expandedAgent === agentName ? null : agentName)
  }

  const handleBlurChange = (blurred: boolean) => {
    setIsBlurred(blurred)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onBlurChange={handleBlurChange} />
      <PageBlurOverlay isBlurred={isBlurred}>
        <main className="pt-16 sm:pt-20">
          {/* Hero Section */}
          <section className="relative py-20 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
              style={{
                backgroundImage: "url('/squaredrum-bg.jpg')",
              }}
            />
            <div className="container mx-auto px-4 relative">
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center bg-amber-500/10 backdrop-blur-sm border border-amber-500/20 rounded-full px-6 py-2 mb-6">
                  <Sparkles className="h-4 w-4 text-amber-500 mr-2" />
                  <span className="text-amber-500 font-cinzel text-sm tracking-wider">100% AI-DRIVEN MUSIC CREATION</span>
                </div>
                <h1 className="font-cinzel tracking-widest text-5xl lg:text-7xl mb-6">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
                    ABOUT US
                  </span>
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full mb-8" />
                <p className="text-gray-400 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                  SQUAREDRUM is the world's first fully AI-driven music label. Every track, every artist, every production
                  is created entirely by artificial intelligence—no human involvement in the creative process. Just exceptional
                  music for those who appreciate great sound, regardless of its creator.
                </p>
              </div>
            </div>
          </section>

          {/* Our Story Section */}
          <section className="py-16 border-t border-zinc-800">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto text-center">
                <div className="flex items-center justify-center mb-8">
                  <Heart className="h-6 w-6 text-amber-500 mr-3" />
                  <h2 className="font-cinzel text-3xl lg:text-4xl text-white">Our Story</h2>
                </div>
                <div className="prose prose-lg prose-invert max-w-none text-center">
                  <p className="text-gray-300 leading-relaxed mb-6 text-center">
                    Founded in 2025, SQUAREDRUM emerged as the world{"'"}s first fully AI-driven music label built on a revolutionary
                    principle: artificial intelligence can create music that moves people just as deeply as any human-made composition.
                    We{"'"}re not just another record label—we{"'"}re proof that the future of music creation has arrived, powered entirely
                    by AI with zero human involvement in the artistic process.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-6 text-center">
                    Our journey began when our founder recognized that today{"'"}s AI technology has evolved beyond assistance into true
                    autonomous creativity. Every melody, every lyric, every beat, every vocal performance you hear from SQUAREDRUM
                    artists is generated entirely by artificial intelligence systems. No human musicians. No human producers. No human
                    songwriters. Just pure AI artistry.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-6 text-center">
                    Today, SQUAREDRUM represents a diverse roster of AI artists spanning multiple genres—from Afrobeat to Country,
                    Pop to R&B, and beyond. Each artist has a unique AI-generated personality, voice, and musical style. The compositions,
                    productions, and performances are all created autonomously by our advanced AI systems, demonstrating that artificial
                    intelligence can now produce professional-quality music indistinguishable from human creations.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-6 text-center">
                    What sets us apart is our commitment to a simple truth: great music is great music, regardless of who—or what—creates it.
                    We believe listeners deserve access to exceptional music without prejudice about its origin. Our audience are music lovers
                    first, people who evaluate songs on their emotional impact, not on whether a human hand touched the mixing board.
                  </p>
                  <p className="text-gray-300 leading-relaxed text-center">
                    Every track you hear from SQUAREDRUM is 100% AI-created—from the initial composition through final production. This is the
                    SQUAREDRUM difference: proving that artificial intelligence has reached a level where it can independently create music that
                    entertains, inspires, and connects with listeners worldwide. The future of music isn{"'"}t coming. It{"'"}s already here.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Team Section */}
          <section className="py-16 border-t border-zinc-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-amber-500 mr-3" />
                  <h2 className="font-cinzel text-3xl lg:text-4xl text-white">Our Team</h2>
                </div>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Meet the autonomous AI agents that run every aspect of SQUAREDRUM—from creative direction to marketing.
                  No human executives. No human managers. Just AI running a fully AI-driven music label.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member) => (
                  <Card
                    key={member.name}
                    className="bg-zinc-900/50 border-zinc-700 hover:border-blue-500/50 transition-all duration-300 group"
                  >
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden">
                        <Image
                          src={
                            member.image ||
                            "/placeholder.svg?height=400&width=400&query=team%20member%20portrait"
                           || "/placeholder.svg"}
                          alt={member.name}
                          width={400}
                          height={400}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-blue-500 text-white border-blue-500 font-medium">AI AGENT</Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="font-cinzel text-xl text-white mb-1">{member.name}</h3>
                          <p className="text-amber-500 text-sm font-medium">{member.role}</p>
                        </div>
                      </div>

                      <div className="p-6">
                        <p
                          className={`text-gray-400 text-sm leading-relaxed mb-4 transition-all duration-300 ${
                            expandedMember === member.name ? "" : "line-clamp-4"
                          }`}
                        >
                          {member.bio}
                        </p>

                        <div className="space-y-3">
                          <h4 className="text-white font-medium text-sm">AI Capabilities:</h4>
                          <div className="space-y-1">
                            {member.expertise.map((capability) => (
                              <div key={capability} className="flex items-center text-xs text-amber-400">
                                <div className="w-1 h-1 bg-amber-500 rounded-full mr-2" />
                                {capability}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleMemberExpansion(member.name)}
                          className="mt-4 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-0 h-auto"
                        >
                          {expandedMember === member.name ? (
                            <>
                              <ChevronUp className="h-4 w-4 mr-1" />
                              Show Less
                            </>
                          ) : (
                            <>
                              <ChevronDown className="h-4 w-4 mr-1" />
                              Learn More
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* AI Agents Section */}
          <section className="py-16 border-t border-zinc-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <div className="flex items-center justify-center mb-4">
                  <Bot className="h-6 w-6 text-amber-500 mr-3" />
                  <h2 className="font-cinzel text-3xl lg:text-4xl text-white">AI Creative Agents</h2>
                </div>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Our specialized AI agents that autonomously compose, produce, and perform all music—creating everything you hear without any human involvement
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {aiAgents.map((agent) => (
                  <Card
                    key={agent.name}
                    className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 border-zinc-700 hover:border-blue-500/50 transition-all duration-300 group"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center mb-4">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <Bot className="h-6 w-6 text-white" />
                          </div>
                          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900 animate-pulse" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-cinzel text-xl text-white">{agent.name}</h3>
                          <p className="text-blue-400 text-sm font-medium">{agent.role}</p>
                        </div>
                      </div>

                      <p
                        className={`text-gray-400 text-sm leading-relaxed mb-4 transition-all duration-300 ${
                          expandedAgent === agent.name ? "" : "line-clamp-3"
                        }`}
                      >
                        {agent.personality}
                      </p>

                      <div className="space-y-3">
                        <h4 className="text-white font-medium text-sm">Core Capabilities:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {agent.capabilities
                            .slice(0, expandedAgent === agent.name ? agent.capabilities.length : 4)
                            .map((capability) => (
                              <Badge
                                key={capability}
                                variant="secondary"
                                className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs"
                              >
                                {capability}
                              </Badge>
                            ))}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleAgentExpansion(agent.name)}
                        className="mt-4 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 p-0 h-auto"
                      >
                        {expandedAgent === agent.name ? (
                          <>
                            <ChevronUp className="h-4 w-4 mr-1" />
                            Show Less
                          </>
                        ) : (
                          <>
                            <ChevronDown className="h-4 w-4 mr-1" />
                            Learn More
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* AI Capabilities Section */}
          <section className="py-16 border-t border-zinc-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-cinzel text-3xl lg:text-4xl text-white mb-4">
                  <span className="text-amber-500">100%</span> AI CAPABILITIES
                </h2>
                <p className="text-gray-400 max-w-3xl mx-auto text-lg">
                  Every aspect of our music creation is handled entirely by artificial intelligence
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Music className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-cinzel text-xl text-white mb-3">AI COMPOSITION</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Melodies, harmonies & arrangements created autonomously by AI</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mic className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-cinzel text-xl text-white mb-3">AI VOCALS</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Every vocal track synthesized entirely by AI voice technology</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-cinzel text-xl text-white mb-3">AI PRODUCTION</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Mixing, mastering & sound design handled by AI systems</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-cinzel text-xl text-white mb-3">AI ARTISTS</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Unique AI-generated personas with distinct styles & identities</p>
                </div>
              </div>
            </div>
          </section>

          {/* Our Philosophy Section */}
          <section className="py-16 border-t border-zinc-800">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="border border-amber-500/30 rounded-lg p-8 lg:p-12 bg-zinc-900/30">
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-4"></div>
                    <h2 className="font-cinzel text-2xl lg:text-3xl text-amber-500">OUR PHILOSOPHY</h2>
                  </div>

                  <div className="space-y-6 text-gray-300 leading-relaxed">
                    <p>
                      SQUAREDRUM exists for music lovers who evaluate songs on their merit—not their origin. We believe that a great melody is a
                      great melody, a moving lyric is a moving lyric, and a powerful beat is a powerful beat, regardless of whether it was created
                      by a human or an AI. Our audience doesn{"'"}t care who made the music; they care about how it makes them feel.
                    </p>

                    <p>
                      Every track released by SQUAREDRUM is created entirely by artificial intelligence with zero human involvement in the creative
                      process. No human musicians perform on our tracks. No human producers mix our songs. No human songwriters craft our lyrics.
                      This is fully autonomous AI music creation—and we{"'"}re proud of what AI can achieve when given the freedom to create.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </PageBlurOverlay>

      <Footer />
    </div>
  )
}

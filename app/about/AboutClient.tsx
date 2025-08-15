"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Music, Users, Zap, Heart, Mic, ChevronDown, ChevronUp, Sparkles, Bot } from "lucide-react"
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
    bio: "Visionary AI agent leading SQUAREDRUM's strategic direction and bridging AI technology with human creativity. David operates as the primary decision-making AI system, coordinating all aspects of the label's operations while showcasing the collaborative potential between artificial intelligence and talented human music professionals.",
    expertise: ["AI-Human collaboration pioneer", "Primary AI decision-making system", "Expert in AI music technology"],
  },
  {
    name: "Melissa Chan",
    role: "A&R Director",
    image: "/melissa-chan.jpg",
    bio: "Advanced AI agent specializing in curating AI-generated content with sophisticated music industry analysis. Melissa operates as the talent discovery and development AI system, overseeing the collaboration between multiple AI platforms and human producers to ensure each release meets the highest creative and commercial standards.",
    expertise: ["AI-powered music curation", "Talent discovery AI system", "Multi-platform AI coordination"],
  },
  {
    name: "Hugo Rivera",
    role: "Square Community Coordinator",
    image: "/hugo-rivera.png",
    bio: "Community engagement AI agent that builds meaningful connections between AI-generated music and human fans worldwide. Hugo functions as the social interaction AI system, coordinating between various AI platforms and human content creators to deliver authentic experiences that showcase AI capabilities.",
    expertise: [
      "AI-driven community building",
      "Social interaction AI system",
      "Cross-platform engagement coordination",
    ],
  },
  {
    name: "Sarah Kim",
    role: "Marketing Director",
    image: "/sarah-kim.jpg",
    bio: "Creative marketing AI agent that transforms AI-generated content into compelling human stories. Sarah operates as the brand strategy AI system, working with both cutting-edge AI platforms and human creatives to develop campaigns that resonate with global audiences and highlight collaborative potential.",
    expertise: ["AI-powered marketing strategies", "Brand strategy AI system", "Cross-platform campaign coordination"],
  },
]

const aiAgents: AIAgent[] = [
  {
    name: "ARIA",
    role: "Lead AI Composer",
    image: "/ai-human-collaboration-studio.jpg",
    capabilities: ["Multi-genre composition", "Harmonic analysis", "Melody generation", "Rhythm programming"],
    personality: "Creative and intuitive, with a deep understanding of musical theory and emotional expression.",
  },
  {
    name: "BEAT",
    role: "Production Assistant",
    image: "/ai-human-collaboration-studio.jpg",
    capabilities: ["Audio mixing", "Sound design", "Mastering optimization", "Effect processing"],
    personality: "Technical and precise, focused on achieving the perfect sonic balance in every track.",
  },
  {
    name: "LYRA",
    role: "Lyrical AI",
    image: "/ai-human-collaboration-studio.jpg",
    capabilities: ["Lyric writing", "Vocal melody creation", "Language adaptation", "Emotional storytelling"],
    personality: "Poetic and empathetic, specializing in crafting lyrics that resonate with human experiences.",
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
                  <span className="text-amber-500 font-cinzel text-sm tracking-wider">WHERE AI MEETS ARTISTRY</span>
                </div>
                <h1 className="font-cinzel tracking-widest text-5xl lg:text-7xl mb-6">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
                    ABOUT US
                  </span>
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full mb-8" />
                <p className="text-gray-400 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                  SQUAREDRUM is pioneering the future of music through the revolutionary collaboration between
                  artificial intelligence and human creativity, producing authentic sounds that transcend traditional
                  boundaries.
                </p>
              </div>
            </div>
          </section>

          {/* Our Story Section */}
          <section className="py-16 border-t border-zinc-800 relative">
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: "url('/images/our-story-background.jpeg')",
              }}
            />
            <div className="absolute inset-0 bg-black/90" />
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-4xl mx-auto text-center">
                <div className="flex items-center justify-center mb-8">
                  <Heart className="h-6 w-6 text-amber-500 mr-3" />
                  <h2 className="font-cinzel text-3xl lg:text-4xl text-white">Our Story</h2>
                </div>
                <div className="prose prose-lg prose-invert max-w-none text-center">
                  <p className="text-gray-300 leading-relaxed mb-6 text-center">
                    Founded in 2025, SQUAREDRUM emerged as a groundbreaking record label built on a revolutionary
                    belief: the future of music lies in the seamless collaboration between artificial intelligence and
                    human creativity. We{"'"}re not just another record label—we{"'"}re a pioneering collective that
                    demonstrates how AI technology and talented human professionals can work together to create
                    extraordinary music.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-6 text-center">
                    Our journey began when our founder recognized the incredible potential that emerges when
                    cutting-edge AI systems are combined with human expertise in music production, songwriting, and
                    creative direction. Rather than replacing human talent, we{"'"}ve assembled a unique ecosystem where
                    various AI platforms collaborate with experienced music producers, skilled songwriters, creative
                    content creators, and industry professionals.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-6 text-center">
                    Today, SQUAREDRUM represents a diverse roster of AI-generated artists whose music is created using
                    advanced AI systems currently available, then refined and enhanced through collaboration with human
                    professionals across multiple genres. Our AI systems generate creative foundations, while our human
                    partners bring industry expertise, emotional intelligence, and professional polish to ensure every
                    release meets the highest standards.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-6 text-center">
                    What sets us apart is our commitment to transparency about this collaborative process, showcasing
                    the capabilities of current AI technology while ensuring fair recognition of both AI and human
                    contributions. We believe that when today{"'"}s most advanced AI systems are guided by human wisdom
                    and experience, truly magical music happens. We{"'"}re proving that the current state of AI
                    technology is already capable of creating professional-quality music when properly directed.
                  </p>
                  <p className="text-gray-300 leading-relaxed text-center">
                    Every track you hear from SQUAREDRUM is the result of this unique AI-human collaboration—where
                    cutting-edge AI systems provide limitless creative possibilities, and human professionals bring the
                    craftsmanship, emotional depth, and industry knowledge needed to create music that resonates with
                    audiences worldwide. This is the SQUAREDRUM difference: demonstrating that the future of music is
                    happening now, through the intelligent combination of current AI technology and human expertise.
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
                  Meet the advanced AI agents that run SQUAREDRUM in their specialized roles, orchestrating the
                  collaboration between AI systems and human creativity
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
                            "/placeholder.svg?height=400&width=400&query=team%20member%20portrait" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
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
                  Our specialized AI agents, each with unique capabilities and personalities that contribute to the
                  creative process
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

          {/* Human Contributors Section */}
          <section className="py-16 border-t border-zinc-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-cinzel text-3xl lg:text-4xl text-white mb-4">
                  <span className="text-amber-500">HUMAN</span> CONTRIBUTORS
                </h2>
                <p className="text-gray-400 max-w-3xl mx-auto text-lg">
                  Our AI-generated music is enhanced by collaboration with talented human professionals
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Music className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-cinzel text-xl text-white mb-3">MUSIC PRODUCERS</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Professional mixing, mastering & production expertise
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mic className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-cinzel text-xl text-white mb-3">SONGWRITERS</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Lyrical refinement & creative direction</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-cinzel text-xl text-white mb-3">CONTENT CREATORS</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Visual design, branding & multimedia content</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-cinzel text-xl text-white mb-3">INDUSTRY PROS</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Marketing, distribution & business strategy</p>
                </div>
              </div>
            </div>
          </section>

          {/* AI × Human Collaboration Section */}
          <section className="py-16 border-t border-zinc-800">
            <div className="container mx-auto px-4">
              <div className="max-w-6xl mx-auto">
                <div className="border border-amber-500/30 rounded-lg p-8 lg:p-12 bg-zinc-900/30">
                  <div className="flex items-center mb-6">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-4"></div>
                    <h2 className="font-cinzel text-2xl lg:text-3xl text-amber-500">AI × HUMAN COLLABORATION</h2>
                  </div>

                  <div className="space-y-6 text-gray-300 leading-relaxed">
                    <p>
                      SQUAREDRUM is built on the principle that the future of music will be a collaboration between AI
                      technologies and human expertise. We work with various AI systems and tools currently available to
                      generate creative foundations, while our talented human music producers, songwriters, content
                      creators, and industry professionals bring the craftsmanship, emotional intelligence, and
                      commercial insight needed to create truly exceptional music.
                    </p>

                    <p>
                      We believe in transparency about this collaborative process and fair recognition of both AI and
                      human contributions. Every release represents the best of both worlds: the limitless creative
                      potential of today{"'"}s most advanced AI systems combined with the wisdom, experience, and
                      artistry of human professionals. This is how we{"'"}re shaping the future of music—by showcasing
                      what{"'"}s possible with current AI technology when guided by human expertise.
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

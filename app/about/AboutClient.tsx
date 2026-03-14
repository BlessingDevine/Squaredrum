"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Music, Users, Zap, Heart, Mic, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
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


const teamMembers: TeamMember[] = [
  {
    name: "David Thompson",
    role: "CEO/Managing Director",
    image: "/david-thompson.jpg",
    bio: "Visionary leader guiding SQUAREDRUM's strategic direction and bridging AI technology with human creativity. David oversees all label operations and ensures our unique AI-human collaboration model delivers exceptional music, coordinating between our AI systems and professional production team.",
    expertise: ["Strategic leadership", "AI-human collaboration", "Music industry expertise"],
  },
  {
    name: "Melissa Chan",
    role: "A&R Director",
    image: "/melissa-chan.jpg",
    bio: "Experienced A&R professional specializing in curating AI-generated content and overseeing production quality. Melissa identifies promising AI compositions, coordinates with our mixing and mastering engineers, and ensures each release meets the highest professional standards.",
    expertise: ["Artist development", "Production oversight", "Quality curation"],
  },
  {
    name: "Hugo Rivera",
    role: "Square Community Coordinator",
    image: "/hugo-rivera.png",
    bio: "Community engagement specialist who builds meaningful connections between our AI-human collaborative music and fans worldwide. Hugo manages fan interactions, gathers feedback on our productions, and ensures our community understands the craftsmanship behind every release.",
    expertise: ["Community building", "Fan engagement", "Brand communication"],
  },
  {
    name: "Sarah Kim",
    role: "Marketing Director",
    image: "/sarah-kim.jpg",
    bio: "Creative marketing professional who develops compelling campaigns that highlight both our AI innovation and human production expertise. Sarah crafts brand stories that resonate with audiences who appreciate the artistry of professional sound engineering.",
    expertise: ["Marketing strategy", "Brand storytelling", "Campaign execution"],
  },
]


export default function AboutClient() {
  const [expandedMember, setExpandedMember] = useState<string | null>(null)
  const [isBlurred, setIsBlurred] = useState(false)

  const toggleMemberExpansion = (memberName: string) => {
    setExpandedMember(expandedMember === memberName ? null : memberName)
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
                  <span className="text-amber-500 font-cinzel text-sm tracking-wider">AI CREATIVITY + HUMAN CRAFTSMANSHIP</span>
                </div>
                <h1 className="font-cinzel tracking-widest text-5xl lg:text-7xl mb-6">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
                    ABOUT US
                  </span>
                </h1>
                <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-500 mx-auto rounded-full mb-8" />
                <p className="text-gray-400 text-lg lg:text-xl max-w-3xl mx-auto leading-relaxed">
                  SQUAREDRUM pioneers the future of music through the powerful collaboration between AI creativity and human expertise.
                  Our AI artists generate innovative compositions, while our team of professional producers, mix engineers, and mastering
                  specialists refine every track to achieve studio-quality excellence.
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
                    Founded in 2025, SQUAREDRUM emerged as a groundbreaking record label built on a revolutionary belief: the future of music
                    lies in the seamless collaboration between artificial intelligence and human expertise. We{"'"}re not just another record
                    label—we{"'"}re a pioneering collective that demonstrates how AI creativity and skilled human professionals can work together
                    to create extraordinary music that resonates with audiences worldwide.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-6 text-center">
                    Our journey began when our founder recognized the incredible potential that emerges when cutting-edge AI systems are combined
                    with human expertise in music production. While AI generates innovative compositions, melodies, and vocal performances, our
                    team of experienced mix engineers, mastering specialists, and sound designers bring the critical human touch—the refined ear
                    for detail, the intuitive understanding of sonic balance, and the artistic judgment that transforms good music into great music.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-6 text-center">
                    Today, SQUAREDRUM represents a diverse roster of AI artists spanning multiple genres—from Afrobeat to Country, Pop to R&B,
                    and beyond. Each artist has a unique AI-generated personality, voice, and musical style. But behind every release stands our
                    dedicated team of human professionals who handle mixing, mastering, sound design, and overall quality supervision, ensuring
                    every track meets the highest standards of audio excellence.
                  </p>
                  <p className="text-gray-300 leading-relaxed mb-6 text-center">
                    What sets us apart is our commitment to the perfect balance: leveraging AI{"'"}s limitless creative potential while relying on
                    human expertise for the technical precision and artistic refinement that defines professional-quality music. Our producers bring
                    decades of combined experience in EQ, compression, spatial imaging, and tonal balance—skills that require human intuition and
                    trained ears to execute at the highest level.
                  </p>
                  <p className="text-gray-300 leading-relaxed text-center">
                    Every track you hear from SQUAREDRUM represents this powerful collaboration: AI-generated creativity refined through human
                    craftsmanship. From the initial AI composition through professional mixing, mastering, and final quality control, human hands
                    and ears guide each release to perfection. This is the SQUAREDRUM difference—where technology and tradition unite to create
                    music that moves, inspires, and connects.
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
                  <Users className="h-6 w-6 text-amber-500 mr-3" />
                  <h2 className="font-cinzel text-3xl lg:text-4xl text-white">Our Team</h2>
                </div>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Meet the professionals who guide SQUAREDRUM{"'"}s vision—combining AI innovation with human expertise
                  in music production, mixing, mastering, and overall creative supervision.
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
                          <Badge className="bg-amber-500 text-black border-amber-500 font-medium">LEADERSHIP</Badge>
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
                          <h4 className="text-white font-medium text-sm">Expertise:</h4>
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

          {/* Human Expertise Section */}
          <section className="py-16 border-t border-zinc-800">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <h2 className="font-cinzel text-3xl lg:text-4xl text-white mb-4">
                  <span className="text-amber-500">HUMAN</span> EXPERTISE
                </h2>
                <p className="text-gray-400 max-w-3xl mx-auto text-lg">
                  Professional craftsmanship that transforms AI creativity into studio-quality excellence
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Music className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-cinzel text-xl text-white mb-3">PROFESSIONAL MIXING</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Expert engineers balance every element with precision EQ, compression, and spatial imaging</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Mic className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-cinzel text-xl text-white mb-3">MASTERING EXCELLENCE</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Final polish by mastering specialists ensuring broadcast-ready, commercially competitive sound</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Zap className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-cinzel text-xl text-white mb-3">SOUND DESIGN</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Creative sound designers craft unique textures, atmospheres, and sonic signatures</p>
                </div>

                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Users className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="font-cinzel text-xl text-white mb-3">QUALITY SUPERVISION</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">Experienced producers oversee every release with discerning ears and refined musical taste</p>
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
                      SQUAREDRUM exists for music lovers who appreciate both innovation and craftsmanship. We believe that the magic happens when
                      AI{"'"}s boundless creativity meets the refined expertise of human professionals. Great music requires more than just
                      composition—it demands the nuanced touch of skilled engineers who understand the art and science of sound.
                    </p>

                    <p>
                      Every track released by SQUAREDRUM represents a collaborative process: AI generates the creative foundation—melodies, vocals,
                      and arrangements—while our team of professional mix engineers, mastering specialists, and sound designers bring their expertise
                      to perfect every detail. From tonal balance to stereo imaging, from dynamic range to frequency clarity, human ears and hands
                      ensure each release achieves the highest standards of audio excellence.
                    </p>

                    <p>
                      Our philosophy centers on leveraging the best of both worlds: AI{"'"}s ability to explore unlimited creative possibilities,
                      combined with human expertise in the technical and artistic aspects of music production that require years of training
                      and refined musical taste to master. This is the SQUAREDRUM difference—innovation guided by experience.
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

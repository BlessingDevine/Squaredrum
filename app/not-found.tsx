import type { Metadata, Viewport } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Home, ArrowLeft, Music } from "lucide-react"

export const metadata: Metadata = {
  title: "Page Not Found | SquareDrum Records",
  description: "The page you're looking for doesn't exist. Explore our music catalog instead.",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <div className="mb-8">
          <div className="relative inline-block">
            <h1 className="font-cinzel text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 animate-pulse">
              404
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 blur-3xl -z-10 animate-pulse" />
          </div>
        </div>

        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur-sm">
          <CardContent className="p-8">
            <div className="mb-6">
              <Music className="w-16 h-16 mx-auto text-amber-500 mb-4" />
              <h2 className="font-cinzel text-2xl md:text-3xl font-bold mb-4">Track Not Found</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Looks like this page hit a wrong note. The content you're looking for might have been moved, deleted, or
                never existed in our catalog.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                  <Link href="/">
                    <Home className="w-5 h-5 mr-2" />
                    Back to Home
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-amber-500/50 text-amber-500 hover:bg-amber-500/10 bg-transparent"
                >
                  <Link href="/releases">
                    <Music className="w-5 h-5 mr-2" />
                    Browse Music
                  </Link>
                </Button>
              </div>

              <div className="pt-4">
                <Button asChild variant="ghost" className="text-gray-400 hover:text-white">
                  <Link href="javascript:history.back()">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Go Back
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Need help?{" "}
            <Link href="/contact" className="text-amber-500 hover:text-amber-400 underline">
              Contact us
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

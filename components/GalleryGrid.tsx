"use client"

import Image from "next/image"
import { useState, memo } from "react"

export interface GalleryGridProps {
  images?: string[]
}

function prettifyFilename(src: string) {
  const parts = src.split("/").pop() || ""
  return parts.replace(/[-_]/g, " ")
}

const ImageWithFallback = memo(function ImageWithFallback({
  src,
  alt,
  sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw",
  priority = false,
}: {
  src: string
  alt: string
  sizes?: string
  priority?: boolean
}) {
  const [currentSrc, setCurrentSrc] = useState(src)

  return (
    <div className="relative aspect-square overflow-hidden rounded-xl border">
      <Image
        src={currentSrc || "/placeholder.png"}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        onError={() => {
          if (currentSrc !== "/placeholder.png") {
            setCurrentSrc("/placeholder.png")
          }
        }}
      />
    </div>
  )
})

const GalleryGrid = ({ images = [] }: GalleryGridProps) => {
  if (!images?.length) {
    return <div className="text-sm text-neutral-500">{"No images found."}</div>
  }

  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((src, idx) => (
        <li key={src} className="list-none">
          <ImageWithFallback src={src || "/placeholder.png"} alt={prettifyFilename(src)} priority={idx < 4} />
        </li>
      ))}
    </ul>
  )
}

export default GalleryGrid

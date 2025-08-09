"use client"

import Image from "next/image"
import { useMemo, useState } from "react"

type GalleryGridProps = {
  images: string[]
  className?: string
}

/**
 * Extracts a human-friendly alt from the file path.
 */
function getAltFromPath(src: string): string {
  try {
    const parts = src.split("/")
    const file = parts[parts.length - 1] || "Image"
    const base = file.replace(/\.[a-zA-Z0-9]+$/, "")
    const words = base.replace(/[-_]+/g, " ")
    return words
      .split(" ")
      .filter(Boolean)
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ")
  } catch {
    return "Image"
  }
}

function ImageWithFallback({ src, alt }: { src: string; alt: string }) {
  const [current, setCurrent] = useState(src)
  const onError = () => {
    if (current !== "/placeholder.png") {
      setCurrent("/placeholder.png")
    }
  }
  // Sizes for 2/3/4 column responsive grid
  const sizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1400px) 25vw, 25vw"

  return (
    <div className="relative aspect-square overflow-hidden rounded-xl border">
      <Image
        src={current || "/placeholder.png"}
        alt={alt}
        fill
        sizes={sizes}
        onError={onError}
        className="object-cover"
        // Improve image decoding behavior
        priority={false}
      />
    </div>
  )
}

export default function GalleryGrid({ images, className = "" }: GalleryGridProps) {
  const items = useMemo(() => images ?? [], [images])
  return (
    <div className={`grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4 ${className}`}>
      {items.map((src, idx) => {
        const alt = getAltFromPath(src)
        return (
          <div key={`${src}-${idx}`} className="group">
            <ImageWithFallback src={src || "/placeholder.png"} alt={alt} />
          </div>
        )
      })}
    </div>
  )
}

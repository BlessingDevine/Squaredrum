"use client"

import Image from "next/image"
import * as React from "react"

type GalleryGridProps = {
  images: string[]
}

function ImageTile({ src, alt }: { src: string; alt: string }) {
  const [imgSrc, setImgSrc] = React.useState(src)

  return (
    <div className="relative aspect-square overflow-hidden rounded-xl border bg-neutral-100">
      <Image
        src={imgSrc || "/placeholder.png"}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        onError={() => setImgSrc("/placeholder.png")}
        // Prefer not to set priority for large grids; allow Next to optimize naturally.
      />
    </div>
  )
}

export default function GalleryGrid({ images }: GalleryGridProps) {
  if (!images || images.length === 0) {
    return <p className="text-neutral-500">{"No images found."}</p>
  }

  return (
    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {images.map((src, idx) => {
        const alt = `Gallery image ${idx + 1}`
        return (
          <li key={src} className="list-none">
            <ImageTile src={src || "/placeholder.png"} alt={alt} />
          </li>
        )
      })}
    </ul>
  )
}

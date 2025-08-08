'use client'

import { useMemo } from 'react'

type GalleryImage = {
  src: string
  alt: string
  caption?: string
}

/**
 * Ensures a cache-busting parameter (?v=1) is present.
 * If the URL already has a query string, appends &v=1 (unless v already exists).
 */
function withCacheBust(url: string, version = '1') {
  try {
    // Absolute paths like /gallery/01.png
    const hasQuery = url.includes('?')
    if (!hasQuery) return `${url}?v=${version}`

    // If "v=" already exists, leave it as-is; otherwise append
    const hasV = /[?&]v=/.test(url)
    return hasV ? url : `${url}&v=${version}`
  } catch {
    return `${url}?v=${version}`
  }
}

const FALLBACK_PLACEHOLDER = '/placeholder.svg?height=800&width=800'

export default function EagerImageGallery({
  images = [],
  title = 'Gallery',
}: {
  images?: GalleryImage[]
  title?: string
}) {
  const prepared = useMemo(
    () =>
      images.map((img) => ({
        ...img,
        src: withCacheBust(img.src, '1'),
      })),
    [images]
  )

  return (
    <div className="w-full">
      <div className="mb-6 text-center">
        <h1 className="font-cinzel text-3xl sm:text-4xl font-bold tracking-wider">
          {title}
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          {'All images are loaded eagerly with cache-busting and error fallback.'}
        </p>
      </div>

      <div
        className="
          grid gap-4
          grid-cols-2
          sm:grid-cols-3
          lg:grid-cols-4
          xl:grid-cols-5
        "
      >
        {prepared.map((img, idx) => (
          <figure
            key={`${img.src}-${idx}`}
            className="
              group relative overflow-hidden rounded-lg
              border border-zinc-800 bg-zinc-900/40
              hover:border-amber-500/50 transition-colors
              focus-within:ring-2 focus-within:ring-amber-500
            "
          >
            <img
              src={img.src || "/placeholder.svg"}
              alt={img.alt}
              loading="eager"
              decoding="sync"
              // @ts-ignore - React supports fetchPriority in modern browsers
              fetchPriority="high"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
              width={800}
              height={800}
              className="
                w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-64
                object-cover object-center select-none
                transition-transform duration-300 group-hover:scale-[1.02]
              "
              onError={(e) => {
                const target = e.currentTarget
                // Prevent infinite loop if fallback also fails
                if (!target.dataset.fallbackApplied) {
                  target.dataset.fallbackApplied = 'true'
                  target.src = withCacheBust(FALLBACK_PLACEHOLDER, '1')
                }
              }}
            />
            {(img.caption || img.alt) && (
              <figcaption
                className="
                  absolute bottom-0 left-0 right-0
                  bg-gradient-to-t from-black/70 via-black/40 to-transparent
                  px-3 pt-10 pb-2
                  text-xs text-gray-200
                "
              >
                {img.caption || img.alt}
              </figcaption>
            )}
          </figure>
        ))}
      </div>
    </div>
  )
}

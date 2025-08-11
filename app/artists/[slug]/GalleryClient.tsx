"use client"

import { useEffect, useState } from "react"
import type { JSX } from "react/jsx-runtime" // Declare JSX variable

export default function GalleryClient({
  slug,
  renderItem,
}: {
  slug: string
  renderItem: (file: string) => JSX.Element
}) {
  const [files, setFiles] = useState<string[]>([])

  useEffect(() => {
    fetch(`/api/gallery/${slug}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((arr) => setFiles(Array.isArray(arr) ? arr : []))
      .catch(() => setFiles([]))
  }, [slug])

  if (!files.length) return null
  return <>{files.map(renderItem)}</>
}

"use client"
import { useEffect, useState } from "react"
import type { JSX } from "react/jsx-runtime" // Declare JSX variable

export default function GalleryFiles({
  slug,
  render,
}: {
  slug: string
  render: (files: string[]) => JSX.Element
}) {
  const [files, setFiles] = useState<string[]>([])
  useEffect(() => {
    fetch(`/api/gallery/${slug}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((arr) => setFiles(Array.isArray(arr) ? arr : []))
      .catch(() => setFiles([]))
  }, [slug])
  if (!files.length) return null
  return render(files)
}

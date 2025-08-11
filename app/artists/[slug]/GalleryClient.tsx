"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, Loader2 } from "lucide-react"
import Image from "next/image"

interface GalleryClientProps {
  slug: string
  currentGalleryIndex: number
  visibleImageCount: number
  isLoadingMore: boolean
  showAllImages: boolean
  onImageClick: (index: number) => void
  onSeeMore: () => void
  onShowLess: () => void
  IMAGES_PER_LOAD: number
}

export default function GalleryClient({
  slug,
  currentGalleryIndex,
  visibleImageCount,
  isLoadingMore,
  showAllImages,
  onImageClick,
  onSeeMore,
  onShowLess,
  IMAGES_PER_LOAD,
}: GalleryClientProps) {
  const [files, setFiles] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/gallery/${slug}`, { cache: "no-store" })
      .then((r) => r.json())
      .then((arr) => {
        setFiles(Array.isArray(arr) ? arr : [])
        setLoading(false)
      })
      .catch(() => {
        setFiles([])
        setLoading(false)
      })
  }, [slug])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3 text-amber-500">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">Loading gallery...</span>
        </div>
      </div>
    )
  }

  if (!files.length) {
    return null
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={visibleImageCount}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2"
        >
          {files.slice(0, visibleImageCount).map((file, index) => (
            <motion.button
              key={file}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: index >= 16 ? (index - 16) * 0.05 : 0,
              }}
              onClick={() => onImageClick(index)}
              className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-200 group ${
                index === currentGalleryIndex
                  ? "ring-2 ring-amber-500 scale-105"
                  : "hover:scale-105 opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={`/images/${slug}/${file}`}
                alt={`${slug} ${file}`}
                fill
                className="object-cover"
                sizes="100px"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                <Eye className="h-4 w-4 text-white" />
              </div>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Loading Animation */}
      <AnimatePresence>
        {isLoadingMore && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex items-center justify-center py-8"
          >
            <div className="flex items-center gap-3 text-amber-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm font-medium">Loading more photos...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4">
        <div className="text-sm text-gray-500">
          {showAllImages ? "All photos loaded" : `${files.length - visibleImageCount} more photos available`}
        </div>

        <div className="flex gap-3">
          {/* Show Less Button */}
          {visibleImageCount > 16 && (
            <button
              onClick={onShowLess}
              className="border border-zinc-700 text-gray-400 hover:text-white hover:border-amber-500 transition-all duration-200 px-4 py-2 rounded-lg text-sm"
            >
              Show Less
            </button>
          )}

          {/* See More Button */}
          {!showAllImages && visibleImageCount < files.length && (
            <button
              onClick={onSeeMore}
              disabled={isLoadingMore}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-medium px-6 py-2 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />
                  Loading...
                </>
              ) : (
                <>
                  See More
                  <span className="ml-2 text-xs bg-black/20 px-2 py-0.5 rounded-full">
                    +{Math.min(IMAGES_PER_LOAD, files.length - visibleImageCount)}
                  </span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

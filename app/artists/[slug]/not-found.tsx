import Link from "next/link"

export default function ArtistGalleryNotFound() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-md rounded-xl border p-6 text-center">
        <h1 className="mb-2 text-xl font-semibold">Gallery Not Found</h1>
        <p className="mb-6 text-sm text-muted-foreground">
          We couldn&apos;t find any images for this artist. The folder may be missing or empty.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link href="/artists" className="rounded-xl border px-4 py-2 hover:bg-accent/30 transition">
            Back to Artists
          </Link>
        </div>
      </div>
    </main>
  )
}

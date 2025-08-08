import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="max-w-xl">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{'Gallery Not Found'}</h1>
        <p className="mt-2 text-neutral-600">
          {"We couldn't find that artist folder under /public/images. Check the slug and try again."}
        </p>
        <div className="mt-6">
          <Link
            href="/artists"
            className="inline-block rounded-xl border px-4 py-2 hover:bg-neutral-50 transition"
          >
            {'Back to Galleries'}
          </Link>
        </div>
      </div>
    </main>
  )
}

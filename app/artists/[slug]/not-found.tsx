import Link from "next/link"

export default function NotFound() {
  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-xl rounded-xl border p-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">{"Gallery Not Found"}</h1>
        <p className="mt-2 text-neutral-600">
          {"We couldn't find any images for this artist. Check the folder name and try again."}
        </p>
        <div className="mt-6">
          <Link href="/artists" className="inline-block rounded-xl border px-4 py-2 hover:bg-neutral-50 transition">
            {"Back to Artists"}
          </Link>
        </div>
      </div>
    </main>
  )
}

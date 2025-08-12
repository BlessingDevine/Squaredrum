import { NextResponse } from "next/server"
import { list } from "@vercel/blob"

export const dynamic = "force-dynamic"
export const revalidate = 0

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const prefix = searchParams.get("prefix") || ""
  try {
    const { blobs } = await list({ prefix, limit: 1000, token: process.env.BLOB_READ_WRITE_TOKEN })
    const names = (blobs ?? []).map((b) => b.pathname || b.url)
    return NextResponse.json({ prefix, count: names.length, sample: names.slice(0, 10) })
  } catch (e) {
    return NextResponse.json({ prefix, error: String(e) }, { status: 500 })
  }
}

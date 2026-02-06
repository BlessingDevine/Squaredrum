import { list } from "@vercel/blob";

export async function GET() {
  try {
    const allBlobs: { url: string; pathname: string }[] = [];
    let cursor: string | undefined;

    do {
      const result = await list({ cursor, limit: 1000 });
      for (const blob of result.blobs) {
        if (blob.pathname.endsWith(".mp3") || blob.pathname.endsWith(".wav")) {
          allBlobs.push({ url: blob.url, pathname: blob.pathname });
        }
      }
      cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);

    return Response.json({ count: allBlobs.length, blobs: allBlobs });
  } catch (error) {
    return Response.json({ error: String(error) }, { status: 500 });
  }
}

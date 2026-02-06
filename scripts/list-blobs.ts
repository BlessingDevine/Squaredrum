import { list } from "@vercel/blob";

async function main() {
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

  console.log(`Found ${allBlobs.length} audio files:\n`);
  for (const blob of allBlobs) {
    console.log(`${blob.pathname}`);
    console.log(`  ${blob.url}\n`);
  }
}

main().catch(console.error);

import { list } from '@vercel/blob';

async function listAllBlobs() {
  let cursor;
  let allBlobs = [];
  
  do {
    const result = await list({ cursor, limit: 1000, token: process.env.BLOB_READ_WRITE_TOKEN });
    allBlobs = allBlobs.concat(result.blobs);
    cursor = result.cursor;
  } while (cursor);

  // Filter for mp3 files
  const audioBlobs = allBlobs.filter(b => b.pathname.endsWith('.mp3'));
  console.log('=== AUDIO FILES ===');
  for (const blob of audioBlobs) {
    console.log(`${blob.pathname} => ${blob.url}`);
  }
  
  console.log(`\nTotal audio files: ${audioBlobs.length}`);
  console.log(`Total blobs: ${allBlobs.length}`);
}

listAllBlobs().catch(console.error);

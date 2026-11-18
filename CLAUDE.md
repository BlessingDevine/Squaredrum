# Notes for Claude

## FIZZ handle change (Nov 17, 2026) — open task

FIZZ (SQUAREDRUM male AI Afrobeat/Bongo Flava artist, he/him) changed his Instagram handle from @ai.fizz to @Fizz.bongo. Branded hashtag is now #FizzBongo (replaces #Fizz). No self-tagging on his own posts; other roster artists tag @Fizz.bongo in cross-promo.

Done: all 5 scheduled FIZZ posts in PostFast (Nov 18–27) updated to #FizzBongo.

Still to do — update FIZZ everywhere:
1. squaredrum.com artist page (https://www.squaredrum.com/artists/fizz): Instagram link still points to instagram.com/ai.fizz, and the bio/song descriptions call him "she". Change to @Fizz.bongo and he/him. The page source is NOT in the BlessingDevine/Squaredrum or BlessingDevine/squaredrum-site repos as checked out on Nov 17; find which repo/CMS/database actually deploys it.
2. Go Square app (BlessingDevine/gosquare-app): reads artist Instagram from the Supabase `artists` table, `instagram` column (src/lib/catalog.ts). Set FIZZ's value to `Fizz.bongo`.
3. Music Square Radio (BlessingDevine/v0-music-square-radio): no FIZZ handle in code; check whether it pulls artist data from the same Supabase table.

Check the Supabase `artists` table first; fixing it there may cover all three. When everything is done, remove this section.

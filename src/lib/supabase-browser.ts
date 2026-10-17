"use client";

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./config";

/**
 * The browser's own Supabase client, signed in as the listener. Same project
 * and same accounts as the GoSquare app, so likes, playlists and follows made
 * here show up there and the other way round. The session is kept in this
 * browser's storage; nothing about it reaches the server-rendered pages.
 */
export const supabase = createClient(new URL(SUPABASE_URL).origin, SUPABASE_KEY, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false },
});

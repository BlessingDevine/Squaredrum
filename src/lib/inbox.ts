import "server-only";
import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "./config";

/**
 * Contact messages go to the shared Supabase project (table made by
 * supabase/site_tables.sql). The publishable key may only insert into it,
 * never read it back; read messages in the Supabase dashboard → Table Editor.
 */
const db = createClient(new URL(SUPABASE_URL).origin, SUPABASE_KEY, { auth: { persistSession: false } });

export const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const clip = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function saveMessage(row: { name: string; email: string; company: string | null; topic: string; message: string }) {
  const { error } = await db.from("site_messages").insert(row);
  if (error) throw new Error(error.message);
}

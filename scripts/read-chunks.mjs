// Print all chunk previews for MITS. Usage: node scripts/read-chunks.mjs
import fs from "node:fs";
import { createClient } from "@supabase/supabase-js";

function env() {
  const out = {};
  for (const line of fs.readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Za-z0-9_]+)\s*=\s*(.+?)\s*$/);
    if (m && !line.trim().startsWith("#")) out[m[1]] = m[2];
  }
  return out;
}
const e = env();
const sb = createClient(e.NEXT_PUBLIC_SUPABASE_URL, e.SUPABASE_SERVICE_ROLE_KEY, { auth: { persistSession: false } });
const { data } = await sb.from("document_chunks")
  .select("chunk_index,content_preview,documents(title)")
  .eq("college_id", "5b9da90e-86ae-4fe4-8ce9-25bc5a53f91c")
  .order("chunk_index");
for (const c of data || []) {
  console.log(`===== ${c.documents?.title} #${c.chunk_index} =====`);
  console.log((c.content_preview || "").slice(0, 900));
}

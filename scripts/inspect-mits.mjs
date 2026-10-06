// Read-only inspect of MITS workspace. Usage: node scripts/inspect-mits.mjs
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

const { data: colleges } = await sb.from("colleges").select("id,name,domain,status,city");
console.log("COLLEGES:", JSON.stringify(colleges, null, 1));
const mits = (colleges || []).find((c) => c.domain === "mits-madanapalle");
if (!mits) process.exit(0);
const { data: depts } = await sb.from("departments").select("id,name,code").eq("college_id", mits.id).order("name");
console.log("DEPTS:", JSON.stringify(depts, null, 1));
const { data: docs } = await sb.from("documents").select("id,title,file_name,status,department_id").eq("college_id", mits.id);
console.log("DOCS:", JSON.stringify(docs, null, 1));
const { count: chunks } = await sb.from("document_chunks").select("id", { count: "exact", head: true }).eq("college_id", mits.id);
console.log("CHUNKS:", chunks);
try {
  const { count: facts } = await sb.from("knowledge_facts").select("id", { count: "exact", head: true }).eq("college_id", mits.id);
  console.log("FACTS:", facts);
  const { data: ex } = await sb.from("knowledge_facts").select("question,status").eq("college_id", mits.id).limit(50);
  console.log("EXISTING FACTS:", JSON.stringify(ex, null, 1));
} catch (err) {
  console.log("FACTS TABLE MISSING — run the migration first:", err.message);
}

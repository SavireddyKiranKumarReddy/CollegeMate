// Wipe ALL knowledge for a college: facts (+versions cascade), documents (+chunks cascade + storage files).
// Keeps: college, departments, memberships, query_logs. Usage: node scripts/wipe-kb.mjs [domain]
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
const domain = process.argv[2] || "mits-madanapalle";

const { data: college } = await sb.from("colleges").select("id").eq("domain", domain).maybeSingle();
if (!college) throw new Error("college not found: " + domain);
const cid = college.id;

const { error: fErr, count: fCount } = await sb.from("knowledge_facts").delete({ count: "exact" }).eq("college_id", cid);
console.log("facts deleted:", fCount, fErr?.message || "ok");

const { data: docs } = await sb.from("documents").select("id,file_path").eq("college_id", cid);
for (const d of docs || []) {
  if (d.file_path) await sb.storage.from("college-docs").remove([d.file_path]);
  await sb.from("documents").delete().eq("id", d.id);
}
console.log("documents deleted:", (docs || []).length);

const { count: chunks } = await sb.from("document_chunks").select("id", { count: "exact", head: true }).eq("college_id", cid);
console.log("chunks remaining:", chunks);
const { count: facts } = await sb.from("knowledge_facts").select("id", { count: "exact", head: true }).eq("college_id", cid);
console.log("facts remaining:", facts);

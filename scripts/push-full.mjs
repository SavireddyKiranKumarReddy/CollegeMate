import fs from "fs";
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN || "";
const REF = process.env.SUPABASE_PROJECT_REF || "ktszdgklfjekupffqecq";
if (!TOKEN) { console.error("Set SUPABASE_ACCESS_TOKEN env first"); process.exit(1); }
const sql = fs.readFileSync("supabase/schema.sql", "utf8");
const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
  method: "POST",
  headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
  body: JSON.stringify({ query: sql }),
});
const t = await res.text();
console.log(res.status, t.slice(0, 4000));

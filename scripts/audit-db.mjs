const REF = process.env.SUPABASE_PROJECT_REF || "ktszdgklfjekupffqecq";
const TOKEN = process.env.SUPABASE_ACCESS_TOKEN || "";
if (!TOKEN) { console.error("Set SUPABASE_ACCESS_TOKEN env first"); process.exit(1); }
async function q(label, query) {
  const res = await fetch(`https://api.supabase.com/v1/projects/${REF}/database/query`, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query }),
  });
  const t = await res.text();
  console.log("==", label, res.status);
  console.log(t.slice(0, 4000));
}
await q("tables", "select table_name from information_schema.tables where table_schema='public' order by 1");
await q("counts", "select 'colleges' as t, count(*) as c from public.colleges union all select 'departments', count(*) from public.departments union all select 'memberships', count(*) from public.memberships union all select 'documents', count(*) from public.documents union all select 'profiles', count(*) from public.profiles");
await q("buckets", "select id, name, public, created_at from storage.buckets");
await q("objects", "select count(*) as objects from storage.objects where bucket_id='college-docs'");
await q("auth_users", "select count(*) as users from auth.users");
await q("project", "select name from auth.users limit 0");

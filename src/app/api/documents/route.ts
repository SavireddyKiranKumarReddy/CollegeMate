import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";
import { extractText, chunkText } from "@/lib/rag";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const college_id = searchParams.get("college_id");
    const department_id = searchParams.get("department_id");
    const sb = supabaseAdmin();
    let q = sb.from("documents").select("*").order("created_at", { ascending: false }).limit(100);
    if (college_id) q = q.eq("college_id", college_id);
    if (department_id) q = q.eq("department_id", department_id);
    const { data, error } = await q;
    if (error) throw error;
    return NextResponse.json({ documents: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const fd = await req.formData();
    const file = fd.get("file") as File | null;
    const college_id = fd.get("college_id") as string | null;
    const department_id = (fd.get("department_id") as string | null) || null;
    const title = (fd.get("title") as string | null) || null;
    if (!file || !college_id) return NextResponse.json({ error: "file + college_id required" }, { status: 400 });

    const ALLOWED = ["pdf", "doc", "docx", "xls", "xlsx", "csv", "txt"];
    const safeName = (file.name.split("/").pop() || "file").split("\\").pop()!.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
    const ext = (safeName.split(".").pop() || "").toLowerCase();
    if (!ALLOWED.includes(ext)) return NextResponse.json({ error: "file type not allowed" }, { status: 400 });
    if (file.size > 15 * 1024 * 1024) return NextResponse.json({ error: "max 15MB" }, { status: 400 });

    const sb = supabaseAdmin();
    const path = `${college_id}/${department_id || "general"}/${Date.now()}-${safeName}`;
    const buf = Buffer.from(await file.arrayBuffer());
    const { error: upErr } = await sb.storage.from("college-docs").upload(path, buf, {
      contentType: file.type || "application/octet-stream",
      upsert: true,
    });
    if (upErr) throw upErr;

    const { data, error } = await sb
      .from("documents")
      .insert({
        college_id,
        department_id,
        title: (title || safeName).slice(0, 200),
        file_name: safeName,
        file_path: path,
        file_type: ext,
        status: "ready",
      })
      .select()
      .single();
    if (error) throw error;

    // extract + chunk for RAG (best-effort; upload still succeeds if this fails)
    try {
      const text = await extractText(buf, ext, file.type || "");
      const chunks = chunkText(text);
      if (chunks.length > 0) {
        const sb2 = supabaseAdmin();
        await sb2.from("document_chunks").insert(
          chunks.map((c, i) => ({
            document_id: data.id,
            college_id,
            department_id,
            chunk_index: i,
            content_preview: c,
            token_count: Math.ceil(c.length / 4),
          }))
        );
      }
    } catch (e) {
      console.error("chunk insert failed", e);
    }
    return NextResponse.json({ document: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const sb = supabaseAdmin();
    const { data: doc } = await sb.from("documents").select("file_path").eq("id", id).maybeSingle();
    await sb.from("document_chunks").delete().eq("document_id", id);
    if (doc?.file_path) await sb.storage.from("college-docs").remove([doc.file_path]);
    const { error } = await sb.from("documents").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

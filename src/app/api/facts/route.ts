import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

// College-admin knowledge API. All mutations are admin-side; service key (RLS bypasses).

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const sb = supabaseAdmin();
    const hist = searchParams.get("history");
    if (hist) {
      const { data, error } = await sb
        .from("knowledge_versions")
        .select("*")
        .eq("fact_id", hist)
        .order("version", { ascending: false })
        .limit(20);
      if (error) throw error;
      return NextResponse.json({ versions: data });
    }
    const college_id = searchParams.get("college_id");
    const status = searchParams.get("status");
    const q = searchParams.get("q");
    if (!college_id) return NextResponse.json({ error: "college_id required" }, { status: 400 });
    let query = sb.from("knowledge_facts").select("*").eq("college_id", college_id).order("updated_at", { ascending: false }).limit(200);
    if (status) query = query.eq("status", status);
    if (q) query = query.or(`question.ilike.%${q}%,answer.ilike.%${q}%`);
    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json({ facts: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const b = await req.json();
    if (!b.college_id || !b.question?.trim() || !b.answer?.trim()) {
      return NextResponse.json({ error: "college_id + question + answer required" }, { status: 400 });
    }
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("knowledge_facts")
      .insert({
        college_id: b.college_id,
        department_id: b.department_id || null,
        question: String(b.question).slice(0, 300),
        answer: String(b.answer).slice(0, 2000),
        topic: (b.topic || "other").slice(0, 40),
        source_document_id: b.source_document_id || null,
        source_label: (b.source_label || "manual entry").slice(0, 200),
        status: "verified",
        valid_from: b.valid_from || null,
        valid_to: b.valid_to || null,
        created_by: (b.created_by || "admin").slice(0, 120),
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ fact: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const b = await req.json();
    if (!b.id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const sb = supabaseAdmin();
    const { data: cur, error: curErr } = await sb.from("knowledge_facts").select("*").eq("id", b.id).maybeSingle();
    if (curErr || !cur) return NextResponse.json({ error: "fact not found" }, { status: 404 });

    const patch: any = { updated_at: new Date().toISOString() };
    if (typeof b.status === "string") patch.status = b.status;
    if (b.valid_from !== undefined) patch.valid_from = b.valid_from || null;
    if (b.valid_to !== undefined) patch.valid_to = b.valid_to || null;
    if (typeof b.topic === "string") patch.topic = b.topic.slice(0, 40);
    if (typeof b.department_id !== "undefined") patch.department_id = b.department_id || null;

    const contentChanged =
      (typeof b.question === "string" && b.question.trim() && b.question.trim() !== cur.question) ||
      (typeof b.answer === "string" && b.answer.trim() && b.answer.trim() !== cur.answer);
    if (contentChanged) {
      await sb.from("knowledge_versions").insert({
        fact_id: cur.id,
        question: cur.question,
        answer: cur.answer,
        version: cur.version,
        changed_by: (b.changed_by || "admin").slice(0, 120),
      });
      patch.version = (cur.version || 1) + 1;
      if (typeof b.question === "string" && b.question.trim()) patch.question = b.question.trim().slice(0, 300);
      if (typeof b.answer === "string" && b.answer.trim()) patch.answer = b.answer.trim().slice(0, 2000);
      patch.updated_by = (b.changed_by || "admin").slice(0, 120);
    }

    const { data, error } = await sb.from("knowledge_facts").update(patch).eq("id", b.id).select().single();
    if (error) throw error;
    return NextResponse.json({ fact: data });
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
    const { error } = await sb.from("knowledge_facts").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const college_id = searchParams.get("college_id");
    const sb = supabaseAdmin();
    let q = sb.from("memberships").select("id,college_id,user_email,role,department_id,created_at,departments(name)").order("created_at", { ascending: false });
    if (college_id) q = q.eq("college_id", college_id);
    const { data, error } = await q;
    if (error) throw error;
    return NextResponse.json({ memberships: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { college_id, user_email, role, department_id } = await req.json();
    if (!college_id || !user_email || !role)
      return NextResponse.json({ error: "college_id + user_email + role required" }, { status: 400 });
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("memberships")
      .upsert(
        {
          college_id,
          user_email: user_email.toLowerCase(),
          role,
          department_id: department_id || null,
        },
        { onConflict: "college_id,user_email" }
      )
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ membership: data });
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
    const { error } = await sb.from("memberships").delete().eq("id", id);
    if (error) throw error;
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

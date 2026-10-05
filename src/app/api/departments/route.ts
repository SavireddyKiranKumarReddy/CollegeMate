import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const college_id = searchParams.get("college_id");
    if (!college_id) return NextResponse.json({ error: "college_id required" }, { status: 400 });
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("departments")
      .select("*")
      .eq("college_id", college_id)
      .order("created_at");
    if (error) throw error;
    return NextResponse.json({ departments: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { college_id, name, code } = await req.json();
    if (!college_id || !name) return NextResponse.json({ error: "college_id + name required" }, { status: 400 });
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("departments")
      .insert({ college_id, name, code: code || null })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ department: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

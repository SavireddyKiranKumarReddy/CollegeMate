import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const college_id = searchParams.get("college_id");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
    const sb = supabaseAdmin();
    let q = sb.from("query_logs").select("*").order("created_at", { ascending: false }).limit(limit);
    if (college_id) q = q.eq("college_id", college_id);
    const { data, error } = await q;
    if (error) throw error;
    return NextResponse.json({ logs: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

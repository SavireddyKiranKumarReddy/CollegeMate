import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const out: any = {
    url,
    hasAnon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasService: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
  try {
    const sb = supabaseAdmin();
    const { count, error } = await sb.from("colleges").select("id", { count: "exact", head: true });
    out.dbOk = !error;
    out.collegesCount = count;
    if (error) out.dbError = error.message;
    const { error: deptErr } = await sb.from("departments").select("id", { count: "exact", head: true });
    out.departmentsOk = !deptErr;
  } catch (e: any) {
    out.dbError = e.message;
    out.dbOk = false;
  }
  return NextResponse.json(out);
}

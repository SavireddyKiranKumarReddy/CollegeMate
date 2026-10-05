import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email")?.toLowerCase();
    if (!email) return NextResponse.json({ error: "email required" }, { status: 400 });
    const sb = supabaseAdmin();
    if (email === "super") {
      return NextResponse.json({ email, isSuper: true, demo: true, redirect: "/dashboard" });
    }
    if (email === "mits") {
      const { data: college } = await sb.from("colleges").select("id,name").eq("domain", "mits-madanapalle").maybeSingle();
      return NextResponse.json({ email, isSuper: false, demo: true, college, redirect: "/mits-madanapalle" });
    }
    const { data: profile } = await sb.from("profiles").select("role").eq("email", email).maybeSingle();
    const { data: memberships } = await sb
      .from("memberships")
      .select("role, college_id, colleges(name,domain)")
      .eq("user_email", email);
    const superEmails = (process.env.SUPER_ADMIN_EMAILS || "")
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    const isSuper = superEmails.includes(email) || profile?.role === "super_admin";
    const adminOf = (memberships || []).find((m: any) => m.role === "college_admin");
    let redirect = "/chat";
    if (isSuper) redirect = "/dashboard";
    else if ((adminOf as any)?.colleges?.domain) redirect = `/${(adminOf as any).colleges.domain}`;
    else if (memberships?.some((m: any) => m.role === "faculty")) redirect = "/faculty";
    return NextResponse.json({ email, isSuper, profile, memberships, redirect });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

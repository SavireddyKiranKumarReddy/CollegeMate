import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status, admin_email } = await req.json();
    if (!["approved", "rejected"].includes(status))
      return NextResponse.json({ error: "invalid status" }, { status: 400 });
    const sb = supabaseAdmin();
    const update: any = { status };
    if (admin_email) update.admin_email = admin_email;
    const { data, error } = await sb.from("colleges").update(update).eq("id", id).select().single();
    if (error) throw error;
    // auto-membership for admin
    if (status === "approved" && admin_email) {
      await sb.from("memberships").upsert(
        { college_id: id, user_email: admin_email.toLowerCase(), role: "college_admin" },
        { onConflict: "college_id,user_email" }
      );
    }
    return NextResponse.json({ college: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

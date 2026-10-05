import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/server";

export async function GET() {
  try {
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("colleges")
      .select("id,name,domain,city,contact_email,status,admin_email,created_at")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return NextResponse.json({ colleges: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.contact_email)
      return NextResponse.json({ error: "name + contact_email required" }, { status: 400 });
    const sb = supabaseAdmin();
    const { data, error } = await sb
      .from("colleges")
      .insert({
        name: body.name,
        domain: body.domain || null,
        city: body.city || null,
        contact_email: body.contact_email,
        notes: body.notes || null,
        status: "pending",
      })
      .select()
      .single();
    if (error) throw error;
    return NextResponse.json({ college: data });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (body.website) return NextResponse.json({ ok: true });
    if (!name || name.length > 100 || !/^\S+@\S+\.\S+$/.test(email) || email.length > 180 || phone.length > 30 || !message || message.length > 3000) return NextResponse.json({ error: "Please check the form and try again." }, { status: 400 });

    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.from("contact_messages").insert({ name, email, phone, message });
    if (error) return NextResponse.json({ error: "Unable to send your message right now." }, { status: 500 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to send your message right now." }, { status: 500 });
  }
}

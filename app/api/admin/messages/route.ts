import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

async function getAdminClient() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.user_metadata.role === "admin" ? supabase : null;
}

export async function GET() {
  const supabase = await getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Unable to load messages." }, { status: 500 });
  return NextResponse.json({ data });
}

export async function PATCH(request: Request) {
  const supabase = await getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, is_read } = await request.json() as { id?: unknown; is_read?: unknown };
  if (typeof id !== "string" || typeof is_read !== "boolean") return NextResponse.json({ error: "Message id and read state are required." }, { status: 400 });
  const { data, error } = await supabase.from("contact_messages").update({ is_read }).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: "Unable to update message." }, { status: 400 });
  return NextResponse.json({ data });
}

export async function DELETE(request: Request) {
  const supabase = await getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json() as { id?: unknown };
  if (typeof id !== "string") return NextResponse.json({ error: "Message id is required." }, { status: 400 });
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Unable to delete message." }, { status: 400 });
  return NextResponse.json({ ok: true });
}

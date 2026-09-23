import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const fields = ["slug", "title_en", "title_ur", "description_en", "description_ur", "icon", "image_url", "is_active", "display_order"] as const;
type ProgramPayload = Partial<Record<(typeof fields)[number], unknown>>;

async function getAdminClient() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.user_metadata.role === "admin" ? supabase : null;
}
function clean(body: ProgramPayload) { return Object.fromEntries(fields.filter((field) => field in body).map((field) => [field, body[field]])); }

export async function GET() {
  const supabase = await getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from("programs").select("*").order("display_order").order("created_at");
  if (error) return NextResponse.json({ error: "Unable to load programs." }, { status: 500 });
  return NextResponse.json({ data });
}
export async function POST(request: Request) {
  const supabase = await getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as ProgramPayload;
  const payload = clean(body);
  if (typeof payload.slug !== "string" || typeof payload.title_en !== "string" || !payload.slug.trim() || !payload.title_en.trim()) return NextResponse.json({ error: "English title and slug are required." }, { status: 400 });
  const { data, error } = await supabase.from("programs").insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.code === "23505" ? "That slug is already in use." : "Unable to create the program." }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}
export async function PATCH(request: Request) {
  const supabase = await getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as ProgramPayload & { id?: unknown };
  if (typeof body.id !== "string") return NextResponse.json({ error: "Program id is required." }, { status: 400 });
  const { id, ...values } = body;
  const { data, error } = await supabase.from("programs").update(clean(values)).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: "Unable to update the program." }, { status: 400 });
  return NextResponse.json({ data });
}
export async function DELETE(request: Request) {
  const supabase = await getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json() as { id?: unknown };
  if (typeof id !== "string") return NextResponse.json({ error: "Program id is required." }, { status: 400 });
  const { error } = await supabase.from("programs").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Unable to delete the program." }, { status: 400 });
  return NextResponse.json({ ok: true });
}

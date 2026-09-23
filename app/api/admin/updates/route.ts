import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const fields = ["slug", "title_en", "title_ur", "summary_en", "summary_ur", "content_en", "content_ur", "cover_image_url", "category", "location_en", "location_ur", "published_at", "is_published"] as const;
type UpdatePayload = Partial<Record<(typeof fields)[number], unknown>>;

async function getAdminClient() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || user.user_metadata.role !== "admin") return null;
  return supabase;
}

function cleanPayload(body: UpdatePayload) {
  return Object.fromEntries(fields.filter((field) => field in body).map((field) => [field, body[field]]));
}

export async function GET() {
  const supabase = await getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from("updates").select("*").order("created_at", { ascending: false });
  if (error) return NextResponse.json({ error: "Unable to load updates." }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as UpdatePayload;
  const payload = cleanPayload(body);
  if (typeof payload.slug !== "string" || typeof payload.title_en !== "string" || !payload.slug.trim() || !payload.title_en.trim()) return NextResponse.json({ error: "English title and slug are required." }, { status: 400 });
  const { data, error } = await supabase.from("updates").insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.code === "23505" ? "That slug is already in use." : "Unable to create the update." }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const supabase = await getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as UpdatePayload & { id?: unknown };
  if (typeof body.id !== "string") return NextResponse.json({ error: "Update id is required." }, { status: 400 });
  const { id, ...values } = body;
  const { data, error } = await supabase.from("updates").update(cleanPayload(values)).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: "Unable to update the record." }, { status: 400 });
  return NextResponse.json({ data });
}

export async function DELETE(request: Request) {
  const supabase = await getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as { id?: unknown };
  if (typeof body.id !== "string") return NextResponse.json({ error: "Update id is required." }, { status: 400 });
  const { error } = await supabase.from("updates").delete().eq("id", body.id);
  if (error) return NextResponse.json({ error: "Unable to delete the record." }, { status: 400 });
  return NextResponse.json({ ok: true });
}

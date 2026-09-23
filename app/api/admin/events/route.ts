import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const fields = ["slug", "title_en", "title_ur", "description_en", "description_ur", "event_date", "event_time", "location_en", "location_ur", "poster_url", "status"] as const;
type EventPayload = Partial<Record<(typeof fields)[number], unknown>>;
const statuses = ["upcoming", "ongoing", "completed", "cancelled"] as const;

async function getAdminClient() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.user_metadata.role === "admin" ? supabase : null;
}
function clean(body: EventPayload) { return Object.fromEntries(fields.filter((field) => field in body).map((field) => [field, body[field]])); }

export async function GET() {
  const supabase = await getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data, error } = await supabase.from("events").select("*").order("event_date", { ascending: false });
  if (error) return NextResponse.json({ error: "Unable to load events." }, { status: 500 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as EventPayload;
  const payload = clean(body);
  if (typeof payload.slug !== "string" || typeof payload.title_en !== "string" || typeof payload.event_date !== "string" || !payload.slug.trim() || !payload.title_en.trim() || !payload.event_date) return NextResponse.json({ error: "English title, slug and date are required." }, { status: 400 });
  if (payload.status !== undefined && !statuses.includes(payload.status as (typeof statuses)[number])) return NextResponse.json({ error: "Invalid event status." }, { status: 400 });
  const { data, error } = await supabase.from("events").insert(payload).select().single();
  if (error) return NextResponse.json({ error: error.code === "23505" ? "That slug is already in use." : "Unable to create the event." }, { status: 400 });
  return NextResponse.json({ data }, { status: 201 });
}

export async function PATCH(request: Request) {
  const supabase = await getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json() as EventPayload & { id?: unknown };
  if (typeof body.id !== "string") return NextResponse.json({ error: "Event id is required." }, { status: 400 });
  const { id, ...values } = body;
  if (values.status !== undefined && !statuses.includes(values.status as (typeof statuses)[number])) return NextResponse.json({ error: "Invalid event status." }, { status: 400 });
  const { data, error } = await supabase.from("events").update(clean(values)).eq("id", id).select().single();
  if (error) return NextResponse.json({ error: "Unable to update the event." }, { status: 400 });
  return NextResponse.json({ data });
}

export async function DELETE(request: Request) {
  const supabase = await getAdminClient();
  if (!supabase) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await request.json() as { id?: unknown };
  if (typeof id !== "string") return NextResponse.json({ error: "Event id is required." }, { status: 400 });
  const { error } = await supabase.from("events").delete().eq("id", id);
  if (error) return NextResponse.json({ error: "Unable to delete the event." }, { status: 400 });
  return NextResponse.json({ ok: true });
}

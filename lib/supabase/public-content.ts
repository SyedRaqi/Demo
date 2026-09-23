import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getPublishedRecord(table: "programs" | "updates" | "events", slug: string) {
  const supabase = await createSupabaseServerClient();
  if (table === "programs") return supabase.from(table).select("*").eq("slug", slug).eq("is_active", true).maybeSingle();
  if (table === "updates") return supabase.from(table).select("*").eq("slug", slug).eq("is_published", true).maybeSingle();
  return supabase.from(table).select("*").eq("slug", slug).maybeSingle();
}

export async function getPublicList(table: "programs" | "updates" | "events" | "gallery" | "notices" | "team_members") {
  try {
    const supabase = await createSupabaseServerClient();
    if (table === "programs") return (await supabase.from(table).select("*").eq("is_active", true).order("display_order")).data ?? [];
    if (table === "updates") return (await supabase.from(table).select("*").eq("is_published", true).order("published_at", { ascending: false })).data ?? [];
    if (table === "gallery") return (await supabase.from(table).select("*").eq("is_published", true).order("display_order")).data ?? [];
    if (table === "notices") return (await supabase.from(table).select("*").eq("is_published", true).order("published_at", { ascending: false })).data ?? [];
    if (table === "team_members") return (await supabase.from(table).select("*").eq("is_active", true).order("display_order")).data ?? [];
    return (await supabase.from(table).select("*").order("event_date", { ascending: true })).data ?? [];
  } catch {
    return [];
  }
}

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type HomepageContent = { updates: Record<string, unknown>[]; events: Record<string, unknown>[]; notices: Record<string, unknown>[]; gallery: Record<string, unknown>[]; programs: Record<string, unknown>[] };

const demoContent: HomepageContent = {
  updates: [
    { id: "demo-awards", slug: "educational-awards-demo", title_en: "Educational awards, shared proudly", title_ur: "تعلیمی اعزازات، اجتماعی فخر", summary_en: "DEMO CONTENT: A placeholder editorial story for the first published community update.", summary_ur: "نمونہ مواد: پہلی شائع شدہ کمیونٹی خبر کے لیے عارضی کہانی۔", category: "education", location_en: "Bhatkal", location_ur: "بھٹکل", published_at: "2026-09-23", cover_image_url: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=85" },
    { id: "demo-care", slug: "healthcare-camp-demo", title_en: "Care finds a way through the community", title_ur: "کمیونٹی کے ذریعے مدد کا راستہ", summary_en: "DEMO CONTENT: Replace this with an approved society update from the admin newsroom.", summary_ur: "نمونہ مواد: اسے منتظمین کی منظور شدہ خبر سے تبدیل کریں۔", category: "healthcare", location_en: "Bhatkal", location_ur: "بھٹکل", published_at: "2026-09-18", cover_image_url: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1100&q=85" },
    { id: "demo-sports", slug: "community-sports-demo", title_en: "A shared field, a stronger neighbourhood", title_ur: "مشترکہ میدان، مضبوط محلہ", summary_en: "DEMO CONTENT: A sample community story awaiting official publication.", summary_ur: "نمونہ مواد: سرکاری اشاعت کی منتظر کمیونٹی کہانی۔", category: "community", location_en: "Bhatkal", location_ur: "بھٹکل", published_at: "2026-09-12", cover_image_url: "https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1100&q=85" },
  ],
  events: [{ id: "demo-event", slug: "community-meeting-demo", title_en: "Community meeting", title_ur: "کمیونٹی میٹنگ", event_date: "2026-09-28", event_time: "6:00 PM", location_en: "Bhatkal", location_ur: "بھٹکل", status: "upcoming" }],
  notices: [{ id: "demo-notice", title_en: "Important notice", title_ur: "اہم اطلاع", content_en: "DEMO CONTENT: Official notices will be published by the society administrators.", content_ur: "نمونہ مواد: سرکاری اعلانات سوسائٹی کے منتظمین شائع کریں گے۔" }],
  gallery: [{ id: "demo-photo-1", image_url: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=900&q=85", title_en: "Community in motion", title_ur: "متحرک کمیونٹی" }, { id: "demo-photo-2", image_url: "https://images.unsplash.com/photo-1494386346843-e12284507169?auto=format&fit=crop&w=900&q=85", title_en: "Small acts, shared care", title_ur: "چھوٹی کوششیں، مشترکہ خیال" }, { id: "demo-photo-3", image_url: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=900&q=85", title_en: "Together in Bhatkal", title_ur: "بھٹکل میں ساتھ ساتھ" }],
  programs: [{ id: "demo-education", slug: "education-support", title_en: "Education support", title_ur: "تعلیمی تعاون" }, { id: "demo-health", slug: "healthcare-assistance", title_en: "Healthcare assistance", title_ur: "صحت کی مدد" }, { id: "demo-relief", slug: "emergency-relief", title_en: "Emergency relief", title_ur: "ہنگامی امداد" }, { id: "demo-community", slug: "community-support", title_en: "Community support", title_ur: "کمیونٹی تعاون" }],
};

export async function getHomepageContent(): Promise<HomepageContent> {
  try {
    const supabase = await createSupabaseServerClient();
    const [updates, events, notices, gallery, programs] = await Promise.all([
      supabase.from("updates").select("*").eq("is_published", true).lte("published_at", new Date().toISOString()).order("featured", { ascending: false }).order("breaking", { ascending: false }).order("published_at", { ascending: false }).limit(8),
      supabase.from("events").select("*").in("status", ["upcoming", "ongoing"]).order("event_date", { ascending: true }).limit(5),
      supabase.from("notices").select("*").eq("is_published", true).order("published_at", { ascending: false }).limit(3),
      supabase.from("gallery").select("*").eq("is_published", true).order("display_order").limit(6),
      supabase.from("programs").select("*").eq("is_active", true).order("display_order").limit(6),
    ]);
    const live = { updates: updates.data ?? [], events: events.data ?? [], notices: notices.data ?? [], gallery: gallery.data ?? [], programs: programs.data ?? [] };
    return Object.values(live).some((items) => items.length > 0) ? { ...demoContent, ...live } : demoContent;
  } catch {
    return demoContent;
  }
}

export async function searchPublicContent(query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [];
  try {
    const supabase = await createSupabaseServerClient();
    const [updates, events, notices, programs] = await Promise.all([
      supabase.from("updates").select("id, slug, title_en, title_ur, summary_en, summary_ur, category, published_at, cover_image_url").eq("is_published", true),
      supabase.from("events").select("id, slug, title_en, title_ur, description_en, description_ur, event_date, poster_url"),
      supabase.from("notices").select("id, title_en, title_ur, content_en, content_ur, published_at").eq("is_published", true),
      supabase.from("programs").select("id, slug, title_en, title_ur, description_en, description_ur, image_url").eq("is_active", true),
    ]);
    return [
      ...(updates.data ?? []).filter((item) => `${item.title_en} ${item.title_ur} ${item.summary_en} ${item.summary_ur}`.toLowerCase().includes(needle)).map((item) => ({ ...item, kind: "updates" })),
      ...(events.data ?? []).filter((item) => `${item.title_en} ${item.title_ur} ${item.description_en} ${item.description_ur}`.toLowerCase().includes(needle)).map((item) => ({ ...item, kind: "events" })),
      ...(notices.data ?? []).filter((item) => `${item.title_en} ${item.title_ur} ${item.content_en} ${item.content_ur}`.toLowerCase().includes(needle)).map((item) => ({ ...item, kind: "notices" })),
      ...(programs.data ?? []).filter((item) => `${item.title_en} ${item.title_ur} ${item.description_en} ${item.description_ur}`.toLowerCase().includes(needle)).map((item) => ({ ...item, kind: "programs" })),
    ];
  } catch {
    return [];
  }
}

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

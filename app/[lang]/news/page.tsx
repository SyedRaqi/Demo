import { notFound } from "next/navigation";
import { NewsArchive } from "@/components/news-archive";
import { getPublicList } from "@/lib/supabase/public-content";
import type { Language } from "@/lib/content";

export default async function NewsPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ category?: string; page?: string }> }) {
  const { lang } = await params;
  if (lang !== "en" && lang !== "ur") notFound();
  const records = await getPublicList("updates");
  const query = await searchParams;
  const category = query.category || "all";
  const page = Math.max(1, Number(query.page || "1") || 1);
  return <NewsArchive language={lang as Language} records={records} category={category} page={page} />;
}
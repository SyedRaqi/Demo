import { notFound } from "next/navigation";
import { PublicDetail } from "@/components/public-detail";
import { getPublishedRecord } from "@/lib/supabase/public-content";

export default async function UpdateDetail({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (lang !== "en" && lang !== "ur") notFound();
  const { data } = await getPublishedRecord("updates", slug);
  if (!data) notFound();
  return <PublicDetail language={lang} type="updates" record={data} />;
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicPage } from "@/components/public-page";
import { PublicListing } from "@/components/public-listing";
import { pageCopy, type Language, type PageKey } from "@/lib/content";
import { getPublicList } from "@/lib/supabase/public-content";

const sections = ["about", "programs", "updates", "events", "gallery", "notices", "team", "contact"] as const;

export function generateStaticParams() {
  return ["en", "ur"].flatMap((lang) => sections.map((section) => ({ lang, section })));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; section: string }> }): Promise<Metadata> {
  const { lang, section } = await params;
  if (!isLanguage(lang) || !isPageKey(section)) return {};
  return { title: pageCopy[lang][section].title, description: pageCopy[lang][section].intro };
}

export default async function PublicSectionPage({ params }: { params: Promise<{ lang: string; section: string }> }) {
  const { lang, section } = await params;
  if (!isLanguage(lang) || !isPageKey(section)) notFound();
  const table = section === "team" ? "team_members" : section as "programs" | "updates" | "events" | "gallery" | "notices" | "team";
  if (section !== "about" && section !== "contact") {
    const records = await getPublicList(table === "team" ? "team_members" : table);
    if (records.length > 0) return <PublicListing language={lang} type={section} records={records} />;
  }
  return <PublicPage language={lang} page={section} />;
}

function isLanguage(value: string): value is Language {
  return value === "en" || value === "ur";
}

function isPageKey(value: string): value is PageKey {
  return sections.includes(value as (typeof sections)[number]);
}

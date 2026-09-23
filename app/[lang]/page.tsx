import { notFound } from "next/navigation";
import { NewsroomHome } from "@/components/newsroom-home";
import type { Language } from "@/lib/content";

export function generateStaticParams() {
  return [{ lang: "en" }, { lang: "ur" }];
}

export default async function LanguageHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "en" && lang !== "ur") notFound();
  return <NewsroomHome language={lang as Language} />;
}

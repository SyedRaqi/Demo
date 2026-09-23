import Home from "@/app/page";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return [{ lang: "en" }];
}

export default async function LanguageHome({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== "en") notFound();
  return <Home />;
}

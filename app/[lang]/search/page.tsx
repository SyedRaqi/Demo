import Link from "next/link";
import { Search } from "lucide-react";
import { notFound } from "next/navigation";
import { searchPublicContent } from "@/lib/supabase/public-content";

export default async function SearchPage({ params, searchParams }: { params: Promise<{ lang: string }>; searchParams: Promise<{ q?: string }> }) {
  const { lang } = await params;
  if (lang !== "en" && lang !== "ur") notFound();
  const query = (await searchParams).q ?? "";
  const urdu = lang === "ur";
  const results = (await searchPublicContent(query)) as Record<string, unknown>[];
  return <main dir={urdu ? "rtl" : "ltr"} className={`inner-page ${urdu ? "urdu-page" : ""}`}><header className="site-header"><Link className="brand" href={`/${lang}`}><span className="brand-mark">M</span><span><strong>Madeena Welfare Society</strong><small>Bhatkal / community newsroom</small></span></Link><Link className="nav-contact" href={`/${lang}`}>{urdu ? "صفحہ اول" : "Home"}</Link></header><section className="inner-hero page-width"><p className="section-kicker">{urdu ? "تلاش" : "SEARCH THE NEWSROOM"}</p><h1>{urdu ? "کمیونٹی میں تلاش کریں۔" : "Find something in the community."}</h1><form className="news-search-form"><Search size={18} /><input name="q" defaultValue={query} placeholder={urdu ? "خبریں، تقریبات، پروگرامز..." : "News, events, programs..."} /><button type="submit">{urdu ? "تلاش" : "Search"}</button></form></section><section className="inner-content page-width"><div className="content-list">{query && results.length === 0 && <div className="news-empty">{urdu ? "کوئی نتیجہ نہیں ملا۔" : "No results found."}</div>}{results.map((result) => { const title = String(result[urdu ? "title_ur" : "title_en"] || result.title_en); const slug = String(result.slug || result.id); const href = `/${lang}/${result.kind}/${slug}`; return <Link className="content-row" href={href} key={`${result.kind}-${result.id}`}><div><span className="row-label">{String(result.kind).toUpperCase()}</span><h2>{title}</h2><p>{String(result[urdu ? "summary_ur" : "summary_en"] || result[urdu ? "description_ur" : "description_en"] || "")}</p></div></Link>; })}</div></section></main>;
}
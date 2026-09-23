import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import type { Language } from "@/lib/content";
import { GalleryGrid } from "@/components/gallery-grid";
import { Brand } from "@/components/brand";

type RecordValue = Record<string, unknown>;

export function PublicListing({ language, type, records }: { language: Language; type: "programs" | "updates" | "events" | "gallery" | "notices" | "team"; records: RecordValue[] }) {
  const urdu = language === "ur";
  const prefix = `/${language}/${type}`;
  const title = { programs: urdu ? "ہمارے پروگرام" : "Our programs", updates: urdu ? "تازہ خبریں" : "Latest updates", events: urdu ? "تقاریب" : "Events", gallery: urdu ? "گیلری" : "Gallery", notices: urdu ? "اعلانات" : "Notices", team: urdu ? "ہماری ٹیم" : "Our team" }[type];
  return <main dir={urdu ? "rtl" : "ltr"} className="inner-page"><header className="site-header"><Brand href={`/${language}`} urdu={urdu} /><Link className="nav-contact" href={`/${language}/contact`}>{urdu ? "رابطہ کریں" : "Get in touch"} <ArrowUpRight size={16} /></Link></header><section className="inner-hero page-width"><Link className="back-link" href={`/${language}`}><ChevronRight size={15} /> {urdu ? "صفحہ اول" : "Home"}</Link><p className="section-kicker">{urdu ? "مدینہ ویلفیئر سوسائٹی" : "MADEENA WELFARE SOCIETY"}</p><h1>{title}</h1><p className="inner-intro">{urdu ? "سوسائٹی کی منظور شدہ معلومات اور تازہ مواد۔" : "Approved content and current information from the society."}</p></section><section className="inner-content page-width">{type === "gallery" ? <GalleryGrid photos={records as PhotoRecord[]} urdu={urdu} /> : <div className="content-list">{records.map((record) => { const slug = String(record.slug || record.id); const titleValue = String(record[urdu ? "title_ur" : "title_en"] || record.title_en || record[urdu ? "name_ur" : "name_en"] || ""); const description = String(record[urdu ? "description_ur" : "description_en"] || record[urdu ? "summary_ur" : "summary_en"] || record[urdu ? "bio_ur" : "bio_en"] || ""); const href = ["programs", "updates", "events"].includes(type) ? `${prefix}/${slug}` : prefix; return <article className="content-row" key={String(record.id)}><div><span className="row-label">{String(record.category || type).toUpperCase()}</span><h2>{titleValue}</h2><p>{description}</p></div><Link className="row-icon" href={href} aria-label={`Open ${titleValue}`}><ArrowUpRight size={21} /></Link></article>; })}</div>}</section></main>;
}

type PhotoRecord = { id: string; image_url: string; title_en?: string; title_ur?: string; description_en?: string; description_ur?: string };

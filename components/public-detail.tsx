import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import type { Language } from "@/lib/content";
import { Brand } from "@/components/brand";

type DetailRecord = Record<string, unknown>;

export function PublicDetail({ language, type, record }: { language: Language; type: "programs" | "updates" | "events"; record: DetailRecord }) {
  const urdu = language === "ur";
  const title = String(record[urdu ? "title_ur" : "title_en"] || record.title_en || "");
  const description = String(record[urdu ? "description_ur" : "description_en"] || record[urdu ? "summary_ur" : "summary_en"] || "");
  const content = String(record[urdu ? "content_ur" : "content_en"] || description);
  const location = String(record[urdu ? "location_ur" : "location_en"] || record.location_en || "");
  const eventDate = String(record.event_date || "");
  const eventTime = String(record.event_time || "");
  const prefix = `/${language}`;
  const back = `${prefix}/${type}`;
  return <main dir={urdu ? "rtl" : "ltr"} className="inner-page"><header className="site-header"><Brand href={prefix} urdu={urdu} /><Link className="nav-contact" href={`${prefix}/contact`}>{urdu ? "رابطہ کریں" : "Get in touch"} <ArrowUpRight size={16} /></Link></header><article className="detail-page page-width"><Link className="back-link" href={back}><ArrowLeft size={15} /> {urdu ? "واپس" : "Back to all"}</Link><p className="section-kicker">{String(record.category || type).toUpperCase()}</p><h1>{title}</h1><p className="detail-lead">{description}</p><div className="detail-body"><p>{content}</p>{location && <p><strong>{urdu ? "مقام:" : "Location:"}</strong> {location}</p>}{eventDate && <p><strong>{urdu ? "تاریخ:" : "Date:"}</strong> {eventDate} {eventTime}</p>}</div></article></main>;
}

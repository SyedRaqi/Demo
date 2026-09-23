import Link from "next/link";
import { PublicListing } from "@/components/public-listing";
import type { Language } from "@/lib/content";

type RecordValue = Record<string, unknown>;
const categories = ["all", "community", "education", "healthcare", "welfare", "events", "sports", "announcement", "relief"];

export function NewsArchive({ language, records, category, page }: { language: Language; records: RecordValue[]; category: string; page: number }) {
  const urdu = language === "ur";
  const selected = category === "all" ? records : records.filter((record) => String(record.category || "").toLowerCase() === category);
  const pageSize = 9;
  const visible = selected.slice((page - 1) * pageSize, page * pageSize);
  const hasNext = selected.length > page * pageSize;
  const prefix = `/${language}/news`;
  return <><nav className="news-category-filter" aria-label={urdu ? "خبروں کی اقسام" : "News categories"}>{categories.map((item) => <Link className={item === category ? "is-selected" : ""} href={`${prefix}?category=${item}`} key={item}>{urdu ? ({ all: "سب", community: "کمیونٹی", education: "تعلیم", healthcare: "صحت", welfare: "فلاح", events: "تقاریب", sports: "کھیل", announcement: "اعلان", relief: "امداد" } as Record<string, string>)[item] : item}</Link>)}</nav><PublicListing language={language} type="updates" records={visible} />{selected.length === 0 && <p className="news-empty page-width">{urdu ? "اس زمرے میں ابھی کوئی خبر نہیں۔" : "No stories in this category yet."}</p>}{(page > 1 || hasNext) && <nav className="news-pagination page-width" aria-label={urdu ? "صفحات" : "Pagination"}>{page > 1 && <Link href={`${prefix}?category=${category}&page=${page - 1}`}>{urdu ? "پچھلا" : "Previous"}</Link>}{hasNext && <Link href={`${prefix}?category=${category}&page=${page + 1}`}>{urdu ? "اگلا" : "Next"}</Link>}</nav>}</>;
}

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, ChevronRight, MapPin, Menu, Search } from "lucide-react";
import { getHomepageContent } from "@/lib/supabase/public-content";
import type { Language } from "@/lib/content";

type RecordValue = Record<string, unknown>;

const copy = {
  en: { news: "News", events: "Events", programs: "Programs", gallery: "Gallery", about: "About", ticker: "LATEST", feature: "FEATURED STORY", today: "TODAY IN BHATKAL", stories: "LATEST STORIES", happening: "WHAT'S HAPPENING", notice: "IMPORTANT NOTICE", photos: "PHOTO STORIES", work: "OUR WORK", read: "Read story", view: "View all", demo: "DEMO CONTENT", empty: "No latest stories available.", eventsEmpty: "No upcoming events.", contact: "Get in touch" },
  ur: { news: "خبریں", events: "تقاریب", programs: "پروگرامز", gallery: "گیلری", about: "تعارف", ticker: "تازہ ترین", feature: "نمایاں کہانی", today: "آج بھٹکل میں", stories: "تازہ خبریں", happening: "کیا ہو رہا ہے", notice: "اہم اعلان", photos: "تصویری کہانیاں", work: "ہمارا کام", read: "کہانی پڑھیں", view: "سب دیکھیں", demo: "نمونہ مواد", empty: "ابھی کوئی تازہ خبر دستیاب نہیں۔", eventsEmpty: "ابھی کوئی آئندہ تقریب نہیں۔", contact: "رابطہ کریں" },
} as const;

function value(record: RecordValue, language: Language, key: string, fallback = "") {
  return String(record[`${key}_${language}`] || record[`${key}_en`] || fallback);
}

function dateLabel(input: unknown, language: Language) {
  if (!input) return language === "ur" ? "تاریخ جلد شامل ہوگی" : "Date to be confirmed";
  return new Intl.DateTimeFormat(language === "ur" ? "ur-PK" : "en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(String(input)));
}

function Header({ language }: { language: Language }) {
  const t = copy[language];
  const prefix = `/${language}`;
  const links = [[t.news, "updates"], [t.events, "events"], [t.programs, "programs"], [t.gallery, "gallery"], [t.about, "about"]] as const;
  return <><div className="utility-bar"><span>{language === "ur" ? "بدھ، 23 ستمبر 2026" : "Tue, 23 Sep 2026"}</span><span className="utility-source">◉ {language === "ur" ? "مصدقہ کمیونٹی معلومات" : "Your source for trusted community news"}</span><span className="utility-social">f　𝕏　◎　◉</span></div><header className="news-header">
    <Link className="news-brand" href={prefix}><span className="news-logo"><Image src="/madeena-logo.png" alt="Madeena Welfare Society logo" width={48} height={48} priority /></span><span><strong>Madeena Welfare</strong><small>Bhatkal / community newsroom</small></span></Link>
    <nav className="news-nav" aria-label="Primary navigation">{links.map(([label, path]) => <Link href={`${prefix}/${path}`} key={path}>{label}</Link>)}</nav>
    <div className="news-actions"><Link href={`${prefix}/search`} aria-label="Search"><Search size={18} /></Link><Link className="news-language" href={language === "en" ? "/ur" : "/en"}>{language === "en" ? "اردو" : "EN"}</Link><Link className="news-contact" href={`${prefix}/contact`}>{t.contact}<ArrowUpRight size={15} /></Link><button className="news-menu" aria-label="Open menu"><Menu size={20} /></button></div>
  </header></>;
}

function StoryCard({ record, language, size = "standard" }: { record: RecordValue; language: Language; size?: "large" | "standard" | "small" }) {
  const t = copy[language];
  const image = String(record.cover_image_url || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=85");
  return <Link className={`story-card story-${size}`} href={`/${language}/updates/${String(record.slug || record.id)}`}>
    <div className="story-image" style={{ backgroundImage: `linear-gradient(180deg, transparent 30%, rgba(7,26,42,.86)), url(${image})` }}><span className="story-category">{String(record.category || "community").toUpperCase()}</span><span className="story-title">{value(record, language, "title", language === "ur" ? "کمیونٹی اپ ڈیٹ" : "Community update")}</span></div>
    <div className="story-meta"><span>{dateLabel(record.published_at, language)}</span><span>{value(record, language, "location", language === "ur" ? "بھٹکل" : "Bhatkal")}</span></div>
    {size !== "small" && <p>{value(record, language, "summary", t.empty)}</p>}
  </Link>;
}

function EventRow({ record, language }: { record: RecordValue; language: Language }) {
  const live = record.status === "ongoing";
  return <Link className="happening-row" href={`/${language}/events/${String(record.slug || record.id)}`}>
    <div className="happening-date"><strong>{record.event_date ? new Date(String(record.event_date)).getDate() : "--"}</strong><span>{record.event_date ? new Intl.DateTimeFormat(language === "ur" ? "ur-PK" : "en-GB", { month: "short" }).format(new Date(String(record.event_date))).toUpperCase() : "TBC"}</span></div>
    <div><span className={live ? "live-label" : "story-category"}>{live ? "● LIVE NOW" : language === "ur" ? "آنے والی تقریب" : "UPCOMING"}</span><h3>{value(record, language, "title", language === "ur" ? "کمیونٹی تقریب" : "Community gathering")}</h3><p><CalendarDays size={13} /> {String(record.event_time || (language === "ur" ? "وقت جلد بتایا جائے گا" : "Time to be confirmed"))} <MapPin size={13} /> {value(record, language, "location", language === "ur" ? "بھٹکل" : "Bhatkal")}</p></div>
    <ChevronRight size={18} />
  </Link>;
}

export async function NewsroomHome({ language }: { language: Language }) {
  const data = await getHomepageContent();
  const t = copy[language];
  const prefix = `/${language}`;
  const feature = data.updates[0];
  const featureImage = feature ? String(feature.cover_image_url || "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1800&q=90") : "";
  return <main dir={language === "ur" ? "rtl" : "ltr"} className={`newsroom ${language === "ur" ? "newsroom-urdu" : ""}`}>
    <Header language={language} />
    <div className="news-ticker"><span>{t.ticker}</span><div>{data.updates.slice(0, 4).map((item) => <Link href={`${prefix}/updates/${String(item.slug || item.id)}`} key={String(item.id)}>{value(item, language, "title")} <b>•</b></Link>)}</div></div>
    <section className="feature-story">{feature ? <Link href={`${prefix}/updates/${String(feature.slug || feature.id)}`} className="feature-art"><div className="feature-copy"><span className="editorial-label">{t.feature} / {String(feature.category || "community").toUpperCase()}</span><h1>{value(feature, language, "title", language === "ur" ? "کمیونٹی کی تازہ کہانی" : "Bhatkal's community moves forward")}</h1><p>{value(feature, language, "summary", language === "ur" ? "مدینہ ویلفیئر سوسائٹی کی تازہ معلومات اور سرگرمیاں۔" : "A daily view of the people, ideas and care shaping our community.")}</p><span className="button button-primary feature-button">{t.read} <ArrowUpRight size={17} /></span></div><div className="feature-image" style={{ backgroundImage: `url(${featureImage})` }}><span>{value(feature, language, "title", language === "ur" ? "کمیونٹی کی مضبوط کہانی" : "A stronger community builds a brighter future")}</span></div></Link> : <div className="feature-art feature-empty"><div className="feature-copy"><span className="editorial-label">{t.demo}</span><h1>{language === "ur" ? "آپ کی کمیونٹی کی اگلی کہانی یہاں ہوگی۔" : "Your community's next story belongs here."}</h1><p>{t.empty}</p></div></div>}</section>
    <nav className="category-rail section-wrap">{[["▣", t.news], ["◇", language === "ur" ? "تعلیم" : "Education"], ["♧", language === "ur" ? "کمیونٹی" : "Community"], ["▥", language === "ur" ? "فلاح" : "Welfare"], ["♡", language === "ur" ? "صحت" : "Health"], ["⌁", language === "ur" ? "کھیل" : "Sports"], ["□", t.events], ["•••", language === "ur" ? "مزید" : "More"]].map(([icon, label]) => <Link href={`${prefix}/news`} key={label}><strong>{icon}</strong><span>{label}</span></Link>)}</nav>
    <section className="today-strip"><div className="section-wrap today-inner"><div><span className="editorial-label">{t.today}</span><h2>{new Intl.DateTimeFormat(language === "ur" ? "ur-PK" : "en-GB", { day: "2-digit", month: "long", year: "numeric" }).format(new Date())}</h2></div><div className="today-stats"><span><strong>{String(data.updates.length).padStart(2, "0")}</strong>{language === "ur" ? "تازہ خبریں" : "New updates"}</span><span><strong>{String(data.events.length).padStart(2, "0")}</strong>{language === "ur" ? "آئندہ تقریبات" : "Upcoming events"}</span><span><strong>{String(data.notices.length).padStart(2, "0")}</strong>{language === "ur" ? "اہم اعلانات" : "Important notices"}</span></div></div></section>
    <section className="section-wrap stories-section"><div className="section-heading-news"><div><span className="editorial-label">{t.stories}</span><h2>{language === "ur" ? "آج کی تازہ خبریں" : "Latest news"}</h2></div><Link href={`${prefix}/news`}>{t.view} <ArrowUpRight size={16} /></Link></div><div className="news-with-sidebar"><div>{data.updates.length ? <div className="story-grid">{data.updates.slice(0, 3).map((item, index) => <StoryCard key={String(item.id)} record={item} language={language} size={index === 0 ? "large" : "standard"} />)}</div> : <div className="news-empty">{t.empty}</div>}</div><aside className="trending-panel"><div className="trending-title"><span>♨</span> {language === "ur" ? "مقبول ترین" : "Trending now"}</div>{data.updates.slice(0, 5).map((item, index) => <Link href={`${prefix}/updates/${String(item.slug || item.id)}`} key={String(item.id)}><b>{index + 1}</b><span>{value(item, language, "title", language === "ur" ? "کمیونٹی خبر" : "Community story")}</span></Link>)}<div className="quote-card">“{language === "ur" ? "مضبوط کمیونٹی روشن مستقبل بناتی ہے۔" : "A stronger community builds a brighter tomorrow."}”<small>— Madeena Welfare Society</small></div></aside></div></section>
    <section className="featured-news section-wrap"><div className="section-heading-news"><div><span className="editorial-label">FEATURED</span><h2>{language === "ur" ? "منتخب کہانیاں" : "Stories worth saving"}</h2></div><Link href={`${prefix}/news`}>{t.view} <ArrowUpRight size={16} /></Link></div><div className="featured-row">{data.updates.slice(1, 4).map((item) => <StoryCard key={String(item.id)} record={item} language={language} size="standard" />)}</div></section>
    <section className="happening-section"><div className="section-wrap happening-layout"><div><span className="editorial-label">{t.happening}</span><h2>{language === "ur" ? "آج، کل اور اس ہفتے" : "Today, tomorrow, this week"}</h2><p>{language === "ur" ? "بھٹکل کمیونٹی میں ہونے والی سرگرمیوں سے باخبر رہیں۔" : "A daily board for the gatherings and activities shaping Bhatkal."}</p><Link className="outline-button" href={`${prefix}/events`}>{t.view} <ArrowUpRight size={16} /></Link></div><div className="happening-list">{data.events.length ? data.events.slice(0, 3).map((item) => <EventRow key={String(item.id)} record={item} language={language} />) : <div className="news-empty">{t.eventsEmpty}</div>}</div></div></section>
    {data.notices[0] && <section className="section-wrap notice-section"><div className="notice-card"><div><span className="editorial-label">{t.notice}</span><h2>{value(data.notices[0], language, "title", language === "ur" ? "اہم اطلاع" : "An important notice")}</h2><p>{value(data.notices[0], language, "content", "Official announcements from the society will appear here.")}</p></div><Link className="button button-light" href={`${prefix}/notices`}>{t.read} <ArrowUpRight size={16} /></Link></div></section>}
    <section className="photo-section"><div className="section-wrap"><div className="section-heading-news light-heading"><div><span className="editorial-label">{t.photos}</span><h2>{language === "ur" ? "لمحے محفوظ کریں" : "Moments worth keeping"}</h2></div><Link href={`${prefix}/gallery`}>{t.view} <ArrowUpRight size={16} /></Link></div><div className="photo-strip">{data.gallery.slice(0, 3).map((photo) => <Link href={`${prefix}/gallery`} key={String(photo.id)} className="photo-tile" style={{ backgroundImage: `linear-gradient(180deg, transparent, rgba(7,26,42,.78)), url(${String(photo.image_url)})` }}><span>{value(photo, language, "title", language === "ur" ? "کمیونٹی لمحہ" : "Community moment")}</span></Link>)}</div></div></section>
    <section className="work-section section-wrap"><div className="work-copy"><span className="editorial-label">{t.work}</span><h2>{language === "ur" ? "مدد وہاں جہاں زندگی ہو رہی ہے۔" : "Practical support, close to home."}</h2><p>{language === "ur" ? "تعلیم، صحت، ہنگامی امداد اور کمیونٹی تعاون کے بارے میں منظور شدہ معلومات یہاں ملیں گی۔" : "Explore the approved programs that help make education, healthcare, relief and community support feel closer to home."}</p><Link className="green-link" href={`${prefix}/programs`}>{t.view} <ArrowUpRight size={16} /></Link></div><div className="work-list">{data.programs.slice(0, 4).map((program, index) => <Link href={`${prefix}/programs/${String(program.slug || program.id)}`} key={String(program.id)}><span>0{index + 1}</span><strong>{value(program, language, "title", language === "ur" ? "کمیونٹی تعاون" : "Community support")}</strong><ArrowUpRight size={16} /></Link>)}</div></section>
    <footer className="news-footer"><div className="section-wrap footer-grid"><div><span className="footer-logo footer-logo-news"><Image src="/madeena-logo.png" alt="Madeena Welfare Society logo" width={68} height={68} /></span><h2>Madeena Welfare Society</h2><p>Bhatkal / community newsroom</p></div><div><span className="editorial-label">{language === "ur" ? "دیکھیے" : "EXPLORE"}</span>{[[t.news, "updates"], [t.events, "events"], [t.programs, "programs"], [t.gallery, "gallery"], [t.about, "about"]].map(([label, path]) => <Link href={`${prefix}/${path}`} key={path}>{label}</Link>)}</div><div><span className="editorial-label">{language === "ur" ? "رابطہ" : "CONTACT"}</span><p>{language === "ur" ? "سرکاری معلومات جلد شامل ہوں گی۔" : "Official contact details will be published here when approved."}</p><Link className="green-link" href={`${prefix}/contact`}>{t.contact} <ArrowUpRight size={16} /></Link></div></div><div className="footer-base section-wrap"><span>© {new Date().getFullYear()} Madeena Welfare Society Bhatkal</span><span>{t.demo} · {language === "ur" ? "مواد منتظمین کے ذریعے تبدیل ہوتا ہے" : "Content changes through the admin newsroom"}</span></div></footer>
  </main>;
}

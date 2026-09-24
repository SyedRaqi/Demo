import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, CalendarDays, ChevronRight, MapPin, Menu, Search } from "lucide-react";
import { getHomepageContent } from "@/lib/supabase/public-content";
import type { Language } from "@/lib/content";

type RecordValue = Record<string, unknown>;

const copy = {
  en: { news: "News / Updates", events: "Events", programs: "Services / Programs", gallery: "Gallery", about: "About / Mission", feature: "COMMUNITY · SUPPORT · WELFARE", stories: "LATEST NEWS / UPDATES", galleryTitle: "Gallery", happening: "UPCOMING EVENTS", notice: "IMPORTANT NOTICE", work: "OUR WELFARE PROGRAMS", read: "Read story", view: "View all", demo: "DEMO CONTENT", empty: "No latest stories available.", eventsEmpty: "No upcoming events.", contact: "Contact Us", explore: "Explore Our Work" },
  ur: { news: "خبریں / تازہ معلومات", events: "تقاریب", programs: "خدمات / پروگرامز", gallery: "گیلری", about: "تعارف / مشن", feature: "کمیونٹی · تعاون · فلاح", stories: "تازہ خبریں / معلومات", galleryTitle: "گیلری", happening: "آئندہ تقریبات", notice: "اہم اعلان", work: "ہمارے فلاحی پروگرامز", read: "کہانی پڑھیں", view: "سب دیکھیں", demo: "نمونہ مواد", empty: "ابھی کوئی تازہ خبر دستیاب نہیں۔", eventsEmpty: "ابھی کوئی آئندہ تقریب نہیں۔", contact: "رابطہ کریں", explore: "ہمارے کام کو دیکھیں" },
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
  return <header className="news-header">
    <Link className="news-brand" href={prefix}><span className="news-logo"><Image src="/madeena-logo.png" alt="Madeena Welfare Society logo" width={58} height={58} priority /></span><span><strong>Madeena Welfare Society<br />Bhatkal</strong><small>مدینہ ویلفیئر سوسائٹی، بھٹکل</small></span></Link>
    <nav className="news-nav" aria-label="Primary navigation">{links.map(([label, path]) => <Link href={`${prefix}/${path}`} key={path}>{label}</Link>)}</nav>
    <div className="news-actions"><Link href={`${prefix}/search`} aria-label="Search"><Search size={18} /></Link><Link className="news-language" href={language === "en" ? "/ur" : "/en"}>{language === "en" ? "اردو" : "EN"}</Link><Link className="news-contact" href={`${prefix}/contact`}>{t.contact}<ArrowUpRight size={15} /></Link><button className="news-menu" aria-label="Open menu"><Menu size={20} /></button></div>
  </header>;
}

function ProgramCard({ icon, title, text, color, language }: { icon: string; title: string; text: string; color: string; language: Language }) {
  return <Link href={`/${language}/programs`} className="program-card-reference"><span className={`program-icon-reference ${color}`}>{icon}</span><h3>{title}</h3><p>{text}</p><strong className="program-arrow">→</strong></Link>;
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
    <section className="feature-story">{feature ? <Link href={`${prefix}/updates/${String(feature.slug || feature.id)}`} className="feature-art"><div className="feature-copy"><span className="editorial-label">{t.feature} / {String(feature.category || "community").toUpperCase()}</span><h1>{value(feature, language, "title", language === "ur" ? "کمیونٹی کی تازہ کہانی" : "Bhatkal's community moves forward")}</h1><p>{value(feature, language, "summary", language === "ur" ? "مدینہ ویلفیئر سوسائٹی کی تازہ معلومات اور سرگرمیاں۔" : "A daily view of the people, ideas and care shaping our community.")}</p><span className="button button-primary feature-button">{t.read} <ArrowUpRight size={17} /></span></div><div className="feature-image" style={{ backgroundImage: `url(${featureImage})` }}><span>{value(feature, language, "title", language === "ur" ? "کمیونٹی کی مضبوط کہانی" : "A stronger community builds a brighter future")}</span></div></Link> : <div className="feature-art feature-empty"><div className="feature-copy"><span className="editorial-label">{t.demo}</span><h1>{language === "ur" ? "آپ کی کمیونٹی کی اگلی کہانی یہاں ہوگی۔" : "Your community's next story belongs here."}</h1><p>{t.empty}</p></div></div>}</section>
    <section className="programs-reference section-wrap"><div className="reference-section-heading"><div><h2>{language === "ur" ? "ہمارے فلاحی پروگرامز" : "Our Welfare Programs"}</h2><p>{language === "ur" ? "وقف شدہ اقدامات کے ذریعے کمیونٹی کی خدمت۔" : "Serving the community through dedicated initiatives."}</p></div></div><div className="program-grid-reference"><ProgramCard language={language} icon="▥" color="green" title={language === "ur" ? "تعلیمی تعاون" : "Education Support"} text={language === "ur" ? "تعلیم کے ذریعے روشن مستقبل کی تعمیر۔" : "Helping build brighter futures through education."} /><ProgramCard language={language} icon="♡" color="blue" title={language === "ur" ? "صحت کی مدد" : "Healthcare Assistance"} text={language === "ur" ? "بہتر صحت اور فلاح کے لیے تعاون۔" : "Supporting better health and well-being."} /><ProgramCard language={language} icon="♧" color="red" title={language === "ur" ? "ہنگامی امداد" : "Emergency Relief"} text={language === "ur" ? "ضرورت کے وقت بروقت مدد۔" : "Providing timely help in times of need."} /><ProgramCard language={language} icon="♙" color="purple" title={language === "ur" ? "کمیونٹی تعاون" : "Community Support"} text={language === "ur" ? "مل کر مضبوط کمیونٹی بنانا۔" : "Strengthening our community together."} /></div></section>
    <section className="section-wrap stories-section"><div className="section-heading-news"><div><span className="editorial-label">{t.stories}</span><h2>{language === "ur" ? "آج کی تازہ خبریں" : "Latest news"}</h2></div><Link href={`${prefix}/news`}>{t.view} <ArrowUpRight size={16} /></Link></div><div className="news-with-sidebar"><div>{data.updates.length ? <div className="story-grid">{data.updates.slice(0, 3).map((item, index) => <StoryCard key={String(item.id)} record={item} language={language} size={index === 0 ? "large" : "standard"} />)}</div> : <div className="news-empty">{t.empty}</div>}</div><aside className="trending-panel"><div className="trending-title"><span>♨</span> {language === "ur" ? "مقبول ترین" : "Trending now"}</div>{data.updates.slice(0, 5).map((item, index) => <Link href={`${prefix}/updates/${String(item.slug || item.id)}`} key={String(item.id)}><b>{index + 1}</b><span>{value(item, language, "title", language === "ur" ? "کمیونٹی خبر" : "Community story")}</span></Link>)}<div className="quote-card">“{language === "ur" ? "مضبوط کمیونٹی روشن مستقبل بناتی ہے۔" : "A stronger community builds a brighter tomorrow."}”<small>— Madeena Welfare Society</small></div></aside></div></section>
    <section className="featured-news section-wrap"><div className="section-heading-news"><div><span className="editorial-label">{t.galleryTitle}</span><h2>{language === "ur" ? "ہماری سرگرمیوں اور کام کی جھلکیاں" : "Moments from our work and community activities."}</h2></div><Link href={`${prefix}/gallery`}>{language === "ur" ? "تمام تصاویر" : "View All Photos"} →</Link></div><div className="gallery-reference-grid">{data.gallery.slice(0, 4).map((photo) => <Link href={`${prefix}/gallery`} key={String(photo.id)}><div style={{ backgroundImage: `url(${String(photo.image_url)})` }} /><strong>{value(photo, language, "title", language === "ur" ? "کمیونٹی لمحہ" : "Community activity")}</strong></Link>)}</div></section>
    <section className="happening-section"><div className="section-wrap happening-layout"><div><span className="editorial-label">{t.happening}</span><h2>{language === "ur" ? "آج، کل اور اس ہفتے" : "Today, tomorrow, this week"}</h2><p>{language === "ur" ? "بھٹکل کمیونٹی میں ہونے والی سرگرمیوں سے باخبر رہیں۔" : "A daily board for the gatherings and activities shaping Bhatkal."}</p><Link className="outline-button" href={`${prefix}/events`}>{t.view} <ArrowUpRight size={16} /></Link></div><div className="happening-list">{data.events.length ? data.events.slice(0, 3).map((item) => <EventRow key={String(item.id)} record={item} language={language} />) : <div className="news-empty">{t.eventsEmpty}</div>}</div></div></section>
    {data.notices[0] && <section className="section-wrap notice-section"><div className="notice-card"><div><span className="editorial-label">{t.notice}</span><h2>{value(data.notices[0], language, "title", language === "ur" ? "اہم اطلاع" : "An important notice")}</h2><p>{value(data.notices[0], language, "content", "Official announcements from the society will appear here.")}</p></div><Link className="button button-light" href={`${prefix}/notices`}>{t.read} <ArrowUpRight size={16} /></Link></div></section>}
    <section className="contact-reference section-wrap"><div className="contact-reference-icon">✉</div><div><h2>{language === "ur" ? "رابطہ کریں" : "Get In Touch"}</h2><p>{language === "ur" ? "آپ کے سوالات، تجاویز اور تعاون ہمارے لیے اہم ہیں۔" : "We welcome your queries, suggestions and support."}</p><small>{language === "ur" ? "ہم سے رابطہ کریں اور بات چیت شروع کریں۔" : "Feel free to reach out to us."}</small></div><Link href={`${prefix}/contact`} className="button button-primary">{t.contact} →</Link></section>
    <section className="work-section section-wrap"><div className="work-copy"><span className="editorial-label">{t.work}</span><h2>{language === "ur" ? "مدد وہاں جہاں زندگی ہو رہی ہے۔" : "Practical support, close to home."}</h2><p>{language === "ur" ? "تعلیم، صحت، ہنگامی امداد اور کمیونٹی تعاون کے بارے میں منظور شدہ معلومات یہاں ملیں گی۔" : "Explore the approved programs that help make education, healthcare, relief and community support feel closer to home."}</p><Link className="green-link" href={`${prefix}/programs`}>{t.view} <ArrowUpRight size={16} /></Link></div><div className="work-list">{data.programs.slice(0, 4).map((program, index) => <Link href={`${prefix}/programs/${String(program.slug || program.id)}`} key={String(program.id)}><span>0{index + 1}</span><strong>{value(program, language, "title", language === "ur" ? "کمیونٹی تعاون" : "Community support")}</strong><ArrowUpRight size={16} /></Link>)}</div></section>
    <footer className="news-footer"><div className="section-wrap footer-grid"><div><span className="footer-logo footer-logo-news"><Image src="/madeena-logo.png" alt="Madeena Welfare Society logo" width={68} height={68} /></span><h2>Madeena Welfare Society</h2><p>Bhatkal / community newsroom</p></div><div><span className="editorial-label">{language === "ur" ? "دیکھیے" : "EXPLORE"}</span>{[[t.news, "updates"], [t.events, "events"], [t.programs, "programs"], [t.gallery, "gallery"], [t.about, "about"]].map(([label, path]) => <Link href={`${prefix}/${path}`} key={path}>{label}</Link>)}</div><div><span className="editorial-label">{language === "ur" ? "رابطہ" : "CONTACT"}</span><p>{language === "ur" ? "سرکاری معلومات جلد شامل ہوں گی۔" : "Official contact details will be published here when approved."}</p><Link className="green-link" href={`${prefix}/contact`}>{t.contact} <ArrowUpRight size={16} /></Link></div></div><div className="footer-base section-wrap"><span>© {new Date().getFullYear()} Madeena Welfare Society Bhatkal</span><span>{t.demo} · {language === "ur" ? "مواد منتظمین کے ذریعے تبدیل ہوتا ہے" : "Content changes through the admin newsroom"}</span></div></footer>
  </main>;
}

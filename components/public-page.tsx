import Link from "next/link";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { pageCopy, type Language, type PageKey } from "@/lib/content";
import { ContactForm } from "@/components/contact-form";
import { Brand } from "@/components/brand";

const labels = {
  en: { home: "Home", contact: "Get in touch", back: "Back home", language: "اردو" },
  ur: { home: "صفحہ اول", contact: "رابطہ کریں", back: "واپس جائیں", language: "EN" },
};

export function PublicPage({ language, page }: { language: Language; page: PageKey }) {
  const copy = pageCopy[language][page];
  const isUrdu = language === "ur";
  const prefix = `/${language}`;
  const navigation = [["About", "about"], ["Programs", "programs"], ["Updates", "updates"], ["Events", "events"], ["Gallery", "gallery"], ["Team", "team"], ["Notices", "notices"]] as const;

  return <main dir={isUrdu ? "rtl" : "ltr"} className={isUrdu ? "urdu-page inner-page" : "inner-page"}>
    <header className="site-header"><Brand href={prefix} urdu={isUrdu} /><nav className="desktop-nav" aria-label="Primary navigation">{navigation.map(([label, key]) => <Link href={`${prefix}/${key}`} key={key}>{isUrdu ? pageCopy.ur[key].eyebrow : label}</Link>)}</nav><div className="header-actions"><Link className="language-switch" href={isUrdu ? "/en" : "/ur"}>{labels[language].language}</Link><Link className="nav-contact" href={`${prefix}/contact`}>{labels[language].contact} <ArrowUpRight size={16} /></Link></div></header>
    <section className="inner-hero page-width"><Link className="back-link" href={prefix}><ChevronLeft size={15} /> {labels[language].back}</Link><p className="section-kicker">{copy.eyebrow}</p><h1>{copy.title}</h1><p className="inner-intro">{copy.intro}</p></section>
    <section className="inner-content page-width">{"items" in copy && page === "contact" ? <div className="contact-page-grid"><div className="content-list">{copy.items.map(([title, text]) => <article className="content-row" key={title}><div><span className="row-label">CONTACT</span><h2>{title}</h2><p>{text}</p></div></article>)}</div><ContactForm urdu={isUrdu} /></div> : "sections" in copy ? <div className="info-grid">{copy.sections.map(([title, text], index) => <article className="info-card" key={title}><span className="info-index">{String(index + 1).padStart(2, "0")}</span><h2>{title}</h2><p>{text}</p></article>)}</div> : "items" in copy ? <div className="content-list">{copy.items.map(([title, text]) => <article className="content-row" key={title}><div><span className="row-label">MADEENA WELFARE SOCIETY</span><h2>{title}</h2><p>{text}</p></div><ArrowUpRight className="row-icon" size={21} /></article>)}</div> : null}</section>
    <section className="inner-cta"><div className="page-width"><div><p className="section-kicker">{isUrdu ? "آئیے بات کرتے ہیں" : "LET'S TALK"}</p><h2>{isUrdu ? "آپ کی بات ہمارے لیے اہم ہے۔" : "Your voice has a place here."}</h2></div><Link className="button button-primary" href={`${prefix}/contact`}>{labels[language].contact} <ArrowUpRight size={17} /></Link></div></section>
    <footer className="simple-footer page-width"><span>© {new Date().getFullYear()} Madeena Welfare Society Bhatkal</span><Link href={prefix}>{labels[language].home} <ChevronRight size={14} /></Link></footer>
  </main>;
}

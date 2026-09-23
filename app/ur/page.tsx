import Link from "next/link";
import { ArrowUpRight, HeartHandshake } from "lucide-react";
import { Brand } from "@/components/brand";
import "../globals.css";

export default function UrduHome() {
  return (
    <main dir="rtl" className="urdu-page">
      <header className="site-header">
        <Brand href="/ur" urdu />
        <nav className="desktop-nav" aria-label="بنیادی نیویگیشن">
          <Link href="/ur/about">ہمارے بارے میں</Link><Link href="/ur/programs">پروگرامز</Link><Link href="/ur/updates">تازہ خبریں</Link><Link href="/ur/events">تقاریب</Link><Link href="/ur/gallery">گیلری</Link><Link href="/ur/team">ٹیم</Link><Link href="/ur/notices">اعلانات</Link>
        </nav>
        <div className="header-actions"><Link className="language-switch" href="/">EN</Link><Link className="nav-contact" href="/ur/contact">رابطہ کریں <ArrowUpRight size={16} /></Link></div>
      </header>
      <section className="urdu-hero hero-section"><div className="hero-copy"><p className="eyebrow">مدینہ ویلفیئر سوسائٹی <span>·</span> بھٹکل</p><h1>اچھا کام<br /><em>مل کر</em> بڑھتا ہے۔</h1><p className="hero-intro">ایک صحت مند، مضبوط اور ہمدرد معاشرے کے لیے مل کر کام کر رہے ہیں۔</p><div className="hero-buttons"><Link className="button button-primary" href="/ur/about">ہمارے کام کو دیکھیں <ArrowUpRight size={17} /></Link><Link className="text-link" href="/ur/contact">ہم سے بات کریں <ArrowUpRight size={17} /></Link></div></div><div className="hero-visual"><div className="hero-photo" role="img" aria-label="کمیونٹی کے افراد ایک ساتھ" /><div className="hero-note"><span className="note-icon"><HeartHandshake size={17} /></span><span><strong>اتحاد ہماری طاقت ہے</strong><small>چھوٹی کوششیں، بڑا اثر</small></span></div></div></section>
      <section className="intro-section page-width"><div className="section-kicker">۰۱ / ہمارا طریقہ</div><div className="intro-grid"><h2>تھوڑی سی توجہ<br />بہت کچھ <em>بدل سکتی ہے۔</em></h2><div><p className="large-copy">مدینہ ویلفیئر سوسائٹی ہمارے معاشرے کو عزت، مواقع اور دیکھ بھال کے ساتھ آگے بڑھنے میں مدد دینے کے لیے موجود ہے۔</p><p className="muted-copy">ہم عملی تعاون، بامعنی تعلق اور اس یقین کے لیے ایک جگہ بنا رہے ہیں کہ کسی کو مشکل وقت اکیلے نہیں گزارنا چاہیے۔</p><Link className="text-link dark-link" href="/ur/about">ہمارے مشن کے بارے میں <ArrowUpRight size={17} /></Link></div></div></section>
      <section className="contact-section page-width"><div><div className="section-kicker">۰۲ / رابطہ کریں</div><h2>اچھی بات چیت سے<br /><em>اچھے کام شروع ہوتے ہیں۔</em></h2></div><div><p>آپ کے سوالات، تجاویز اور تعاون کا خیر مقدم ہے۔</p><Link className="button button-primary" href="/ur/contact">رابطہ کریں <ArrowUpRight size={17} /></Link></div></section>
    </main>
  );
}

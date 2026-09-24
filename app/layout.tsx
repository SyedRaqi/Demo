import type { Metadata } from "next";
import "./globals.css";
import "./newsroom.css";
import "./reference-home.css";
import "./reference-type.css";
import "./reference-composition.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  icons: { icon: "/madeena-logo.png?v=2", shortcut: "/madeena-logo.png?v=2", apple: "/madeena-logo.png?v=2" },
  title: { default: "Madeena Welfare Society | Bhatkal", template: "%s | Madeena Welfare Society" },
  description: "Madeena Welfare Society, Bhatkal. Working together for a healthier, stronger and more compassionate community.",
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "Madeena Welfare Society", title: "Madeena Welfare Society | Bhatkal", description: "Working together for a healthier, stronger and more compassionate community." },
  twitter: { card: "summary", title: "Madeena Welfare Society | Bhatkal", description: "Working together for a healthier, stronger and more compassionate community." },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Madeena Welfare Society",
  alternateName: "Madeena Welfare Society Bhatkal",
  logo: "/madeena-logo.png",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  description: "A bilingual community newsroom and welfare platform for Madeena Welfare Society, Bhatkal.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} /></body>
    </html>
  );
}

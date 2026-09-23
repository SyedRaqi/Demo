import type { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const sections = ["about", "programs", "updates", "events", "gallery", "notices", "team", "contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "en", "ur"].flatMap((prefix) => [
    { url: `${baseUrl}/${prefix}`.replace(/\/$/, ""), lastModified: new Date() },
    ...sections.map((section) => ({ url: `${baseUrl}/${prefix}/${section}`.replace(/\/$/, ""), lastModified: new Date() })),
  ]);
}

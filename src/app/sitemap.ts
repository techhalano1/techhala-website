import type { MetadataRoute } from "next";
import { en } from "@/content/en";
import { locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/solutions",
    ...en.solutions.items.map((p) => `/solutions/${p.slug}`),
    "/products/hal-sdlc",
    "/work",
    ...en.work.items.map((c) => `/work/${c.slug}`),
    "/about",
    "/contact",
  ];
  const now = new Date();
  return paths.flatMap((path) =>
    locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? "weekly" : "monthly",
      priority: path === "" ? 1 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])),
      },
    })),
  );
}

import type { MetadataRoute } from "next";
import { en } from "@/content/en";
import { getCatalog } from "@/lib/catalog";
import { locales } from "@/lib/i18n";
import { siteUrl } from "@/lib/site";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCatalog("en");
  const paths = [
    "",
    "/products",
    ...products.map((p) => `/products/${p.slug}`),
    "/solutions",
    ...en.solutions.items.map((p) => `/solutions/${p.slug}`),
    "/solutions/hal-sdlc",
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
      changeFrequency: path === "" || path.startsWith("/products") ? "weekly" : "monthly",
      priority: path === "" ? 1 : path.startsWith("/products") ? 0.9 : 0.7,
      alternates: {
        languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}${path}`])),
      },
    })),
  );
}

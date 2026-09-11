import { cache } from "react";
import { getDictionary } from "@/content";
import { en } from "@/content/en";
import { vi } from "@/content/vi";
import {
  ageGroups,
  productArtVariants,
  productCategories,
  productTints,
  type AgeGroup,
  type Dictionary,
  type Product,
  type ProductArtVariant,
  type ProductCategory,
  type ProductColor,
  type ProductTint,
} from "@/content/types";
import { getDb, type ProductMediaRow, type ProductRow, type ProductTranslationRow } from "@/lib/db";
import { type Locale } from "@/lib/i18n";
import { classifyVideo } from "@/lib/video";

export function isCategory(v: string): v is ProductCategory {
  return (productCategories as readonly string[]).includes(v);
}
export function isAgeGroup(v: string): v is AgeGroup {
  return (ageGroups as readonly string[]).includes(v);
}
export function isArtVariant(v: string): v is ProductArtVariant {
  return (productArtVariants as readonly string[]).includes(v);
}
export function isTint(v: string): v is ProductTint {
  return (productTints as readonly string[]).includes(v);
}

export type CatalogSnapshot = {
  products: ProductRow[];
  translations: ProductTranslationRow[];
  media: ProductMediaRow[];
};

/** One DB round-trip per request (React cache); null when Supabase is not configured. */
export const loadCatalogSnapshot = cache(async (): Promise<CatalogSnapshot | null> => {
  const db = getDb();
  if (!db) return null;
  const [p, t, m] = await Promise.all([
    db.from("products").select("*").order("sort_order").order("created_at"),
    db.from("product_translations").select("*"),
    db.from("product_media").select("*").order("sort_order").order("id"),
  ]);
  if (p.error) throw p.error;
  if (t.error) throw t.error;
  if (m.error) throw m.error;
  return { products: p.data, translations: t.data, media: m.data };
});

const codeCatalog: Record<Locale, Product[]> = { vi: vi.products.items, en: en.products.items };

/** null in a translation column = "use the default"; "" = "cleared by the owner". */
function text(override: string | null | undefined, fallback: string | undefined): string | undefined {
  if (override === null || override === undefined) return fallback;
  return override || undefined;
}
function list<T>(override: T[] | null | undefined, fallback: T[] | undefined): T[] {
  return override ?? fallback ?? [];
}

function pickTranslation(snapshot: CatalogSnapshot, slug: string, locale: Locale) {
  const exact = snapshot.translations.find((t) => t.product_slug === slug && t.locale === locale);
  if (exact) return exact;
  return locale === "en" ? snapshot.translations.find((t) => t.product_slug === slug && t.locale === "vi") : undefined;
}

function mergeProduct(
  base: Product | undefined,
  row: ProductRow | undefined,
  tr: ProductTranslationRow | undefined,
  media: ProductMediaRow[],
): Product | null {
  if (!base && !row) return null;
  const slug = base?.slug ?? row!.slug;
  const category = row && isCategory(row.category) ? row.category : base?.category ?? "education";
  const art = row?.art && isArtVariant(row.art) ? row.art : base?.art ?? "buddy";
  const tint = row?.tint && isTint(row.tint) ? row.tint : base?.tint ?? "yellow";
  const ages = (row?.ages ?? base?.ages ?? []).filter(isAgeGroup);
  const colors: ProductColor[] | undefined = row?.colors ?? base?.colors;
  const compareAt = row?.compare_at_price === null || row?.compare_at_price === undefined ? base?.compareAtPrice : row.compare_at_price || undefined;

  const images = media
    .filter((m) => m.kind === "image")
    .map((m) => ({ id: m.id, url: m.url, alt: m.alt ?? undefined, color: m.color ?? undefined }));
  const videoFile = media.find((m) => m.kind === "video");
  const video = videoFile ? classifyVideo(videoFile.url) : row?.video_url ? classifyVideo(row.video_url) : undefined;

  return {
    slug,
    name: text(tr?.name, base?.name) ?? row?.name ?? slug,
    category,
    art,
    tint,
    tagline: text(tr?.tagline, base?.tagline) ?? "",
    price: row?.price ?? base?.price ?? 0,
    compareAtPrice: compareAt && compareAt > (row?.price ?? base?.price ?? 0) ? compareAt : undefined,
    rating: row?.rating ?? base?.rating ?? 5,
    sold: row?.sold ?? base?.sold ?? 0,
    freeShipping: row?.free_shipping ?? base?.freeShipping ?? true,
    ages,
    ageLabel: text(tr?.age_label, base?.ageLabel),
    colors: colors && colors.length > 0 ? colors : undefined,
    badge: text(tr?.badge, base?.badge),
    audience: text(tr?.audience, base?.audience) ?? "",
    summary: text(tr?.summary, base?.summary) ?? "",
    highlights: list(tr?.highlights, base?.highlights),
    features: list(tr?.features, base?.features),
    specs: list(tr?.specs, base?.specs),
    inBox: list(tr?.in_box, base?.inBox),
    images: images.length > 0 ? images : undefined,
    video,
    active: row?.active ?? true,
  };
}

/**
 * Full catalog for a locale: code defaults overlaid with owner edits + uploaded media from Supabase.
 * Includes inactive products (filter with `p.active` for the storefront).
 */
export const getCatalogAll = cache(async (locale: Locale): Promise<Product[]> => {
  const base = codeCatalog[locale];
  const snapshot = await loadCatalogSnapshot().catch((err) => {
    console.error("[catalog] falling back to code catalog", err);
    return null;
  });
  if (!snapshot) return base;

  const rows = new Map(snapshot.products.map((r) => [r.slug, r]));
  const mediaBySlug = new Map<string, ProductMediaRow[]>();
  for (const m of snapshot.media) mediaBySlug.set(m.product_slug, [...(mediaBySlug.get(m.product_slug) ?? []), m]);

  const order = new Map<string, number>();
  base.forEach((p, i) => order.set(p.slug, i));
  const slugs = [...base.map((p) => p.slug), ...snapshot.products.filter((r) => !order.has(r.slug)).map((r) => r.slug)];

  const merged: Product[] = [];
  for (const slug of slugs) {
    const p = mergeProduct(
      base.find((b) => b.slug === slug),
      rows.get(slug),
      pickTranslation(snapshot, slug, locale),
      mediaBySlug.get(slug) ?? [],
    );
    if (p) merged.push(p);
  }
  const sortKey = (p: Product) => rows.get(p.slug)?.sort_order ?? 1000;
  return merged
    .map((p, i) => ({ p, i }))
    .sort((a, b) => sortKey(a.p) - sortKey(b.p) || a.i - b.i)
    .map(({ p }) => p);
});

/** Storefront catalog (active products only). */
export async function getCatalog(locale: Locale) {
  return (await getCatalogAll(locale)).filter((p) => p.active !== false);
}

/** Dictionary whose `products.items` is the live catalog — use in place of getDictionary() wherever products are shown. */
export async function getStoreDictionary(locale: Locale): Promise<Dictionary> {
  const t = getDictionary(locale);
  const items = await getCatalog(locale);
  return { ...t, products: { ...t.products, items } };
}

export async function findProduct(locale: Locale, slug: string) {
  return (await getCatalogAll(locale)).find((p) => p.slug === slug) ?? null;
}

/** Colour swatch lookup for admin pages (slug + colour id → name/hex). */
export function colorLookup(products: Product[]) {
  const map = new Map<string, ProductColor>();
  for (const p of products) for (const c of p.colors ?? []) map.set(`${p.slug}:${c.id}`, c);
  return (slug: string, colorId: string | null | undefined) => (colorId ? map.get(`${slug}:${colorId}`) : undefined);
}

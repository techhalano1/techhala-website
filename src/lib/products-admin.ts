import { randomUUID } from "node:crypto";
import type { AgeGroup, Product, ProductArtVariant, ProductCategory, ProductColor, ProductTint } from "@/content/types";
import { findProduct } from "@/lib/catalog";
import { requireDb, type ProductMediaRow, type ProductRow, type ProductTranslationRow } from "@/lib/db";
import type { Locale } from "@/lib/i18n";
import { variantRowsFor } from "@/lib/orders";

export const MEDIA_BUCKET = "products";
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
export const MAX_VIDEO_BYTES = 100 * 1024 * 1024;

export const imageMimes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"] as const;
export const videoMimes = ["video/mp4", "video/webm", "video/quicktime"] as const;

export type MediaKind = ProductMediaRow["kind"];

export function mediaKindFor(mime: string): MediaKind | null {
  if ((imageMimes as readonly string[]).includes(mime)) return "image";
  if ((videoMimes as readonly string[]).includes(mime)) return "video";
  return null;
}

export type ProductInput = {
  slug: string;
  category: ProductCategory;
  price: number;
  compareAtPrice: number | null;
  active: boolean;
  freeShipping: boolean;
  rating: number | null;
  sold: number | null;
  ages: AgeGroup[];
  colors: ProductColor[];
  art: ProductArtVariant | null;
  tint: ProductTint | null;
  videoUrl: string | null;
  sortOrder: number;
  translations: Record<Locale, TranslationInput>;
};

export type TranslationInput = {
  name: string;
  tagline: string;
  summary: string;
  audience: string;
  badge: string;
  ageLabel: string;
  highlights: string[];
  features: { title: string; body: string }[];
  specs: { label: string; value: string }[];
  inBox: string[];
};

export async function getProductRow(slug: string) {
  const { data, error } = await requireDb().from("products").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data;
}

export async function listMedia(slug: string) {
  const { data, error } = await requireDb()
    .from("product_media")
    .select("*")
    .eq("product_slug", slug)
    .order("sort_order")
    .order("id");
  if (error) throw error;
  return data;
}

/** Create or update a product plus both translations, then make sure variants exist for every colour. */
export async function saveProduct(input: ProductInput, opts: { create: boolean }) {
  const db = requireDb();
  const viName = input.translations.vi.name || input.translations.en.name || input.slug;

  const existing = await getProductRow(input.slug);
  if (opts.create && existing) throw new Error(`Slug "${input.slug}" đã tồn tại.`);

  const row: Omit<ProductRow, "created_at" | "updated_at"> = {
    slug: input.slug,
    name: viName,
    category: input.category,
    price: input.price,
    active: input.active,
    source: existing?.source ?? (opts.create ? "admin" : "code"),
    compare_at_price: input.compareAtPrice,
    free_shipping: input.freeShipping,
    rating: input.rating,
    sold: input.sold,
    ages: input.ages,
    colors: input.colors,
    art: input.art,
    tint: input.tint,
    video_url: input.videoUrl,
    sort_order: input.sortOrder,
  };
  const { error: pErr } = await db.from("products").upsert(row, { onConflict: "slug" });
  if (pErr) throw pErr;

  const trRows: Omit<ProductTranslationRow, "updated_at">[] = (["vi", "en"] as Locale[]).map((locale) => {
    const t = input.translations[locale];
    return {
      product_slug: input.slug,
      locale,
      name: t.name,
      tagline: t.tagline,
      summary: t.summary,
      audience: t.audience,
      badge: t.badge,
      age_label: t.ageLabel,
      highlights: t.highlights,
      features: t.features,
      specs: t.specs,
      in_box: t.inBox,
    };
  });
  const { error: tErr } = await db.from("product_translations").upsert(trRows, { onConflict: "product_slug,locale" });
  if (tErr) throw tErr;

  // Variants (one per colour) carry stock; add any new ones, never drop existing ones.
  const { error: vErr } = await db
    .from("variants")
    .upsert(variantRowsFor({ slug: input.slug, colors: input.colors }), { onConflict: "sku", ignoreDuplicates: true });
  if (vErr) throw vErr;
}

function translationOf(p: Product): TranslationInput {
  return {
    name: p.name,
    tagline: p.tagline,
    summary: p.summary,
    audience: p.audience,
    badge: p.badge ?? "",
    ageLabel: p.ageLabel ?? "",
    highlights: p.highlights,
    features: p.features,
    specs: p.specs,
    inBox: p.inBox,
  };
}

/** Snapshot of the current (merged) product as an editable input — used to materialise code products in the DB. */
export async function productInputFor(slug: string): Promise<ProductInput | null> {
  const [vi, en] = await Promise.all([findProduct("vi", slug), findProduct("en", slug)]);
  if (!vi || !en) return null;
  return {
    slug,
    category: vi.category,
    price: vi.price,
    compareAtPrice: vi.compareAtPrice ?? null,
    active: vi.active !== false,
    freeShipping: vi.freeShipping,
    rating: vi.rating,
    sold: vi.sold,
    ages: vi.ages,
    colors: vi.colors ?? [],
    art: vi.art,
    tint: vi.tint,
    videoUrl: vi.video && vi.video.kind !== "file" ? vi.video.url : null,
    sortOrder: 1000,
    translations: { vi: translationOf(vi), en: translationOf(en) },
  };
}

export async function setProductActive(slug: string, active: boolean) {
  const db = requireDb();
  const existing = await getProductRow(slug);
  if (!existing) {
    const input = await productInputFor(slug);
    if (!input) throw new Error("Không tìm thấy sản phẩm.");
    await saveProduct({ ...input, active }, { create: false });
    return;
  }
  const { error } = await db.from("products").update({ active }).eq("slug", slug);
  if (error) throw error;
}

/** Only admin-created products can be deleted; code products are hidden with `active = false` instead. */
export async function deleteProduct(slug: string) {
  const db = requireDb();
  const existing = await getProductRow(slug);
  if (!existing) return;
  if (existing.source !== "admin") throw new Error("Sản phẩm mặc định không xoá được — hãy ẩn (tắt hiển thị).");
  const media = await listMedia(slug);
  const paths = media.map((m) => m.storage_path).filter((p): p is string => Boolean(p));
  if (paths.length > 0) await db.storage.from(MEDIA_BUCKET).remove(paths);
  const { error } = await db.from("products").delete().eq("slug", slug);
  if (error) throw error;
}

function extensionFor(mime: string, filename: string) {
  const fromName = /\.([a-z0-9]{2,5})$/i.exec(filename)?.[1]?.toLowerCase();
  if (fromName) return fromName;
  return mime.split("/")[1] ?? "bin";
}

export function publicMediaUrl(path: string) {
  return requireDb().storage.from(MEDIA_BUCKET).getPublicUrl(path).data.publicUrl;
}

/** Signed URL the browser PUTs the file to directly (bypasses the server-action body limit). */
export async function createUploadTarget(slug: string, filename: string, mime: string, size: number) {
  const kind = mediaKindFor(mime);
  if (!kind) throw new Error("Định dạng không hỗ trợ. Ảnh: JPG/PNG/WebP/GIF/AVIF; video: MP4/WebM/MOV.");
  const max = kind === "image" ? MAX_IMAGE_BYTES : MAX_VIDEO_BYTES;
  if (size <= 0 || size > max) throw new Error(`Tệp quá lớn (tối đa ${Math.round(max / 1024 / 1024)} MB).`);
  const path = `${slug}/${randomUUID()}.${extensionFor(mime, filename)}`;
  const { data, error } = await requireDb().storage.from(MEDIA_BUCKET).createSignedUploadUrl(path);
  if (error) throw error;
  return { path: data.path, signedUrl: data.signedUrl, token: data.token, kind };
}

/** Register a file that was uploaded to `storage_path`, or an external link (YouTube/TikTok/MP4). */
export async function addMedia(input: {
  slug: string;
  kind: MediaKind;
  url?: string;
  storagePath?: string;
  color?: string | null;
  alt?: string | null;
}) {
  const db = requireDb();
  if (!input.url && !input.storagePath) throw new Error("Thiếu tệp hoặc liên kết.");
  const url = input.url ?? publicMediaUrl(input.storagePath!);
  const current = await listMedia(input.slug);
  const sort_order = current.reduce((m, r) => Math.max(m, r.sort_order), -1) + 1;
  const { data, error } = await db
    .from("product_media")
    .insert({
      product_slug: input.slug,
      kind: input.kind,
      url,
      storage_path: input.storagePath ?? null,
      color: input.color || null,
      alt: input.alt || null,
      sort_order,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateMedia(id: number, patch: { color?: string | null; alt?: string | null }) {
  const { error } = await requireDb()
    .from("product_media")
    .update({ color: patch.color || null, alt: patch.alt || null })
    .eq("id", id);
  if (error) throw error;
}

export async function reorderMedia(slug: string, orderedIds: number[]) {
  const db = requireDb();
  const current = await listMedia(slug);
  const ids = new Set(current.map((m) => m.id));
  const valid = orderedIds.filter((id) => ids.has(id));
  await Promise.all(valid.map((id, i) => db.from("product_media").update({ sort_order: i }).eq("id", id)));
}

export async function removeMedia(id: number) {
  const db = requireDb();
  const { data, error } = await db.from("product_media").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  if (!data) return;
  if (data.storage_path) await db.storage.from(MEDIA_BUCKET).remove([data.storage_path]);
  const { error: dErr } = await db.from("product_media").delete().eq("id", id);
  if (dErr) throw dErr;
}

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { ProductColor } from "@/content/types";
import { requireAdmin } from "@/lib/admin-auth";
import { isAgeGroup, isArtVariant, isCategory, isTint } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";
import {
  addMedia,
  createUploadTarget,
  deleteProduct,
  mediaKindFor,
  removeMedia,
  reorderMedia,
  saveProduct,
  setProductActive,
  updateMedia,
  type ProductInput,
  type TranslationInput,
} from "@/lib/products-admin";
import type { ActionResult } from "@/app/admin/actions";

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function fail(err: unknown): ActionResult {
  console.error("[admin/products]", err);
  return { ok: false, error: err instanceof Error ? err.message : "Có lỗi xảy ra." };
}

function str(fd: FormData, key: string, max = 2000) {
  return String(fd.get(key) ?? "")
    .trim()
    .slice(0, max);
}
function lines(fd: FormData, key: string) {
  return str(fd, key, 10000)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}
function pairs(fd: FormData, key: string): [string, string][] {
  return lines(fd, key).map((l) => {
    const i = l.indexOf("|");
    return i === -1 ? [l, ""] : [l.slice(0, i).trim(), l.slice(i + 1).trim()];
  });
}
function optionalNumber(fd: FormData, key: string) {
  const raw = str(fd, key, 20);
  if (raw === "") return null;
  const n = Number(raw.replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : NaN;
}

function parseTranslation(fd: FormData, locale: Locale): TranslationInput {
  const k = (f: string) => `${locale}_${f}`;
  return {
    name: str(fd, k("name"), 200),
    tagline: str(fd, k("tagline"), 300),
    summary: str(fd, k("summary"), 3000),
    audience: str(fd, k("audience"), 300),
    badge: str(fd, k("badge"), 60),
    ageLabel: str(fd, k("ageLabel"), 60),
    highlights: lines(fd, k("highlights")),
    features: pairs(fd, k("features")).map(([title, body]) => ({ title, body })),
    specs: pairs(fd, k("specs")).map(([label, value]) => ({ label, value })),
    inBox: lines(fd, k("inBox")),
  };
}

function parseColors(fd: FormData): ProductColor[] {
  const out: ProductColor[] = [];
  for (const [id, rest] of pairs(fd, "colors")) {
    const [name, hexRaw] = rest.split("|").map((s) => s.trim());
    const cid = id.toLowerCase().replace(/[^a-z0-9-]/g, "");
    const hex = (hexRaw ?? "").startsWith("#") ? hexRaw : `#${hexRaw ?? ""}`;
    if (!cid || !name || !/^#[0-9a-f]{6}$/i.test(hex)) throw new Error(`Màu không hợp lệ: "${id}". Định dạng: id | Tên | #RRGGBB`);
    out.push({ id: cid, name, hex });
  }
  return out;
}

function parseProduct(fd: FormData): ProductInput {
  const slug = str(fd, "slug", 80).toLowerCase();
  if (!SLUG_RE.test(slug)) throw new Error("Slug chỉ gồm chữ thường, số và dấu gạch ngang (vd: robot-mini-2).");
  const category = str(fd, "category", 30);
  if (!isCategory(category)) throw new Error("Danh mục không hợp lệ.");
  const price = optionalNumber(fd, "price");
  if (price === null || !Number.isInteger(price) || price <= 0) throw new Error("Giá bán phải là số nguyên > 0.");
  const compareAtPrice = optionalNumber(fd, "compareAtPrice");
  if (compareAtPrice !== null && (!Number.isInteger(compareAtPrice) || compareAtPrice < 0)) throw new Error("Giá gốc không hợp lệ.");
  const rating = optionalNumber(fd, "rating");
  if (rating !== null && (Number.isNaN(rating) || rating < 0 || rating > 5)) throw new Error("Đánh giá phải từ 0 đến 5.");
  const sold = optionalNumber(fd, "sold");
  if (sold !== null && (!Number.isInteger(sold) || sold < 0)) throw new Error("Số đã bán không hợp lệ.");
  const sortOrder = optionalNumber(fd, "sortOrder");
  const art = str(fd, "art", 30);
  const tint = str(fd, "tint", 30);
  const videoUrl = str(fd, "videoUrl", 500);
  if (videoUrl && !/^https:\/\//i.test(videoUrl)) throw new Error("Link video phải bắt đầu bằng https://");

  const translations = { vi: parseTranslation(fd, "vi"), en: parseTranslation(fd, "en") };
  if (!translations.vi.name) throw new Error("Cần nhập tên sản phẩm (tiếng Việt).");

  return {
    slug,
    category,
    price,
    compareAtPrice: compareAtPrice && compareAtPrice > price ? compareAtPrice : null,
    active: fd.get("active") === "on",
    freeShipping: fd.get("freeShipping") === "on",
    rating: rating === null ? null : Math.round(rating * 10) / 10,
    sold,
    ages: fd.getAll("ages").map(String).filter(isAgeGroup),
    colors: parseColors(fd),
    art: isArtVariant(art) ? art : null,
    tint: isTint(tint) ? tint : null,
    videoUrl: videoUrl || null,
    sortOrder: sortOrder === null || Number.isNaN(sortOrder) ? 1000 : Math.round(sortOrder),
    translations,
  };
}

function revalidateStore() {
  revalidatePath("/", "layout");
}

export async function saveProductAction(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  await requireAdmin();
  const create = fd.get("mode") === "create";
  let input: ProductInput;
  try {
    input = parseProduct(fd);
    await saveProduct(input, { create });
  } catch (err) {
    return fail(err);
  }
  revalidateStore();
  if (create) redirect(`/admin/products/${input.slug}?created=1`);
  return { ok: true };
}

export async function toggleProductActive(slug: string, active: boolean): Promise<ActionResult> {
  await requireAdmin();
  try {
    await setProductActive(slug, active);
  } catch (err) {
    return fail(err);
  }
  revalidateStore();
  return { ok: true };
}

export async function deleteProductAction(slug: string): Promise<ActionResult> {
  await requireAdmin();
  try {
    await deleteProduct(slug);
  } catch (err) {
    return fail(err);
  }
  revalidateStore();
  redirect("/admin/products");
}

export type UploadTarget =
  | { ok: true; path: string; signedUrl: string; kind: "image" | "video" }
  | { ok: false; error: string };

/** Step 1 of an upload: the browser gets a one-time signed URL and PUTs the file straight to Storage. */
export async function requestUpload(slug: string, filename: string, mime: string, size: number): Promise<UploadTarget> {
  await requireAdmin();
  if (!SLUG_RE.test(slug)) return { ok: false, error: "Slug không hợp lệ." };
  try {
    const t = await createUploadTarget(slug, filename, mime, size);
    return { ok: true, path: t.path, signedUrl: t.signedUrl, kind: t.kind };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Không tạo được link tải lên." };
  }
}

/** Step 2: after a successful PUT, record the file on the product. */
export async function confirmUpload(slug: string, path: string, mime: string, color: string): Promise<ActionResult> {
  await requireAdmin();
  const kind = mediaKindFor(mime);
  if (!kind || !path.startsWith(`${slug}/`)) return { ok: false, error: "Tệp không hợp lệ." };
  try {
    await addMedia({ slug, kind, storagePath: path, color });
  } catch (err) {
    return fail(err);
  }
  revalidateStore();
  return { ok: true };
}

export async function updateMediaAction(id: number, patch: { color: string; alt: string }): Promise<ActionResult> {
  await requireAdmin();
  if (!Number.isInteger(id) || id <= 0) return { ok: false, error: "Thiếu mã ảnh." };
  try {
    await updateMedia(id, { color: patch.color.slice(0, 40), alt: patch.alt.slice(0, 200) });
  } catch (err) {
    return fail(err);
  }
  revalidateStore();
  return { ok: true };
}

export async function reorderMediaAction(slug: string, orderedIds: number[]): Promise<ActionResult> {
  await requireAdmin();
  if (!SLUG_RE.test(slug) || !orderedIds.every((n) => Number.isInteger(n))) return { ok: false, error: "Dữ liệu không hợp lệ." };
  try {
    await reorderMedia(slug, orderedIds);
  } catch (err) {
    return fail(err);
  }
  revalidateStore();
  return { ok: true };
}

export async function removeMediaAction(id: number): Promise<ActionResult> {
  await requireAdmin();
  if (!Number.isInteger(id) || id <= 0) return { ok: false, error: "Thiếu mã ảnh." };
  try {
    await removeMedia(id);
  } catch (err) {
    return fail(err);
  }
  revalidateStore();
  return { ok: true };
}

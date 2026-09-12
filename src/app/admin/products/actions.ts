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
  listMedia,
  mediaKindFor,
  productInputFor,
  removeMedia,
  reorderMedia,
  saveProduct,
  setProductActive,
  updateMedia,
  type ProductInput,
  type TranslationInput,
} from "@/lib/products-admin";
import { clearMedia, colorFromFilename, importImageUrl, planImport, readSheet, type ImportChange } from "@/lib/product-import";
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

// --- ZIP / spreadsheet import -------------------------------------------------------------------

export type ImportPreview =
  | {
      ok: true;
      slug: string;
      create: boolean;
      changes: ImportChange[];
      errors: string[];
      warnings: string[];
      unknown: string[];
      imageUrls: string[];
      colors: ProductColor[];
      mediaCount: number;
    }
  | { ok: false; error: string };

const MAX_SHEET_BYTES = 2 * 1024 * 1024;

async function sheetFrom(fd: FormData) {
  const file = fd.get("sheet");
  if (!(file instanceof File)) throw new Error("Thiếu file product.xlsx / product.csv.");
  if (file.size > MAX_SHEET_BYTES) throw new Error("File bảng tính quá lớn (tối đa 2 MB).");
  if (!/\.(xlsx|csv)$/i.test(file.name)) throw new Error("Bảng tính phải là .xlsx hoặc .csv.");
  return { bytes: new Uint8Array(await file.arrayBuffer()), name: file.name };
}

async function planFrom(fd: FormData) {
  const pageSlug = str(fd, "slug", 80) || null;
  if (pageSlug && !SLUG_RE.test(pageSlug)) throw new Error("Slug không hợp lệ.");
  const sheet = await sheetFrom(fd);
  const { values, unknown } = await readSheet(sheet.bytes, sheet.name);
  const slug = pageSlug ?? (values.slug?.vi.toLowerCase() || "");
  const base = slug && SLUG_RE.test(slug) ? await productInputFor(slug) : null;
  const plan = planImport(values, base, pageSlug);
  return { plan, unknown, base };
}

/** Step 1: validate the sheet and show what would change — nothing is written. */
export async function previewImportAction(fd: FormData): Promise<ImportPreview> {
  await requireAdmin();
  try {
    const { plan, unknown } = await planFrom(fd);
    const mediaCount = plan.create ? 0 : (await listMedia(plan.input.slug)).length;
    return {
      ok: true,
      slug: plan.input.slug,
      create: plan.create,
      changes: plan.changes,
      errors: plan.errors,
      warnings: plan.warnings,
      unknown,
      imageUrls: plan.imageUrls,
      colors: plan.input.colors,
      mediaCount,
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Không đọc được file." };
  }
}

/**
 * Step 2: write the product; optionally wipe the current gallery so the ZIP's photos replace it.
 * Photos from the ZIP are then uploaded by the browser (requestUpload/confirmUpload) and remote
 * `imageUrls` are fetched by `importImageUrlsAction`.
 */
export async function applyImportAction(fd: FormData): Promise<ActionResult & { slug?: string }> {
  await requireAdmin();
  try {
    const { plan } = await planFrom(fd);
    if (plan.errors.length) return { ok: false, error: plan.errors.join(" · ") };
    await saveProduct(plan.input, { create: plan.create });
    if (fd.get("replaceMedia") === "1") await clearMedia(plan.input.slug);
    revalidateStore();
    return { ok: true, slug: plan.input.slug };
  } catch (err) {
    return fail(err);
  }
}

export async function clearMediaAction(slug: string): Promise<ActionResult> {
  await requireAdmin();
  if (!SLUG_RE.test(slug)) return { ok: false, error: "Slug không hợp lệ." };
  try {
    await clearMedia(slug);
  } catch (err) {
    return fail(err);
  }
  revalidateStore();
  return { ok: true };
}

export async function importImageUrlsAction(slug: string, urls: string[]): Promise<{ ok: true; failed: string[] } | { ok: false; error: string }> {
  await requireAdmin();
  if (!SLUG_RE.test(slug)) return { ok: false, error: "Slug không hợp lệ." };
  const failed: string[] = [];
  const colors = (await productInputFor(slug))?.colors ?? [];
  for (const url of urls.slice(0, 30)) {
    try {
      await importImageUrl(slug, url, colorFromFilename(new URL(url).pathname, colors));
    } catch (err) {
      failed.push(`${url}: ${err instanceof Error ? err.message : "lỗi"}`);
    }
  }
  revalidateStore();
  return { ok: true, failed };
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

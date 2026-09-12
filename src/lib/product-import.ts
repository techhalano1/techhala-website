import ExcelJS from "exceljs";
import { strFromU8, strToU8, unzipSync, zipSync } from "fflate";
import type { ProductColor } from "@/content/types";
import { ageGroups, productCategories } from "@/content/types";
import { isAgeGroup, isCategory } from "@/lib/catalog";
import type { Locale } from "@/lib/i18n";
import {
  addMedia,
  imageMimes,
  listMedia,
  MAX_IMAGE_BYTES,
  MEDIA_BUCKET,
  type ProductInput,
  type TranslationInput,
} from "@/lib/products-admin";
import { requireDb } from "@/lib/db";

/**
 * One-product import package: a spreadsheet (`product.xlsx` / `product.csv`, one field per row:
 * `field | vi | en | note`) plus the product photos next to it. Field keys mirror `ProductInput`
 * so a sheet round-trips with the manual edit form. Empty cell = keep the current value; `-` = clear.
 */

export const SHEET_NAMES = ["product.xlsx", "product.csv"] as const;
export const CLEAR = "-";
export const SEP = "|";
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type FieldKind = "text" | "int" | "bool" | "list" | "pairs" | "ages" | "colors" | "url" | "urls";

export type FieldDef = {
  key: string;
  label: string;
  note: string;
  kind: FieldKind;
  bilingual: boolean;
  required?: boolean;
};

export const IMPORT_FIELDS: readonly FieldDef[] = [
  { key: "slug", label: "Mã sản phẩm (slug)", note: "Chữ thường, số, gạch ngang. Trùng mã đang có = cập nhật.", kind: "text", bilingual: false, required: true },
  { key: "category", label: "Danh mục", note: productCategories.join(" / "), kind: "text", bilingual: false, required: true },
  { key: "price", label: "Giá bán (VNĐ)", note: "Số nguyên, bắt buộc", kind: "int", bilingual: false, required: true },
  { key: "compareAtPrice", label: "Giá gốc (gạch)", note: "Để trống nếu không giảm giá", kind: "int", bilingual: false },
  { key: "freeShipping", label: "Miễn phí giao hàng", note: "yes / no", kind: "bool", bilingual: false },
  { key: "active", label: "Hiển thị trên web", note: "yes = bán ngay, no = ẩn để duyệt", kind: "bool", bilingual: false },
  { key: "ages", label: "Độ tuổi", note: `${ageGroups.join(" | ")} — nhiều giá trị cách bởi |`, kind: "ages", bilingual: false },
  { key: "colors", label: "Màu sắc", note: "id:Tên:#RRGGBB | id2:Tên:#hex — id khớp hậu tố tên ảnh (03-red.jpg)", kind: "colors", bilingual: false },
  { key: "videoUrl", label: "Link video", note: "YouTube / TikTok (https://…)", kind: "url", bilingual: false },
  { key: "imageUrls", label: "Ảnh trên mạng", note: "Link ảnh cách bởi | — hệ thống tự tải về; ảnh trong ZIP đứng trước", kind: "urls", bilingual: false },
  { key: "sortOrder", label: "Thứ tự hiển thị", note: "Số nhỏ lên trước (mặc định 1000)", kind: "int", bilingual: false },
  { key: "name", label: "Tên sản phẩm", note: "Bắt buộc (tiếng Việt)", kind: "text", bilingual: true, required: true },
  { key: "badge", label: "Nhãn", note: "Nhãn nhỏ trên thẻ sản phẩm (Bán chạy, Mới…)", kind: "text", bilingual: true },
  { key: "tagline", label: "Câu mô tả ngắn", note: "1 dòng dưới tên", kind: "text", bilingual: true },
  { key: "summary", label: "Mô tả", note: "Đoạn dài; xuống dòng bằng Alt+Enter", kind: "text", bilingual: true },
  { key: "audience", label: "Dành cho", note: "Ví dụ: Bé 4–8 tuổi bắt đầu học tiếng Anh", kind: "text", bilingual: true },
  { key: "ageLabel", label: "Nhãn độ tuổi", note: "Ví dụ: 4–8 tuổi", kind: "text", bilingual: true },
  { key: "highlights", label: "Điểm nổi bật", note: "Mỗi điểm cách bởi |", kind: "list", bilingual: true },
  { key: "features", label: "Tính năng", note: "Tiêu đề: mô tả | Tiêu đề 2: mô tả", kind: "pairs", bilingual: true },
  { key: "specs", label: "Thông số", note: "Tên: giá trị | Tên 2: giá trị", kind: "pairs", bilingual: true },
  { key: "inBox", label: "Trong hộp", note: "Mỗi món cách bởi |", kind: "list", bilingual: true },
];

const FIELD_BY_KEY = new Map(IMPORT_FIELDS.map((f) => [f.key.toLowerCase(), f]));

export type SheetValues = Record<string, { vi: string; en: string }>;

// --- Reading ---------------------------------------------------------------------------------

/** Minimal OOXML reader: tolerates namespace-prefixed XML (e.g. `<x:workbook>`) and absolute rel targets that ExcelJS rejects. */
function stripNs(xml: string) {
  return xml.replace(/<(\/?)[A-Za-z0-9_]+:/g, "<$1").replace(/\s[A-Za-z0-9_]+:([A-Za-z0-9_]+=)/g, " $1");
}

function xmlText(s: string) {
  return s
    .replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&amp;/g, "&");
}

function colIndex(ref: string) {
  let n = 0;
  for (const ch of ref.replace(/\d+$/, "")) n = n * 26 + (ch.toUpperCase().charCodeAt(0) - 64);
  return n;
}

function readXlsxRows(buf: Uint8Array): string[][] {
  const files = unzipSync(buf);
  const get = (path: string) => {
    const key = Object.keys(files).find((k) => k.replace(/^\/+/, "") === path.replace(/^\/+/, ""));
    return key ? stripNs(strFromU8(files[key])) : null;
  };
  const wb = get("xl/workbook.xml");
  const rels = get("xl/_rels/workbook.xml.rels");
  if (!wb || !rels) throw new Error("File Excel không hợp lệ.");
  const firstSheet = /<sheet\b[^>]*\bid="([^"]+)"/.exec(wb)?.[1];
  if (!firstSheet) throw new Error("File Excel không có sheet nào.");
  const relRe = new RegExp(`<Relationship\\b[^>]*\\bId="${firstSheet}"[^>]*>`);
  const target = /Target="([^"]+)"/.exec(relRe.exec(rels)?.[0] ?? "")?.[1];
  if (!target) throw new Error("File Excel không hợp lệ.");
  const sheet = get(target.startsWith("/") ? target : `xl/${target}`);
  if (!sheet) throw new Error("File Excel không hợp lệ.");

  const shared: string[] = [];
  const ss = get("xl/sharedStrings.xml");
  if (ss) for (const m of ss.matchAll(/<si>([\s\S]*?)<\/si>/g)) shared.push(xmlText(m[1].match(/<t\b[^>]*>[\s\S]*?<\/t>|<t\b[^>]*\/>/g)?.join("") ?? ""));

  const rows: string[][] = [];
  for (const rm of sheet.matchAll(/<row\b[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells: string[] = [];
    for (const cm of rm[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const attrs = cm[1];
      const inner = cm[2] ?? "";
      const ref = /\br="([A-Z]+)\d+"/i.exec(attrs)?.[1];
      const type = /\bt="([^"]+)"/.exec(attrs)?.[1] ?? "n";
      let text = "";
      if (type === "s") text = shared[Number(xmlText(/<v>([\s\S]*?)<\/v>/.exec(inner)?.[1] ?? ""))] ?? "";
      else if (type === "inlineStr") text = xmlText(inner.match(/<t\b[^>]*>[\s\S]*?<\/t>/g)?.join("") ?? "");
      else if (type === "b") text = /<v>1<\/v>/.test(inner) ? "yes" : "no";
      else text = xmlText(/<v>([\s\S]*?)<\/v>/.exec(inner)?.[1] ?? "");
      const idx = ref ? colIndex(ref) - 1 : cells.length;
      while (cells.length < idx) cells.push("");
      cells[idx] = text.trim();
    }
    if (cells.some(Boolean)) {
      while (cells.length < 3) cells.push("");
      rows.push(cells);
    }
  }
  return rows;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  const src = text.replace(/^\uFEFF/, "");
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          cell += '"';
          i++;
        } else quoted = false;
      } else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else cell += ch;
  }
  if (cell !== "" || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows;
}

async function readRows(buf: Uint8Array, filename: string): Promise<string[][]> {
  if (/\.csv$/i.test(filename)) return parseCsv(new TextDecoder("utf-8").decode(buf));
  try {
    return readXlsxRows(buf);
  } catch (err) {
    throw new Error(`Không đọc được file Excel: ${err instanceof Error ? err.message : "lỗi"}`);
  }
}

/** Vertical sheet → values keyed by field. Unknown field names are reported, not silently dropped. */
export async function readSheet(buf: Uint8Array, filename: string): Promise<{ values: SheetValues; unknown: string[] }> {
  const rows = await readRows(buf, filename);
  const values: SheetValues = {};
  const unknown: string[] = [];
  for (const [i, r] of rows.entries()) {
    const key = (r[0] ?? "").trim();
    if (!key) continue;
    const lk = key.toLowerCase();
    if (i === 0 && ["field", "truong", "trường", "key"].includes(lk)) continue;
    if (lk.startsWith("#")) continue;
    const def = FIELD_BY_KEY.get(lk);
    if (!def) {
      unknown.push(key);
      continue;
    }
    values[def.key] = { vi: (r[1] ?? "").trim(), en: (r[2] ?? "").trim() };
  }
  return { values, unknown };
}

// --- Applying ------------------------------------------------------------------------------------

export type ImportChange = { key: string; label: string; from: string; to: string };

export type ImportPlan = {
  input: ProductInput;
  create: boolean;
  changes: ImportChange[];
  errors: string[];
  warnings: string[];
  imageUrls: string[];
};

const emptyTranslation = (): TranslationInput => ({
  name: "",
  tagline: "",
  summary: "",
  audience: "",
  badge: "",
  ageLabel: "",
  highlights: [],
  features: [],
  specs: [],
  inBox: [],
});

export function emptyProductInput(slug: string): ProductInput {
  return {
    slug,
    category: "education",
    price: 0,
    compareAtPrice: null,
    active: true,
    freeShipping: false,
    rating: null,
    sold: null,
    ages: [],
    colors: [],
    art: null,
    tint: null,
    videoUrl: null,
    sortOrder: 1000,
    translations: { vi: emptyTranslation(), en: emptyTranslation() },
  };
}

const splitList = (s: string) =>
  s
    .split(SEP)
    .map((x) => x.trim())
    .filter(Boolean);

const splitPairs = (s: string): [string, string][] =>
  splitList(s).map((item) => {
    const i = item.indexOf(":");
    return i === -1 ? [item, ""] : [item.slice(0, i).trim(), item.slice(i + 1).trim()];
  });

function parseColors(vi: string): ProductColor[] {
  return splitList(vi).map((item) => {
    const [idRaw, name, hexRaw] = item.split(":").map((x) => x.trim());
    const id = (idRaw ?? "").toLowerCase().replace(/[^a-z0-9-]/g, "");
    const hex = (hexRaw ?? "").startsWith("#") ? hexRaw! : `#${hexRaw ?? ""}`;
    if (!id || !name || !/^#[0-9a-f]{6}$/i.test(hex)) throw new Error(`Màu không hợp lệ: "${item}". Định dạng: id:Tên:#RRGGBB`);
    return { id, name, hex };
  });
}

const fmt = (v: unknown): string => {
  if (v === null || v === undefined || v === "") return "";
  if (Array.isArray(v)) {
    return v
      .map((x) => {
        if (typeof x === "string") return x;
        if (x && typeof x === "object") {
          if ("hex" in x) return `${x.id}:${x.name}:${x.hex}`;
          if ("title" in x) return `${x.title}: ${x.body}`;
          if ("label" in x) return `${x.label}: ${x.value}`;
        }
        return String(x);
      })
      .join(` ${SEP} `);
  }
  if (typeof v === "boolean") return v ? "yes" : "no";
  return String(v);
};

function parseBool(s: string) {
  const v = s.toLowerCase();
  if (["yes", "y", "true", "1", "có", "co", "x"].includes(v)) return true;
  if (["no", "n", "false", "0", "không", "khong"].includes(v)) return false;
  throw new Error(`"${s}" không phải yes/no.`);
}

function parseInt_(s: string) {
  const n = Number(s.replace(/[^\d-]/g, ""));
  if (!Number.isInteger(n)) throw new Error(`"${s}" không phải số nguyên.`);
  return n;
}

/**
 * Merge sheet values over the current product (or an empty one). Every cell is validated and
 * turned into a change entry so the admin can review before anything is written.
 */
export function planImport(values: SheetValues, base: ProductInput | null, pageSlug: string | null): ImportPlan {
  const errors: string[] = [];
  const warnings: string[] = [];
  const changes: ImportChange[] = [];
  const imageUrls: string[] = [];

  const sheetSlug = values.slug?.vi.toLowerCase() ?? "";
  const slug = pageSlug ?? sheetSlug;
  if (!slug) errors.push("Thiếu dòng slug (mã sản phẩm).");
  else if (!SLUG_RE.test(slug)) errors.push(`Slug "${slug}" không hợp lệ (chỉ chữ thường, số, gạch ngang).`);
  if (pageSlug && sheetSlug && sheetSlug !== pageSlug)
    errors.push(`Slug trong file ("${sheetSlug}") khác sản phẩm đang mở ("${pageSlug}"). Dùng trang "Thêm sản phẩm" để tạo mới.`);

  const create = base === null;
  const input: ProductInput = base
    ? { ...base, ages: [...base.ages], colors: [...base.colors], translations: { vi: { ...base.translations.vi }, en: { ...base.translations.en } } }
    : emptyProductInput(slug);
  input.slug = slug;

  const record = (key: string, label: string, from: unknown, to: unknown) => {
    const a = fmt(from);
    const b = fmt(to);
    if (a !== b) changes.push({ key, label, from: a, to: b });
  };

  for (const def of IMPORT_FIELDS) {
    if (def.key === "slug") continue;
    const cell = values[def.key];
    const raw = cell?.vi ?? "";
    const rawEn = cell?.en ?? "";
    const hasVi = raw !== "";
    const clearVi = raw === CLEAR;
    try {
      switch (def.key) {
        case "category":
          if (hasVi) {
            if (!isCategory(raw)) throw new Error(`Danh mục "${raw}" không hợp lệ (${productCategories.join(" / ")}).`);
            record(def.key, def.label, input.category, raw);
            input.category = raw;
          }
          break;
        case "price":
          if (hasVi) {
            const n = parseInt_(raw);
            if (n <= 0) throw new Error("Giá bán phải > 0.");
            record(def.key, def.label, input.price, n);
            input.price = n;
          }
          break;
        case "compareAtPrice":
          if (clearVi) {
            record(def.key, def.label, input.compareAtPrice, null);
            input.compareAtPrice = null;
          } else if (hasVi) {
            const n = parseInt_(raw);
            if (n < 0) throw new Error("Giá gốc không hợp lệ.");
            record(def.key, def.label, input.compareAtPrice, n);
            input.compareAtPrice = n;
          }
          break;
        case "sortOrder":
          if (hasVi) {
            const n = parseInt_(raw);
            record(def.key, def.label, input.sortOrder, n);
            input.sortOrder = n;
          }
          break;
        case "freeShipping":
        case "active":
          if (hasVi) {
            const b = parseBool(raw);
            record(def.key, def.label, input[def.key], b);
            input[def.key] = b;
          }
          break;
        case "ages":
          if (clearVi) {
            record(def.key, def.label, input.ages, []);
            input.ages = [];
          } else if (hasVi) {
            const list = splitList(raw);
            const bad = list.filter((a) => !isAgeGroup(a));
            if (bad.length) throw new Error(`Độ tuổi không hợp lệ: ${bad.join(", ")} (${ageGroups.join(" | ")}).`);
            const ages = list.filter(isAgeGroup);
            record(def.key, def.label, input.ages, ages);
            input.ages = ages;
          }
          break;
        case "colors":
          if (clearVi) {
            record(def.key, def.label, input.colors, []);
            input.colors = [];
          } else if (hasVi) {
            const colors = parseColors(raw);
            record(def.key, def.label, input.colors, colors);
            input.colors = colors;
          }
          break;
        case "videoUrl":
          if (clearVi) {
            record(def.key, def.label, input.videoUrl, null);
            input.videoUrl = null;
          } else if (hasVi) {
            if (!/^https:\/\//i.test(raw)) throw new Error("Link video phải bắt đầu bằng https://");
            record(def.key, def.label, input.videoUrl, raw);
            input.videoUrl = raw.slice(0, 500);
          }
          break;
        case "imageUrls":
          if (hasVi && !clearVi) {
            for (const u of splitList(raw)) {
              if (!/^https?:\/\//i.test(u)) throw new Error(`Link ảnh không hợp lệ: ${u}`);
              imageUrls.push(u);
            }
          }
          break;
        default: {
          // Bilingual translation fields.
          const k = def.key as keyof TranslationInput;
          for (const locale of ["vi", "en"] as Locale[]) {
            const v = locale === "vi" ? raw : rawEn;
            if (v === "") continue;
            const t = input.translations[locale];
            const label = `${def.label} (${locale.toUpperCase()})`;
            if (def.kind === "list") {
              const next = v === CLEAR ? [] : splitList(v);
              record(`${def.key}_${locale}`, label, t[k], next);
              (t[k] as string[]) = next;
            } else if (def.kind === "pairs") {
              const next =
                v === CLEAR
                  ? []
                  : def.key === "features"
                    ? splitPairs(v).map(([title, body]) => ({ title, body }))
                    : splitPairs(v).map(([label, value]) => ({ label, value }));
              record(`${def.key}_${locale}`, label, t[k], next);
              (t[k] as unknown[]) = next;
            } else {
              const next = v === CLEAR ? "" : v.slice(0, def.key === "summary" ? 3000 : 300);
              record(`${def.key}_${locale}`, label, t[k], next);
              (t[k] as string) = next;
            }
          }
        }
      }
    } catch (err) {
      errors.push(`${def.label}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  if (input.compareAtPrice !== null && input.compareAtPrice <= input.price) {
    if (input.compareAtPrice !== 0) warnings.push("Giá gốc không lớn hơn giá bán nên sẽ không hiển thị giá gạch.");
    input.compareAtPrice = null;
  }
  if (!input.translations.vi.name) errors.push("Thiếu tên sản phẩm (tiếng Việt).");
  if (create && input.price <= 0) errors.push("Sản phẩm mới cần có giá bán.");
  if (!input.translations.en.name && input.translations.vi.name) {
    input.translations.en.name = input.translations.vi.name;
    warnings.push("Chưa có tên tiếng Anh — dùng tên tiếng Việt.");
  }

  return { input, create, changes, errors, warnings, imageUrls };
}

// --- Photos inside the ZIP ------------------------------------------------------------------------

/** `03-red.jpg` → colour id "red" when that colour exists on the product. */
export function colorFromFilename(filename: string, colors: ProductColor[]) {
  const stem = filename.split("/").pop()!.replace(/\.[a-z0-9]+$/i, "");
  const suffix = stem.split(/[-_]/).pop()?.toLowerCase() ?? "";
  return colors.some((c) => c.id === suffix) ? suffix : "";
}

/** Download a remote image into Storage and attach it (used for the `imageUrls` row). */
export async function importImageUrl(slug: string, url: string, color = "") {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 15000);
  let res: Response;
  try {
    res = await fetch(url, { signal: ctrl.signal, redirect: "follow", headers: { accept: "image/*" } });
  } finally {
    clearTimeout(timer);
  }
  if (!res.ok) throw new Error(`Không tải được ảnh (${res.status}): ${url}`);
  const mime = (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase();
  if (!(imageMimes as readonly string[]).includes(mime)) throw new Error(`Không phải ảnh (${mime || "không rõ định dạng"}): ${url}`);
  const bytes = new Uint8Array(await res.arrayBuffer());
  if (bytes.byteLength > MAX_IMAGE_BYTES) throw new Error(`Ảnh quá lớn (> ${MAX_IMAGE_BYTES / 1024 / 1024} MB): ${url}`);
  const ext = mime.split("/")[1] === "jpeg" ? "jpg" : mime.split("/")[1];
  const path = `${slug}/${crypto.randomUUID()}.${ext}`;
  const { error } = await requireDb().storage.from(MEDIA_BUCKET).upload(path, bytes, { contentType: mime, cacheControl: "31536000" });
  if (error) throw error;
  return addMedia({ slug, kind: "image", storagePath: path, color: color || null });
}

/** Remove every image/video of a product (files + rows) — used when a ZIP replaces the gallery. */
export async function clearMedia(slug: string) {
  const db = requireDb();
  const media = await listMedia(slug);
  const paths = media.map((m) => m.storage_path).filter((p): p is string => Boolean(p));
  if (paths.length) {
    const { error } = await db.storage.from(MEDIA_BUCKET).remove(paths);
    if (error) throw error;
  }
  const { error } = await db.from("product_media").delete().eq("product_slug", slug);
  if (error) throw error;
  return media.length;
}

// --- Template / export --------------------------------------------------------------------------------

const README_VI = `HƯỚNG DẪN NHẬP SẢN PHẨM TỪ ZIP (TechHala)

1. Mở product.xlsx, điền cột "tiếng Việt" (và "tiếng Anh" nếu có). Cột "ghi chú" chỉ để hướng dẫn.
   - Ô để trống = giữ nguyên giá trị đang có trên web. Ghi "-" để xoá hẳn một trường.
   - Nhiều giá trị (độ tuổi, màu, điểm nổi bật, thông số…) cách nhau bằng dấu |
2. Đặt ảnh sản phẩm cạnh file này: 01.jpg, 02.jpg, 03-red.jpg …
   - Ảnh xếp theo tên file; ảnh đầu tiên là ảnh đại diện.
   - Hậu tố -<id màu> (03-red.jpg) gắn ảnh cho màu có id "red" ở dòng colors.
   - JPG / PNG / WebP / AVIF, tối đa 10 MB mỗi ảnh.
   - Nếu ZIP có ảnh, toàn bộ ảnh cũ trên web sẽ được thay bằng ảnh trong ZIP (có thể tắt khi nhập).
3. Video: dán link YouTube/TikTok vào dòng videoUrl.
4. Nén cả thư mục thành .zip và kéo vào /admin/products/<slug> → "Nhập từ ZIP".
`;

/** Spreadsheet with every field, optionally pre-filled from the current product (for edit-and-reimport). */
export async function buildSheet(current: ProductInput | null): Promise<Uint8Array> {
  const wb = new ExcelJS.Workbook();
  wb.creator = "TechHala";
  const ws = wb.addWorksheet("product");
  ws.columns = [
    { header: "field", key: "field", width: 18 },
    { header: "tiếng Việt", key: "vi", width: 60 },
    { header: "tiếng Anh", key: "en", width: 60 },
    { header: "ghi chú", key: "note", width: 60 },
  ];
  ws.getRow(1).font = { bold: true };
  ws.views = [{ state: "frozen", ySplit: 1 }];

  for (const def of IMPORT_FIELDS) {
    let vi = "";
    let en = "";
    if (current) {
      switch (def.key) {
        case "slug":
          vi = current.slug;
          break;
        case "imageUrls":
          break;
        case "colors":
        case "category":
        case "price":
        case "compareAtPrice":
        case "freeShipping":
        case "active":
        case "ages":
        case "videoUrl":
        case "sortOrder":
          vi = fmt(current[def.key]);
          break;
        default: {
          const k = def.key as keyof TranslationInput;
          vi = fmt(current.translations.vi[k]);
          en = fmt(current.translations.en[k]);
        }
      }
    }
    const row = ws.addRow({ field: def.key, vi, en, note: `${def.label}${def.required ? " (bắt buộc)" : ""} — ${def.note}` });
    row.getCell("field").font = { bold: true };
    row.getCell("note").font = { color: { argb: "FF6B7280" }, italic: true };
    if (!def.bilingual) row.getCell("en").fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F4F6" } };
    for (const c of ["vi", "en", "note"]) row.getCell(c).alignment = { wrapText: true, vertical: "top" };
  }
  const out = await wb.xlsx.writeBuffer();
  return new Uint8Array(out as ArrayBuffer);
}

/** ZIP with the sheet + README (+ a copy of the current photos' URLs list, so the folder mirrors the site). */
export async function buildTemplateZip(current: ProductInput | null, photoUrls: string[] = []): Promise<Uint8Array> {
  const sheet = await buildSheet(current);
  const files: Record<string, Uint8Array> = {
    "product.xlsx": sheet,
    "README.txt": strToU8(README_VI),
  };
  if (photoUrls.length) files["anh-hien-tai.txt"] = strToU8(`Ảnh đang dùng trên web (theo thứ tự):\n${photoUrls.join("\n")}\n`);
  return zipSync(files, { level: 6 });
}

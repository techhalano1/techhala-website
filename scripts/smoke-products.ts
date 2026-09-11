/* Dev smoke test for /admin/products plumbing: npx tsx --env-file=.env.local scripts/smoke-products.ts
 * Creates a throw-away product, uploads a 1x1 PNG through a signed URL, attaches a YouTube link, checks the
 * merged storefront catalog, then deletes everything it created. */
import { findProduct, getCatalog, getCatalogAll } from "../src/lib/catalog";
import { requireDb } from "../src/lib/db";
import { syncCatalog } from "../src/lib/orders";
import {
  addMedia,
  createUploadTarget,
  deleteProduct,
  getProductRow,
  listMedia,
  productInputFor,
  removeMedia,
  reorderMedia,
  saveProduct,
  setProductActive,
  updateMedia,
} from "../src/lib/products-admin";
import { embedUrl } from "../src/lib/video";

let failures = 0;
function check(label: string, ok: boolean, detail?: unknown) {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}${detail !== undefined ? ` — ${JSON.stringify(detail)}` : ""}`);
  if (!ok) failures++;
}

const slug = `smoke-bot-${Date.now().toString(36)}`;
const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg==",
  "base64",
);

async function main() {
  const db = requireDb();
  const before = await getCatalogAll("vi");
  check("code catalog loads", before.length >= 13, before.length);

  const seed = await productInputFor("halabuddy");
  check("productInputFor(code product) materialises both locales", !!seed && seed.translations.en.tagline !== seed.translations.vi.tagline, {
    vi: seed?.translations.vi.tagline,
    en: seed?.translations.en.tagline,
  });

  // 1. create an admin product with two colours
  await saveProduct(
    {
      slug,
      category: "education",
      price: 2_490_000,
      compareAtPrice: 2_990_000,
      active: true,
      freeShipping: true,
      rating: 4.8,
      sold: 12,
      ages: ["6-12"],
      colors: [
        { id: "red", name: "Đỏ", hex: "#ef4444" },
        { id: "blue", name: "Xanh", hex: "#3b82f6" },
      ],
      art: "buddy",
      tint: "blue",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      sortOrder: 5,
      translations: {
        vi: {
          name: "Robot Smoke",
          tagline: "Bạn học tiếng Anh",
          summary: "Mô tả VI",
          audience: "Học sinh",
          badge: "Mới",
          ageLabel: "6–12 tuổi",
          highlights: ["Nói chuyện tự nhiên", "Pin 8 giờ"],
          features: [{ title: "Hội thoại", body: "AI hội thoại" }],
          specs: [{ label: "Pin", value: "2.000 mAh" }],
          inBox: ["Robot", "Cáp USB-C"],
        },
        en: {
          name: "Smoke Robot",
          tagline: "English buddy",
          summary: "Summary EN",
          audience: "Students",
          badge: "New",
          ageLabel: "Ages 6–12",
          highlights: ["Natural talk"],
          features: [],
          specs: [],
          inBox: ["Robot"],
        },
      },
    },
    { create: true },
  );
  const row = await getProductRow(slug);
  check("product row created with source=admin", row?.source === "admin" && row.price === 2_490_000, row?.source);

  const { data: variants } = await db.from("variants").select("sku").eq("product_slug", slug);
  check("one variant per colour", variants?.length === 2, variants?.map((v) => v.sku));

  let vi = await findProduct("vi", slug);
  let en = await findProduct("en", slug);
  check("merged VI product", vi?.name === "Robot Smoke" && vi.compareAtPrice === 2_990_000 && vi.colors?.length === 2, vi?.name);
  check("merged EN product", en?.name === "Smoke Robot" && en.highlights.length === 1, en?.name);
  check("youtube link classified + embeddable", vi?.video?.kind === "youtube" && (embedUrl(vi.video) ?? "").includes("youtube-nocookie.com/embed/dQw4w9WgXcQ"), vi?.video);
  check("sorted first (sort_order 5)", before.length + 1 === (await getCatalogAll("vi")).length && (await getCatalogAll("vi"))[0].slug === slug);

  // duplicate create must fail
  let dup = false;
  try {
    await saveProduct({ ...(await productInputFor(slug))!, slug }, { create: true });
  } catch {
    dup = true;
  }
  check("duplicate slug rejected", dup);

  // 2. upload an image via signed URL, exactly like the browser does
  const target = await createUploadTarget(slug, "pixel.png", "image/png", PNG_1X1.length);
  const put = await fetch(target.signedUrl, { method: "PUT", headers: { "content-type": "image/png" }, body: PNG_1X1 });
  check("PUT to signed upload URL", put.ok, put.status);
  const img = await addMedia({ slug, kind: "image", storagePath: target.path, color: "red", alt: "Robot đỏ" });
  const head = await fetch(img.url, { method: "HEAD" });
  check("uploaded image publicly readable", head.ok && (head.headers.get("content-type") ?? "").startsWith("image/png"), img.url);

  let bad = false;
  try {
    await createUploadTarget(slug, "x.exe", "application/octet-stream", 10);
  } catch {
    bad = true;
  }
  check("unsupported mime rejected", bad);
  let big = false;
  try {
    await createUploadTarget(slug, "big.png", "image/png", 11 * 1024 * 1024);
  } catch {
    big = true;
  }
  check("oversized image rejected", big);

  const img2 = await addMedia({ slug, kind: "image", storagePath: target.path, color: null, alt: null });
  vi = await findProduct("vi", slug);
  check("storefront sees 2 images, colour on first", vi?.images?.length === 2 && vi.images[0].color === "red" && vi.images[0].alt === "Robot đỏ");

  await reorderMedia(slug, [img2.id, img.id]);
  await updateMedia(img.id, { color: "blue", alt: "Robot xanh" });
  const media = await listMedia(slug);
  check("reorder + update persisted", media[0].id === img2.id && media[1].color === "blue" && media[1].alt === "Robot xanh");

  // 3. hide → storefront excludes, admin still sees; checkout catalog excludes too
  await setProductActive(slug, false);
  const store = await getCatalog("vi");
  const all = await getCatalogAll("vi");
  check("inactive hidden from storefront but visible to admin", !store.some((p) => p.slug === slug) && all.some((p) => p.slug === slug && p.active === false));
  await setProductActive(slug, true);

  // 4. edit price/translation; syncCatalog must not clobber it
  const edit = (await productInputFor(slug))!;
  await saveProduct({ ...edit, price: 2_690_000, translations: { ...edit.translations, vi: { ...edit.translations.vi, tagline: "" } } }, { create: false });
  await syncCatalog(db);
  vi = await findProduct("vi", slug);
  en = await findProduct("en", slug);
  check("price edit survives syncCatalog", vi?.price === 2_690_000 && (await getProductRow(slug))?.price === 2_690_000);
  check("cleared tagline stays cleared; EN untouched", vi?.tagline === "" && en?.tagline === "English buddy");

  // code product rows are only inserted, never overwritten
  const hb = await getProductRow("halabuddy");
  check("code product present in DB for stock", !!hb && hb.source === "code");

  // 5. cleanup: removeMedia deletes the object; deleteProduct cascades
  await removeMedia(img2.id);
  await deleteProduct(slug);
  const gone = await fetch(img.url, { method: "HEAD" });
  const { data: leftovers } = await db.storage.from("products").list(slug);
  check("storage objects removed", gone.status === 400 || gone.status === 404, gone.status);
  check("no leftover objects in folder", (leftovers ?? []).length === 0, leftovers?.map((o) => o.name));
  check("product row + media + variants gone", !(await getProductRow(slug)) && (await listMedia(slug)).length === 0);
  const { data: vLeft } = await db.from("variants").select("sku").eq("product_slug", slug);
  check("variants cascaded", (vLeft ?? []).length === 0);
  check("catalog back to baseline", (await getCatalogAll("vi")).length === before.length);

  console.log(failures === 0 ? "\nALL OK" : `\n${failures} FAILURE(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch(async (err) => {
  console.error(err);
  await deleteProduct(slug).catch(() => undefined);
  process.exit(1);
});

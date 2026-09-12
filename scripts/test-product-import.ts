/* Offline tests for the one-product sheet importer: npx tsx scripts/test-product-import.ts
 * Add --live (with --env-file=.env.local) to also round-trip a throw-away product through Supabase. */
import assert from "node:assert/strict";
import { unzipSync } from "fflate";
import { buildSheet, buildTemplateZip, clearMedia, colorFromFilename, emptyProductInput, planImport, readSheet } from "../src/lib/product-import";

const live = process.argv.includes("--live");
let passed = 0;
async function t(name: string, fn: () => void | Promise<void>) {
  try {
    await fn();
    passed++;
    console.log(`  ✔ ${name}`);
  } catch (e) {
    console.error(`  ✖ ${name}\n`, e);
    process.exitCode = 1;
  }
}

const csv = (rows: string[][]) => new TextEncoder().encode(rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n"));

const halabuddy = () => {
  const p = emptyProductInput("halabuddy");
  p.category = "education";
  p.price = 2990000;
  p.colors = [
    { id: "red", name: "Đỏ", hex: "#E53935" },
    { id: "white", name: "Trắng", hex: "#FAFAFA" },
  ];
  p.translations.vi.name = "HalaBuddy";
  p.translations.vi.summary = "Robot học tiếng Anh";
  p.translations.vi.highlights = ["Cũ 1", "Cũ 2"];
  p.translations.en.name = "HalaBuddy";
  return p;
};

(async () => {
  console.log("product-import");

  await t("CSV: Vietnamese text + list/pairs parsing", async () => {
    const { values, unknown } = await readSheet(
      csv([
        ["field", "vi", "en", "ghi chú"],
        ["slug", "robot-moi", "", ""],
        ["category", "education", "", ""],
        ["price", "3.490.000", "", ""],
        ["name", "Robot Tiếng Việt có dấu", "Vietnamese Robot", ""],
        ["highlights", "Điểm 1 | Điểm 2", "Point 1|Point 2", ""],
        ["specs", "Pin: 2000 mAh | Kết nối: Wi‑Fi 2.4 GHz", "Battery: 2000 mAh", ""],
        ["ages", "4-8 | family", "", ""],
        ["colors", "red:Đỏ:#E53935 | blue:Xanh:#1E88E5", "", ""],
        ["freeShipping", "có", "", ""],
        ["mystery", "x", "", ""],
      ]),
      "product.csv",
    );
    assert.deepEqual(unknown, ["mystery"]);
    const plan = planImport(values, null, null);
    assert.deepEqual(plan.errors, []);
    assert.equal(plan.create, true);
    assert.equal(plan.input.price, 3490000);
    assert.equal(plan.input.translations.vi.name, "Robot Tiếng Việt có dấu");
    assert.deepEqual(plan.input.translations.vi.highlights, ["Điểm 1", "Điểm 2"]);
    assert.deepEqual(plan.input.translations.en.highlights, ["Point 1", "Point 2"]);
    assert.deepEqual(plan.input.translations.vi.specs, [
      { label: "Pin", value: "2000 mAh" },
      { label: "Kết nối", value: "Wi‑Fi 2.4 GHz" },
    ]);
    assert.deepEqual(plan.input.ages, ["4-8", "family"]);
    assert.deepEqual(plan.input.colors.map((c) => c.id), ["red", "blue"]);
    assert.equal(plan.input.freeShipping, true);
  });

  await t("XLSX round-trip via buildSheet keeps values", async () => {
    const base = halabuddy();
    const xlsx = await buildSheet(base);
    const { values, unknown } = await readSheet(xlsx, "product.xlsx");
    assert.deepEqual(unknown, []);
    assert.equal(values.name.vi, "HalaBuddy");
    assert.equal(values.colors.vi, "red:Đỏ:#E53935 | white:Trắng:#FAFAFA");
    const plan = planImport(values, base, "halabuddy");
    assert.deepEqual(plan.errors, []);
    assert.equal(plan.create, false);
    assert.deepEqual(plan.changes, [], "re-importing own template changes nothing");
  });

  await t("blank keeps, '-' clears, changed fields are listed", async () => {
    const base = halabuddy();
    const { values } = await readSheet(
      csv([
        ["field", "vi", "en"],
        ["price", "3190000", ""],
        ["summary", "", ""],
        ["highlights", "-", ""],
        ["compareAtPrice", "-", ""],
      ]),
      "product.csv",
    );
    const plan = planImport(values, base, "halabuddy");
    assert.deepEqual(plan.errors, []);
    assert.equal(plan.input.price, 3190000);
    assert.equal(plan.input.translations.vi.summary, "Robot học tiếng Anh");
    assert.deepEqual(plan.input.translations.vi.highlights, []);
    assert.equal(plan.input.compareAtPrice, null);
    assert.deepEqual(plan.changes.map((c) => c.key).sort(), ["highlights_vi", "price"]);
  });

  await t("validation errors: slug mismatch, category, price, ages, colors, video url, image url", async () => {
    const { values } = await readSheet(
      csv([
        ["field", "vi", "en"],
        ["slug", "other-slug", ""],
        ["category", "toys", ""],
        ["price", "abc", ""],
        ["ages", "99-100", ""],
        ["colors", "red:Đỏ:red", ""],
        ["videoUrl", "not a url", ""],
        ["imageUrls", "ftp://x/y.jpg", ""],
      ]),
      "product.csv",
    );
    const plan = planImport(values, halabuddy(), "halabuddy");
    const joined = plan.errors.join("\n");
    for (const k of ["slug", "Danh mục", "Giá bán", "Độ tuổi", "Màu", "video", "Ảnh trên mạng"]) {
      assert.ok(joined.toLowerCase().includes(k.toLowerCase()), `missing error for ${k}: ${joined}`);
    }
  });

  await t("new product requires slug, category, price, vi name", async () => {
    const { values } = await readSheet(csv([["field", "vi", "en"], ["slug", "new-one", ""]]), "product.csv");
    const plan = planImport(values, null, null);
    assert.equal(plan.create, true);
    assert.ok(plan.errors.length >= 2, plan.errors.join(" | "));
    assert.ok(plan.errors.some((e) => e.includes("tên")) && plan.errors.some((e) => e.includes("giá")), plan.errors.join(" | "));
  });

  await t("colour suffix from filename", () => {
    const colors = halabuddy().colors;
    assert.equal(colorFromFilename("03-red.jpg", colors), "red");
    assert.equal(colorFromFilename("photos/IMG_2_WHITE.PNG", colors), "white");
    assert.equal(colorFromFilename("01.jpg", colors), "");
    assert.equal(colorFromFilename("hero-blue.webp", colors), "");
  });

  await t("template zip has product.xlsx + README", async () => {
    const zip = await buildTemplateZip(halabuddy(), ["https://x/1.jpg"]);
    const files = unzipSync(zip);
    assert.deepEqual(Object.keys(files).sort(), ["README.txt", "anh-hien-tai.txt", "product.xlsx"]);
    assert.ok(files["product.xlsx"].length > 1000);
  });

  if (live) {
    const { saveProduct, deleteProduct, getProductRow, listMedia, addMedia } = await import("../src/lib/products-admin");
    const slug = `zz-import-${Date.now().toString(36)}`;
    await t("live: create → update via sheet → clearMedia → delete", async () => {
      const { values } = await readSheet(
        csv([
          ["field", "vi", "en"],
          ["slug", slug, ""],
          ["category", "education", ""],
          ["price", "2990000", ""],
          ["active", "no", ""],
          ["name", "Robot thử nhập ZIP", "Zip import test"],
          ["highlights", "A | B", ""],
        ]),
        "product.csv",
      );
      const plan = planImport(values, null, null);
      assert.deepEqual(plan.errors, []);
      await saveProduct(plan.input, { create: true });
      assert.ok(await getProductRow(slug));
      await addMedia({ slug, kind: "video", url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" });
      assert.equal((await listMedia(slug)).length, 1);
      await clearMedia(slug);
      assert.equal((await listMedia(slug)).length, 0);
      await deleteProduct(slug);
      assert.equal(await getProductRow(slug), null);
    });
  }

  console.log(`\n${passed} passed${process.exitCode ? ", some FAILED" : ""}`);
})();

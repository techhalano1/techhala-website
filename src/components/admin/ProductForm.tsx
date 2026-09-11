"use client";

import { useActionState, useState, useTransition } from "react";
import { ageGroups, productArtVariants, productCategories, productTints, type Product } from "@/content/types";
import type { ProductRow } from "@/lib/db";
import { categoryLabel } from "@/lib/admin-ui";
import type { ActionResult } from "@/app/admin/actions";
import { deleteProductAction, saveProductAction, toggleProductActive } from "@/app/admin/products/actions";

const field = "mt-1 block w-full rounded-xl border-2 border-ink bg-bg-elev px-3 py-2 text-sm outline-none focus:shadow-hard-accent";
const labelCls = "block text-xs font-bold";

const ageLabelVi: Record<(typeof ageGroups)[number], string> = {
  "4-8": "4–8 tuổi",
  "6-12": "6–12 tuổi",
  "9-15": "9–15 tuổi",
  family: "Gia đình",
  seniors: "Người lớn tuổi",
};

function Field({
  label,
  name,
  defaultValue,
  hint,
  type = "text",
  required,
  readOnly,
  step,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null;
  hint?: string;
  type?: string;
  required?: boolean;
  readOnly?: boolean;
  step?: string;
}) {
  return (
    <label className={labelCls}>
      {label}
      <input
        name={name}
        type={type}
        step={step}
        required={required}
        readOnly={readOnly}
        defaultValue={defaultValue ?? ""}
        className={`${field} ${readOnly ? "bg-tint-peach/40 text-muted" : ""}`}
      />
      {hint && <span className="mt-1 block text-[11px] font-normal text-muted">{hint}</span>}
    </label>
  );
}

function Area({
  label,
  name,
  defaultValue,
  hint,
  rows = 4,
}: {
  label: string;
  name: string;
  defaultValue?: string;
  hint?: string;
  rows?: number;
}) {
  return (
    <label className={labelCls}>
      {label}
      <textarea name={name} rows={rows} defaultValue={defaultValue ?? ""} className={`${field} font-mono text-xs leading-relaxed`} />
      {hint && <span className="mt-1 block text-[11px] font-normal text-muted">{hint}</span>}
    </label>
  );
}

function TranslationFields({ locale, p }: { locale: "vi" | "en"; p: Product | null }) {
  const k = (f: string) => `${locale}_${f}`;
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Tên sản phẩm" name={k("name")} defaultValue={p?.name} required={locale === "vi"} />
      <Field label="Khẩu hiệu ngắn (tagline)" name={k("tagline")} defaultValue={p?.tagline} />
      <Field label="Nhãn (badge)" name={k("badge")} defaultValue={p?.badge} hint="Vd: Bán chạy, Mới, -15%. Để trống nếu không có." />
      <Field label="Nhãn độ tuổi" name={k("ageLabel")} defaultValue={p?.ageLabel} hint="Vd: 6–12 tuổi" />
      <div className="sm:col-span-2">
        <Field label="Dành cho ai (audience)" name={k("audience")} defaultValue={p?.audience} />
      </div>
      <div className="sm:col-span-2">
        <Area label="Mô tả / giới thiệu" name={k("summary")} defaultValue={p?.summary} rows={4} />
      </div>
      <Area
        label="Điểm nổi bật"
        name={k("highlights")}
        defaultValue={p?.highlights.join("\n")}
        hint="Mỗi dòng một điểm."
        rows={5}
      />
      <Area
        label="Trong hộp có gì"
        name={k("inBox")}
        defaultValue={p?.inBox.join("\n")}
        hint="Mỗi dòng một món."
        rows={5}
      />
      <Area
        label="Tính năng"
        name={k("features")}
        defaultValue={p?.features.map((f) => `${f.title} | ${f.body}`).join("\n")}
        hint="Mỗi dòng: Tiêu đề | Nội dung"
        rows={6}
      />
      <Area
        label="Thông số kỹ thuật"
        name={k("specs")}
        defaultValue={p?.specs.map((s) => `${s.label} | ${s.value}`).join("\n")}
        hint="Mỗi dòng: Nhãn | Giá trị (vd: Pin | 2.000 mAh, ~6 giờ)"
        rows={6}
      />
    </div>
  );
}

export function ProductForm({
  mode,
  vi,
  en,
  row,
}: {
  mode: "create" | "edit";
  vi: Product | null;
  en: Product | null;
  row: ProductRow | null;
}) {
  const [result, action, pending] = useActionState<ActionResult | null, FormData>(saveProductAction, null);
  const [tab, setTab] = useState<"vi" | "en">("vi");
  const [deleting, startDelete] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const colorsText = (vi?.colors ?? []).map((c) => `${c.id} | ${c.name} | ${c.hex}`).join("\n");

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="mode" value={mode} />

      <section className="kcard p-5">
        <h2 className="font-bold">Thông tin bán hàng</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Field
            label="Slug (đường dẫn)"
            name="slug"
            defaultValue={vi?.slug}
            required
            readOnly={mode === "edit"}
            hint={mode === "create" ? "Chữ thường, số, gạch ngang. Vd: robot-mini-2" : undefined}
          />
          <label className={labelCls}>
            Danh mục
            <select name="category" defaultValue={vi?.category ?? "education"} className={field}>
              {productCategories.map((c) => (
                <option key={c} value={c}>
                  {categoryLabel[c] ?? c}
                </option>
              ))}
            </select>
          </label>
          <Field label="Giá bán (₫)" name="price" type="number" defaultValue={vi?.price} required hint="Số nguyên, vd 2990000" />
          <Field label="Giá gốc gạch ngang (₫)" name="compareAtPrice" type="number" defaultValue={vi?.compareAtPrice} hint="Để trống nếu không giảm giá." />
          <Field label="Đánh giá (0–5)" name="rating" type="number" step="0.1" defaultValue={vi?.rating} />
          <Field label="Đã bán" name="sold" type="number" defaultValue={vi?.sold} />
          <Field label="Thứ tự hiển thị" name="sortOrder" type="number" defaultValue={row?.sort_order ?? 1000} hint="Nhỏ hơn lên trước." />
          <div className="flex flex-col justify-end gap-2 pb-1 text-sm">
            <label className="flex items-center gap-2 font-semibold">
              <input type="checkbox" name="active" defaultChecked={vi ? vi.active !== false : true} className="h-4 w-4 accent-accent" />
              Hiển thị trên website
            </label>
            <label className="flex items-center gap-2 font-semibold">
              <input type="checkbox" name="freeShipping" defaultChecked={vi?.freeShipping ?? true} className="h-4 w-4 accent-accent" />
              Miễn phí vận chuyển
            </label>
          </div>
        </div>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <fieldset>
            <legend className="text-xs font-bold">Độ tuổi phù hợp</legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {ageGroups.map((a) => (
                <label key={a} className="flex items-center gap-1.5 rounded-lg border-2 border-ink px-2.5 py-1 text-xs font-semibold">
                  <input type="checkbox" name="ages" value={a} defaultChecked={vi?.ages.includes(a)} className="h-3.5 w-3.5 accent-accent" />
                  {ageLabelVi[a]}
                </label>
              ))}
            </div>
          </fieldset>
          <Area
            label="Màu sắc / phiên bản"
            name="colors"
            defaultValue={colorsText}
            hint="Mỗi dòng: id | Tên | #RRGGBB (vd: pink | Hồng | #f9a8d4). Mỗi màu là một mã kho riêng; đổi id sẽ tạo mã kho mới."
            rows={4}
          />
          <div className="space-y-3">
            <Field
              label="Link video giới thiệu"
              name="videoUrl"
              defaultValue={vi?.video && vi.video.kind !== "file" ? vi.video.url : row?.video_url}
              hint="YouTube hoặc TikTok — được nhúng trên trang sản phẩm. Tệp MP4 tải ở mục Ảnh & video."
            />
            <div className="grid grid-cols-2 gap-3">
              <label className={labelCls}>
                Hình minh hoạ (khi chưa có ảnh)
                <select name="art" defaultValue={vi?.art ?? "buddy"} className={field}>
                  {productArtVariants.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </label>
              <label className={labelCls}>
                Màu nền
                <select name="tint" defaultValue={vi?.tint ?? "yellow"} className={field}>
                  {productTints.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
      </section>

      <section className="kcard p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-bold">Nội dung giới thiệu</h2>
          <div role="tablist" className="flex gap-1 rounded-xl border-2 border-ink p-1 text-xs font-bold">
            {(["vi", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                role="tab"
                aria-selected={tab === l}
                onClick={() => setTab(l)}
                className={`rounded-lg px-3 py-1 ${tab === l ? "bg-ink text-white" : "hover:bg-tint-peach"}`}
              >
                {l === "vi" ? "Tiếng Việt" : "English"}
              </button>
            ))}
          </div>
        </div>
        <div className={`mt-4 ${tab === "vi" ? "" : "hidden"}`}>
          <TranslationFields locale="vi" p={vi} />
        </div>
        <div className={`mt-4 ${tab === "en" ? "" : "hidden"}`}>
          <TranslationFields locale="en" p={en} />
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={pending} className="kbtn kbtn-accent h-11 px-6 text-sm">
          {pending ? "Đang lưu…" : mode === "create" ? "Tạo sản phẩm" : "Lưu thay đổi"}
        </button>
        {result?.ok && <span className="text-sm font-bold text-[#0d6b3a]">Đã lưu. Website cập nhật trong ~1 phút.</span>}
        {result && !result.ok && (
          <span role="alert" className="text-sm font-bold text-accent">
            {result.error}
          </span>
        )}
        {mode === "edit" && row?.source === "admin" && vi && (
          <button
            type="button"
            disabled={deleting}
            onClick={() => {
              if (!confirm(`Xoá sản phẩm "${vi.name}" và toàn bộ ảnh/video của nó?`)) return;
              startDelete(async () => {
                const r = await deleteProductAction(vi.slug);
                if (r && !r.ok) setDeleteError(r.error);
              });
            }}
            className="kbtn kbtn-white ml-auto h-11 px-4 text-xs text-accent"
          >
            {deleting ? "Đang xoá…" : "Xoá sản phẩm"}
          </button>
        )}
        {deleteError && (
          <span role="alert" className="text-sm font-bold text-accent">
            {deleteError}
          </span>
        )}
      </div>
    </form>
  );
}

export function ProductActiveToggle({ slug, active, inDb }: { slug: string; active: boolean; inDb: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        role="switch"
        aria-checked={active}
        disabled={pending}
        title={inDb ? undefined : "Sản phẩm mặc định — bấm sẽ lưu vào cơ sở dữ liệu rồi đổi trạng thái."}
        onClick={() =>
          start(async () => {
            const r = await toggleProductActive(slug, !active);
            setError(r.ok ? null : r.error);
          })
        }
        className={`relative h-6 w-11 rounded-full border-2 border-ink transition ${active ? "bg-[#7bd389]" : "bg-bg-elev"} ${pending ? "opacity-50" : ""}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full border-2 border-ink bg-white transition ${active ? "left-5" : "left-0.5"}`} />
      </button>
      <span className="text-xs font-semibold">{active ? "Đang bán" : "Đã ẩn"}</span>
      {error && (
        <span role="alert" className="text-xs font-bold text-accent">
          {error}
        </span>
      )}
    </div>
  );
}

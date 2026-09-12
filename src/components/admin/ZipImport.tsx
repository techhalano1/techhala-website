"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { ProductColor } from "@/content/types";
import {
  applyImportAction,
  clearMediaAction,
  confirmUpload,
  importImageUrlsAction,
  previewImportAction,
  requestUpload,
  type ImportPreview,
} from "@/app/admin/products/actions";

const IMAGE_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
};
const VIDEO_EXT: Record<string, string> = { mp4: "video/mp4", webm: "video/webm", mov: "video/quicktime" };

type Package = {
  sheet: File | null;
  photos: File[];
  videos: File[];
  ignored: string[];
};

type Step =
  | { kind: "idle" }
  | { kind: "reading" }
  | { kind: "preview"; pkg: Package; preview: ImportPreview }
  | { kind: "running"; pkg: Package; log: string[] }
  | { kind: "done"; slug: string; log: string[]; failed: string[] };

const ext = (name: string) => name.split(".").pop()?.toLowerCase() ?? "";
const base = (path: string) => path.split("/").pop() ?? path;

/** `03-red.jpg` → "red" when it is one of the product's colour ids. */
function colorFor(name: string, colors: ProductColor[]) {
  const stem = base(name).replace(/\.[a-z0-9]+$/i, "");
  const suffix = stem.split(/[-_]/).pop()?.toLowerCase() ?? "";
  return colors.some((c) => c.id === suffix) ? suffix : "";
}

async function unpack(file: File): Promise<Package> {
  const pkg: Package = { sheet: null, photos: [], videos: [], ignored: [] };
  const e = ext(file.name);
  if (e === "xlsx" || e === "csv") {
    pkg.sheet = file;
    return pkg;
  }
  if (e !== "zip") throw new Error("Chọn file .zip (hoặc riêng product.xlsx / product.csv).");
  const { unzip } = await import("fflate");
  const bytes = new Uint8Array(await file.arrayBuffer());
  const entries = await new Promise<Record<string, Uint8Array>>((resolve, reject) =>
    unzip(bytes, { filter: (f) => !f.name.includes("__MACOSX") && !base(f.name).startsWith(".") && f.originalSize <= 110 * 1024 * 1024 }, (err, data) =>
      err ? reject(err) : resolve(data),
    ),
  );
  const sheets: string[] = [];
  for (const [path, data] of Object.entries(entries)) {
    if (path.endsWith("/") || data.length === 0) continue;
    const name = base(path);
    const x = ext(name);
    if (x === "xlsx" || x === "csv") sheets.push(path);
    else if (IMAGE_EXT[x]) pkg.photos.push(new File([data as BlobPart], name, { type: IMAGE_EXT[x] }));
    else if (VIDEO_EXT[x]) pkg.videos.push(new File([data as BlobPart], name, { type: VIDEO_EXT[x] }));
    else pkg.ignored.push(name);
  }
  const preferred = sheets.find((p) => /^(.*\/)?product\.(xlsx|csv)$/i.test(p)) ?? sheets[0];
  if (preferred) pkg.sheet = new File([entries[preferred] as BlobPart], base(preferred));
  const byName = (a: File, b: File) => a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" });
  pkg.photos.sort(byName);
  pkg.videos.sort(byName);
  return pkg;
}

async function uploadOne(slug: string, file: File, color: string): Promise<string | null> {
  const target = await requestUpload(slug, file.name, file.type, file.size);
  if (!target.ok) return target.error;
  const res = await fetch(target.signedUrl, {
    method: "PUT",
    headers: { "content-type": file.type, "cache-control": "max-age=31536000", "x-upsert": "false" },
    body: file,
  });
  if (!res.ok) return `Tải lên thất bại (${res.status}).`;
  const saved = await confirmUpload(slug, target.path, file.type, color);
  return saved.ok ? null : saved.error;
}

export function ZipImport({ slug }: { slug: string | null }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>({ kind: "idle" });
  const [replaceMedia, setReplaceMedia] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setStep({ kind: "idle" });
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setStep({ kind: "reading" });
    try {
      const pkg = await unpack(file);
      if (!pkg.sheet && !slug) throw new Error("ZIP không có product.xlsx / product.csv — cần bảng tính để tạo sản phẩm mới.");
      let preview: ImportPreview;
      if (pkg.sheet) {
        const fd = new FormData();
        fd.set("sheet", pkg.sheet);
        if (slug) fd.set("slug", slug);
        preview = await previewImportAction(fd);
      } else {
        preview = { ok: true, slug: slug!, create: false, changes: [], errors: [], warnings: ["ZIP không có bảng tính — chỉ cập nhật ảnh/video."], unknown: [], imageUrls: [], colors: [], mediaCount: 0 };
      }
      if (!preview.ok) throw new Error(preview.error);
      setStep({ kind: "preview", pkg, preview });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Không đọc được file.");
      setStep({ kind: "idle" });
    }
  };

  const run = async (pkg: Package, preview: Extract<ImportPreview, { ok: true }>) => {
    const log: string[] = [];
    const failed: string[] = [];
    const push = (s: string) => {
      log.push(s);
      setStep({ kind: "running", pkg, log: [...log] });
    };
    setStep({ kind: "running", pkg, log });
    const hasFiles = pkg.photos.length + pkg.videos.length + preview.imageUrls.length > 0;
    const wipe = replaceMedia && hasFiles && !preview.create;

    let targetSlug = preview.slug;
    if (pkg.sheet) {
      const fd = new FormData();
      fd.set("sheet", pkg.sheet);
      if (slug) fd.set("slug", slug);
      if (wipe) fd.set("replaceMedia", "1");
      const r = await applyImportAction(fd);
      if (!r.ok) {
        setError(r.error);
        setStep({ kind: "preview", pkg, preview });
        return;
      }
      targetSlug = r.slug ?? targetSlug;
      push(preview.create ? `Đã tạo sản phẩm ${targetSlug}.` : `Đã cập nhật thông tin (${preview.changes.length} thay đổi).`);
      if (wipe) push(`Đã xoá ${preview.mediaCount} ảnh/video cũ.`);
    } else if (wipe) {
      const r = await clearMediaAction(targetSlug);
      if (!r.ok) {
        setError(r.error);
        setStep({ kind: "preview", pkg, preview });
        return;
      }
      push(`Đã xoá ${preview.mediaCount} ảnh/video cũ.`);
    }

    const files = [...pkg.photos, ...pkg.videos];
    for (const [i, f] of files.entries()) {
      let err: string | null;
      try {
        err = await uploadOne(targetSlug, f, colorFor(f.name, preview.colors));
      } catch (e) {
        err = e instanceof Error ? e.message : "Lỗi mạng.";
      }
      if (err) failed.push(`${f.name}: ${err}`);
      push(`${err ? "✖" : "✔"} ${f.name} (${i + 1}/${files.length})${colorFor(f.name, preview.colors) ? ` · màu ${colorFor(f.name, preview.colors)}` : ""}`);
    }
    if (preview.imageUrls.length) {
      push(`Đang tải ${preview.imageUrls.length} ảnh từ link…`);
      const r = await importImageUrlsAction(targetSlug, preview.imageUrls);
      if (!r.ok) failed.push(r.error);
      else {
        failed.push(...r.failed);
        push(`Ảnh từ link: ${preview.imageUrls.length - r.failed.length}/${preview.imageUrls.length} thành công.`);
      }
    }
    setStep({ kind: "done", slug: targetSlug, log, failed });
    if (slug) router.refresh();
    else router.push(`/admin/products/${targetSlug}?created=1`);
  };

  const templateHref = slug ? `/admin/products/template?slug=${encodeURIComponent(slug)}` : "/admin/products/template";

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border-2 border-dashed border-ink/50 bg-tint-peach/30 p-4">
        <label className="block text-xs font-bold">
          Chọn file .zip (hoặc product.xlsx / .csv)
          <input
            ref={inputRef}
            type="file"
            accept=".zip,.xlsx,.csv,application/zip,application/x-zip-compressed"
            disabled={step.kind === "reading" || step.kind === "running"}
            onChange={(e) => onFile(e.target.files?.[0])}
            className="mt-1 block text-xs file:mr-3 file:rounded-lg file:border-2 file:border-ink file:bg-bg-elev file:px-3 file:py-1.5 file:text-xs file:font-bold"
          />
        </label>
        <a href={templateHref} className="kbtn kbtn-white h-9 px-4 text-xs">
          {slug ? "Tải ZIP mẫu (đã điền sẵn sản phẩm này)" : "Tải ZIP mẫu"}
        </a>
        <p className="basis-full text-[11px] text-muted">
          ZIP gồm <span className="font-mono">product.xlsx</span> (mỗi dòng một trường: field · tiếng Việt · tiếng Anh) và ảnh đặt cạnh (
          <span className="font-mono">01.jpg, 02.jpg, 03-red.jpg</span> — hậu tố = mã màu). Ô trống giữ giá trị cũ, ghi <span className="font-mono">-</span> để
          xoá. Không ghi gì cho tới khi bạn bấm &quot;Nhập&quot;.
        </p>
      </div>

      {error && <div className="rounded-lg border-2 border-accent bg-accent/5 p-3 text-xs font-bold text-accent">{error}</div>}
      {step.kind === "reading" && <p className="text-xs text-muted">Đang đọc file…</p>}

      {step.kind === "preview" && step.preview.ok && (
        <div className="space-y-3 rounded-xl border-2 border-ink bg-bg-elev p-4 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="font-bold">
              {step.preview.create ? "Tạo sản phẩm mới" : "Cập nhật sản phẩm"} <span className="font-mono">{step.preview.slug}</span> · {step.preview.changes.length} thay đổi ·{" "}
              {step.pkg.photos.length} ảnh · {step.pkg.videos.length} video · {step.preview.imageUrls.length} ảnh từ link
            </p>
            <button type="button" onClick={reset} className="text-muted underline">
              Chọn file khác
            </button>
          </div>

          {step.preview.errors.length > 0 && (
            <ul className="list-disc space-y-0.5 pl-4 font-bold text-accent">
              {step.preview.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          )}
          {step.preview.warnings.length > 0 && (
            <ul className="list-disc space-y-0.5 pl-4 text-[#a35a00]">
              {step.preview.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
          {step.preview.unknown.length > 0 && <p className="text-muted">Bỏ qua dòng không nhận ra: {step.preview.unknown.join(", ")}</p>}
          {step.pkg.ignored.length > 0 && <p className="text-muted">Bỏ qua tệp không hỗ trợ: {step.pkg.ignored.join(", ")}</p>}

          {step.preview.changes.length > 0 && (
            <div className="max-h-80 overflow-auto rounded-lg border border-ink/20">
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-bg-elev">
                  <tr className="border-b border-ink/20">
                    <th className="px-2 py-1">Trường</th>
                    <th className="px-2 py-1">Hiện tại</th>
                    <th className="px-2 py-1">Mới</th>
                  </tr>
                </thead>
                <tbody>
                  {step.preview.changes.map((c) => (
                    <tr key={c.key} className="border-b border-ink/10 align-top">
                      <td className="whitespace-nowrap px-2 py-1 font-bold">{c.label}</td>
                      <td className="max-w-xs break-words px-2 py-1 text-muted">{c.from || <span className="italic">(trống)</span>}</td>
                      <td className="max-w-xs break-words px-2 py-1">{c.to || <span className="italic">(xoá)</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(step.pkg.photos.length > 0 || step.pkg.videos.length > 0) && (
            <p className="text-muted">
              Tệp sẽ tải lên (theo thứ tự):{" "}
              {[...step.pkg.photos, ...step.pkg.videos].map((f) => {
                const c = colorFor(f.name, step.preview.ok ? step.preview.colors : []);
                return (
                  <span key={f.name} className="mr-2 inline-block font-mono">
                    {f.name}
                    {c ? ` (${c})` : ""}
                  </span>
                );
              })}
            </p>
          )}

          {!step.preview.create && step.pkg.photos.length + step.pkg.videos.length + step.preview.imageUrls.length > 0 && (
            <label className="flex items-center gap-2 font-bold">
              <input type="checkbox" checked={replaceMedia} onChange={(e) => setReplaceMedia(e.target.checked)} />
              Xoá {step.preview.mediaCount} ảnh/video hiện có, thay bằng ảnh trong ZIP
            </label>
          )}

          <div className="flex gap-2">
            <button
              type="button"
              disabled={step.preview.errors.length > 0}
              onClick={() => step.preview.ok && run(step.pkg, step.preview)}
              className="kbtn kbtn-accent h-9 px-5 text-xs"
            >
              Nhập
            </button>
            <button type="button" onClick={reset} className="kbtn kbtn-white h-9 px-4 text-xs">
              Huỷ
            </button>
          </div>
        </div>
      )}

      {(step.kind === "running" || step.kind === "done") && (
        <div className="space-y-2 rounded-xl border-2 border-ink bg-bg-elev p-4 text-xs">
          <p className="font-bold">{step.kind === "running" ? "Đang nhập…" : step.failed.length ? `Xong, ${step.failed.length} lỗi` : "Nhập xong"}</p>
          <ul className="space-y-0.5 font-mono">
            {step.log.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ul>
          {step.kind === "done" && step.failed.length > 0 && (
            <ul className="list-disc space-y-0.5 pl-4 font-bold text-accent">
              {step.failed.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          )}
          {step.kind === "done" && (
            <button type="button" onClick={reset} className="kbtn kbtn-white h-9 px-4 text-xs">
              Nhập file khác
            </button>
          )}
        </div>
      )}
    </div>
  );
}

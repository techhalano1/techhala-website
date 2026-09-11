"use client";

import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";
import type { ProductColor } from "@/content/types";
import type { ProductMediaRow } from "@/lib/db";
import {
  confirmUpload,
  removeMediaAction,
  reorderMediaAction,
  requestUpload,
  updateMediaAction,
} from "@/app/admin/products/actions";

const field = "rounded-lg border-2 border-ink bg-bg-elev px-2 py-1 text-xs outline-none focus:shadow-hard-accent";

type UploadState = { name: string; status: "uploading" | "done" | "error"; error?: string };

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

export function MediaManager({ slug, media, colors }: { slug: string; media: ProductMediaRow[]; colors: ProductColor[] }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<UploadState[]>([]);
  const [uploadColor, setUploadColor] = useState("");
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const run = (fn: () => Promise<{ ok: true } | { ok: false; error: string }>) =>
    start(async () => {
      const r = await fn();
      setError(r.ok ? null : r.error);
      if (r.ok) router.refresh();
    });

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const list = Array.from(files);
    setUploads(list.map((f) => ({ name: f.name, status: "uploading" })));
    for (let i = 0; i < list.length; i++) {
      let err: string | null;
      try {
        err = await uploadOne(slug, list[i], uploadColor);
      } catch (e) {
        err = e instanceof Error ? e.message : "Lỗi mạng.";
      }
      setUploads((u) => u.map((x, j) => (j === i ? { ...x, status: err ? "error" : "done", error: err ?? undefined } : x)));
    }
    if (inputRef.current) inputRef.current.value = "";
    router.refresh();
  };

  const move = (index: number, dir: -1 | 1) => {
    const ids = media.map((m) => m.id);
    const j = index + dir;
    if (j < 0 || j >= ids.length) return;
    [ids[index], ids[j]] = [ids[j], ids[index]];
    run(() => reorderMediaAction(slug, ids));
  };

  const colorName = (id: string | null) => colors.find((c) => c.id === id)?.name ?? id;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-xl border-2 border-dashed border-ink/50 bg-tint-peach/30 p-4">
        <label className="block text-xs font-bold">
          Chọn ảnh / video
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/gif,image/avif,video/mp4,video/webm,video/quicktime"
            onChange={(e) => onFiles(e.target.files)}
            className="mt-1 block text-xs file:mr-3 file:rounded-lg file:border-2 file:border-ink file:bg-bg-elev file:px-3 file:py-1.5 file:text-xs file:font-bold"
          />
        </label>
        {colors.length > 0 && (
          <label className="block text-xs font-bold">
            Gán cho màu
            <select value={uploadColor} onChange={(e) => setUploadColor(e.target.value)} className={`${field} mt-1 block`}>
              <option value="">Tất cả màu</option>
              {colors.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
        )}
        <p className="text-[11px] text-muted">Ảnh ≤ 10 MB (JPG/PNG/WebP), video ≤ 100 MB (MP4). Có thể chọn nhiều tệp.</p>
      </div>

      {uploads.length > 0 && (
        <ul className="space-y-1 text-xs">
          {uploads.map((u, i) => (
            <li key={i} className="flex items-center gap-2">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  u.status === "done" ? "bg-[#0d6b3a]" : u.status === "error" ? "bg-accent" : "animate-pulse bg-[#a35a00]"
                }`}
              />
              <span className="truncate">{u.name}</span>
              <span className="text-muted">
                {u.status === "uploading" ? "đang tải…" : u.status === "done" ? "xong" : u.error}
              </span>
            </li>
          ))}
        </ul>
      )}

      {error && (
        <p role="alert" className="text-xs font-bold text-accent">
          {error}
        </p>
      )}

      {media.length === 0 ? (
        <p className="text-sm text-muted">Chưa có ảnh/video — website đang dùng hình minh hoạ SVG.</p>
      ) : (
        <ul className={`grid gap-3 sm:grid-cols-2 lg:grid-cols-3 ${pending ? "opacity-60" : ""}`}>
          {media.map((m, i) => (
            <li key={m.id} className="kcard overflow-hidden">
              <div className="relative aspect-[4/3] bg-tint-peach/40">
                {m.kind === "image" ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt={m.alt ?? ""} className="h-full w-full object-cover" />
                ) : m.storage_path ? (
                  <video src={m.url} controls preload="metadata" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center p-3 text-center text-xs">
                    <span className="break-all">{m.url}</span>
                  </div>
                )}
                {i === 0 && m.kind === "image" && (
                  <span className="absolute left-2 top-2 rounded-md bg-ink px-1.5 py-0.5 text-[10px] font-bold uppercase text-white">Ảnh đại diện</span>
                )}
                <span className="absolute right-2 top-2 rounded-md bg-white/90 px-1.5 py-0.5 text-[10px] font-bold uppercase">
                  {m.kind === "image" ? "Ảnh" : "Video"}
                </span>
              </div>
              <div className="space-y-2 p-3">
                <div className="flex gap-2">
                  {colors.length > 0 && m.kind === "image" && (
                    <select
                      aria-label="Gán cho màu"
                      defaultValue={m.color ?? ""}
                      onChange={(e) => run(() => updateMediaAction(m.id, { color: e.target.value, alt: m.alt ?? "" }))}
                      className={`${field} flex-1`}
                    >
                      <option value="">Tất cả màu</option>
                      {colors.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  )}
                  {m.color && !colors.some((c) => c.id === m.color) && (
                    <span className="text-[11px] text-accent">Màu &ldquo;{colorName(m.color)}&rdquo; không còn tồn tại</span>
                  )}
                </div>
                <input
                  aria-label="Mô tả ảnh (alt)"
                  placeholder="Mô tả ảnh (SEO)…"
                  defaultValue={m.alt ?? ""}
                  onBlur={(e) => {
                    if (e.target.value !== (m.alt ?? "")) run(() => updateMediaAction(m.id, { color: m.color ?? "", alt: e.target.value }));
                  }}
                  className={`${field} w-full`}
                />
                <div className="flex items-center gap-1">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0 || pending} className="kbtn kbtn-white h-7 px-2 text-xs" aria-label="Lên">
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === media.length - 1 || pending}
                    className="kbtn kbtn-white h-7 px-2 text-xs"
                    aria-label="Xuống"
                  >
                    →
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => {
                      if (confirm("Xoá tệp này?")) run(() => removeMediaAction(m.id));
                    }}
                    className="kbtn kbtn-white ml-auto h-7 px-2 text-xs text-accent"
                  >
                    Xoá
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

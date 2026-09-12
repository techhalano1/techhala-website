"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ProductImage } from "@/content";

type Props = {
  images: ProductImage[];
  index: number;
  title: string;
  labels: { close: string; prev: string; next: string };
  onClose: () => void;
};

export function Lightbox({ images, index, title, labels, onClose }: Props) {
  const [i, setI] = useState(index);
  const touchX = useRef<number | null>(null);
  const n = images.length;
  const prev = useCallback(() => setI((v) => (v - 1 + n) % n), [n]);
  const next = useCallback(() => setI((v) => (v + 1) % n), [n]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose, prev, next]);

  const img = images[i];
  if (!img) return null;

  return (
    <div
      role="dialog"
      aria-modal
      aria-label={title}
      className="fixed inset-0 z-[60] flex flex-col bg-ink/95 text-white"
      onClick={onClose}
      onTouchStart={(e) => (touchX.current = e.touches[0]?.clientX ?? null)}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        touchX.current = null;
        if (start === null || end === undefined) return;
        if (end - start > 40) prev();
        else if (start - end > 40) next();
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 text-sm font-bold">
        <span className="font-mono">
          {i + 1} / {n}
        </span>
        <button type="button" onClick={onClose} aria-label={labels.close} className="rounded-full p-2 hover:bg-white/10">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
      <div className="relative flex-1" onClick={(e) => e.stopPropagation()}>
        <Image key={img.id} src={img.url} alt={img.alt || title} fill sizes="100vw" className="object-contain" priority />
        {n > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label={labels.prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border-2 border-white/40 bg-ink/60 p-3 hover:bg-ink"
            >
              <Chevron dir="left" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={labels.next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border-2 border-white/40 bg-ink/60 p-3 hover:bg-ink"
            >
              <Chevron dir="right" />
            </button>
          </>
        )}
      </div>
      {n > 1 && (
        <ul className="flex justify-center gap-2 overflow-x-auto px-4 py-3" onClick={(e) => e.stopPropagation()}>
          {images.map((im, k) => (
            <li key={im.id} className="shrink-0">
              <button
                type="button"
                onClick={() => setI(k)}
                aria-label={`${k + 1} / ${n}`}
                aria-current={k === i}
                className={`relative block h-14 w-14 overflow-hidden rounded-lg border-2 ${k === i ? "border-white" : "border-white/30 opacity-70 hover:opacity-100"}`}
              >
                <Image src={im.url} alt="" fill sizes="56px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={dir === "left" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"} />
    </svg>
  );
}

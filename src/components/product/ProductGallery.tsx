"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import type { Product, ProductImage } from "@/content";
import { ProductArt } from "@/components/ProductArt";
import { ProductVideo } from "@/components/ProductVideo";
import { Lightbox } from "@/components/product/Lightbox";

type Item = { key: string; image?: ProductImage; video?: Product["video"] };

type Props = {
  product: Product;
  shellHex?: string;
  /** Image the user picked (thumbnail click / colour change); the gallery scrolls to it. */
  activeId?: number;
  onActiveChange: (id: number) => void;
  labels: { gallery: string; zoom: string; video: string; close: string; prev: string; next: string };
  overlay?: ReactNode;
};

const VIDEO_AFTER = 2;

export function ProductGallery({ product: p, shellHex, activeId, onActiveChange, labels, overlay }: Props) {
  const images = p.images ?? [];
  const items: Item[] = images.map((image) => ({ key: `img-${image.id}`, image }));
  if (p.video) items.splice(Math.min(VIDEO_AFTER, items.length), 0, { key: "video", video: p.video });

  const [lightbox, setLightbox] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const scrollingTo = useRef<number | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track || images.length < 2) return;
    const nodes = Array.from(track.querySelectorAll<HTMLElement>("[data-image-id]"));
    const io = new IntersectionObserver(
      (entries) => {
        const best = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!best) return;
        const id = Number((best.target as HTMLElement).dataset.imageId);
        if (scrollingTo.current !== null && scrollingTo.current !== id) return;
        scrollingTo.current = null;
        onActiveChange(id);
      },
      { threshold: [0.55] },
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, [images.length, onActiveChange]);

  const scrollTo = (id: number) => {
    const el = trackRef.current?.querySelector<HTMLElement>(`[data-image-id="${id}"]`);
    if (!el) return;
    scrollingTo.current = id;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    if (desktop) {
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: "smooth" });
    } else {
      el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  };

  const lastActive = useRef(activeId);
  useEffect(() => {
    if (activeId === undefined || activeId === lastActive.current) return;
    lastActive.current = activeId;
    scrollTo(activeId);
  }, [activeId]);

  if (images.length === 0) {
    return (
      <div className="space-y-4">
        <div className="kcard relative overflow-hidden">
          <div className="relative aspect-[4/3]">
            <ProductArt variant={p.art} tint={p.tint} shell={shellHex} title={p.name} />
          </div>
          {overlay}
        </div>
        {p.video && (
          <div className="kcard overflow-hidden">
            <ProductVideo video={p.video} title={p.name} />
          </div>
        )}
      </div>
    );
  }

  const activeIndex = Math.max(
    0,
    images.findIndex((i) => i.id === activeId),
  );

  return (
    <div className="lg:flex lg:gap-4">
      {images.length > 1 && (
        <ul className="hidden w-[64px] shrink-0 flex-col gap-2 self-start lg:sticky lg:top-24 lg:flex" aria-label={labels.gallery}>
          {images.map((img, k) => (
            <li key={img.id}>
              <button
                type="button"
                onClick={() => {
                  onActiveChange(img.id);
                  scrollTo(img.id);
                }}
                aria-label={`${k + 1} / ${images.length}`}
                aria-current={img.id === activeId}
                className={`relative block aspect-square w-full overflow-hidden rounded-xl border-2 transition ${
                  img.id === activeId ? "border-accent shadow-hard-accent" : "border-ink opacity-75 hover:opacity-100"
                }`}
              >
                <Image src={img.url} alt="" fill sizes="64px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="relative min-w-0 flex-1">
        <div
          ref={trackRef}
          className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:gap-4 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden"
        >
          {items.map((it, k) =>
            it.image ? (
              <button
                key={it.key}
                type="button"
                data-image-id={it.image.id}
                onClick={() => setLightbox(images.indexOf(it.image!))}
                aria-label={labels.zoom}
                className="kcard group relative block w-[88%] shrink-0 snap-center overflow-hidden text-left sm:w-[80%] lg:w-full"
              >
                <div className="relative aspect-square bg-bg-elev">
                  <Image
                    src={it.image.url}
                    alt={it.image.alt || p.name}
                    fill
                    priority={k === 0}
                    sizes="(min-width: 1024px) 424px, 88vw"
                    className="object-contain"
                  />
                </div>
                <span className="pointer-events-none absolute bottom-3 right-3 rounded-lg border-2 border-ink bg-bg-elev/90 px-2 py-1 text-xs font-bold opacity-0 transition group-hover:opacity-100">
                  {labels.zoom}
                </span>
              </button>
            ) : (
              <div key={it.key} className="kcard w-[88%] shrink-0 snap-center overflow-hidden sm:w-[80%] lg:w-full">
                <ProductVideo video={it.video!} title={p.name} />
              </div>
            ),
          )}
        </div>
        {overlay}

        {images.length > 1 && (
          <div className="mt-3 flex items-center justify-center gap-1.5 lg:hidden" aria-hidden>
            {images.map((img, k) => (
              <span key={img.id} className={`h-2 rounded-full transition-all ${k === activeIndex ? "w-5 bg-accent" : "w-2 bg-ink/25"}`} />
            ))}
          </div>
        )}
      </div>

      {lightbox !== null && (
        <Lightbox
          images={images}
          index={lightbox}
          title={p.name}
          labels={{ close: labels.close, prev: labels.prev, next: labels.next }}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
}

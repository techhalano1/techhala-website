import type { ProductVideo } from "@/content/types";

const YT_RE = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/i;
const TIKTOK_RE = /tiktok\.com\/.*\/video\/(\d+)/i;
const FILE_RE = /\.(mp4|webm|mov|m4v)(\?.*)?$/i;

/** Classify a pasted link or uploaded file URL so the storefront knows how to render it. */
export function classifyVideo(url: string): ProductVideo {
  const u = url.trim();
  if (YT_RE.test(u)) return { url: u, kind: "youtube" };
  if (TIKTOK_RE.test(u)) return { url: u, kind: "tiktok" };
  if (FILE_RE.test(u)) return { url: u, kind: "file" };
  return { url: u, kind: "link" };
}

/** iframe src for embeddable providers; null for files / plain links. */
export function embedUrl(video: ProductVideo): string | null {
  if (video.kind === "youtube") {
    const id = YT_RE.exec(video.url)?.[1];
    return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0` : null;
  }
  if (video.kind === "tiktok") {
    const id = TIKTOK_RE.exec(video.url)?.[1];
    return id ? `https://www.tiktok.com/embed/v2/${id}` : null;
  }
  return null;
}

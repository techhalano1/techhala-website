import type { ProductVideo as Video } from "@/content";
import { embedUrl } from "@/lib/video";

export function ProductVideo({ video, title, poster }: { video: Video; title: string; poster?: string }) {
  const src = embedUrl(video);
  if (src) {
    return (
      <div className={video.kind === "tiktok" ? "mx-auto aspect-[9/16] max-h-[640px]" : "aspect-video"}>
        <iframe
          src={src}
          title={title}
          className="h-full w-full"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }
  if (video.kind === "file") {
    return (
      <video controls playsInline preload="metadata" poster={poster} className="aspect-video w-full bg-ink">
        <source src={video.url} />
      </video>
    );
  }
  return (
    <a href={video.url} target="_blank" rel="noreferrer" className="block p-5 font-semibold text-accent hover:underline">
      {video.url}
    </a>
  );
}

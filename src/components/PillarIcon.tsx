import type { PillarSlug } from "@/content";

const paths: Record<PillarSlug, string> = {
  "ai-sdlc": "M8 6l-5 6 5 6M16 6l5 6-5 6M14 4l-4 16",
  aiops: "M3 12h4l3-8 4 16 3-8h4",
  "ai-robot": "M12 2v3M8 5h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3zM9 11h.01M15 11h.01M9 15h6",
  "ai-solutions": "M12 3l2.5 5.5L20 11l-5.5 2.5L12 19l-2.5-5.5L4 11l5.5-2.5zM19 3v3M19 18v3M3 19h3",
};

export function PillarIcon({ slug, className = "" }: { slug: PillarSlug; className?: string }) {
  return (
    <span
      className={`inline-flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-bg text-accent ${className}`}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d={paths[slug]} />
      </svg>
    </span>
  );
}

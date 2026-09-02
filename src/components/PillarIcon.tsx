import type { PillarSlug } from "@/content";

const paths: Record<PillarSlug, string> = {
  "ai-robot": "M12 2v3M8 5h8a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3zM9 11h.01M15 11h.01M9 15h6",
  "ai-sdlc": "M8 6l-5 6 5 6M16 6l5 6-5 6M14 4l-4 16",
  "ai-enterprise": "M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4M9 10h.01M15 10h.01M9 14h.01M15 14h.01",
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

import Link from "next/link";
import type { ReactNode } from "react";

export function Container({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 ${className}`}>{children}</div>;
}

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-20 sm:py-28 ${className}`}>
      <Container>{children}</Container>
    </section>
  );
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-accent">{children}</p>
  );
}

export function Heading({
  children,
  as: Tag = "h2",
  className = "",
}: {
  children: ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const size =
    Tag === "h1"
      ? "text-4xl sm:text-6xl"
      : Tag === "h2"
        ? "text-3xl sm:text-4xl"
        : "text-xl sm:text-2xl";
  return (
    <Tag className={`font-semibold tracking-tight text-balance ${size} ${className}`}>{children}</Tag>
  );
}

export function Lead({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`mt-4 max-w-2xl text-lg text-muted ${className}`}>{children}</p>;
}

export function Button({
  href,
  children,
  variant = "primary",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
}) {
  const base =
    "inline-flex h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-medium transition";
  const styles = {
    primary: "bg-fg text-bg hover:opacity-90",
    secondary: "border border-border bg-bg-elev hover:border-fg/40",
    ghost: "text-accent hover:underline px-0",
  }[variant];
  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-border bg-bg-elev p-6 transition hover:border-fg/30 ${className}`}
    >
      {children}
    </div>
  );
}

export function Arrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Check() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      className="mt-0.5 shrink-0 text-accent"
      aria-hidden="true"
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

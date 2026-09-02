"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, swapLocale, type Locale } from "@/lib/i18n";

export function LangSwitch({ current, label }: { current: Locale; label: string }) {
  const pathname = usePathname();
  return (
    <div
      role="group"
      aria-label={label}
      className="inline-flex h-9 items-center rounded-md border border-border p-0.5 text-xs font-medium"
    >
      {locales.map((l) => (
        <Link
          key={l}
          href={swapLocale(pathname, l)}
          hrefLang={l}
          aria-current={l === current ? "true" : undefined}
          className={`rounded px-2.5 py-1 uppercase transition ${
            l === current ? "bg-fg text-bg" : "text-muted hover:text-fg"
          }`}
        >
          {l}
        </Link>
      ))}
    </div>
  );
}

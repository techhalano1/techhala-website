"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { locales, swapLocale, type Locale } from "@/lib/i18n";

type Props = { current: Locale; label: string };

function Switch({ current, label, suffix }: Props & { suffix: string }) {
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
          href={`${swapLocale(pathname, l)}${suffix}`}
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

function QuerySwitch(props: Props) {
  const query = useSearchParams().toString();
  return <Switch {...props} suffix={query ? `?${query}` : ""} />;
}

export function LangSwitch(props: Props) {
  return (
    <Suspense fallback={<Switch {...props} suffix="" />}>
      <QuerySwitch {...props} />
    </Suspense>
  );
}

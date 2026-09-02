"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { localePath, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { LangSwitch } from "./LangSwitch";

export function Nav({ locale, t }: { locale: Locale; t: Dictionary }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: localePath(locale, "/solutions"), label: t.nav.solutions },
    { href: localePath(locale, "/products/hal-sdlc"), label: t.nav.product },
    { href: localePath(locale, "/work"), label: t.nav.work },
    { href: localePath(locale, "/about"), label: t.nav.about },
    { href: localePath(locale, "/contact"), label: t.nav.contact },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-bg/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link href={localePath(locale)} className="text-lg" onClick={() => setOpen(false)}>
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-md px-3 py-2 text-sm transition hover:text-fg ${
                isActive(l.href) ? "text-fg" : "text-muted"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LangSwitch current={locale} label={t.common.language} />
          <ThemeToggle label={t.common.theme} />
          <Link
            href={localePath(locale, "/contact")}
            className="ml-1 inline-flex h-9 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg transition hover:opacity-90"
          >
            {t.nav.bookDemo}
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border md:hidden"
          aria-expanded={open}
          aria-label={open ? t.nav.close : t.nav.menu}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-bg md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col px-4 py-3" aria-label="Mobile">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-base text-fg"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t border-border pt-3">
              <LangSwitch current={locale} label={t.common.language} />
              <ThemeToggle label={t.common.theme} />
              <Link
                href={localePath(locale, "/contact")}
                onClick={() => setOpen(false)}
                className="ml-auto inline-flex h-9 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg"
              >
                {t.nav.bookDemo}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

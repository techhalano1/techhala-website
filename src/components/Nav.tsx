"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { localePath, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { LangSwitch } from "./LangSwitch";
import { CartButton } from "./cart/CartButton";

export function Nav({ locale, t }: { locale: Locale; t: Dictionary }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { href: localePath(locale, "/products"), label: t.nav.products },
    { href: localePath(locale, "/solutions"), label: t.nav.solutions },
    { href: localePath(locale, "/work"), label: t.nav.work },
    { href: localePath(locale, "/about"), label: t.nav.about },
    { href: localePath(locale, "/contact"), label: t.nav.contact },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-bg/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link
          href={localePath(locale)}
          className="text-lg"
          onClick={() => setOpen(false)}
        >
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`rounded-lg px-3 py-2 text-sm font-semibold transition hover:text-fg ${
                isActive(l.href) ? "bg-ink text-bg" : "text-muted"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LangSwitch current={locale} label={t.common.language} />
          <ThemeToggle label={t.common.theme} />
          <CartButton label={t.shop.cart.open} className="ml-1" />
          <Link
            href={localePath(locale, "/products")}
            className="kbtn kbtn-accent ml-1 h-10 px-4 text-sm"
          >
            {t.nav.shopNow}
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <CartButton label={t.shop.cart.open} />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-ink bg-bg-elev"
            aria-expanded={open}
            aria-label={open ? t.nav.close : t.nav.menu}
            onClick={() => setOpen((v) => !v)}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t-2 border-ink bg-bg md:hidden">
          <nav
            className="mx-auto flex max-w-7xl flex-col px-4 py-3"
            aria-label="Mobile"
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-2 py-3 text-base font-semibold text-fg"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2 border-t-2 border-ink pt-3">
              <LangSwitch current={locale} label={t.common.language} />
              <ThemeToggle label={t.common.theme} />
              <Link
                href={localePath(locale, "/products")}
                onClick={() => setOpen(false)}
                className="kbtn kbtn-accent ml-auto h-10 px-4 text-sm"
              >
                {t.nav.shopNow}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}

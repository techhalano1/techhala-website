"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { Dictionary, Product } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import { formatVnd } from "@/lib/site";
import { ProductArt } from "@/components/ProductArt";
import { lineKey, useCart, type CartLine } from "@/components/cart/CartProvider";

export type ResolvedLine = CartLine & { key: string; product: Product; colorName?: string };

export function resolveLines(lines: CartLine[], products: Product[]): ResolvedLine[] {
  const out: ResolvedLine[] = [];
  for (const line of lines) {
    const product = products.find((p) => p.slug === line.slug);
    if (!product) continue;
    const colorName = line.color ? product.colors?.find((c) => c.id === line.color)?.name : undefined;
    out.push({ ...line, key: lineKey(line), product, colorName });
  }
  return out;
}

export function QtyStepper({
  qty,
  onChange,
  label,
  size = "md",
}: {
  qty: number;
  onChange: (qty: number) => void;
  label: string;
  size?: "sm" | "md";
}) {
  const h = size === "sm" ? "h-8" : "h-10";
  const w = size === "sm" ? "w-8" : "w-10";
  return (
    <div className={`inline-flex ${h} items-stretch overflow-hidden rounded-xl border-2 border-ink bg-bg-elev`} role="group" aria-label={label}>
      <button
        type="button"
        onClick={() => onChange(qty - 1)}
        className={`${w} font-bold transition hover:bg-bg disabled:opacity-40`}
        aria-label="−"
      >
        −
      </button>
      <span className={`flex ${w} items-center justify-center border-x-2 border-ink font-mono text-sm font-bold tabular-nums`}>{qty}</span>
      <button
        type="button"
        onClick={() => onChange(qty + 1)}
        className={`${w} font-bold transition hover:bg-bg disabled:opacity-40`}
        disabled={qty >= 10}
        aria-label="+"
      >
        +
      </button>
    </div>
  );
}

export function CartDrawer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const { lines, open, setOpen, setQty, remove, count } = useCart();
  const resolved = resolveLines(lines, t.products.items);
  const subtotal = resolved.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const c = t.shop.cart;

  const panelRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();

    const focusable = () =>
      Array.from(
        panelRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      );
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const items = focusable();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (!panelRef.current?.contains(active)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      previouslyFocused?.focus();
    };
  }, [open, setOpen]);

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <button
        type="button"
        aria-label={c.close}
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-ink/40 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        tabIndex={open ? 0 : -1}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={c.title}
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l-2 border-ink bg-bg shadow-2xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        <header className="flex items-center justify-between border-b-2 border-ink px-5 py-4">
          <h2 className="text-lg font-extrabold">
            {c.title}{" "}
            <span className="ml-1 rounded-full bg-accent px-2 py-0.5 font-mono text-xs text-white">{count}</span>
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink transition hover:bg-bg-elev"
            aria-label={c.close}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {resolved.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="h-24 w-32 opacity-70">
              <ProductArt variant="bag" title="" plain />
            </div>
            <p className="text-muted">{c.empty}</p>
            <Link href={localePath(locale, "/products")} onClick={() => setOpen(false)} className="kbtn kbtn-ink h-11 px-5 text-sm">
              {c.emptyCta}
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-3 overflow-y-auto p-4">
              {resolved.map((l) => (
                <li key={l.key} className="flex gap-3 rounded-2xl border-2 border-ink bg-bg-elev p-3">
                  <Link
                    href={localePath(locale, `/products/${l.product.slug}`)}
                    onClick={() => setOpen(false)}
                    className="h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 border-ink"
                  >
                    <ProductArt variant={l.product.art} tint={l.product.tint} title={l.product.name} />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={localePath(locale, `/products/${l.product.slug}`)}
                          onClick={() => setOpen(false)}
                          className="line-clamp-2 text-sm font-bold leading-snug hover:text-accent"
                        >
                          {l.product.name}
                        </Link>
                        {l.colorName && <p className="text-xs text-muted">{l.colorName}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(l.key)}
                        className="shrink-0 text-xs font-semibold text-muted underline-offset-2 hover:text-accent hover:underline"
                      >
                        {c.remove}
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <QtyStepper qty={l.qty} onChange={(q) => setQty(l.key, q)} label={c.quantity} size="sm" />
                      <span className="font-mono text-sm font-bold tabular-nums text-accent">{formatVnd(l.product.price * l.qty, locale)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
            <footer className="border-t-2 border-ink bg-bg-elev p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">{c.subtotal}</span>
                <span className="font-mono text-xl font-extrabold tabular-nums">{formatVnd(subtotal, locale)}</span>
              </div>
              <p className="mt-1 text-xs text-muted">{c.shippingFree}</p>
              <div className="mt-4 grid gap-2">
                <Link href={localePath(locale, "/checkout")} onClick={() => setOpen(false)} className="kbtn kbtn-accent h-12 text-base">
                  {c.checkout} →
                </Link>
                <button type="button" onClick={() => setOpen(false)} className="kbtn kbtn-white h-11 text-sm">
                  {c.continueShopping}
                </button>
              </div>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}

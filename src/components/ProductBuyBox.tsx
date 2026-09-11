"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Dictionary, Product } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import { company } from "@/lib/site";
import { ProductArt } from "@/components/ProductArt";
import { ComparePrice, Price, Stars, discountPercent, formatSold } from "@/components/ProductCard";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { QtyStepper } from "@/components/cart/CartDrawer";
import { useCart } from "@/components/cart/CartProvider";
import { useRouter } from "next/navigation";

type Props = {
  product: Product;
  locale: Locale;
  t: Dictionary;
  /** Available units per colour id ("" for colourless products); null = stock unknown / not enforced. */
  availability?: Record<string, number> | null;
};

const LOW_STOCK_AT = 5;

export function ProductBuyBox({ product: p, locale, t, availability = null }: Props) {
  const L = t.shop.labels;
  const availableFor = (c: string | undefined) => (availability ? (availability[c ?? ""] ?? 0) : null);
  const firstInStock = p.colors?.find((c) => (availableFor(c.id) ?? 1) > 0)?.id ?? p.colors?.[0]?.id;
  const [color, setColor] = useState(firstInStock);
  const [qty, setQty] = useState(1);
  const { add } = useCart();
  const router = useRouter();
  const pct = discountPercent(p);
  const selectedColor = p.colors?.find((c) => c.id === color);
  const available = availableFor(color);
  const soldOut = available !== null && available <= 0;
  const stockLabel = soldOut
    ? L.outOfStock
    : available !== null && available <= LOW_STOCK_AT
      ? L.lowStock.replace("{n}", String(available))
      : L.inStock;
  const ageText = p.ageLabel ?? (p.ages[0] ? t.shop.ages[p.ages[0]].name : undefined);
  const images = p.images ?? [];
  const [activeImage, setActiveImage] = useState<number | undefined>(images[0]?.id);
  const shown = images.find((i) => i.id === activeImage) ?? images[0];

  useEffect(() => {
    document.body.classList.add("has-buybar");
    return () => document.body.classList.remove("has-buybar");
  }, []);

  const pickColor = (id: string) => {
    setColor(id);
    const match = images.find((i) => i.color === id);
    if (match) setActiveImage(match.id);
  };

  const buyNow = () => {
    if (soldOut) return;
    add({ slug: p.slug, color, qty }, false);
    router.push(localePath(locale, "/checkout"));
  };

  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative">
          <div className="kcard overflow-hidden">
            <div className="relative aspect-[4/3]">
              {shown ? (
                <Image
                  key={shown.id}
                  src={shown.url}
                  alt={shown.alt || p.name}
                  fill
                  priority
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <ProductArt variant={p.art} tint={p.tint} shell={selectedColor?.hex} title={p.name} />
              )}
            </div>
          </div>
          {images.length > 1 && (
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1" aria-label={L.gallery}>
              {images.map((img) => (
                <li key={img.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setActiveImage(img.id)}
                    aria-label={img.alt || p.name}
                    aria-pressed={img.id === shown?.id}
                    className={`relative block h-16 w-20 overflow-hidden rounded-xl border-2 transition ${
                      img.id === shown?.id ? "border-accent shadow-hard-accent" : "border-ink opacity-80 hover:opacity-100"
                    }`}
                  >
                    <Image src={img.url} alt="" fill sizes="80px" className="object-cover" />
                  </button>
                </li>
              ))}
            </ul>
          )}
          <div className="absolute left-4 top-4 flex flex-col items-start gap-2">
            {pct > 0 && <span className="rounded-lg border-2 border-ink bg-accent px-2.5 py-1 font-mono text-xs font-bold text-white">−{pct}%</span>}
            {p.badge && <span className="rounded-lg border-2 border-ink bg-bg-elev px-2.5 py-1 text-xs font-bold">{p.badge}</span>}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {t.shop.guarantees.map((g) => (
              <div key={g.title} className="rounded-xl border-2 border-ink bg-bg-elev p-3 text-center">
                <p className="text-xs font-bold leading-tight">{g.title}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted">
            <span>{t.shop.categories[p.category].name}</span>
            {ageText && (
              <>
                <span aria-hidden>·</span>
                <span className="rounded-md bg-tint-yellow px-1.5 py-0.5 normal-case tracking-normal text-fg">{ageText}</span>
              </>
            )}
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-balance sm:text-5xl">{p.name}</h1>
          <p className="mt-3 text-lg text-muted">{p.tagline}</p>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <Stars rating={p.rating} className="[&>svg]:h-4 [&>svg]:w-4" />
            <span className="font-bold">{p.rating.toFixed(1)}</span>
            <span className="text-muted">
              · {formatSold(p.sold, locale)} {L.sold}
            </span>
            <span
              className={`rounded-md px-1.5 py-0.5 text-xs font-bold ${
                soldOut ? "bg-tint-pink text-accent" : available !== null && available <= LOW_STOCK_AT ? "bg-tint-yellow" : "bg-tint-green text-[#0d6b3a]"
              }`}
            >
              {stockLabel}
            </span>
          </div>

          <div className="mt-6 rounded-2xl border-2 border-ink bg-bg-elev p-5">
            <div className="flex flex-wrap items-baseline gap-3">
              <Price amount={p.price} locale={locale} className="text-4xl" />
              {p.compareAtPrice && (
                <>
                  <ComparePrice amount={p.compareAtPrice} locale={locale} className="text-base" />
                  <span className="rounded-md border-2 border-ink bg-tint-pink px-2 py-0.5 text-xs font-bold">
                    {L.save} {pct}%
                  </span>
                </>
              )}
            </div>
            <p className="mt-1 text-xs text-muted">{L.priceNote}</p>

            {p.colors && p.colors.length > 0 && (
              <div className="mt-5">
                <p className="text-sm font-bold">
                  {L.color}: <span className="font-semibold text-muted">{selectedColor?.name}</span>
                </p>
                <div className="mt-2 flex flex-wrap gap-2" role="radiogroup" aria-label={L.color}>
                  {p.colors.map((c) => {
                    const out = (availableFor(c.id) ?? 1) <= 0;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        role="radio"
                        aria-checked={c.id === color}
                        aria-label={out ? `${c.name} — ${L.outOfStock}` : c.name}
                        title={out ? `${c.name} — ${L.outOfStock}` : c.name}
                        onClick={() => pickColor(c.id)}
                        className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition ${
                          c.id === color ? "border-ink shadow-hard-sm" : "border-ink/30 hover:border-ink"
                        } ${out ? "opacity-50" : ""}`}
                      >
                        <span className="h-6 w-6 rounded-full border border-ink/20" style={{ background: c.hex }} />
                        {out && <span aria-hidden className="absolute h-0.5 w-8 rotate-45 bg-ink" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-sm font-bold">{t.shop.cart.quantity}</span>
              <QtyStepper
                qty={qty}
                onChange={(q) => setQty(Math.min(Math.max(1, q), available ?? Number.MAX_SAFE_INTEGER))}
                label={t.shop.cart.quantity}
              />
            </div>

            {soldOut && <p className="mt-4 rounded-lg bg-tint-pink px-3 py-2 text-sm font-semibold">{L.outOfStockHint}</p>}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <AddToCartButton
                slug={p.slug}
                color={color}
                qty={qty}
                label={t.shop.cart.addToCart}
                addedLabel={t.shop.cart.added}
                variant="ink"
                className="h-12 text-base"
                disabled={soldOut}
              />
              <button type="button" onClick={buyNow} disabled={soldOut} className="kbtn kbtn-accent h-12 text-base disabled:cursor-not-allowed disabled:opacity-50">
                {t.shop.buyNow} →
              </button>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <a href={`tel:${company.phoneE164}`} className="font-semibold text-accent hover:underline">
                {t.shop.callUs} · {company.phoneDisplay}
              </a>
              <a href={company.zaloUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
                {t.shop.zalo}
              </a>
            </div>
          </div>

          <dl className="mt-6 text-sm">
            <dt className="text-xs font-bold uppercase tracking-wider text-muted">{L.audience}</dt>
            <dd className="mt-1 font-semibold">{p.audience}</dd>
          </dl>
          <p className="mt-4 text-muted">{p.summary}</p>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t-2 border-ink bg-bg/95 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold">{p.name}</p>
            <Price amount={p.price} locale={locale} />
          </div>
          <div className="flex shrink-0 gap-2">
            <AddToCartButton
              slug={p.slug}
              color={color}
              qty={qty}
              label={t.shop.cart.addToCart}
              addedLabel={t.shop.cart.added}
              variant="ink"
              className="h-10 px-3 text-sm"
              disabled={soldOut}
            />
            {soldOut ? (
              <span className="kbtn kbtn-accent h-10 cursor-not-allowed px-3 text-sm opacity-50" aria-disabled>
                {L.outOfStock}
              </span>
            ) : (
              <Link href={localePath(locale, "/checkout")} onClick={() => add({ slug: p.slug, color, qty }, false)} className="kbtn kbtn-accent h-10 px-3 text-sm">
                {t.shop.buyNow}
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

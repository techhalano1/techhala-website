import Link from "next/link";
import type { Dictionary, Product } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import { formatVnd } from "@/lib/site";
import { ProductArt } from "@/components/ProductArt";
import { AddToCartButton } from "@/components/cart/AddToCartButton";

export function Price({ amount, locale, className = "" }: { amount: number; locale: Locale; className?: string }) {
  return (
    <span className={`font-mono font-extrabold tabular-nums text-accent ${className}`}>{formatVnd(amount, locale)}</span>
  );
}

export function ComparePrice({ amount, locale, className = "" }: { amount: number; locale: Locale; className?: string }) {
  return <s className={`font-mono text-sm tabular-nums text-muted ${className}`}>{formatVnd(amount, locale)}</s>;
}

export function Stars({ rating, className = "" }: { rating: number; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-0.5 text-[#f5a524] ${className}`} aria-label={`${rating}/5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i < Math.round(rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 2.5l2.9 6.2 6.7.8-5 4.6 1.3 6.7L12 17.5l-5.9 3.3 1.3-6.7-5-4.6 6.7-.8z" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

export function formatSold(n: number, locale: Locale) {
  if (n >= 1000) return `${(n / 1000).toLocaleString(locale === "vi" ? "vi-VN" : "en-US", { maximumFractionDigits: 1 })}k`;
  return n.toLocaleString(locale === "vi" ? "vi-VN" : "en-US");
}

export function discountPercent(product: Product) {
  if (!product.compareAtPrice || product.compareAtPrice <= product.price) return 0;
  return Math.round((1 - product.price / product.compareAtPrice) * 100);
}

export function ProductCard({ product, locale, t, compact = false }: { product: Product; locale: Locale; t: Dictionary; compact?: boolean }) {
  const href = localePath(locale, `/products/${product.slug}`);
  const pct = discountPercent(product);
  const l = t.shop.labels;
  const ageText = product.ageLabel ?? (product.ages[0] ? t.shop.ages[product.ages[0]].name : undefined);

  return (
    <article className="kcard kcard-hover group flex h-full flex-col overflow-hidden">
      <Link href={href} className="relative block aspect-[4/3] overflow-hidden border-b-2 border-ink">
        <ProductArt variant={product.art} tint={product.tint} title={product.name} className="transition duration-300 group-hover:scale-[1.04]" />
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {pct > 0 && (
            <span className="rounded-lg border-2 border-ink bg-accent px-2 py-0.5 font-mono text-[11px] font-bold text-white">−{pct}%</span>
          )}
          {product.badge && (
            <span className="rounded-lg border-2 border-ink bg-bg-elev px-2 py-0.5 text-[11px] font-bold">{product.badge}</span>
          )}
        </div>
        {ageText && (
          <span className="absolute bottom-3 right-3 rounded-lg border-2 border-ink bg-bg-elev px-2 py-0.5 text-[11px] font-bold">
            {ageText}
          </span>
        )}
      </Link>
      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">{t.shop.categories[product.category].name}</span>
        <h3 className={`mt-1.5 font-extrabold leading-snug ${compact ? "text-base" : "text-lg"}`}>
          <Link href={href} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{product.tagline}</p>

        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
          <Stars rating={product.rating} />
          <span className="font-semibold text-fg">{product.rating.toFixed(1)}</span>
          <span aria-hidden>·</span>
          <span>
            {formatSold(product.sold, locale)} {l.sold}
          </span>
          {product.freeShipping && (
            <span className="rounded-md bg-tint-green px-1.5 py-0.5 font-bold text-[#0d6b3a]">{l.freeShipping}</span>
          )}
        </div>

        {product.colors && product.colors.length > 0 && (
          <div className="mt-3 flex items-center gap-1.5" aria-label={l.color}>
            {product.colors.map((c) => (
              <span key={c.id} title={c.name} className="h-4 w-4 rounded-full border-2 border-ink" style={{ background: c.hex }} />
            ))}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <div className="flex flex-col">
            {product.compareAtPrice && <ComparePrice amount={product.compareAtPrice} locale={locale} />}
            <Price amount={product.price} locale={locale} className={compact ? "text-lg" : "text-xl"} />
          </div>
          <AddToCartButton
            slug={product.slug}
            color={product.colors?.[0]?.id}
            label={t.shop.cart.addToCart}
            addedLabel={t.shop.cart.added}
            variant="ink"
            className="h-10 px-3 text-sm"
          />
        </div>
      </div>
    </article>
  );
}

import Link from "next/link";
import type { Dictionary, Product } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import { formatVnd } from "@/lib/site";
import { ProductArt } from "@/components/ProductArt";
import { Arrow } from "@/components/ui";

export function Price({ amount, locale, className = "" }: { amount: number; locale: Locale; className?: string }) {
  return (
    <span className={`font-mono font-semibold tabular-nums text-accent ${className}`}>{formatVnd(amount, locale)}</span>
  );
}

export function ProductCard({ product, locale, t }: { product: Product; locale: Locale; t: Dictionary }) {
  const href = localePath(locale, `/products/${product.slug}`);
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-bg-elev transition hover:border-fg/30">
      <Link href={href} className="relative block aspect-[3/2] overflow-hidden border-b border-border bg-bg">
        <ProductArt variant={product.art} title={product.name} className="transition duration-300 group-hover:scale-[1.03]" />
        {product.badge && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-white">
            {product.badge}
          </span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <span className="font-mono text-[11px] uppercase tracking-wider text-muted">
          {t.shop.categories[product.category].name}
        </span>
        <h3 className="mt-2 text-lg font-semibold leading-snug">
          <Link href={href} className="hover:text-accent">
            {product.name}
          </Link>
        </h3>
        <p className="mt-1 text-sm text-muted">{product.tagline}</p>
        <p className="mt-4 text-xs text-muted">{product.audience}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <Price amount={product.price} locale={locale} className="text-xl" />
          <div className="flex items-center gap-2">
            <Link
              href={href}
              className="inline-flex h-9 items-center gap-1 rounded-md border border-border px-3 text-sm font-medium transition hover:border-fg/40"
            >
              {t.shop.viewDetails}
            </Link>
            <Link
              href={localePath(locale, `/checkout?product=${product.slug}`)}
              className="inline-flex h-9 items-center gap-1 rounded-md bg-accent px-3 text-sm font-medium text-white transition hover:opacity-90"
            >
              {t.shop.buyNow}
              <Arrow />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}

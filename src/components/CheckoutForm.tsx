"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import type { Dictionary, Product } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import { company, formatVnd } from "@/lib/site";
import { ProductArt } from "@/components/ProductArt";
import { submitOrder, type OrderState } from "@/app/[locale]/checkout/actions";

const field =
  "w-full rounded-md border border-border bg-bg px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted/70 focus:border-accent";

export function CheckoutForm({
  locale,
  checkout: C,
  shop,
  products,
  initialSlug,
}: {
  locale: Locale;
  checkout: Dictionary["checkout"];
  shop: Dictionary["shop"];
  products: Product[];
  initialSlug?: string;
}) {
  const [slug, setSlug] = useState(initialSlug && products.some((p) => p.slug === initialSlug) ? initialSlug : "");
  const [quantity, setQuantity] = useState(1);
  const [state, action, pending] = useActionState<OrderState, FormData>(submitOrder, { status: "idle" });
  const product = products.find((p) => p.slug === slug);
  const total = product ? product.price * quantity : 0;

  if (state.status === "success") {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-accent/40 bg-accent/5 p-8 text-center" role="status">
        <p className="font-mono text-xs uppercase tracking-wider text-accent">{C.success.orderCode}</p>
        <p className="mt-1 font-mono text-3xl font-semibold tabular-nums">{state.orderCode}</p>
        <h2 className="mt-6 text-2xl font-semibold">{C.success.title}</h2>
        <p className="mt-2 text-muted">{C.success.body}</p>
        <ol className="mx-auto mt-6 max-w-md space-y-2 text-left text-sm text-muted">
          {C.success.next.map((n, i) => (
            <li key={n} className="flex gap-3">
              <span className="font-mono text-accent">{i + 1}.</span>
              {n}
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href={`tel:${company.phoneE164}`} className="inline-flex h-11 items-center rounded-md bg-fg px-5 text-sm font-medium text-bg">
            {shop.callUs} · {company.phoneDisplay}
          </a>
          <Link
            href={localePath(locale, "/products")}
            className="inline-flex h-11 items-center rounded-md border border-border px-5 text-sm font-medium hover:border-fg/40"
          >
            {shop.labels.allProducts}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[1.3fr_1fr]">
      <input type="hidden" name="locale" value={locale} />

      <div className="min-w-0 space-y-8">
        <fieldset className="space-y-3">
          <legend className="mb-2 text-sm font-semibold">{C.chooseProduct}</legend>
          <div className="grid gap-3 sm:grid-cols-2">
            {products.map((p) => {
              const selected = p.slug === slug;
              return (
                <label
                  key={p.slug}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition ${
                    selected ? "border-accent bg-accent/5" : "border-border bg-bg-elev hover:border-fg/30"
                  }`}
                >
                  <input
                    type="radio"
                    name="product"
                    value={p.slug}
                    checked={selected}
                    onChange={() => setSlug(p.slug)}
                    className="sr-only"
                  />
                  <span className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-bg">
                    <ProductArt variant={p.art} title={p.name} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{p.name}</span>
                    <span className="block font-mono text-xs text-accent">{formatVnd(p.price, locale)}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted">{C.form.name}</span>
            <input name="name" required autoComplete="name" className={field} />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-muted">{C.form.phone}</span>
            <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" className={field} />
          </label>
        </div>
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">{C.form.email}</span>
          <input name="email" type="email" autoComplete="email" className={field} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">{C.form.address}</span>
          <textarea name="address" required rows={2} autoComplete="street-address" className={field} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">{C.form.note}</span>
          <textarea name="note" rows={2} className={field} />
        </label>

        <fieldset className="space-y-2">
          <legend className="mb-2 text-sm font-semibold">{C.form.payment}</legend>
          {C.payments.map((m, i) => (
            <label
              key={m.id}
              className={`flex items-start gap-3 rounded-xl border border-border p-4 ${
                m.available ? "cursor-pointer bg-bg-elev hover:border-fg/30" : "cursor-not-allowed opacity-60"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={m.id}
                defaultChecked={i === 0}
                disabled={!m.available}
                required
                className="mt-1 accent-[var(--accent)]"
              />
              <span>
                <span className="block text-sm font-medium">{m.name}</span>
                <span className="block text-xs text-muted">{m.body}</span>
              </span>
            </label>
          ))}
        </fieldset>
      </div>

      <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-2xl border border-border bg-bg-elev p-6">
          <h2 className="font-semibold">{C.summary}</h2>
          {product ? (
            <div className="mt-4 flex items-center gap-4">
              <span className="h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-bg">
                <ProductArt variant={product.art} title={product.name} />
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{product.name}</p>
                <p className="truncate text-xs text-muted">{product.tagline}</p>
                <p className="mt-1 font-mono text-sm text-accent">{formatVnd(product.price, locale)}</p>
              </div>
            </div>
          ) : (
            <p className="mt-4 text-sm text-muted">{C.noProduct}</p>
          )}

          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="text-muted">{C.quantity}</span>
            <span className="inline-flex items-center rounded-md border border-border">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="h-9 w-9 text-lg leading-none hover:bg-bg"
                aria-label="−"
              >
                −
              </button>
              <input
                name="quantity"
                type="number"
                min={1}
                max={10}
                value={quantity}
                onChange={(e) => setQuantity(Math.min(10, Math.max(1, Number(e.target.value) || 1)))}
                className="h-9 w-12 border-x border-border bg-transparent text-center text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                className="h-9 w-9 text-lg leading-none hover:bg-bg"
                aria-label="+"
              >
                +
              </button>
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between text-sm">
            <span className="text-muted">{C.shipping}</span>
            <span className="font-mono">{formatVnd(0, locale)}</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="font-semibold">{C.total}</span>
            <span className="font-mono text-xl font-semibold tabular-nums text-accent">{formatVnd(total, locale)}</span>
          </div>

          {state.status === "error" && (
            <p className="mt-4 text-sm text-red-500" role="alert">
              {C.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending || !product}
            className="mt-5 inline-flex h-12 w-full items-center justify-center rounded-md bg-accent text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          >
            {pending ? C.form.sending : C.form.submit}
          </button>
          <p className="mt-3 text-center text-xs text-muted">{shop.labels.priceNote}</p>
        </div>

        <div className="mt-4 rounded-2xl border border-border p-5 text-sm">
          <p className="font-semibold">{C.support.title}</p>
          <p className="mt-1 text-muted">{C.support.body}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={`tel:${company.phoneE164}`} className="font-mono text-accent hover:underline">
              {company.phoneDisplay}
            </a>
            <span className="text-muted">·</span>
            <a href={company.zaloUrl} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
              {shop.zalo}
            </a>
          </div>
        </div>
      </aside>
    </form>
  );
}

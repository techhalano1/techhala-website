"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import type { Dictionary, Product } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import { company, formatVnd } from "@/lib/site";
import { ProductArt } from "@/components/ProductArt";
import { ProductCard } from "@/components/ProductCard";
import { useCart } from "@/components/cart/CartProvider";
import { QtyStepper, resolveLines } from "@/components/cart/CartDrawer";
import { submitOrder, type OrderState } from "@/app/[locale]/checkout/actions";
import { BankTransferPanel } from "@/components/BankTransferPanel";

const field =
  "w-full rounded-xl border-2 border-ink bg-bg-elev px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted/70 focus:shadow-hard-accent";

export function CheckoutForm({
  locale,
  checkout: C,
  shop,
  products,
  initialSlug,
  t,
}: {
  locale: Locale;
  checkout: Dictionary["checkout"];
  shop: Dictionary["shop"];
  products: Product[];
  initialSlug?: string;
  t: Dictionary;
}) {
  const { lines, hydrated, add, setQty, remove, clear } = useCart();
  const [state, action, pending] = useActionState<OrderState, FormData>(submitOrder, { status: "idle" });
  const seeded = useRef(false);

  useEffect(() => {
    if (!hydrated || seeded.current) return;
    seeded.current = true;
    if (!initialSlug) return;
    const p = products.find((x) => x.slug === initialSlug);
    if (p && !lines.some((l) => l.slug === p.slug)) add({ slug: p.slug, color: p.colors?.[0]?.id }, false);
  }, [hydrated, initialSlug, products, lines, add]);

  useEffect(() => {
    if (state.status === "success") clear();
  }, [state.status, clear]);

  const prev = state.status === "error" ? state.customer : undefined;
  const prevPayment = state.status === "error" ? state.payment : undefined;
  const resolved = resolveLines(lines, products);
  const total = resolved.reduce((sum, l) => sum + l.product.price * l.qty, 0);
  const itemCount = resolved.reduce((n, l) => n + l.qty, 0);
  const linesJson = JSON.stringify(resolved.map((l) => ({ slug: l.slug, color: l.color, qty: l.qty })));

  if (state.status === "success") {
    return (
      <div className="kcard mx-auto max-w-2xl p-8 text-center" role="status">
        <p className="text-xs font-bold uppercase tracking-wider text-accent">{C.success.orderCode}</p>
        <p className="mt-1 font-mono text-3xl font-extrabold tabular-nums">{state.orderCode}</p>
        <h2 className="mt-6 text-2xl font-extrabold">{C.success.title}</h2>
        <p className="mt-2 text-muted">{C.success.body}</p>
        <ol className="mx-auto mt-6 max-w-md space-y-2 text-left text-sm text-muted">
          {(state.bank ? C.success.bankNext : C.success.next).map((n, i) => (
            <li key={n} className="flex gap-3">
              <span className="font-mono font-bold text-accent">{i + 1}.</span>
              {n}
            </li>
          ))}
        </ol>
        {state.bank && (
          <div className="mt-6">
            <BankTransferPanel info={state.bank} locale={locale} labels={t.orders.detail} />
          </div>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {state.trackUrl && (
            <Link href={state.trackUrl} className="kbtn kbtn-accent h-11 px-5 text-sm">
              {C.success.track}
            </Link>
          )}
          <a href={`tel:${company.phoneE164}`} className="kbtn kbtn-ink h-11 px-5 text-sm">
            {shop.callUs} · {company.phoneDisplay}
          </a>
          <Link href={localePath(locale, "/products")} className="kbtn kbtn-white h-11 px-5 text-sm">
            {shop.labels.allProducts}
          </Link>
        </div>
      </div>
    );
  }

  if (hydrated && resolved.length === 0) {
    const picks = products.filter((p) => p.category === "education" || p.category === "home").slice(0, 3);
    return (
      <div>
        <div className="kcard mx-auto max-w-xl p-8 text-center">
          <div className="mx-auto h-28 w-40 opacity-80">
            <ProductArt variant="bag" title="" plain />
          </div>
          <p className="mt-2 text-lg font-bold">{C.noProduct}</p>
          <Link href={localePath(locale, "/products")} className="kbtn kbtn-accent mt-5 h-11 px-6 text-sm">
            {shop.cart.emptyCta}
          </Link>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map((p) => (
            <ProductCard key={p.slug} product={p} locale={locale} t={t} compact />
          ))}
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[1.3fr_1fr]">
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="lines" value={linesJson} />
      <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" defaultValue="" />

      <div className="min-w-0 space-y-8">
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-1.5 block font-semibold">{C.form.name}</span>
            <input name="name" required autoComplete="name" defaultValue={prev?.name} className={field} />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block font-semibold">{C.form.phone}</span>
            <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" defaultValue={prev?.phone} className={field} />
          </label>
        </div>
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold">{C.form.email}</span>
          <input name="email" type="email" autoComplete="email" defaultValue={prev?.email} className={field} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold">{C.form.address}</span>
          <textarea name="address" required rows={2} autoComplete="street-address" defaultValue={prev?.address} className={field} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-semibold">{C.form.note}</span>
          <textarea name="note" rows={2} defaultValue={prev?.note} className={field} />
        </label>

        <fieldset className="space-y-3">
          <legend className="mb-2 text-sm font-semibold">{C.form.payment}</legend>
          {C.payments.map((m, i) => (
            <label
              key={m.id}
              className={`flex items-start gap-3 rounded-2xl border-2 border-ink p-4 ${
                m.available ? "cursor-pointer bg-bg-elev has-[:checked]:bg-tint-yellow" : "cursor-not-allowed border-dashed opacity-60"
              }`}
            >
              <input
                type="radio"
                name="payment"
                value={m.id}
                defaultChecked={prevPayment ? m.id === prevPayment : i === 0}
                disabled={!m.available}
                required
                className="mt-1 accent-[var(--accent)]"
              />
              <span>
                <span className="block text-sm font-bold">{m.name}</span>
                <span className="block text-xs text-muted">{m.body}</span>
              </span>
            </label>
          ))}
        </fieldset>
      </div>

      <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
        <div className="kcard p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold">{C.summary}</h2>
            <span className="rounded-full border-2 border-ink px-2 py-0.5 font-mono text-xs font-bold">
              {itemCount} {shop.cart.items}
            </span>
          </div>

          <ul className="mt-4 divide-y-2 divide-border">
            {resolved.map((l) => (
              <li key={l.key} className="flex gap-3 py-3">
                <span className="h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-ink">
                  <ProductArt variant={l.product.art} tint={l.product.tint} title={l.product.name} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="line-clamp-2 text-sm font-bold leading-snug">{l.product.name}</p>
                    <button
                      type="button"
                      onClick={() => remove(l.key)}
                      className="shrink-0 text-xs font-semibold text-muted hover:text-accent hover:underline"
                    >
                      {shop.cart.remove}
                    </button>
                  </div>
                  {l.colorName && <p className="text-xs text-muted">{l.colorName}</p>}
                  <div className="mt-2 flex items-center justify-between gap-2">
                    <QtyStepper qty={l.qty} onChange={(q) => setQty(l.key, q)} label={C.quantity} size="sm" />
                    <span className="font-mono text-sm font-bold tabular-nums text-accent">{formatVnd(l.product.price * l.qty, locale)}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <Link href={localePath(locale, "/products")} className="mt-3 inline-block text-sm font-semibold text-accent hover:underline">
            + {C.addMore}
          </Link>

          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-muted">{C.shipping}</span>
            <span className="font-mono font-bold">{formatVnd(0, locale)}</span>
          </div>
          <div className="mt-3 flex items-center justify-between border-t-2 border-ink pt-4">
            <span className="font-bold">{C.total}</span>
            <span className="font-mono text-2xl font-extrabold tabular-nums text-accent">{formatVnd(total, locale)}</span>
          </div>

          {state.status === "error" && (
            <p className="mt-4 text-sm font-semibold text-accent" role="alert">
              {state.reason === "out_of_stock"
                ? C.errors.outOfStock.replace("{items}", state.items ?? "")
                : state.reason === "too_many"
                  ? C.errors.tooMany
                  : C.error}
            </p>
          )}

          <button type="submit" disabled={pending || !hydrated || resolved.length === 0} className="kbtn kbtn-accent mt-5 h-12 w-full text-base">
            {pending ? C.form.sending : C.form.submit}
          </button>
          <p className="mt-3 text-center text-xs text-muted">{shop.labels.priceNote}</p>
        </div>

        <div className="mt-4 rounded-2xl border-2 border-dashed border-ink/40 p-5 text-sm">
          <p className="font-bold">{C.support.title}</p>
          <p className="mt-1 text-muted">{C.support.body}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={`tel:${company.phoneE164}`} className="font-mono font-bold text-accent hover:underline">
              {company.phoneDisplay}
            </a>
            <span className="text-muted">·</span>
            <a href={company.zaloUrl} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">
              {shop.zalo}
            </a>
          </div>
        </div>
      </aside>
    </form>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getDictionary } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import { company, formatVnd } from "@/lib/site";
import { getDb, type OrderStatus } from "@/lib/db";
import { getOrderByToken, normalizeOrderCode } from "@/lib/orders";
import { Heading, Section } from "@/components/ui";

export const dynamic = "force-dynamic";

const timeline: OrderStatus[] = ["pending", "confirmed", "packed", "shipping", "delivered"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; code: string }>;
}): Promise<Metadata> {
  const { locale, code } = await params;
  const t = getDictionary(locale);
  return { title: `${t.orders.detail.title} ${normalizeOrderCode(code)}`, robots: { index: false } };
}

function formatDate(iso: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date(iso));
}

export default async function OrderDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale; code: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { locale, code } = await params;
  const { t: token } = await searchParams;
  const t = getDictionary(locale);
  const D = t.orders.detail;

  const lookupUrl = localePath(locale, `/orders?code=${encodeURIComponent(normalizeOrderCode(code))}`);
  if (!token || !getDb()) redirect(lookupUrl);

  const order = await getOrderByToken(code, token);
  if (!order) redirect(lookupUrl);

  const terminal = order.status === "cancelled" || order.status === "returned";
  const stepIndex = timeline.indexOf(order.status);
  const colorName = (slug: string, color: string | null) =>
    color ? (t.products.items.find((p) => p.slug === slug)?.colors?.find((c) => c.id === color)?.name ?? color) : null;

  return (
    <>
      <Section className="kdots pb-6 pt-12 sm:pb-8 sm:pt-16">
        <p className="text-xs font-bold uppercase tracking-wider text-accent">{D.title}</p>
        <Heading as="h1" className="font-mono font-extrabold tabular-nums">
          {order.code}
        </Heading>
        <p className="mt-2 text-sm text-muted">
          {D.placedAt}: {formatDate(order.created_at, locale)}
        </p>
      </Section>

      <Section className="pt-2 sm:pt-4">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="kcard p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">{D.status}</h2>
              {terminal ? (
                <p className="mt-3 inline-flex rounded-lg border-2 border-ink bg-tint-pink px-3 py-1.5 text-sm font-bold">
                  {t.orders.statuses[order.status]}
                </p>
              ) : (
                <ol className="mt-4 grid gap-3 sm:grid-cols-5">
                  {timeline.map((s, i) => {
                    const done = i <= stepIndex;
                    return (
                      <li key={s} className="flex items-start gap-2 sm:flex-col sm:items-start">
                        <span
                          aria-hidden="true"
                          className={`grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 border-ink text-xs font-bold ${
                            done ? "bg-accent text-white" : "bg-bg-elev text-muted"
                          }`}
                        >
                          {i + 1}
                        </span>
                        <span className={`text-sm ${done ? "font-bold" : "text-muted"}`} aria-current={i === stepIndex ? "step" : undefined}>
                          {t.orders.statuses[s]}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>

            <div className="kcard p-6">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">{D.items}</h2>
              <ul className="mt-3 divide-y divide-border">
                {order.items.map((it) => {
                  const product = t.products.items.find((p) => p.slug === it.product_slug);
                  const name = product?.name ?? it.product_name;
                  const cn = colorName(it.product_slug, it.color);
                  return (
                    <li key={it.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                      <div>
                        <Link href={localePath(locale, `/products/${it.product_slug}`)} className="font-bold hover:underline">
                          {name}
                        </Link>
                        <p className="text-muted">
                          {cn ? `${cn} · ` : ""}
                          {formatVnd(it.unit_price, locale)} × {it.quantity}
                        </p>
                      </div>
                      <span className="font-bold tabular-nums">{formatVnd(it.line_total, locale)}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="mt-3 flex items-center justify-between border-t-2 border-ink pt-3 text-base font-extrabold">
                <span>{D.total}</span>
                <span className="tabular-nums">{formatVnd(order.total, locale)}</span>
              </div>
            </div>

            {order.events.length > 1 && (
              <div className="kcard p-6">
                <h2 className="text-sm font-bold uppercase tracking-wider text-muted">{D.history}</h2>
                <ul className="mt-3 space-y-2 text-sm">
                  {[...order.events].reverse().map((e) => (
                    <li key={e.id} className="flex justify-between gap-4">
                      <span className="font-medium">{t.orders.statuses[e.to_status]}</span>
                      <span className="text-muted tabular-nums">{formatDate(e.created_at, locale)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="space-y-6">
            <div className="kcard p-6 text-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">{D.payment}</h2>
              <p className="mt-2 font-bold">{t.orders.paymentMethods[order.payment_method]}</p>
              <p className="text-muted">
                {D.paymentStatus}: {t.orders.paymentStatuses[order.payment_status]}
              </p>
              {order.payment_method === "bank" && order.payment_status === "unpaid" && !terminal && (
                <div className="mt-4 rounded-xl border-2 border-ink bg-tint-yellow p-4">
                  <p className="font-bold">{D.bankTitle}</p>
                  <p className="mt-1 text-muted">{D.bankBody}</p>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted">{D.transferNote}</p>
                  <p className="font-mono text-base font-extrabold">{order.code}</p>
                </div>
              )}
            </div>

            <div className="kcard p-6 text-sm">
              <h2 className="text-sm font-bold uppercase tracking-wider text-muted">{D.shipTo}</h2>
              <p className="mt-2 font-bold">{order.customer_name}</p>
              <p className="text-muted">{order.customer_phone}</p>
              <p className="text-muted">{order.customer_address}</p>
              {order.note && (
                <>
                  <p className="mt-3 text-xs font-bold uppercase tracking-wider text-muted">{D.note}</p>
                  <p className="text-muted">{order.note}</p>
                </>
              )}
            </div>

            <div className="kcard bg-tint-blue p-6 text-sm">
              <p>{D.help}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`tel:${company.phoneE164}`} className="kbtn kbtn-ink h-10 px-4 text-xs">
                  {company.phoneDisplay}
                </a>
                <a href={company.zaloUrl} target="_blank" rel="noopener noreferrer" className="kbtn kbtn-white h-10 px-4 text-xs">
                  Zalo
                </a>
              </div>
              <Link href={localePath(locale, "/orders")} className="mt-4 inline-block text-xs font-bold underline">
                {D.lookupAnother}
              </Link>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import { getDictionary } from "@/content";
import { type Locale } from "@/lib/i18n";
import { company } from "@/lib/site";
import { Price, ProductCard } from "@/components/ProductCard";
import { Check, Eyebrow, Heading, Lead, Section } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return { title: t.products.title, description: t.products.subtitle };
}

export default async function ProductsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const categories = (["education", "home"] as const).map((c) => ({
    id: c,
    ...t.shop.categories[c],
    items: t.products.items.filter((p) => p.category === c),
  }));

  return (
    <>
      <div className="relative overflow-hidden border-b border-border">
        <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
        <Section className="relative">
          <Eyebrow>{t.nav.products}</Eyebrow>
          <Heading as="h1">{t.products.title}</Heading>
          <Lead>{t.products.subtitle}</Lead>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            {t.shop.guarantees.map((g) => (
              <li key={g.title} className="flex items-center gap-2">
                <Check />
                {g.title}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {categories.map((c, i) => (
        <Section key={c.id} id={c.id} className={i > 0 ? "border-t border-border bg-bg-elev/50" : ""}>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Heading>{c.name}</Heading>
              <Lead>{c.short}</Lead>
            </div>
            <p className="text-sm text-muted">
              {t.shop.priceFrom} <Price amount={Math.min(...c.items.map((p) => p.price))} locale={locale} className="text-base" />
            </p>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {c.items.map((p) => (
              <ProductCard key={p.slug} product={p} locale={locale} t={t} />
            ))}
          </div>
        </Section>
      ))}

      <Section className="border-t border-border">
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-border bg-bg-elev p-8 text-center sm:p-12">
          <p className="text-xs text-muted">{t.shop.labels.priceNote}</p>
          <Heading as="h3">{t.checkout.support.title}</Heading>
          <p className="max-w-xl text-muted">{t.checkout.support.body}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={`tel:${company.phoneE164}`}
              className="inline-flex h-11 items-center rounded-md bg-fg px-5 text-sm font-medium text-bg hover:opacity-90"
            >
              {t.shop.callUs} · {company.phoneDisplay}
            </a>
            <a
              href={company.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center rounded-md border border-border bg-bg px-5 text-sm font-medium hover:border-fg/40"
            >
              {t.shop.zalo}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}

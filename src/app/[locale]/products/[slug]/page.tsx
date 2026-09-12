import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { en } from "@/content/en";
import { getStoreDictionary } from "@/lib/catalog";
import { locales, localePath, type Locale } from "@/lib/i18n";
import { company, siteUrl } from "@/lib/site";
import { getDb } from "@/lib/db";
import { availabilityForProduct, stockEnforced } from "@/lib/orders";
import { ProductBuyBox } from "@/components/ProductBuyBox";
import { ProductCard } from "@/components/ProductCard";
import { Arrow, Check, Heading, Section } from "@/components/ui";

type Params = { locale: Locale; slug: string };

export const revalidate = 60;

export function generateStaticParams() {
  return locales.flatMap((locale) => en.products.items.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = (await getStoreDictionary(locale)).products.items.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.name,
    description: `${p.tagline} — ${p.summary}`,
    openGraph: p.images?.[0] ? { images: [{ url: p.images[0].url }] } : undefined,
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const t = await getStoreDictionary(locale);
  const p = t.products.items.find((x) => x.slug === slug);
  if (!p) notFound();
  const L = t.shop.labels;
  const availability = stockEnforced() ? await availabilityForProduct(slug, getDb()).catch(() => null) : null;
  const related = [
    ...t.products.items.filter((x) => x.slug !== p.slug && x.category === p.category),
    ...t.products.items.filter((x) => x.slug !== p.slug && x.category !== p.category),
  ].slice(0, 3);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.summary,
    brand: { "@type": "Brand", name: company.name },
    image: p.images?.map((i) => i.url),
    url: `${siteUrl}${localePath(locale, `/products/${p.slug}`)}`,
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "VND",
      availability:
        availability && Object.values(availability).every((n) => n <= 0)
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      seller: { "@type": "Organization", name: company.name, telephone: company.phoneE164 },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      <Section className="pt-8 pb-12 sm:pt-10 sm:pb-16">
        <Link href={localePath(locale, "/products")} className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-fg">
          <span className="rotate-180">
            <Arrow />
          </span>
          {L.allProducts}
        </Link>
        <ProductBuyBox product={p} locale={locale} t={t} availability={availability}>
          <div className="mt-12 space-y-12">
            <section>
              <Heading as="h2" className="text-2xl font-extrabold sm:text-3xl">
                {L.highlights}
              </Heading>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {p.highlights.map((h) => (
                  <li key={h} className="flex gap-3 rounded-xl border-2 border-ink bg-bg-elev p-4 text-sm font-semibold">
                    <Check />
                    {h}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <Heading as="h2" className="text-2xl font-extrabold sm:text-3xl">
                {L.features}
              </Heading>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {p.features.map((f, i) => (
                  <div key={f.title} className="kcard p-5">
                    <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg border-2 border-ink bg-tint-yellow font-mono text-sm font-bold">
                      {i + 1}
                    </span>
                    <h3 className="mt-3 font-extrabold">{f.title}</h3>
                    <p className="mt-2 text-sm text-muted">{f.body}</p>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <Heading as="h2" className="text-2xl font-extrabold sm:text-3xl">
                {L.specs}
              </Heading>
              <dl className="kcard mt-5 divide-y-2 divide-border overflow-hidden">
                {p.specs.map((s) => (
                  <div key={s.label} className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm">
                    <dt className="text-muted">{s.label}</dt>
                    <dd className="font-semibold">{s.value}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section>
              <Heading as="h2" className="text-2xl font-extrabold sm:text-3xl">
                {L.inBox}
              </Heading>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {p.inBox.map((i) => (
                  <li key={i} className="flex gap-3 text-sm font-semibold">
                    <Check />
                    {i}
                  </li>
                ))}
              </ul>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {t.shop.guarantees.map((g) => (
                  <div key={g.title} className="rounded-xl border-2 border-ink bg-bg-elev p-4">
                    <p className="text-sm font-bold">{g.title}</p>
                    <p className="mt-1 text-xs text-muted">{g.body}</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </ProductBuyBox>
      </Section>

      <Section className="kdots border-t-2 border-ink pb-28 lg:pb-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Heading className="font-extrabold">{L.related}</Heading>
          <Link href={localePath(locale, "/products")} className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:underline">
            {L.allProducts}
            <Arrow />
          </Link>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <ProductCard key={r.slug} product={r} locale={locale} t={t} />
          ))}
        </div>
      </Section>
    </>
  );
}

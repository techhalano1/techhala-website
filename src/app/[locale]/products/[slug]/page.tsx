import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { en } from "@/content/en";
import { locales, localePath, type Locale } from "@/lib/i18n";
import { company, siteUrl } from "@/lib/site";
import { ProductArt } from "@/components/ProductArt";
import { Price, ProductCard } from "@/components/ProductCard";
import { Arrow, Check, Eyebrow, Heading, Section } from "@/components/ui";

type Params = { locale: Locale; slug: string };

export function generateStaticParams() {
  return locales.flatMap((locale) => en.products.items.map((p) => ({ locale, slug: p.slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = getDictionary(locale).products.items.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.name, description: `${p.tagline} — ${p.summary}` };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const t = getDictionary(locale);
  const p = t.products.items.find((x) => x.slug === slug);
  if (!p) notFound();
  const L = t.shop.labels;
  const related = t.products.items.filter((x) => x.slug !== p.slug).slice(0, 3);
  const checkoutHref = localePath(locale, `/checkout?product=${p.slug}`);

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    description: p.summary,
    brand: { "@type": "Brand", name: company.name },
    url: `${siteUrl}${localePath(locale, `/products/${p.slug}`)}`,
    offers: {
      "@type": "Offer",
      price: p.price,
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Organization", name: company.name, telephone: company.phoneE164 },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />

      <Section className="pb-12 sm:pb-16">
        <Link
          href={localePath(locale, "/products")}
          className="mb-8 inline-flex items-center gap-2 text-sm text-muted hover:text-fg"
        >
          <span className="rotate-180">
            <Arrow />
          </span>
          {L.allProducts}
        </Link>

        <div className="grid gap-10 lg:grid-cols-[1.15fr_1fr]">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-elev">
            <div className="aspect-[3/2]">
              <ProductArt variant={p.art} title={p.name} />
            </div>
            {p.badge && (
              <span className="absolute left-4 top-4 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-white">
                {p.badge}
              </span>
            )}
          </div>

          <div>
            <Eyebrow>{t.shop.categories[p.category].name}</Eyebrow>
            <Heading as="h1" className="text-3xl sm:text-5xl">
              {p.name}
            </Heading>
            <p className="mt-3 text-lg text-muted">{p.tagline}</p>
            <div className="mt-6 flex flex-wrap items-baseline gap-3">
              <Price amount={p.price} locale={locale} className="text-3xl" />
            </div>
            <p className="mt-2 text-xs text-muted">{L.priceNote}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={checkoutHref}
                className="inline-flex h-12 items-center gap-2 rounded-md bg-accent px-6 text-sm font-semibold text-white transition hover:opacity-90"
              >
                {t.shop.buyNow}
                <Arrow />
              </Link>
              <a
                href={`tel:${company.phoneE164}`}
                className="inline-flex h-12 items-center gap-2 rounded-md border border-border bg-bg-elev px-5 text-sm font-medium transition hover:border-fg/40"
              >
                {t.shop.callUs} · {company.phoneDisplay}
              </a>
              <a
                href={company.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center gap-2 rounded-md border border-border bg-bg-elev px-5 text-sm font-medium transition hover:border-fg/40"
              >
                {t.shop.zalo}
              </a>
            </div>

            <dl className="mt-8 rounded-xl border border-border bg-bg-elev p-5 text-sm">
              <dt className="font-mono text-xs uppercase tracking-wider text-muted">{L.audience}</dt>
              <dd className="mt-1 font-medium">{p.audience}</dd>
            </dl>

            <p className="mt-6 text-muted">{p.summary}</p>

            <ul className="mt-6 space-y-2">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-3 text-sm">
                  <Check />
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="border-t border-border bg-bg-elev/50">
        <Heading>{L.features}</Heading>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {p.features.map((f) => (
            <div key={f.title} className="rounded-xl border border-border bg-bg p-6">
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <Heading as="h3">{L.specs}</Heading>
            <dl className="mt-6 divide-y divide-border rounded-xl border border-border">
              {p.specs.map((s) => (
                <div key={s.label} className="grid grid-cols-[1fr_2fr] gap-4 px-5 py-3 text-sm">
                  <dt className="text-muted">{s.label}</dt>
                  <dd className="font-medium">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <Heading as="h3">{L.inBox}</Heading>
            <ul className="mt-6 space-y-3">
              {p.inBox.map((i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <Check />
                  {i}
                </li>
              ))}
            </ul>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {t.shop.guarantees.map((g) => (
                <div key={g.title} className="rounded-xl border border-border bg-bg-elev p-4">
                  <p className="text-sm font-semibold">{g.title}</p>
                  <p className="mt-1 text-xs text-muted">{g.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-t border-border bg-bg-elev/50">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <Heading>{L.related}</Heading>
          <Link href={localePath(locale, "/products")} className="inline-flex items-center gap-2 text-sm text-accent hover:underline">
            {L.allProducts}
            <Arrow />
          </Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((r) => (
            <ProductCard key={r.slug} product={r} locale={locale} t={t} />
          ))}
        </div>
      </Section>

      <div className="sticky bottom-0 z-30 border-t border-border bg-bg/90 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="text-sm font-semibold">{p.name}</p>
            <Price amount={p.price} locale={locale} />
          </div>
          <Link
            href={checkoutHref}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-accent px-4 text-sm font-semibold text-white"
          >
            {t.shop.buyNow}
            <Arrow />
          </Link>
        </div>
      </div>
    </>
  );
}

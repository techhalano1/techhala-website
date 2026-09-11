import Link from "next/link";
import { getDictionary } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import { company, formatVnd } from "@/lib/site";
import { ProductArt } from "@/components/ProductArt";
import { Price, ProductCard } from "@/components/ProductCard";
import { SdlcIllustration } from "@/components/illustrations";
import { Arrow, Button, Card, Check, Container, Eyebrow, Heading, Lead, Section } from "@/components/ui";

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const H = t.home;
  const products = t.products.items;
  const minPrice = Math.min(...products.map((p) => p.price));
  const hero = products.find((p) => p.slug === "halabuddy") ?? products[0];
  const homeProducts = products.filter((p) => p.category === "home");
  const categories = (["education", "home"] as const).map((c) => ({
    id: c,
    ...t.shop.categories[c],
    items: products.filter((p) => p.category === c),
  }));

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: "linear-gradient(120deg, var(--accent), var(--accent-2))" }}
          aria-hidden="true"
        />
        <Container className="relative grid items-center gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <Eyebrow>{H.hero.eyebrow}</Eyebrow>
            <Heading as="h1">
              {H.hero.title} <span className="text-gradient">{H.hero.highlight}</span>
            </Heading>
            <Lead>{H.hero.subtitle}</Lead>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={localePath(locale, "/products")}>
                {H.hero.primaryCta}
                <Arrow />
              </Button>
              <Button href={`tel:${company.phoneE164}`} variant="secondary">
                {H.hero.secondaryCta} · {company.phoneDisplay}
              </Button>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-muted sm:grid-cols-4 lg:grid-cols-2">
              {H.hero.bullets.map((b) => (
                <li key={b} className="flex items-center gap-2">
                  <Check />
                  {b}
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <Link
              href={localePath(locale, `/products/${hero.slug}`)}
              className="group block overflow-hidden rounded-2xl border border-border bg-bg-elev shadow-2xl shadow-black/10 transition hover:border-fg/30"
            >
              <div className="relative aspect-[3/2] bg-bg">
                <ProductArt variant={hero.art} title={hero.name} className="transition duration-500 group-hover:scale-[1.03]" />
                <div className="absolute right-4 top-4 rounded-xl bg-fg px-3 py-2 text-right text-bg shadow-lg">
                  <span className="block text-[10px] uppercase tracking-wider opacity-70">{H.hero.priceBadge}</span>
                  <span className="font-mono text-lg font-semibold tabular-nums">{formatVnd(minPrice, locale)}</span>
                </div>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-border p-5">
                <div>
                  <p className="font-semibold">{hero.name}</p>
                  <p className="text-sm text-muted">{hero.tagline}</p>
                </div>
                <Price amount={hero.price} locale={locale} className="text-lg" />
              </div>
            </Link>
          </div>
        </Container>
      </div>

      {/* Guarantees strip */}
      <div className="border-b border-border bg-bg-elev/50">
        <Container className="grid gap-4 py-6 sm:grid-cols-2 lg:grid-cols-4">
          {t.shop.guarantees.map((g) => (
            <div key={g.title} className="flex gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Check />
              </span>
              <div>
                <p className="text-sm font-semibold">{g.title}</p>
                <p className="text-xs text-muted">{g.body}</p>
              </div>
            </div>
          ))}
        </Container>
      </div>

      {/* Categories */}
      <Section id="categories">
        <Eyebrow>{H.categories.eyebrow}</Eyebrow>
        <Heading>{H.categories.title}</Heading>
        <Lead>{H.categories.subtitle}</Lead>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {categories.map((c) => (
            <Link key={c.id} href={localePath(locale, `/products#${c.id}`)} className="group">
              <Card className="flex h-full flex-col overflow-hidden p-0">
                <div className="grid grid-cols-2 gap-px bg-border">
                  {c.items.slice(0, 2).map((p) => (
                    <div key={p.slug} className="aspect-[3/2] bg-bg">
                      <ProductArt variant={p.art} title={p.name} />
                    </div>
                  ))}
                </div>
                <div className="flex flex-1 items-start justify-between gap-4 p-6">
                  <div>
                    <h3 className="text-xl font-semibold group-hover:text-accent">{c.name}</h3>
                    <p className="mt-1 text-sm text-muted">{c.short}</p>
                    <p className="mt-3 text-sm">
                      {t.shop.priceFrom}{" "}
                      <Price amount={Math.min(...c.items.map((p) => p.price))} locale={locale} />
                    </p>
                  </div>
                  <span className="mt-1 text-accent">
                    <Arrow />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* Catalog */}
      <Section id="products" className="border-t border-border bg-bg-elev/50">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>{H.catalog.eyebrow}</Eyebrow>
            <Heading>{H.catalog.title}</Heading>
            <Lead>{H.catalog.subtitle}</Lead>
          </div>
          <Button href={localePath(locale, "/products")} variant="ghost">
            {t.shop.labels.allProducts}
            <Arrow />
          </Button>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} locale={locale} t={t} />
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted">{t.shop.labels.priceNote}</p>
      </Section>

      {/* Why */}
      <Section className="border-t border-border">
        <div className="max-w-3xl">
          <Eyebrow>{H.why.eyebrow}</Eyebrow>
          <Heading>{H.why.title}</Heading>
          <Lead>{H.why.subtitle}</Lead>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {H.why.items.map((item, i) => (
            <Card key={item.title}>
              <span className="font-mono text-xs text-accent">0{i + 1}</span>
              <h3 className="mt-3 font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Family */}
      <Section className="border-t border-border bg-bg-elev/50">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            {homeProducts.map((p) => (
              <Link
                key={p.slug}
                href={localePath(locale, `/products/${p.slug}`)}
                className="group overflow-hidden rounded-2xl border border-border bg-bg transition hover:border-fg/30"
              >
                <div className="aspect-[3/2]">
                  <ProductArt variant={p.art} title={p.name} className="transition duration-300 group-hover:scale-[1.03]" />
                </div>
                <div className="border-t border-border p-4">
                  <p className="font-semibold">{p.name}</p>
                  <Price amount={p.price} locale={locale} className="text-sm" />
                </div>
              </Link>
            ))}
          </div>
          <div>
            <Eyebrow>{H.family.eyebrow}</Eyebrow>
            <Heading>{H.family.title}</Heading>
            <Lead>{H.family.body}</Lead>
            <ul className="mt-6 space-y-3">
              {H.family.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm">
                  <Check />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href={localePath(locale, "/products#home")}>
                {H.family.cta}
                <Arrow />
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Steps */}
      <Section className="border-t border-border">
        <div className="text-center">
          <Eyebrow>{H.steps.eyebrow}</Eyebrow>
          <Heading>{H.steps.title}</Heading>
          <p className="mx-auto mt-4 max-w-xl text-muted">{H.steps.subtitle}</p>
        </div>
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {H.steps.items.map((s, i) => (
            <li key={s.name} className="relative rounded-xl border border-border bg-bg-elev p-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent font-mono text-sm font-semibold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-semibold">{s.name}</h3>
              <p className="mt-1 text-sm text-muted">{s.desc}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* FAQ */}
      <Section className="border-t border-border bg-bg-elev/50">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <Heading>{H.faq.title}</Heading>
            <div className="mt-6 rounded-xl border border-border bg-bg p-5 text-sm">
              <p className="font-semibold">{t.checkout.support.title}</p>
              <p className="mt-1 text-muted">{t.checkout.support.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`tel:${company.phoneE164}`}
                  className="inline-flex h-9 items-center rounded-md bg-fg px-3 text-sm font-medium text-bg hover:opacity-90"
                >
                  {company.phoneDisplay}
                </a>
                <a
                  href={company.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm font-medium hover:border-fg/40"
                >
                  {t.shop.zalo}
                </a>
              </div>
            </div>
          </div>
          <div className="divide-y divide-border rounded-2xl border border-border bg-bg">
            {H.faq.items.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                  {f.q}
                  <span className="text-muted transition group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="mt-3 text-sm text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* Enterprise solutions teaser */}
      <Section className="border-t border-border">
        <div className="grid items-center gap-10 rounded-2xl border border-border bg-bg-elev p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Eyebrow>{H.solutions.eyebrow}</Eyebrow>
            <Heading as="h3" className="text-2xl sm:text-3xl">
              {H.solutions.title}
            </Heading>
            <p className="mt-4 text-muted">{H.solutions.body}</p>
            <div className="mt-6">
              <Button href={localePath(locale, "/solutions")} variant="secondary">
                {H.solutions.cta}
                <Arrow />
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border border-border bg-bg">
            <SdlcIllustration title={t.solutions.flagship.title} className="aspect-[3/2]" />
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="border-t border-border">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-elev p-10 text-center sm:p-16">
          <div
            className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
            style={{ background: "linear-gradient(120deg, var(--accent), var(--accent-2))" }}
            aria-hidden="true"
          />
          <Heading className="relative">{H.cta.title}</Heading>
          <p className="relative mx-auto mt-4 max-w-xl text-muted">{H.cta.body}</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <Button href={`tel:${company.phoneE164}`}>{H.cta.primary}</Button>
            <Button href={localePath(locale, "/contact")} variant="secondary">
              {H.cta.secondary}
            </Button>
          </div>
        </div>
      </Section>
    </>
  );
}

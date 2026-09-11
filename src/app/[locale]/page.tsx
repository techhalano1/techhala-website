import Link from "next/link";
import { ageGroups, getDictionary } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import { company, formatVnd } from "@/lib/site";
import { ProductArt } from "@/components/ProductArt";
import { Price, ProductCard, Stars } from "@/components/ProductCard";
import { SdlcIllustration } from "@/components/illustrations";
import { Arrow, Check, Container, Eyebrow, Heading, Lead, Section } from "@/components/ui";

const ageTint = {
  "4-8": "bg-tint-pink",
  "6-12": "bg-tint-yellow",
  "9-15": "bg-tint-blue",
  family: "bg-tint-green",
  seniors: "bg-tint-purple",
} as const;

const ageArt = { "4-8": "mini", "6-12": "buddy", "9-15": "pro", family: "home", seniors: "care" } as const;

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const H = t.home;
  const products = t.products.items;
  const robots = products.filter((p) => p.category === "education" || p.category === "home");
  const minPrice = Math.min(...robots.map((p) => p.price));
  const hero = products.find((p) => p.slug === "halabuddy") ?? products[0];
  const picks = [...robots].sort((a, b) => b.sold - a.sold).slice(0, 6);
  const bundles = products.filter((p) => p.category === "combo");
  const accessories = products.filter((p) => p.category === "accessory").slice(0, 4);
  const homeProducts = products.filter((p) => p.category === "home");

  return (
    <>
      {/* Hero */}
      <div className="kdots relative overflow-hidden border-b-2 border-ink">
        <div className="kblob pointer-events-none absolute -right-24 -top-24 h-[420px] w-[420px] bg-tint-yellow" aria-hidden="true" />
        <div className="kblob pointer-events-none absolute -bottom-32 -left-20 h-[360px] w-[360px] bg-tint-pink" aria-hidden="true" />
        <Container className="relative grid items-center gap-12 py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
          <div>
            <span className="kchip kchip-active">{H.hero.eyebrow}</span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-balance sm:text-6xl">
              {H.hero.title}{" "}
              <span className="relative inline-block text-accent">
                {H.hero.highlight}
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden>
                  <path d="M2 9 Q 50 2, 100 8 T 198 6" fill="none" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
                </svg>
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-muted">{H.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href={localePath(locale, "/products")} className="kbtn kbtn-accent h-12 px-6 text-base">
                {H.hero.primaryCta} <Arrow />
              </Link>
              <a href={`tel:${company.phoneE164}`} className="kbtn kbtn-white h-12 px-5 text-base">
                {H.hero.secondaryCta} · {company.phoneDisplay}
              </a>
            </div>
            <ul className="mt-8 flex flex-wrap gap-2 text-sm">
              {H.hero.bullets.map((b) => (
                <li key={b} className="flex items-center gap-1.5 rounded-full border-2 border-ink bg-bg-elev px-3 py-1 font-semibold">
                  <Check />
                  {b}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div className="kcard float-y overflow-hidden bg-tint-blue">
              <Link href={localePath(locale, `/products/${hero.slug}`)} className="group block">
                <div className="relative aspect-[4/3]">
                  <ProductArt variant={hero.art} tint={hero.tint} title={hero.name} className="transition duration-500 group-hover:scale-[1.03]" />
                  <div className="absolute left-4 top-4 max-w-[62%] rounded-2xl rounded-bl-sm border-2 border-ink bg-bg-elev px-3 py-2 text-sm font-semibold shadow-hard-sm">
                    {H.bubbles.robot}
                  </div>
                  <div className="absolute bottom-4 right-4 max-w-[58%] rounded-2xl rounded-br-sm border-2 border-ink bg-tint-yellow px-3 py-2 text-sm font-semibold shadow-hard-sm">
                    {H.bubbles.child}
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 border-t-2 border-ink bg-bg-elev p-5">
                  <div className="min-w-0">
                    <p className="truncate font-extrabold">{hero.name}</p>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
                      <Stars rating={hero.rating} />
                      <span>{hero.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <Price amount={hero.price} locale={locale} className="text-xl" />
                </div>
              </Link>
            </div>
            <div className="absolute -right-3 -top-4 rotate-6 rounded-xl border-2 border-ink bg-accent px-3 py-2 text-white shadow-hard-sm sm:-right-6">
              <span className="block text-[10px] font-bold uppercase tracking-wider opacity-80">{H.hero.priceBadge}</span>
              <span className="font-mono text-lg font-extrabold tabular-nums">{formatVnd(minPrice, locale)}</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Trust strip */}
      <div className="border-b-2 border-ink bg-ink text-bg">
        <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-3 text-sm font-bold">
          {H.strip.map((s) => (
            <span key={s} className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
              {s}
            </span>
          ))}
        </Container>
      </div>

      {/* Age finder */}
      <Section id="ages" className="pb-12 sm:pb-16">
        <div className="text-center">
          <Eyebrow>{H.ages.eyebrow}</Eyebrow>
          <Heading className="font-extrabold">{H.ages.title}</Heading>
          <p className="mx-auto mt-4 max-w-xl text-muted">{H.ages.subtitle}</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {ageGroups.map((a) => {
            const count = products.filter((p) => p.ages.includes(a)).length;
            return (
              <Link
                key={a}
                href={localePath(locale, `/products?age=${a}`)}
                className={`kcard kcard-hover group flex flex-col overflow-hidden ${ageTint[a]}`}
              >
                <div className="aspect-[4/3] px-6 pt-4">
                  <ProductArt variant={ageArt[a]} title={t.shop.ages[a].name} plain className="transition duration-300 group-hover:scale-105" />
                </div>
                <div className="border-t-2 border-ink bg-bg-elev p-4">
                  <p className="text-lg font-extrabold">{t.shop.ages[a].name}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-muted">{t.shop.ages[a].short}</p>
                  <p className="mt-2 text-xs font-bold text-accent">
                    {count} {count === 1 ? t.shop.labels.result : t.shop.labels.results} →
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </Section>

      {/* Stats */}
      <Container className="pb-16 sm:pb-20">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {H.stats.map((s) => (
            <div key={s.label} className="kcard p-5 text-center sm:p-6">
              <p className="font-mono text-2xl font-extrabold tabular-nums text-accent sm:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs font-semibold text-muted sm:text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </Container>

      {/* Best sellers */}
      <Section id="products" className="border-t-2 border-ink bg-tint-yellow/50">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>{H.catalog.eyebrow}</Eyebrow>
            <Heading className="font-extrabold">{H.catalog.title}</Heading>
            <Lead>{H.catalog.subtitle}</Lead>
          </div>
          <Link href={localePath(locale, "/products")} className="kbtn kbtn-white h-11 px-5 text-sm">
            {t.shop.labels.allProducts} <Arrow />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {picks.map((p) => (
            <ProductCard key={p.slug} product={p} locale={locale} t={t} />
          ))}
        </div>
        <p className="mt-6 text-center text-xs text-muted">{t.shop.labels.priceNote}</p>
      </Section>

      {/* Bundles & accessories */}
      <Section className="border-t-2 border-ink">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>{H.bundles.eyebrow}</Eyebrow>
            <Heading className="font-extrabold">{H.bundles.title}</Heading>
            <Lead>{H.bundles.subtitle}</Lead>
          </div>
          <Link href={localePath(locale, "/products?category=combo")} className="inline-flex items-center gap-2 text-sm font-bold text-accent hover:underline">
            {t.shop.categories.combo.name} <Arrow />
          </Link>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {bundles.map((p) => (
            <ProductCard key={p.slug} product={p} locale={locale} t={t} />
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {accessories.map((p) => (
            <Link key={p.slug} href={localePath(locale, `/products/${p.slug}`)} className="kcard kcard-hover group flex items-center gap-3 p-3">
              <span className="h-16 w-20 shrink-0 overflow-hidden rounded-xl border-2 border-ink">
                <ProductArt variant={p.art} tint={p.tint} title={p.name} className="transition duration-300 group-hover:scale-105" />
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-bold">{p.name}</span>
                <Price amount={p.price} locale={locale} className="text-sm" />
              </span>
            </Link>
          ))}
        </div>
      </Section>

      {/* Why */}
      <Section className="border-t-2 border-ink bg-tint-blue/40">
        <div className="max-w-3xl">
          <Eyebrow>{H.why.eyebrow}</Eyebrow>
          <Heading className="font-extrabold">{H.why.title}</Heading>
          <Lead>{H.why.subtitle}</Lead>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {H.why.items.map((item, i) => (
            <div key={item.title} className="kcard p-6">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border-2 border-ink bg-tint-yellow font-mono text-sm font-extrabold">
                0{i + 1}
              </span>
              <h3 className="mt-4 font-extrabold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="kdots border-t-2 border-ink">
        <div className="text-center">
          <Eyebrow>{H.testimonials.eyebrow}</Eyebrow>
          <Heading className="font-extrabold">{H.testimonials.title}</Heading>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {H.testimonials.items.map((item, i) => (
            <figure key={item.name} className={`kcard relative p-6 ${i === 1 ? "lg:-translate-y-3" : ""}`}>
              <span className="absolute -top-4 left-6 rounded-lg border-2 border-ink bg-tint-pink px-2 py-0.5 font-mono text-lg font-extrabold leading-none">“</span>
              <Stars rating={5} className="[&>svg]:h-3.5 [&>svg]:w-3.5" />
              <blockquote className="mt-3 text-sm leading-relaxed">{item.quote}</blockquote>
              <figcaption className="mt-4 flex items-center gap-3 border-t-2 border-border pt-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink bg-tint-yellow text-sm font-extrabold">
                  {item.name.trim().slice(-1).toUpperCase()}
                </span>
                <span>
                  <span className="block text-sm font-bold">{item.name}</span>
                  <span className="block text-xs text-muted">{item.role}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      {/* Family */}
      <Section className="border-t-2 border-ink bg-tint-green/40">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="grid grid-cols-2 gap-4">
            {homeProducts.map((p) => (
              <Link key={p.slug} href={localePath(locale, `/products/${p.slug}`)} className="kcard kcard-hover group overflow-hidden">
                <div className="aspect-[4/3]">
                  <ProductArt variant={p.art} tint={p.tint} title={p.name} className="transition duration-300 group-hover:scale-[1.03]" />
                </div>
                <div className="border-t-2 border-ink p-4">
                  <p className="font-extrabold">{p.name}</p>
                  <Price amount={p.price} locale={locale} className="text-sm" />
                </div>
              </Link>
            ))}
          </div>
          <div>
            <Eyebrow>{H.family.eyebrow}</Eyebrow>
            <Heading className="font-extrabold">{H.family.title}</Heading>
            <Lead>{H.family.body}</Lead>
            <ul className="mt-6 space-y-3">
              {H.family.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm font-semibold">
                  <Check />
                  {b}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link href={localePath(locale, "/products?category=home")} className="kbtn kbtn-ink h-12 px-6 text-base">
                {H.family.cta} <Arrow />
              </Link>
            </div>
          </div>
        </div>
      </Section>

      {/* Steps */}
      <Section className="border-t-2 border-ink">
        <div className="text-center">
          <Eyebrow>{H.steps.eyebrow}</Eyebrow>
          <Heading className="font-extrabold">{H.steps.title}</Heading>
          <p className="mx-auto mt-4 max-w-xl text-muted">{H.steps.subtitle}</p>
        </div>
        <ol className="mt-12 grid gap-4 md:grid-cols-4">
          {H.steps.items.map((s, i) => (
            <li key={s.name} className="kcard relative p-5">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-ink bg-accent font-mono text-sm font-extrabold text-white">
                {i + 1}
              </span>
              <h3 className="mt-4 font-extrabold">{s.name}</h3>
              <p className="mt-1 text-sm text-muted">{s.desc}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* FAQ */}
      <Section className="border-t-2 border-ink bg-tint-peach/40">
        <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
          <div>
            <Heading className="font-extrabold">{H.faq.title}</Heading>
            <div className="kcard mt-6 p-5 text-sm">
              <p className="font-bold">{t.checkout.support.title}</p>
              <p className="mt-1 text-muted">{t.checkout.support.body}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`tel:${company.phoneE164}`} className="kbtn kbtn-ink h-9 px-3 text-sm">
                  {company.phoneDisplay}
                </a>
                <a href={company.zaloUrl} target="_blank" rel="noopener noreferrer" className="kbtn kbtn-white h-9 px-3 text-sm">
                  {t.shop.zalo}
                </a>
              </div>
            </div>
          </div>
          <div className="kcard divide-y-2 divide-border overflow-hidden">
            {H.faq.items.map((f) => (
              <details key={f.q} className="group p-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-bold">
                  {f.q}
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-ink text-sm transition group-open:rotate-45 group-open:bg-ink group-open:text-bg" aria-hidden="true">
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
      <Section className="border-t-2 border-ink">
        <div className="kcard grid items-center gap-10 p-6 sm:p-10 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <Eyebrow>{H.solutions.eyebrow}</Eyebrow>
            <Heading as="h3" className="text-2xl font-extrabold sm:text-3xl">
              {H.solutions.title}
            </Heading>
            <p className="mt-4 text-muted">{H.solutions.body}</p>
            <div className="mt-6">
              <Link href={localePath(locale, "/solutions")} className="kbtn kbtn-white h-11 px-5 text-sm">
                {H.solutions.cta} <Arrow />
              </Link>
            </div>
          </div>
          <div className="overflow-hidden rounded-xl border-2 border-ink bg-bg">
            <SdlcIllustration title={t.solutions.flagship.title} className="aspect-[3/2]" />
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="border-t-2 border-ink">
        <div className="kcard relative overflow-hidden bg-ink p-10 text-center text-bg sm:p-16">
          <div className="kblob pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 bg-accent/60" aria-hidden="true" />
          <div className="kblob pointer-events-none absolute -right-16 -top-24 h-56 w-56 bg-tint-yellow/40" aria-hidden="true" />
          <Heading className="relative font-extrabold text-bg">{H.cta.title}</Heading>
          <p className="relative mx-auto mt-4 max-w-xl text-bg/75">{H.cta.body}</p>
          <div className="relative mt-8 flex flex-wrap justify-center gap-3">
            <a href={`tel:${company.phoneE164}`} className="kbtn kbtn-accent h-12 px-6 text-base">
              {H.cta.primary}
            </a>
            <Link href={localePath(locale, "/contact")} className="kbtn kbtn-white h-12 px-6 text-base">
              {H.cta.secondary}
            </Link>
          </div>
        </div>
      </Section>
    </>
  );
}

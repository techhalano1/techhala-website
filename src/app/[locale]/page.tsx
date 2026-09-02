import Link from "next/link";
import { getDictionary } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import { Terminal } from "@/components/Terminal";
import { PillarIcon } from "@/components/PillarIcon";
import { Arrow, Button, Card, Check, Container, Eyebrow, Heading, Lead, Section } from "@/components/ui";

export default async function Home({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const featured = t.work.items.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
        <div
          className="pointer-events-none absolute -top-40 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{ background: "linear-gradient(120deg, var(--accent), var(--accent-2))" }}
          aria-hidden="true"
        />
        <Container className="relative grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1.05fr_1fr] lg:py-32">
          <div className="fade-up">
            <Eyebrow>{t.home.hero.eyebrow}</Eyebrow>
            <Heading as="h1">
              {t.home.hero.title} <span className="text-gradient">{t.home.hero.highlight}</span>
            </Heading>
            <Lead>{t.home.hero.subtitle}</Lead>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={localePath(locale, "/contact")}>{t.home.hero.primaryCta}</Button>
              <Button href={localePath(locale, "/solutions")} variant="secondary">
                {t.home.hero.secondaryCta}
                <Arrow />
              </Button>
            </div>
          </div>
          <div className="fade-up [animation-delay:150ms]">
            <Terminal steps={t.home.hero.terminal} />
          </div>
        </Container>
      </div>

      {/* Pillars */}
      <Section className="border-t border-border">
        <Eyebrow>{t.home.pillars.eyebrow}</Eyebrow>
        <Heading>{t.home.pillars.title}</Heading>
        <Lead>{t.home.pillars.subtitle}</Lead>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.solutions.items.map((p) => (
            <Link key={p.slug} href={localePath(locale, `/solutions/${p.slug}`)} className="group">
              <Card className="flex h-full flex-col">
                <PillarIcon slug={p.slug} />
                <h3 className="mt-5 text-lg font-semibold">{p.name}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{p.tagline}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  {t.common.learnMore}
                  <span className="transition group-hover:translate-x-0.5">
                    <Arrow />
                  </span>
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* Lifecycle */}
      <Section className="border-t border-border bg-bg-elev/50">
        <div className="max-w-3xl">
          <Eyebrow>{t.home.lifecycle.eyebrow}</Eyebrow>
          <Heading>{t.home.lifecycle.title}</Heading>
          <Lead>{t.home.lifecycle.subtitle}</Lead>
        </div>
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {t.home.lifecycle.steps.map((s, i) => (
            <li key={s.name} className="relative rounded-xl border border-border bg-bg p-5">
              <span className="font-mono text-xs text-accent">0{i + 1}</span>
              <h3 className="mt-2 font-semibold">{s.name}</h3>
              <p className="mt-1.5 text-sm text-muted">{s.desc}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Product */}
      <Section className="border-t border-border">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <Eyebrow>{t.home.product.eyebrow}</Eyebrow>
            <Heading>{t.home.product.title}</Heading>
            <Lead>{t.home.product.body}</Lead>
            <ul className="mt-6 space-y-3">
              {t.home.product.bullets.map((b) => (
                <li key={b} className="flex gap-3 text-sm sm:text-base">
                  <Check />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button href={localePath(locale, "/products/hal-sdlc")}>
                {t.home.product.cta}
                <Arrow />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {t.home.product.stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-bg-elev p-6">
                <div className="text-gradient text-4xl font-semibold tracking-tight">{s.value}</div>
                <div className="mt-1 text-sm text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Work */}
      <Section className="border-t border-border bg-bg-elev/50">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <Eyebrow>{t.home.work.eyebrow}</Eyebrow>
            <Heading>{t.home.work.title}</Heading>
            <Lead>{t.home.work.subtitle}</Lead>
          </div>
          <Button href={localePath(locale, "/work")} variant="secondary">
            {t.common.viewAll}
            <Arrow />
          </Button>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {featured.map((c) => (
            <Link key={c.slug} href={localePath(locale, `/work/${c.slug}`)} className="group">
              <Card className="flex h-full flex-col bg-bg">
                <span className="font-mono text-xs uppercase tracking-wider text-muted">{c.industry}</span>
                <h3 className="mt-3 text-lg font-semibold leading-snug">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm text-muted">{c.summary}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  {t.common.learnMore}
                  <span className="transition group-hover:translate-x-0.5">
                    <Arrow />
                  </span>
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </Section>

      {/* Trust */}
      <Section className="border-t border-border py-14 sm:py-16">
        <p className="text-center text-sm text-muted">{t.home.trust.title}</p>
        <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 font-mono text-sm text-muted/80">
          {t.home.trust.items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </Section>

      {/* CTA */}
      <Section className="border-t border-border">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-bg-elev p-10 text-center sm:p-16">
          <div
            className="pointer-events-none absolute -bottom-32 left-1/2 h-64 w-[600px] -translate-x-1/2 rounded-full opacity-25 blur-3xl"
            style={{ background: "linear-gradient(120deg, var(--accent), var(--accent-2))" }}
            aria-hidden="true"
          />
          <Heading className="relative">{t.home.cta.title}</Heading>
          <p className="relative mx-auto mt-4 max-w-xl text-muted">{t.home.cta.body}</p>
          <div className="relative mt-8">
            <Button href={localePath(locale, "/contact")}>{t.home.cta.button}</Button>
          </div>
        </div>
      </Section>
    </>
  );
}

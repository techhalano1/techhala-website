import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, pillarSlugs } from "@/content";
import { locales, localePath, type Locale } from "@/lib/i18n";
import { PillarIcon } from "@/components/PillarIcon";
import { PillarArt } from "@/components/illustrations";
import { Arrow, Button, Card, Check, Eyebrow, Heading, Lead, Section } from "@/components/ui";

type Params = { locale: Locale; slug: string };

export function generateStaticParams() {
  return locales.flatMap((locale) => pillarSlugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const p = getDictionary(locale).solutions.items.find((x) => x.slug === slug);
  if (!p) return {};
  return { title: p.name, description: p.tagline };
}

export default async function PillarPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const t = getDictionary(locale);
  const p = t.solutions.items.find((x) => x.slug === slug);
  if (!p) notFound();
  const L = t.solutions.sectionLabels;
  const related = t.work.items.filter((c) => c.pillar === p.slug).slice(0, 3);
  const others = t.solutions.items.filter((x) => x.slug !== p.slug);

  return (
    <>
      {/* Hero */}
      <div className="relative overflow-hidden border-b border-border">
        <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
        <Section className="relative">
          <Link
            href={localePath(locale, "/solutions")}
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-fg"
          >
            <span className="rotate-180">
              <Arrow />
            </span>
            {t.solutions.title}
          </Link>
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div className="flex items-start gap-5">
              <PillarIcon slug={p.slug} className="mt-1 hidden h-14 w-14 sm:block" />
              <div>
                <Heading as="h1">{p.name}</Heading>
                <p className="mt-3 max-w-2xl text-xl sm:text-2xl">{p.tagline}</p>
                <Lead>{p.summary}</Lead>
                <div className="mt-8">
                  <Button href={localePath(locale, "/contact")}>{p.cta}</Button>
                </div>
              </div>
            </div>
            <PillarArt slug={p.slug} title={p.tagline} className="glow aspect-[3/2] rounded-2xl" />
          </div>
        </Section>
      </div>

      {/* Problem */}
      <Section>
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <Eyebrow>{L.problem}</Eyebrow>
            <Heading>{p.problem.title}</Heading>
          </div>
          <p className="text-lg text-muted lg:pt-10">{p.problem.body}</p>
        </div>
      </Section>

      {/* Approach */}
      <Section className="border-t border-border bg-bg-elev/50">
        <Eyebrow>{L.approach}</Eyebrow>
        <Heading>{p.approach.title}</Heading>
        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {p.approach.steps.map((s, i) => (
            <li key={s.title} className="rounded-xl border border-border bg-bg p-6">
              <span className="font-mono text-xs text-accent">0{i + 1}</span>
              <h3 className="mt-2 font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted">{s.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Capabilities */}
      <Section className="border-t border-border">
        <Eyebrow>{L.capabilities}</Eyebrow>
        <Heading>{L.capabilities}</Heading>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {p.capabilities.map((c) => (
            <Card key={c.title}>
              <h3 className="font-semibold">{c.title}</h3>
              <p className="mt-2 text-sm text-muted">{c.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Outcomes + Use cases */}
      <Section className="border-t border-border bg-bg-elev/50">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Eyebrow>{L.outcomes}</Eyebrow>
            <ul className="mt-2 space-y-4">
              {p.outcomes.map((o) => (
                <li key={o} className="flex gap-3 text-lg">
                  <Check />
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Eyebrow>{L.useCases}</Eyebrow>
            <ul className="mt-2 grid gap-3">
              {p.useCases.map((u) => (
                <li key={u} className="rounded-lg border border-border bg-bg px-4 py-3 text-sm">
                  {u}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* Related work */}
      {related.length > 0 && (
        <Section className="border-t border-border">
          <Eyebrow>{t.nav.work}</Eyebrow>
          <Heading>{t.home.work.title}</Heading>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {related.map((c) => (
              <Link key={c.slug} href={localePath(locale, `/work/${c.slug}`)} className="group">
                <Card className="h-full p-4">
                  <PillarArt slug={c.pillar} title={c.title} crop className="aspect-[2/1]" />
                  <span className="mt-5 block px-2 font-mono text-xs uppercase tracking-wider text-muted">{c.industry}</span>
                  <h3 className="mt-3 px-2 font-semibold leading-snug">{c.title}</h3>
                  <p className="mt-2 px-2 pb-2 text-sm text-muted">{c.summary}</p>
                </Card>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {/* CTA + other pillars */}
      <Section className="border-t border-border">
        <div className="rounded-2xl border border-border bg-bg-elev p-10 text-center sm:p-14">
          <Heading>{t.home.cta.title}</Heading>
          <p className="mx-auto mt-4 max-w-xl text-muted">{t.home.cta.body}</p>
          <div className="mt-8">
            <Button href={localePath(locale, "/contact")}>{p.cta}</Button>
          </div>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={localePath(locale, `/solutions/${o.slug}`)}
              className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted transition hover:border-fg/40 hover:text-fg"
            >
              {o.name}
              <Arrow />
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content";
import { en } from "@/content/en";
import { locales, localePath, type Locale } from "@/lib/i18n";
import { PillarIcon } from "@/components/PillarIcon";
import { Arrow, Button, Check, Eyebrow, Heading, Lead, Section } from "@/components/ui";

type Params = { locale: Locale; slug: string };

export function generateStaticParams() {
  return locales.flatMap((locale) => en.work.items.map((c) => ({ locale, slug: c.slug })));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const c = getDictionary(locale).work.items.find((x) => x.slug === slug);
  if (!c) return {};
  return { title: c.title, description: c.summary };
}

export default async function CaseStudyPage({ params }: { params: Promise<Params> }) {
  const { locale, slug } = await params;
  const t = getDictionary(locale);
  const c = t.work.items.find((x) => x.slug === slug);
  if (!c) notFound();
  const pillar = t.solutions.items.find((p) => p.slug === c.pillar);
  const more = t.work.items.filter((x) => x.slug !== c.slug).slice(0, 2);

  return (
    <>
      <div className="border-b border-border">
        <Section>
          <Link
            href={localePath(locale, "/work")}
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted hover:text-fg"
          >
            <span className="rotate-180">
              <Arrow />
            </span>
            {t.work.title}
          </Link>
          <Eyebrow>
            {c.client} · {c.industry}
          </Eyebrow>
          <Heading as="h1" className="max-w-4xl">
            {c.title}
          </Heading>
          <Lead>{c.summary}</Lead>
        </Section>
      </div>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-12">
            <div>
              <Eyebrow>{t.common.challenge}</Eyebrow>
              <p className="text-lg">{c.challenge}</p>
            </div>
            <div>
              <Eyebrow>{t.common.solution}</Eyebrow>
              <p className="text-lg">{c.solution}</p>
            </div>
            <div>
              <Eyebrow>{t.common.results}</Eyebrow>
              <ul className="space-y-3">
                {c.results.map((r) => (
                  <li key={r} className="flex gap-3 text-lg">
                    <Check />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <aside className="space-y-6 lg:pt-2">
            <div className="rounded-xl border border-border bg-bg-elev p-6">
              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-muted">{t.common.industry}</dt>
                  <dd className="mt-1 font-medium">{c.industry}</dd>
                </div>
                {pillar && (
                  <div>
                    <dt className="text-muted">{t.common.relatedSolution}</dt>
                    <dd className="mt-2">
                      <Link
                        href={localePath(locale, `/solutions/${pillar.slug}`)}
                        className="inline-flex items-center gap-2 font-medium text-accent hover:underline"
                      >
                        <PillarIcon slug={pillar.slug} className="h-8 w-8" />
                        {pillar.name}
                      </Link>
                    </dd>
                  </div>
                )}
              </dl>
            </div>
            <Button href={localePath(locale, "/contact")} className="w-full">
              {t.common.talkToUs}
            </Button>
          </aside>
        </div>
      </Section>

      <Section className="border-t border-border bg-bg-elev/50">
        <Heading as="h3">{t.home.work.title}</Heading>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {more.map((m) => (
            <Link
              key={m.slug}
              href={localePath(locale, `/work/${m.slug}`)}
              className="rounded-xl border border-border bg-bg p-6 transition hover:border-fg/30"
            >
              <span className="font-mono text-xs uppercase tracking-wider text-muted">{m.industry}</span>
              <h4 className="mt-2 font-semibold">{m.title}</h4>
              <p className="mt-2 text-sm text-muted">{m.summary}</p>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}

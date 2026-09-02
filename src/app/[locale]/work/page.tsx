import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import { PillarIcon } from "@/components/PillarIcon";
import { Arrow, Card, Heading, Lead, Section } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return { title: t.work.title, description: t.work.subtitle };
}

export default async function WorkPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const pillarName = (slug: string) => t.solutions.items.find((p) => p.slug === slug)?.name ?? slug;

  return (
    <>
      <Section className="pb-10 sm:pb-12">
        <Heading as="h1">{t.work.title}</Heading>
        <Lead>{t.work.subtitle}</Lead>
      </Section>
      <Section className="pt-0 sm:pt-0">
        <div className="grid gap-6 md:grid-cols-2">
          {t.work.items.map((c) => (
            <Link key={c.slug} href={localePath(locale, `/work/${c.slug}`)} className="group">
              <Card className="flex h-full flex-col p-8">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-mono text-xs uppercase tracking-wider text-muted">{c.industry}</span>
                  <span className="inline-flex items-center gap-2 text-xs text-muted">
                    <PillarIcon slug={c.pillar} className="h-7 w-7" />
                    {pillarName(c.pillar)}
                  </span>
                </div>
                <h2 className="mt-4 text-xl font-semibold leading-snug">{c.title}</h2>
                <p className="mt-3 flex-1 text-muted">{c.summary}</p>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
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
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import { PillarIcon } from "@/components/PillarIcon";
import { PillarArt } from "@/components/illustrations";
import { Arrow, Button, Card, Heading, Lead, Section } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return { title: t.solutions.title, description: t.solutions.subtitle };
}

export default async function SolutionsPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);

  return (
    <>
      <Section className="pb-10 sm:pb-12">
        <Heading as="h1">{t.solutions.title}</Heading>
        <Lead>{t.solutions.subtitle}</Lead>
      </Section>
      <Section className="pt-0 sm:pt-0">
        <div className="grid gap-6 lg:grid-cols-3">
          {t.solutions.items.map((p) => (
            <Card key={p.slug} className="flex flex-col p-4 sm:p-5">
              <PillarArt slug={p.slug} title={p.tagline} className="aspect-[3/2]" />
              <div className="mt-6 flex items-center gap-4 px-2">
                <PillarIcon slug={p.slug} />
                <h2 className="text-2xl font-semibold">{p.name}</h2>
              </div>
              <p className="mt-4 px-2 text-lg">{p.tagline}</p>
              <p className="mt-3 flex-1 px-2 text-muted">{p.summary}</p>
              <ul className="mt-6 grid gap-2 px-2 text-sm">
                {p.capabilities.slice(0, 4).map((c) => (
                  <li key={c.title} className="flex items-center gap-2 text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {c.title}
                  </li>
                ))}
              </ul>
              <div className="mt-8 px-2 pb-2">
                <Link
                  href={localePath(locale, `/solutions/${p.slug}`)}
                  className="inline-flex items-center gap-2 font-medium text-accent hover:underline"
                >
                  {t.common.learnMore}
                  <Arrow />
                </Link>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Button href={localePath(locale, "/contact")}>{t.common.talkToUs}</Button>
        </div>
      </Section>
    </>
  );
}

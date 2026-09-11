import type { Metadata } from "next";
import Link from "next/link";
import { getDictionary } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import { PillarIcon } from "@/components/PillarIcon";
import { PillarArt, SdlcIllustration } from "@/components/illustrations";
import { Arrow, Button, Card, Eyebrow, Heading, Lead, Section } from "@/components/ui";

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
  const order = ["ai-sdlc", "ai-enterprise", "ai-robot"] as const;
  const items = order.map((slug) => t.solutions.items.find((p) => p.slug === slug)).filter((p) => p !== undefined);

  return (
    <>
      <div className="relative overflow-hidden border-b border-border">
        <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
        <Section className="relative">
          <Heading as="h1">{t.solutions.title}</Heading>
          <Lead>{t.solutions.subtitle}</Lead>
        </Section>
      </div>
      <Section>
        <div className="grid gap-6 lg:grid-cols-3">
          {items.map((p) => (
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
      </Section>

      <Section className="border-t border-border bg-bg-elev/50">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="overflow-hidden rounded-2xl border border-border bg-bg">
            <SdlcIllustration title={t.solutions.flagship.title} className="aspect-[3/2]" />
          </div>
          <div>
            <Eyebrow>{t.solutions.flagship.eyebrow}</Eyebrow>
            <Heading>{t.solutions.flagship.title}</Heading>
            <Lead>{t.solutions.flagship.body}</Lead>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={localePath(locale, "/solutions/hal-sdlc")}>
                {t.solutions.flagship.cta}
                <Arrow />
              </Button>
              <Button href={localePath(locale, "/contact")} variant="secondary">
                {t.common.talkToUs}
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

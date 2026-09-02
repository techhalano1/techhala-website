import type { Metadata } from "next";
import { getDictionary } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import { Button, Card, Eyebrow, Heading, Lead, Section } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return { title: t.about.title, description: t.about.subtitle };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const A = t.about;

  return (
    <>
      <div className="relative overflow-hidden border-b border-border">
        <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
        <Section className="relative">
          <Heading as="h1">{A.title}</Heading>
          <Lead>{A.subtitle}</Lead>
        </Section>
      </div>

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.3fr]">
          <div>
            <Eyebrow>{A.mission.title}</Eyebrow>
            <p className="text-2xl font-medium leading-snug sm:text-3xl">{A.mission.body}</p>
          </div>
          <div>
            <Eyebrow>{A.story.title}</Eyebrow>
            <div className="space-y-4 text-muted">
              {A.story.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="border-t border-border bg-bg-elev/50">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {A.values.map((v) => (
            <Card key={v.title} className="bg-bg">
              <h3 className="font-semibold">{v.title}</h3>
              <p className="mt-2 text-sm text-muted">{v.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {A.stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-bg-elev p-6 text-center">
              <div className="text-gradient text-3xl font-semibold">{s.value}</div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Button href={localePath(locale, "/contact")}>{t.common.talkToUs}</Button>
        </div>
      </Section>
    </>
  );
}

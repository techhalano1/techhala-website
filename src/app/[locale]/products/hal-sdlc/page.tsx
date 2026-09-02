import type { Metadata } from "next";
import { getDictionary } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import { Terminal } from "@/components/Terminal";
import { Arrow, Button, Card, Check, Container, Eyebrow, Heading, Lead, Section } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return { title: t.product.title, description: t.product.subtitle };
}

export default async function ProductPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const P = t.product;

  return (
    <>
      <div className="relative overflow-hidden border-b border-border">
        <div className="grid-bg pointer-events-none absolute inset-0" aria-hidden="true" />
        <Container className="relative grid items-center gap-12 py-20 sm:py-28 lg:grid-cols-[1fr_1fr]">
          <div>
            <Eyebrow>{P.eyebrow}</Eyebrow>
            <Heading as="h1">
              <span className="text-gradient">{P.title}</span>
            </Heading>
            <Lead>{P.subtitle}</Lead>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button href={localePath(locale, "/contact")}>{P.primaryCta}</Button>
              <Button href={localePath(locale, "/solutions/ai-sdlc")} variant="secondary">
                {P.secondaryCta}
                <Arrow />
              </Button>
            </div>
          </div>
          <Terminal steps={t.home.hero.terminal} />
        </Container>
      </div>

      <Section>
        <Heading>{P.workflow.title}</Heading>
        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {P.workflow.steps.map((s, i) => (
            <li key={s.name} className="rounded-xl border border-border bg-bg-elev p-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-fg font-mono text-xs text-bg">
                  {i + 1}
                </span>
                <h3 className="text-lg font-semibold">{s.name}</h3>
              </div>
              <p className="mt-3 text-sm text-muted">{s.desc}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section className="border-t border-border bg-bg-elev/50">
        <Heading>{P.features.title}</Heading>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {P.features.items.map((f) => (
            <Card key={f.title} className="bg-bg">
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted">{f.body}</p>
            </Card>
          ))}
        </div>
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {t.home.product.stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-border bg-bg p-6 text-center">
              <div className="text-gradient text-3xl font-semibold">{s.value}</div>
              <div className="mt-1 text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section className="border-t border-border">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <Heading>{P.audiences.title}</Heading>
            <ul className="mt-8 space-y-6">
              {P.audiences.items.map((a) => (
                <li key={a.title} className="border-l-2 border-accent pl-5">
                  <h3 className="font-semibold">{a.title}</h3>
                  <p className="mt-1 text-sm text-muted">{a.body}</p>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Heading>{P.delivery.title}</Heading>
            <p className="mt-4 text-muted">{P.delivery.body}</p>
            <ul className="mt-6 space-y-3">
              {P.delivery.items.map((d) => (
                <li key={d} className="flex gap-3 text-sm">
                  <Check />
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section className="border-t border-border bg-bg-elev/50">
        <Heading>{P.faq.title}</Heading>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {P.faq.items.map((f) => (
            <details key={f.q} className="group rounded-xl border border-border bg-bg p-5 open:border-fg/30">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium">
                {f.q}
                <span className="text-muted transition group-open:rotate-45">+</span>
              </summary>
              <p className="mt-3 text-sm text-muted">{f.a}</p>
            </details>
          ))}
        </div>
        <div className="mt-14 text-center">
          <Button href={localePath(locale, "/contact")}>{P.primaryCta}</Button>
        </div>
      </Section>
    </>
  );
}

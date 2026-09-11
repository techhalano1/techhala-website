import type { Metadata } from "next";
import { getDictionary } from "@/content";
import { type Locale } from "@/lib/i18n";
import { OrderLookupForm } from "@/components/OrderLookupForm";
import { Heading, Lead, Section } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return { title: t.orders.title, description: t.orders.subtitle, robots: { index: false } };
}

export default async function OrdersLookupPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ code?: string }>;
}) {
  const { locale } = await params;
  const { code } = await searchParams;
  const t = getDictionary(locale);

  return (
    <>
      <Section className="kdots pb-8 pt-12 sm:pb-10 sm:pt-16">
        <Heading as="h1" className="font-extrabold">
          {t.orders.title}
        </Heading>
        <Lead>{t.orders.subtitle}</Lead>
      </Section>
      <Section className="pt-4 sm:pt-6">
        <OrderLookupForm locale={locale} copy={t.orders.form} initialCode={code} />
      </Section>
    </>
  );
}

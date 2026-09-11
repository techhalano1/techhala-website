import type { Metadata } from "next";
import { getDictionary } from "@/content";
import { type Locale } from "@/lib/i18n";
import { CheckoutForm } from "@/components/CheckoutForm";
import { Heading, Lead, Section } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return { title: t.checkout.title, description: t.checkout.subtitle, robots: { index: false } };
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ product?: string }>;
}) {
  const { locale } = await params;
  const { product } = await searchParams;
  const t = getDictionary(locale);

  return (
    <>
      <Section className="pb-8 sm:pb-10">
        <Heading as="h1">{t.checkout.title}</Heading>
        <Lead>{t.checkout.subtitle}</Lead>
      </Section>
      <Section className="pt-0 sm:pt-0">
        <CheckoutForm
          locale={locale}
          checkout={t.checkout}
          shop={t.shop}
          products={t.products.items}
          initialSlug={product}
        />
      </Section>
    </>
  );
}

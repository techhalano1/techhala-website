import type { Metadata } from "next";
import { getDictionary } from "@/content";
import { getStoreDictionary } from "@/lib/catalog";
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
  const t = await getStoreDictionary(locale);

  return (
    <>
      <Section className="kdots pb-8 pt-12 sm:pb-10 sm:pt-16">
        <Heading as="h1" className="font-extrabold">
          {t.checkout.title}
        </Heading>
        <Lead>{t.checkout.subtitle}</Lead>
      </Section>
      <Section className="pt-4 sm:pt-6">
        <CheckoutForm
          locale={locale}
          checkout={t.checkout}
          shop={t.shop}
          products={t.products.items}
          initialSlug={product}
          t={t}
        />
      </Section>
    </>
  );
}

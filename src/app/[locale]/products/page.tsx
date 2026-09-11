import type { Metadata } from "next";
import { Suspense } from "react";
import { getDictionary } from "@/content";
import { getStoreDictionary } from "@/lib/catalog";
import { type Locale } from "@/lib/i18n";
import { company } from "@/lib/site";
import { ProductCatalog } from "@/components/ProductCatalog";
import { Check, Eyebrow, Heading, Lead, Section } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return { title: t.products.title, description: t.products.subtitle };
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string; age?: string }>;
}) {
  const { locale } = await params;
  const { category, age } = await searchParams;
  const t = await getStoreDictionary(locale);

  return (
    <>
      <div className="kdots border-b-2 border-ink">
        <Section className="pt-12 pb-12 sm:pt-16 sm:pb-16">
          <Eyebrow>{t.nav.products}</Eyebrow>
          <Heading as="h1" className="font-extrabold">
            {t.products.title}
          </Heading>
          <Lead>{t.products.subtitle}</Lead>
          <ul className="mt-6 flex flex-wrap gap-2 text-sm">
            {t.shop.guarantees.map((g) => (
              <li key={g.title} className="flex items-center gap-2 rounded-full border-2 border-ink bg-bg-elev px-3 py-1 font-semibold">
                <Check />
                {g.title}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      <Section className="pt-10 pb-10 sm:pt-14 sm:pb-14">
        <Suspense>
          <ProductCatalog products={t.products.items} locale={locale} t={t} initialCategory={category} initialAge={age} />
        </Suspense>
      </Section>

      <Section className="pt-0 sm:pt-0">
        <div className="kcard flex flex-col items-center gap-4 bg-tint-yellow p-8 text-center sm:p-12">
          <p className="text-xs text-muted">{t.shop.labels.priceNote}</p>
          <Heading as="h3" className="font-extrabold">
            {t.checkout.support.title}
          </Heading>
          <p className="max-w-xl text-muted">{t.checkout.support.body}</p>
          <div className="flex flex-wrap justify-center gap-3">
            <a href={`tel:${company.phoneE164}`} className="kbtn kbtn-ink h-11 px-5 text-sm">
              {t.shop.callUs} · {company.phoneDisplay}
            </a>
            <a href={company.zaloUrl} target="_blank" rel="noopener noreferrer" className="kbtn kbtn-white h-11 px-5 text-sm">
              {t.shop.zalo}
            </a>
          </div>
        </div>
      </Section>
    </>
  );
}

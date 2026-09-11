import type { Metadata } from "next";
import { getDictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { company } from "@/lib/site";
import { ContactForm } from "@/components/ContactForm";
import { Heading, Lead, Section } from "@/components/ui";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDictionary(locale);
  return { title: t.nav.contact, description: t.contact.subtitle };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const t = getDictionary(locale);
  const C = t.contact;

  return (
    <Section>
      <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <Heading as="h1">{C.title}</Heading>
          <Lead>{C.subtitle}</Lead>
          <div className="mt-10 rounded-xl border border-border bg-bg-elev p-6">
            <h2 className="font-semibold">{C.aside.title}</h2>
            <p className="mt-1 text-sm text-muted">{C.aside.body}</p>
            <dl className="mt-5 space-y-3 text-sm">
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-muted">{t.shop.phone}</dt>
                <dd className="mt-0.5 flex flex-wrap items-center gap-3">
                  <a href={`tel:${company.phoneE164}`} className="font-mono font-semibold text-accent hover:underline">
                    {company.phoneDisplay}
                  </a>
                  <a
                    href={company.zaloUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted hover:border-fg/40 hover:text-fg"
                  >
                    {t.shop.zalo}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-muted">{t.shop.email}</dt>
                <dd className="mt-0.5">
                  <a href={`mailto:${company.email}`} className="text-accent hover:underline">
                    {company.email}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-xs uppercase tracking-wider text-muted">{t.shop.address}</dt>
                <dd className="mt-0.5">
                  {company.address}
                  <a
                    href={company.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-xs text-accent hover:underline"
                  >
                    {C.aside.visit} ↗
                  </a>
                </dd>
              </div>
            </dl>
            <p className="mt-5 text-xs text-muted">{C.aside.hours}</p>
          </div>
          <div className="mt-4 overflow-hidden rounded-xl border border-border">
            <iframe
              title={company.address}
              src={`https://www.google.com/maps?q=${encodeURIComponent(company.address)}&output=embed`}
              className="h-56 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-bg-elev p-6 sm:p-8">
          <ContactForm locale={locale} t={C.form} />
        </div>
      </div>
    </Section>
  );
}

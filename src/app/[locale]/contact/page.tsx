import type { Metadata } from "next";
import { getDictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
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
            <a
              href={`mailto:${C.aside.email}`}
              className="mt-4 inline-block font-mono text-sm text-accent hover:underline"
            >
              {C.aside.email}
            </a>
            <p className="mt-4 text-xs text-muted">{C.aside.location}</p>
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-bg-elev p-6 sm:p-8">
          <ContactForm locale={locale} t={C.form} />
        </div>
      </div>
    </Section>
  );
}

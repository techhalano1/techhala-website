import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { getDictionary } from "@/content";
import { isLocale, locales, type Locale } from "@/lib/i18n";
import { company, siteUrl } from "@/lib/site";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/cart/CartProvider";
import { CartDrawer } from "@/components/cart/CartDrawer";
import "../globals.css";

const inter = Inter({ subsets: ["latin", "vietnamese"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin", "vietnamese"], variable: "--font-mono" });

const themeInit = `(function(){try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const t = getDictionary(locale);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: t.meta.title, template: "%s · TechHala" },
    description: t.meta.description,
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
    },
    openGraph: {
      type: "website",
      siteName: "TechHala",
      title: t.meta.ogTitle,
      description: t.meta.description,
      locale: locale === "vi" ? "vi_VN" : "en_US",
    },
    twitter: { card: "summary_large_image", title: t.meta.ogTitle, description: t.meta.description },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const t = getDictionary(locale as Locale);

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: company.name,
    url: siteUrl,
    email: company.email,
    telephone: company.phoneE164,
    address: {
      "@type": "PostalAddress",
      streetAddress: company.addressParts.street,
      addressLocality: `${company.addressParts.ward}, ${company.addressParts.district}`,
      addressRegion: company.addressParts.city,
      addressCountry: company.addressParts.country,
    },
    sameAs: [company.github],
    description: t.meta.description,
  };

  return (
    <html
      lang={locale}
      className={`${inter.variable} ${mono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col">
        <CartProvider>
          <Nav locale={locale} t={t} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale} t={t} />
          <CartDrawer locale={locale} t={t} />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  );
}

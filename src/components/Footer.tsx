import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import type { Dictionary } from "@/content";
import { company } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer({ locale, t }: { locale: Locale; t: Dictionary }) {
  const companyLinks = [
    { href: localePath(locale, "/solutions"), label: t.nav.solutions },
    { href: localePath(locale, "/work"), label: t.nav.work },
    { href: localePath(locale, "/about"), label: t.nav.about },
    { href: localePath(locale, "/contact"), label: t.nav.contact },
  ];

  return (
    <footer className="border-t border-border">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo className="text-lg" />
          <p className="mt-3 max-w-sm text-sm text-muted">{t.footer.tagline}</p>
          <a
            href={company.github}
            target="_blank"
            rel="noreferrer"
            aria-label="GitHub"
            className="mt-5 inline-flex text-muted transition hover:text-fg"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 .5C5.7.5.5 5.7.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.9C23.5 5.7 18.3.5 12 .5z" />
            </svg>
          </a>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{t.footer.products}</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {t.products.items.map((p) => (
              <li key={p.slug}>
                <Link href={localePath(locale, `/products/${p.slug}`)} className="transition hover:text-fg">
                  {p.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href={localePath(locale, "/products")} className="text-accent transition hover:underline">
                {t.shop.labels.allProducts}
              </Link>
            </li>
            <li>
              <Link href={localePath(locale, "/orders")} className="transition hover:text-fg">
                {t.footer.trackOrder}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{t.footer.company}</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition hover:text-fg">
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={localePath(locale, "/solutions/hal-sdlc")} className="transition hover:text-fg">
                HAL-SDLC
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">{t.footer.contact}</h3>
          <ul className="mt-3 space-y-2 text-sm text-muted">
            <li>
              <a href={`tel:${company.phoneE164}`} className="font-mono transition hover:text-fg">
                {company.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${company.email}`} className="transition hover:text-fg">
                {company.email}
              </a>
            </li>
            <li>
              <a href={company.mapsUrl} target="_blank" rel="noopener noreferrer" className="transition hover:text-fg">
                {company.address}
              </a>
            </li>
            <li>
              <a href={company.zaloUrl} target="_blank" rel="noopener noreferrer" className="transition hover:text-fg">
                Zalo: {company.phoneLocal}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-5 text-xs text-muted sm:px-6">
          <span>
            © {new Date().getFullYear()} {company.name}. {t.footer.rights}
          </span>
          <span className="font-mono">{company.addressParts.city}, Việt Nam</span>
        </div>
      </div>
    </footer>
  );
}

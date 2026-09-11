# TechHala website

Company website for [TechHala](https://github.com/techhalano1) — AI SDLC, AIOps, AI Robot and AI Solutions.

Built with Next.js 15 (App Router), TypeScript and Tailwind CSS 4. Bilingual (`/en`, `/vi`), dark/light theme, static-first.

## Development

```bash
npm install
npm run dev        # http://localhost:3000 (redirects to /en or /vi)
npm run lint
npm run build && npm run start
```

## Structure

```
src/app/[locale]/           pages (shop home, products, checkout, solutions, solutions/hal-sdlc, work, about, contact)
src/content/{en,vi}.ts      all copy, typed by src/content/types.ts
src/components/             Nav, Footer, Terminal, ContactForm, ui primitives
src/middleware.ts           locale detection + redirect
```

## Configuration

See `.env.example`. `CONTACT_WEBHOOK_URL` receives contact-form submissions and `ORDER_WEBHOOK_URL` receives checkout orders as JSON; without them, submissions are only logged server-side.

Order payload: `{ type: "order", orderCode, lines: [{ slug, name, color?, unitPrice, quantity, lineTotal }], itemCount, total, currency: "VND", payment: "cod" | "bank", customer, locale, submittedAt }`. Prices are recomputed server-side from `src/content/en.ts`. The cart is client-side only (localStorage key `techhala-cart-v1`).

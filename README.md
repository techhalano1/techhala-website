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
src/app/[locale]/           pages (home, solutions, products/hal-sdlc, work, about, contact)
src/content/{en,vi}.ts      all copy, typed by src/content/types.ts
src/components/             Nav, Footer, Terminal, ContactForm, ui primitives
src/middleware.ts           locale detection + redirect
```

## Configuration

See `.env.example`. `CONTACT_WEBHOOK_URL` receives contact-form submissions as JSON; without it, submissions are only logged server-side.

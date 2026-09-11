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
src/app/[locale]/orders/    customer order lookup (code + phone) and tracking page
src/app/admin/              owner dashboard: orders, status workflow, payments, inventory
src/lib/db.ts, orders.ts    Supabase client (service role, server-only) and order/inventory logic
src/middleware.ts           locale detection + redirect (skips /admin)
supabase/schema.sql         database schema (tables, variant_stock view, set_order_status())
```

## Configuration

See `.env.example` for all variables.

### Orders & inventory (Supabase)

1. Create a Supabase project and run `supabase/schema.sql` in the SQL editor.
2. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (server-side only; RLS is enabled and there are no public policies, so the anon key cannot read orders).
3. Set `ADMIN_PASSWORD` and `ADMIN_SESSION_SECRET`, then open `/admin/login`.
4. In **Kho hàng**, click "Đồng bộ danh mục từ website" once to create products/variants from `src/content/vi.ts`, then enter opening stock.

Order flow: checkout → `orders` row (`pending`, code `TH-XXXXXXX`) + `order_items` + `order_events`. Admin moves it `pending → confirmed → packed → shipping → delivered` (or `cancelled` / `returned`). Stock is deducted when an order becomes `packed` and restored if a packed/shipped order is cancelled or returned; open orders count as *reserved*. Payments are recorded manually for now (COD cash or bank transfer with the order code as transfer note) — no online gateway is integrated yet.

Customers track orders at `/{locale}/orders` using order code + phone, or via the tokenized link shown after checkout (also visible in the admin order page to send over Zalo/SMS).

Without Supabase configured, checkout still accepts orders but only logs/notifies them.

### Notifications

New orders are pushed to Telegram when `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` are set, and POSTed as JSON to `ORDER_WEBHOOK_URL` (falls back to `CONTACT_WEBHOOK_URL`). `CONTACT_WEBHOOK_URL` also receives contact-form submissions. All notifications are best effort and never block order creation.

Order webhook payload: `{ type: "order", orderCode, orderId, lines: [{ slug, name, color?, unitPrice, quantity, lineTotal }], payment: "cod" | "bank", customer, locale, submittedAt }`. Prices are recomputed server-side from `src/content/vi.ts`. The cart is client-side only (localStorage key `techhala-cart-v1`).

### Smoke test

`npx tsx --env-file=.env.local scripts/smoke-orders.ts` syncs the catalog, creates and walks an order through the status workflow against the configured database, checks stock movements, then cleans up.

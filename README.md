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

Order flow: checkout → `orders` row (`pending`, code `TH-XXXXXXX`) + `order_items` + `order_events`. Admin moves it `pending → confirmed → packed → shipping → delivered` (or `cancelled` / `returned`). Stock is deducted when an order becomes `packed` and restored if a packed/shipped order is cancelled or returned; open orders count as *reserved*.

Checkout rejects lines that exceed `available = on_hand - reserved` (variants with no stock row count as 0) and product pages show "Tạm hết hàng" / "Chỉ còn N" (revalidated every 60 s). Set `STOCK_MODE=backorder` to accept orders regardless of stock. Checkout also has a honeypot field and caps orders per phone number (`MAX_ORDERS_PER_PHONE_PER_HOUR`, default 5).

Customers track orders at `/{locale}/orders` using order code + phone, or via the tokenized link shown after checkout (also visible in the admin order page to send over Zalo/SMS).

Without Supabase configured, checkout still accepts orders but only logs/notifies them.

### Payments (VietQR + SePay)

Two payment methods are offered: **COD** (recorded in admin when the courier remits) and **bank transfer** via a dynamic VietQR.

1. Set `BANK_CODE` (Napas short code, e.g. `TCB`), `BANK_ACCOUNT_NO`, `BANK_ACCOUNT_NAME` (unaccented). `BANK_BIN`/`BANK_NAME` override the built-in mapping for banks not in `src/lib/vietqr.ts`. After checkout and on the tracking page, bank-transfer orders show an EMVCo/Napas 247 QR with the exact total and the order code as transfer content, plus copyable account details and an "I have transferred" button that pings the owner.
2. **Automatic reconciliation** — sign up at [my.sepay.vn](https://my.sepay.vn), link the receiving account, then add a webhook: URL `https://<domain>/api/webhooks/sepay`, auth type *API Key*, and put the same key in `SEPAY_API_KEY`. The endpoint:
   - requires `Authorization: Apikey <SEPAY_API_KEY>` (timing-safe compare) and returns `401` otherwise;
   - stores every transaction in `bank_transactions` (unique on provider + transaction id, so SePay retries/duplicates are acknowledged with `200` and ignored);
   - only `transferType = "in"` can settle an order; the order code is extracted from `code`/`content`/`referenceCode`;
   - a transfer ≥ order total inserts a `payments` row and sets `payment_status = paid`; underpayments and unknown codes are stored, flagged in the notification and left for manual matching;
   - always answers `{ "success": true }` for accepted events so SePay stops retrying.
3. **Manual fallback** — `/admin/payments` lists every transaction, highlights unmatched incoming ones and lets you type an order code to match them; per-order manual "record payment" also remains available.

Without `BANK_*` the customer sees a manual notice (quote the order code); without `SEPAY_API_KEY` nothing is auto-reconciled.

### Production checklist

- [ ] `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` (schema applied, catalog synced, opening stock entered)
- [ ] `ADMIN_PASSWORD` (strong), `ADMIN_SESSION_SECRET` (`openssl rand -hex 32`)
- [ ] `BANK_CODE`, `BANK_ACCOUNT_NO`, `BANK_ACCOUNT_NAME` — scan the QR once with a real banking app and check amount/content
- [ ] SePay webhook added with the API key in `SEPAY_API_KEY`; send a small real transfer with an order code and confirm the order flips to paid
- [ ] `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` so you hear about orders/payments
- [ ] `NEXT_PUBLIC_SITE_URL` set to the public domain (used in tracking links sent to customers)
- [ ] Replace sample ratings / sold counts / testimonials in `src/content/*.ts` with real figures

### Notifications

New orders are pushed to Telegram when `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` are set, and POSTed as JSON to `ORDER_WEBHOOK_URL` (falls back to `CONTACT_WEBHOOK_URL`). `CONTACT_WEBHOOK_URL` also receives contact-form submissions. All notifications are best effort and never block order creation.

Order webhook payload: `{ type: "order", orderCode, orderId, lines: [{ slug, name, color?, unitPrice, quantity, lineTotal }], payment: "cod" | "bank", customer, locale, submittedAt }`. Prices are recomputed server-side from `src/content/vi.ts`. The cart is client-side only (localStorage key `techhala-cart-v1`).

### Smoke test

`npx tsx --env-file=.env.local scripts/smoke-orders.ts` syncs the catalog, creates and walks an order through the status workflow against the configured database, checks stock movements, then cleans up.

`npx tsx --env-file=.env.local scripts/smoke-payments.ts` creates a bank-transfer order, then drives the SePay reconciliation path (outgoing / unknown code / underpaid / exact / duplicate) and asserts payment status and idempotency, then cleans up. With the dev server running, `SMOKE_WEBHOOK_URL=http://localhost:3000/api/webhooks/sepay` additionally exercises the HTTP route (auth + payload validation).

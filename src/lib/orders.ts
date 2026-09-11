import { randomInt } from "node:crypto";
import type { Product } from "@/content/types";
import { getCatalogAll } from "@/lib/catalog";
import {
  requireDb,
  type Db,
  type OrderEventRow,
  type OrderItemRow,
  type OrderRow,
  type OrderStatus,
  type PaymentMethod,
  type PaymentRow,
  type VariantRow,
  type VariantStockRow,
} from "@/lib/db";

export type OrderLine = {
  slug: string;
  name: string;
  color?: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
};

export type NewOrder = {
  lines: OrderLine[];
  payment: PaymentMethod;
  customer: { name: string; phone: string; email: string; address: string; note: string };
  locale: string;
};

export type OrderWithItems = OrderRow & {
  items: OrderItemRow[];
  events: OrderEventRow[];
  payments: PaymentRow[];
};

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function makeOrderCode() {
  let s = "";
  for (let i = 0; i < 7; i++) s += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return `TH-${s}`;
}

export function normalizePhone(raw: string) {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("84") && digits.length >= 11) return `0${digits.slice(2)}`;
  return digits;
}

export function normalizeOrderCode(raw: string) {
  const s = raw.trim().toUpperCase().replace(/\s+/g, "");
  return s.startsWith("TH-") ? s : s.startsWith("TH") ? `TH-${s.slice(2)}` : `TH-${s}`;
}

function skuFor(slug: string, color?: string | null) {
  const base = slug.toUpperCase();
  return color ? `${base}-${color.toUpperCase()}` : base;
}

export function variantRowsFor(p: Pick<Product, "slug" | "colors">) {
  const rows: Omit<VariantRow, "id" | "created_at">[] = [];
  if (p.colors && p.colors.length > 0) {
    for (const c of p.colors) {
      rows.push({ product_slug: p.slug, color: c.id, color_name: c.name, sku: skuFor(p.slug, c.id) });
    }
  } else {
    rows.push({ product_slug: p.slug, color: null, color_name: null, sku: skuFor(p.slug) });
  }
  return rows;
}

function catalogVariants(products: Product[]) {
  return products.flatMap(variantRowsFor);
}

/**
 * Make sure every catalog product (code defaults + admin-created) has a `products` row and a variant per colour.
 * Rows that already exist are left untouched so owner edits in /admin/products always win; never deletes.
 */
export async function syncCatalog(db: Db = requireDb()) {
  const products = await getCatalogAll("vi");
  const { error: pErr } = await db.from("products").upsert(
    products.map((p) => ({ slug: p.slug, name: p.name, category: p.category, price: p.price, active: true })),
    { onConflict: "slug", ignoreDuplicates: true },
  );
  if (pErr) throw pErr;

  const { error: vErr } = await db
    .from("variants")
    .upsert(catalogVariants(products), { onConflict: "sku", ignoreDuplicates: true });
  if (vErr) throw vErr;

  return { products: products.length, variants: catalogVariants(products).length };
}

async function resolveVariantIds(db: Db, lines: OrderLine[]) {
  const skus = lines.map((l) => skuFor(l.slug, l.color));
  const lookup = async () => {
    const { data, error } = await db.from("variants").select("id, sku").in("sku", skus);
    if (error) throw error;
    return new Map(data.map((v) => [v.sku, v.id]));
  };
  let map = await lookup();
  if (skus.some((s) => !map.has(s))) {
    await syncCatalog(db);
    map = await lookup();
  }
  return lines.map((l) => {
    const id = map.get(skuFor(l.slug, l.color));
    if (!id) throw new Error(`variant not found for ${l.slug}/${l.color ?? "-"}`);
    return id;
  });
}

export class OutOfStockError extends Error {
  constructor(public readonly shortages: { slug: string; color?: string; requested: number; available: number }[]) {
    super("insufficient stock");
  }
}

/** Backorders are allowed when STOCK_MODE=backorder; otherwise orders are capped at available stock. */
export function stockEnforced() {
  return process.env.STOCK_MODE?.toLowerCase() !== "backorder";
}

/** available per variant id (on_hand - reserved). Missing rows mean no stock history → 0. */
export async function availabilityFor(variantIds: string[], db: Db = requireDb()) {
  if (variantIds.length === 0) return new Map<string, number>();
  const { data, error } = await db
    .from("variant_stock")
    .select("variant_id, on_hand, reserved")
    .in("variant_id", variantIds);
  if (error) throw error;
  return new Map(data.map((r) => [r.variant_id, r.on_hand - r.reserved]));
}

/** available per product slug → color id ("" for colorless) — for the storefront. */
export async function availabilityForProduct(slug: string, db: Db | null = requireDb()) {
  if (!db) return null;
  const { data, error } = await db
    .from("variant_stock")
    .select("color, on_hand, reserved")
    .eq("product_slug", slug);
  if (error) throw error;
  const out: Record<string, number> = {};
  for (const r of data) out[r.color ?? ""] = r.on_hand - r.reserved;
  return out;
}

/** Orders placed from `phone` in the last hour — simple abuse brake for the public checkout. */
export async function recentOrderCount(phone: string, db: Db = requireDb()) {
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error } = await db
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("customer_phone", normalizePhone(phone))
    .gte("created_at", since);
  if (error) throw error;
  return count ?? 0;
}

export async function createOrder(input: NewOrder): Promise<OrderRow> {
  const db = requireDb();
  const variantIds = await resolveVariantIds(db, input.lines);

  if (stockEnforced()) {
    const available = await availabilityFor(variantIds, db);
    const shortages = input.lines.flatMap((l, i) => {
      const avail = available.get(variantIds[i]) ?? 0;
      return l.quantity > avail ? [{ slug: l.slug, color: l.color, requested: l.quantity, available: Math.max(0, avail) }] : [];
    });
    if (shortages.length > 0) throw new OutOfStockError(shortages);
  }

  const subtotal = input.lines.reduce((s, l) => s + l.lineTotal, 0);

  let order: OrderRow | null = null;
  for (let attempt = 0; attempt < 5 && !order; attempt++) {
    const { data, error } = await db
      .from("orders")
      .insert({
        code: makeOrderCode(),
        payment_method: input.payment,
        customer_name: input.customer.name,
        customer_phone: normalizePhone(input.customer.phone) || input.customer.phone,
        customer_email: input.customer.email || null,
        customer_address: input.customer.address,
        note: input.customer.note || null,
        subtotal,
        shipping_fee: 0,
        total: subtotal,
        locale: input.locale || "vi",
      })
      .select()
      .single();
    if (data) order = data;
    else if (error && error.code !== "23505") throw error;
  }
  if (!order) throw new Error("could not allocate order code");

  const { error: iErr } = await db.from("order_items").insert(
    input.lines.map((l, i) => ({
      order_id: order!.id,
      variant_id: variantIds[i],
      product_slug: l.slug,
      product_name: l.name,
      color: l.color ?? null,
      unit_price: l.unitPrice,
      quantity: l.quantity,
      line_total: l.lineTotal,
    })),
  );
  if (iErr) {
    await db.from("orders").delete().eq("id", order.id);
    throw iErr;
  }

  await db.from("order_events").insert({ order_id: order.id, from_status: null, to_status: "pending", note: "website" });
  return order;
}

async function attachDetails(db: Db, order: OrderRow): Promise<OrderWithItems> {
  const [items, events, payments] = await Promise.all([
    db.from("order_items").select("*").eq("order_id", order.id).order("id"),
    db.from("order_events").select("*").eq("order_id", order.id).order("id"),
    db.from("payments").select("*").eq("order_id", order.id).order("paid_at"),
  ]);
  if (items.error) throw items.error;
  if (events.error) throw events.error;
  if (payments.error) throw payments.error;
  return { ...order, items: items.data, events: events.data, payments: payments.data };
}

/** Customer-facing lookup: order code + its access token (from the confirmation link). */
export async function getOrderByToken(code: string, token: string) {
  const db = requireDb();
  const { data, error } = await db
    .from("orders")
    .select("*")
    .eq("code", normalizeOrderCode(code))
    .eq("access_token", token)
    .maybeSingle();
  if (error) throw error;
  return data ? attachDetails(db, data) : null;
}

/** Customer-facing lookup: order code + phone number used at checkout. */
export async function findOrderByCodeAndPhone(code: string, phone: string) {
  const db = requireDb();
  const { data, error } = await db
    .from("orders")
    .select("*")
    .eq("code", normalizeOrderCode(code))
    .eq("customer_phone", normalizePhone(phone))
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function getOrderById(id: string) {
  const db = requireDb();
  const { data, error } = await db.from("orders").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data ? attachDetails(db, data) : null;
}

export async function listOrders(opts: { status?: OrderStatus; q?: string; limit?: number } = {}) {
  const db = requireDb();
  let query = db.from("orders").select("*").order("created_at", { ascending: false }).limit(opts.limit ?? 100);
  if (opts.status) query = query.eq("status", opts.status);
  if (opts.q) {
    const q = opts.q.trim();
    const like = `%${q.replace(/[%_,]/g, "")}%`;
    query = query.or(`code.ilike.${like},customer_phone.ilike.${like},customer_name.ilike.${like}`);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function orderStats() {
  const db = requireDb();
  const [{ data: open, error: e1 }, { data: paid, error: e2 }] = await Promise.all([
    db.from("orders").select("status, total").not("status", "in", "(cancelled,returned)"),
    db.from("orders").select("total").eq("payment_status", "paid"),
  ]);
  if (e1) throw e1;
  if (e2) throw e2;
  const byStatus: Partial<Record<OrderStatus, number>> = {};
  let revenue = 0;
  for (const o of open) {
    byStatus[o.status] = (byStatus[o.status] ?? 0) + 1;
    if (o.status === "delivered") revenue += o.total;
  }
  return { byStatus, deliveredRevenue: revenue, paidTotal: paid.reduce((s, p) => s + p.total, 0), openCount: open.length };
}

export async function setOrderStatus(orderId: string, status: OrderStatus, note?: string) {
  const db = requireDb();
  const { data, error } = await db.rpc("set_order_status", { p_order_id: orderId, p_status: status, p_note: note ?? null });
  if (error) throw error;
  return data;
}

/** Flip unpaid → paid and record the payment. Returns false (and records nothing) if the order was already paid. */
export async function markOrderPaid(orderId: string, opts: { provider: string; amount: number; ref?: string }) {
  const db = requireDb();
  const { data: flipped, error } = await db
    .from("orders")
    .update({ payment_status: "paid", updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .eq("payment_status", "unpaid")
    .select("id");
  if (error) throw error;
  if (!flipped || flipped.length === 0) return false;
  const { error: pErr } = await db.from("payments").insert({
    order_id: orderId,
    provider: opts.provider,
    amount: opts.amount,
    status: "paid",
    provider_ref: opts.ref || null,
  });
  if (pErr) throw pErr;
  return true;
}

export async function setOrderPaymentStatus(orderId: string, status: OrderRow["payment_status"]) {
  const db = requireDb();
  const { error } = await db
    .from("orders")
    .update({ payment_status: status, updated_at: new Date().toISOString() })
    .eq("id", orderId);
  if (error) throw error;
}

export async function saveAdminNote(orderId: string, adminNote: string) {
  const db = requireDb();
  const { error } = await db
    .from("orders")
    .update({ admin_note: adminNote || null, updated_at: new Date().toISOString() })
    .eq("id", orderId);
  if (error) throw error;
}

export async function listStock(): Promise<VariantStockRow[]> {
  const db = requireDb();
  const { data, error } = await db
    .from("variant_stock")
    .select("*")
    .order("category")
    .order("product_name")
    .order("color");
  if (error) throw error;
  return data;
}

export async function addStockMovement(variantId: string, qty: number, reason: "purchase" | "adjust", note?: string) {
  const db = requireDb();
  const { error } = await db
    .from("inventory_movements")
    .insert({ variant_id: variantId, qty, reason, note: note || null });
  if (error) throw error;
}

export async function listMovements(variantId: string, limit = 50) {
  const db = requireDb();
  const { data, error } = await db
    .from("inventory_movements")
    .select("*")
    .eq("variant_id", variantId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data;
}

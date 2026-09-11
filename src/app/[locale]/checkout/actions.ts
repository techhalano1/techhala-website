"use server";

import { vi } from "@/content/vi";
import { getDb, isPaymentMethod } from "@/lib/db";
import { createOrder, makeOrderCode, type NewOrder, type OrderLine } from "@/lib/orders";
import { notifyNewOrder } from "@/lib/notify";

export type OrderState =
  | { status: "idle" }
  | { status: "error" }
  | { status: "success"; orderCode: string; trackUrl?: string };

const MAX_LINES = 20;
const MAX_QTY = 10;

function parseLines(raw: string): OrderLine[] | null {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }
  if (!Array.isArray(parsed) || parsed.length === 0 || parsed.length > MAX_LINES) return null;

  const lines: OrderLine[] = [];
  for (const item of parsed) {
    if (typeof item !== "object" || item === null) return null;
    const rec = item as Record<string, unknown>;
    const slug = typeof rec.slug === "string" ? rec.slug : "";
    const qtyRaw = typeof rec.qty === "number" ? rec.qty : Number(rec.qty);
    const color = typeof rec.color === "string" && rec.color ? rec.color : undefined;
    const product = vi.products.items.find((p) => p.slug === slug);
    if (!product || !Number.isFinite(qtyRaw)) return null;
    if (color && !product.colors?.some((c) => c.id === color)) return null;
    const quantity = Math.min(MAX_QTY, Math.max(1, Math.round(qtyRaw)));
    lines.push({
      slug: product.slug,
      name: product.name,
      color,
      unitPrice: product.price,
      quantity,
      lineTotal: product.price * quantity,
    });
  }
  return lines;
}

export async function submitOrder(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const lines = parseLines(String(formData.get("lines") ?? ""));
  const payment = String(formData.get("payment") ?? "");
  const locale = String(formData.get("locale") ?? "vi");

  const customer = {
    name: String(formData.get("name") ?? "").trim().slice(0, 120),
    phone: String(formData.get("phone") ?? "").trim().slice(0, 30),
    email: String(formData.get("email") ?? "").trim().slice(0, 200),
    address: String(formData.get("address") ?? "").trim().slice(0, 500),
    note: String(formData.get("note") ?? "").trim().slice(0, 1000),
  };

  if (!lines || !isPaymentMethod(payment)) return { status: "error" };
  if (!customer.name || !customer.phone || !customer.address) return { status: "error" };

  const order: NewOrder = { lines, payment, customer, locale };

  if (!getDb()) {
    // No database configured: fall back to notification-only (webhook / log).
    const code = makeOrderCode();
    console.info(`[order] ${code} not persisted (Supabase not configured); ${lines.length} line(s), ${payment}`);
    await notifyNewOrder(order, code, null);
    return { status: "success", orderCode: code };
  }

  try {
    const saved = await createOrder(order);
    await notifyNewOrder(order, saved.code, saved.id);
    return {
      status: "success",
      orderCode: saved.code,
      trackUrl: `/${locale}/orders/${saved.code}?t=${saved.access_token}`,
    };
  } catch (err) {
    console.error("[order] failed to save", err);
    return { status: "error" };
  }
}

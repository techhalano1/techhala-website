"use server";

import { vi } from "@/content/vi";
import { en } from "@/content/en";
import { getDb, isPaymentMethod } from "@/lib/db";
import { createOrder, makeOrderCode, OutOfStockError, recentOrderCount, type NewOrder, type OrderLine } from "@/lib/orders";
import { notifyNewOrder } from "@/lib/notify";
import { transferInfoFor } from "@/lib/payments";
import type { BankTransferInfo } from "@/components/BankTransferPanel";

export type CustomerFields = { name: string; phone: string; email: string; address: string; note: string };

export type OrderState =
  | { status: "idle" }
  | { status: "error"; reason?: "out_of_stock" | "too_many"; items?: string; customer?: CustomerFields; payment?: string }
  | { status: "success"; orderCode: string; trackUrl?: string; bank?: BankTransferInfo };

const MAX_LINES = 20;
const MAX_QTY = 10;
const MAX_ORDERS_PER_PHONE_PER_HOUR = Number(process.env.MAX_ORDERS_PER_PHONE_PER_HOUR ?? 5);

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

  const customer: CustomerFields = {
    name: String(formData.get("name") ?? "").trim().slice(0, 120),
    phone: String(formData.get("phone") ?? "").trim().slice(0, 30),
    email: String(formData.get("email") ?? "").trim().slice(0, 200),
    address: String(formData.get("address") ?? "").trim().slice(0, 500),
    note: String(formData.get("note") ?? "").trim().slice(0, 1000),
  };

  const fail = (extra: Omit<Extract<OrderState, { status: "error" }>, "status" | "customer" | "payment"> = {}): OrderState => ({
    status: "error",
    customer,
    payment,
    ...extra,
  });

  if (!lines || !isPaymentMethod(payment)) return fail();
  if (!customer.name || !customer.phone || !customer.address) return fail();

  // Honeypot: real users never see/fill this field. Pretend success so bots stop retrying.
  if (String(formData.get("website") ?? "") !== "") {
    return { status: "success", orderCode: makeOrderCode() };
  }

  const order: NewOrder = { lines, payment, customer, locale };
  const total = lines.reduce((s, l) => s + l.lineTotal, 0);

  if (!getDb()) {
    // No database configured: fall back to notification-only (webhook / log).
    const code = makeOrderCode();
    console.info(`[order] ${code} not persisted (Supabase not configured); ${lines.length} line(s), ${payment}`);
    await notifyNewOrder(order, code, null);
    const bank = payment === "bank" ? await transferInfoFor(code, total) : null;
    return { status: "success", orderCode: code, bank: bank ?? undefined };
  }

  try {
    if ((await recentOrderCount(customer.phone)) >= MAX_ORDERS_PER_PHONE_PER_HOUR) {
      return fail({ reason: "too_many" });
    }
    const saved = await createOrder(order);
    await notifyNewOrder(order, saved.code, saved.id);
    const bank = payment === "bank" ? await transferInfoFor(saved.code, saved.total) : null;
    return {
      status: "success",
      orderCode: saved.code,
      trackUrl: `/${locale}/orders/${saved.code}?t=${saved.access_token}`,
      bank: bank ?? undefined,
    };
  } catch (err) {
    if (err instanceof OutOfStockError) {
      const catalog = (locale === "en" ? en : vi).products.items;
      const items = err.shortages
        .map((s) => {
          const p = catalog.find((x) => x.slug === s.slug);
          const color = s.color ? p?.colors?.find((c) => c.id === s.color)?.name : undefined;
          return `${p?.name ?? s.slug}${color ? ` (${color})` : ""}: ${s.available}/${s.requested}`;
        })
        .join(", ");
      return fail({ reason: "out_of_stock", items });
    }
    console.error("[order] failed to save", err);
    return fail();
  }
}

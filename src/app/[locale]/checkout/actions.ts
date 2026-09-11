"use server";

import { en } from "@/content/en";

export type OrderState =
  | { status: "idle" }
  | { status: "error" }
  | { status: "success"; orderCode: string };

const paymentMethods = ["cod", "bank"] as const;
type PaymentMethod = (typeof paymentMethods)[number];

function isPaymentMethod(value: string): value is PaymentMethod {
  return (paymentMethods as readonly string[]).includes(value);
}

function makeOrderCode() {
  const stamp = Date.now().toString(36).toUpperCase().slice(-5);
  const rand = Math.random().toString(36).toUpperCase().slice(2, 5);
  return `TH-${stamp}${rand}`;
}

type OrderLine = { slug: string; name: string; color?: string; unitPrice: number; quantity: number; lineTotal: number };

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
    const product = en.products.items.find((p) => p.slug === slug);
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

  const payload = {
    orderCode: makeOrderCode(),
    lines: lines ?? [],
    itemCount: lines?.reduce((n, l) => n + l.quantity, 0) ?? 0,
    total: lines?.reduce((sum, l) => sum + l.lineTotal, 0) ?? 0,
    currency: "VND",
    payment,
    customer: {
      name: String(formData.get("name") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      address: String(formData.get("address") ?? "").trim(),
      note: String(formData.get("note") ?? "").trim(),
    },
    locale: String(formData.get("locale") ?? ""),
    submittedAt: new Date().toISOString(),
  };

  if (!lines || !isPaymentMethod(payment)) return { status: "error" };
  if (!payload.customer.name || !payload.customer.phone || !payload.customer.address) return { status: "error" };

  const webhook = process.env.ORDER_WEBHOOK_URL ?? process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) {
    console.info("[order] submission (no ORDER_WEBHOOK_URL configured)", payload);
    return { status: "success", orderCode: payload.orderCode };
  }

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ type: "order", ...payload }),
    });
    return res.ok ? { status: "success", orderCode: payload.orderCode } : { status: "error" };
  } catch {
    return { status: "error" };
  }
}

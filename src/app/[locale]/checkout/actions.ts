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

export async function submitOrder(_prev: OrderState, formData: FormData): Promise<OrderState> {
  const productSlug = String(formData.get("product") ?? "").trim();
  const product = en.products.items.find((p) => p.slug === productSlug);
  const quantity = Math.min(10, Math.max(1, Number(formData.get("quantity") ?? 1) || 1));
  const payment = String(formData.get("payment") ?? "");

  const payload = {
    orderCode: makeOrderCode(),
    product: product ? { slug: product.slug, name: product.name, unitPrice: product.price } : null,
    quantity,
    total: product ? product.price * quantity : 0,
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

  if (!product || !isPaymentMethod(payment)) return { status: "error" };
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

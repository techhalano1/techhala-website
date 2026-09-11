"use server";

import { redirect } from "next/navigation";
import { isLocale } from "@/lib/i18n";
import { getDb } from "@/lib/db";
import { findOrderByCodeAndPhone } from "@/lib/orders";

export type LookupState = { status: "idle" } | { status: "not_found" };

export async function lookupOrder(_prev: LookupState, formData: FormData): Promise<LookupState> {
  const localeRaw = String(formData.get("locale") ?? "vi");
  const locale = isLocale(localeRaw) ? localeRaw : "vi";
  const code = String(formData.get("code") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  if (!code || !phone || !getDb()) return { status: "not_found" };

  let order: Awaited<ReturnType<typeof findOrderByCodeAndPhone>> = null;
  try {
    order = await findOrderByCodeAndPhone(code, phone);
  } catch (err) {
    console.error("[orders] lookup failed", err);
  }
  if (!order) return { status: "not_found" };

  redirect(`/${locale}/orders/${order.code}?t=${order.access_token}`);
}

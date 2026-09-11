"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  checkPassword,
  clearAdminCookie,
  requireAdmin,
  setAdminCookie,
} from "@/lib/admin-auth";
import { isOrderStatus, isPaymentStatus } from "@/lib/db";
import {
  addStockMovement,
  markOrderPaid,
  saveAdminNote,
  setOrderPaymentStatus,
  setOrderStatus,
  syncCatalog,
} from "@/lib/orders";
import { matchTransactionToOrder } from "@/lib/payments";
import { notifyPayment } from "@/lib/notify";
import { requireDb } from "@/lib/db";

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) return { error: "Sai mật khẩu." };
  await setAdminCookie();
  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  await clearAdminCookie();
  redirect("/admin/login");
}

export type ActionResult = { ok: true } | { ok: false; error: string };

function fail(err: unknown): ActionResult {
  console.error("[admin]", err);
  return { ok: false, error: err instanceof Error ? err.message : "Có lỗi xảy ra." };
}

export async function changeOrderStatus(orderId: string, status: string, note?: string): Promise<ActionResult> {
  await requireAdmin();
  if (!isOrderStatus(status)) return { ok: false, error: "Trạng thái không hợp lệ." };
  try {
    await setOrderStatus(orderId, status, note);
  } catch (err) {
    return fail(err);
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function recordPayment(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const orderId = String(formData.get("orderId") ?? "");
  const amount = Number(formData.get("amount") ?? 0);
  const provider = String(formData.get("provider") ?? "bank").trim() || "bank";
  const ref = String(formData.get("ref") ?? "").trim();
  if (!orderId || !Number.isFinite(amount) || amount <= 0) return { ok: false, error: "Số tiền không hợp lệ." };
  try {
    const paid = await markOrderPaid(orderId, { provider, amount: Math.round(amount), ref });
    if (!paid) return { ok: false, error: "Đơn này đã được đánh dấu đã thu trước đó." };
  } catch (err) {
    return fail(err);
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

/** Owner links an unmatched incoming bank transaction to an order (content had a typo, etc.). */
export async function matchTransaction(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const txId = Number(formData.get("txId") ?? 0);
  const code = String(formData.get("code") ?? "").trim();
  if (!Number.isInteger(txId) || txId <= 0 || !code) return { ok: false, error: "Thiếu mã đơn." };
  try {
    const outcome = await matchTransactionToOrder(txId, code);
    if (outcome.result === "ignored") {
      return { ok: false, error: outcome.reason === "order_not_found" ? "Không tìm thấy đơn với mã này." : "Giao dịch không phải tiền vào." };
    }
    if (outcome.result === "duplicate") return { ok: false, error: "Giao dịch đã được xử lý." };
    const { data: tx } = await requireDb().from("bank_transactions").select("*").eq("id", txId).maybeSingle();
    if (tx && outcome.result === "paid") await notifyPayment(outcome, tx);
    revalidatePath("/admin", "layout");
    if (outcome.result === "underpaid") {
      return { ok: false, error: `Đã gắn giao dịch vào đơn ${outcome.order.code} nhưng còn thiếu ${outcome.missing.toLocaleString("vi-VN")} ₫ — đơn vẫn “Chưa thu”.` };
    }
  } catch (err) {
    return fail(err);
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function updatePaymentStatus(orderId: string, status: string): Promise<ActionResult> {
  await requireAdmin();
  if (!isPaymentStatus(status)) return { ok: false, error: "Trạng thái không hợp lệ." };
  try {
    await setOrderPaymentStatus(orderId, status);
  } catch (err) {
    return fail(err);
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function updateAdminNote(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const orderId = String(formData.get("orderId") ?? "");
  const note = String(formData.get("adminNote") ?? "").trim().slice(0, 2000);
  if (!orderId) return { ok: false, error: "Thiếu mã đơn." };
  try {
    await saveAdminNote(orderId, note);
  } catch (err) {
    return fail(err);
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function stockIn(_prev: ActionResult | null, formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  const variantId = String(formData.get("variantId") ?? "");
  const qty = Math.round(Number(formData.get("qty") ?? 0));
  const reason = String(formData.get("reason") ?? "purchase") === "adjust" ? "adjust" : "purchase";
  const note = String(formData.get("note") ?? "").trim().slice(0, 500);
  if (!variantId || !Number.isFinite(qty) || qty === 0) return { ok: false, error: "Số lượng phải khác 0." };
  try {
    await addStockMovement(variantId, qty, reason, note);
  } catch (err) {
    return fail(err);
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

export async function syncCatalogAction(): Promise<ActionResult> {
  await requireAdmin();
  try {
    await syncCatalog();
  } catch (err) {
    return fail(err);
  }
  revalidatePath("/admin", "layout");
  return { ok: true };
}

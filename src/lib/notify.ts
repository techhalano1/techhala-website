import { siteUrl } from "@/lib/site";
import type { NewOrder } from "@/lib/orders";

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

const vnd = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

export function formatOrderMessage(order: NewOrder, code: string, adminUrl: string) {
  const total = order.lines.reduce((s, l) => s + l.lineTotal, 0);
  const lines = order.lines
    .map((l) => `• ${escapeHtml(l.name)}${l.color ? ` (${escapeHtml(l.color)})` : ""} × ${l.quantity} — ${vnd(l.lineTotal)}`)
    .join("\n");
  const pay = order.payment === "cod" ? "COD" : "Chuyển khoản";
  return [
    `🛒 <b>Đơn mới ${escapeHtml(code)}</b> — ${vnd(total)} (${pay})`,
    lines,
    "",
    `👤 ${escapeHtml(order.customer.name)} — ${escapeHtml(order.customer.phone)}`,
    `📍 ${escapeHtml(order.customer.address)}`,
    order.customer.email ? `✉️ ${escapeHtml(order.customer.email)}` : "",
    order.customer.note ? `📝 ${escapeHtml(order.customer.note)}` : "",
    "",
    `<a href="${adminUrl}">Mở trong admin</a>`,
  ]
    .filter((l) => l !== "")
    .join("\n");
}

async function sendTelegram(text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return false;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "HTML", disable_web_page_preview: true }),
  });
  if (!res.ok) console.error("[notify] telegram failed", res.status, await res.text().catch(() => ""));
  return res.ok;
}

async function sendWebhook(payload: Record<string, unknown>) {
  const webhook = process.env.ORDER_WEBHOOK_URL ?? process.env.CONTACT_WEBHOOK_URL;
  if (!webhook) return false;
  const res = await fetch(webhook, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) console.error("[notify] webhook failed", res.status);
  return res.ok;
}

/** Best-effort owner notification for a new order. Never throws — the order is already saved. */
export async function notifyNewOrder(order: NewOrder, code: string, orderId: string | null) {
  const adminUrl = orderId ? `${siteUrl}/admin/orders/${orderId}` : `${siteUrl}/admin/orders`;
  const results = await Promise.allSettled([
    sendTelegram(formatOrderMessage(order, code, adminUrl)),
    sendWebhook({ type: "order", orderCode: code, orderId, ...order, submittedAt: new Date().toISOString() }),
  ]);
  const delivered = results.some((r) => r.status === "fulfilled" && r.value);
  if (!delivered) console.info(`[order] ${code} saved; no notification channel configured or all failed`);
  for (const r of results) if (r.status === "rejected") console.error("[notify]", r.reason);
}

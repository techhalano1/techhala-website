import { company, siteUrl } from "@/lib/site";
import type { OrderItemRow, OrderRow } from "@/lib/db";
import { isLocale, type Locale } from "@/lib/i18n";
import { getBankAccount, sanitizeTransferNote } from "@/lib/vietqr";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

function esc(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

const vnd = (n: number, locale: Locale) =>
  new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US").format(n) + (locale === "vi" ? " ₫" : " VND");

export function emailConfigured() {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

/** Send one transactional email through Resend. Best-effort: logs and returns false on any failure. */
export async function sendEmail(msg: { to: string; subject: string; html: string; text?: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) return false;
  try {
    const res = await fetch(RESEND_ENDPOINT, {
      method: "POST",
      headers: { authorization: `Bearer ${apiKey}`, "content-type": "application/json" },
      body: JSON.stringify({
        from,
        to: [msg.to],
        reply_to: process.env.EMAIL_REPLY_TO ?? company.email,
        subject: msg.subject,
        html: msg.html,
        text: msg.text,
      }),
    });
    if (!res.ok) console.error("[email] resend failed", res.status, await res.text().catch(() => ""));
    return res.ok;
  } catch (err) {
    console.error("[email] resend error", err);
    return false;
  }
}

type Copy = {
  subjectNew: (code: string) => string;
  subjectPaid: (code: string) => string;
  greeting: (name: string) => string;
  receivedTitle: string;
  receivedBody: string;
  paidTitle: string;
  paidBody: string;
  orderCode: string;
  items: string;
  qty: string;
  total: string;
  shipTo: string;
  payment: string;
  methods: Record<OrderRow["payment_method"], string>;
  bankTitle: string;
  bankBody: string;
  bank: string;
  accountNo: string;
  accountName: string;
  amount: string;
  transferNote: string;
  track: string;
  help: string;
  footer: string;
};

const copy: Record<Locale, Copy> = {
  vi: {
    subjectNew: (code) => `TechHala đã nhận đơn hàng ${code}`,
    subjectPaid: (code) => `TechHala đã nhận thanh toán cho đơn ${code}`,
    greeting: (name) => `Xin chào ${name},`,
    receivedTitle: "Đã nhận đơn hàng!",
    receivedBody: "Cảm ơn bạn đã đặt hàng tại TechHala. Chúng tôi sẽ gọi xác nhận trong vòng 2 giờ làm việc và giao hàng trong 2 – 4 ngày.",
    paidTitle: "Đã nhận thanh toán",
    paidBody: "Chúng tôi đã nhận được tiền chuyển khoản của bạn. Đơn hàng sẽ được đóng gói và giao trong 2 – 4 ngày làm việc.",
    orderCode: "Mã đơn hàng",
    items: "Sản phẩm",
    qty: "SL",
    total: "Tổng cộng (đã gồm VAT, miễn phí giao hàng)",
    shipTo: "Giao đến",
    payment: "Thanh toán",
    methods: { cod: "Thanh toán khi nhận hàng (COD)", bank: "Chuyển khoản ngân hàng" },
    bankTitle: "Chuyển khoản để hoàn tất đơn",
    bankBody: "Vui lòng chuyển khoản theo thông tin dưới đây và ghi đúng nội dung. Hệ thống tự động xác nhận khi tiền vào tài khoản.",
    bank: "Ngân hàng",
    accountNo: "Số tài khoản",
    accountName: "Chủ tài khoản",
    amount: "Số tiền",
    transferNote: "Nội dung chuyển khoản",
    track: "Theo dõi đơn hàng",
    help: "Cần hỗ trợ? Gọi/Zalo",
    footer: "Email này được gửi tự động vì bạn vừa đặt hàng tại techhala.com.",
  },
  en: {
    subjectNew: (code) => `TechHala received your order ${code}`,
    subjectPaid: (code) => `TechHala received your payment for order ${code}`,
    greeting: (name) => `Hi ${name},`,
    receivedTitle: "Order received!",
    receivedBody: "Thank you for shopping at TechHala. We will call to confirm within 2 business hours and deliver in 2 – 4 days.",
    paidTitle: "Payment received",
    paidBody: "We have received your bank transfer. Your order will be packed and delivered within 2 – 4 business days.",
    orderCode: "Order code",
    items: "Items",
    qty: "Qty",
    total: "Total (VAT included, free shipping)",
    shipTo: "Ship to",
    payment: "Payment",
    methods: { cod: "Cash on delivery (COD)", bank: "Bank transfer" },
    bankTitle: "Transfer to complete your order",
    bankBody: "Please transfer using the details below and keep the note exactly as shown. Payment is confirmed automatically once it arrives.",
    bank: "Bank",
    accountNo: "Account number",
    accountName: "Account holder",
    amount: "Amount",
    transferNote: "Transfer note",
    track: "Track your order",
    help: "Need help? Call/Zalo",
    footer: "This automatic email was sent because you just placed an order at techhala.com.",
  },
};

type EmailLine = Pick<OrderItemRow, "product_name" | "color" | "quantity" | "line_total">;

function orderLocale(order: OrderRow): Locale {
  return isLocale(order.locale) ? order.locale : "vi";
}

function trackUrl(order: OrderRow, locale: Locale) {
  return `${siteUrl}/${locale}/orders/${order.code}?t=${order.access_token}`;
}

function row(label: string, value: string) {
  return `<tr><td style="padding:6px 0;color:#666">${esc(label)}</td><td style="padding:6px 0;text-align:right;font-weight:700">${esc(value)}</td></tr>`;
}

function layout(title: string, body: string, C: Copy) {
  return `<!doctype html><html><body style="margin:0;background:#f6f4ef;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#111">
<div style="max-width:560px;margin:0 auto;padding:24px 16px">
  <div style="font-size:20px;font-weight:800;margin-bottom:16px">Tech<span style="color:#e11d2e">Hala</span></div>
  <div style="background:#fff;border:2px solid #111;border-radius:16px;padding:24px">
    <h1 style="font-size:22px;margin:0 0 8px">${esc(title)}</h1>
    ${body}
  </div>
  <p style="font-size:12px;color:#777;margin-top:16px">${esc(C.help)}: ${esc(company.phoneDisplay)} · ${esc(company.email)}<br>${esc(C.footer)}</p>
</div></body></html>`;
}

function itemsTable(lines: EmailLine[], order: OrderRow, locale: Locale, C: Copy) {
  const rows = lines
    .map(
      (l) =>
        `<tr><td style="padding:6px 0;border-top:1px solid #eee">${esc(l.product_name)}${l.color ? ` <span style="color:#666">(${esc(l.color)})</span>` : ""}</td><td style="padding:6px 8px;border-top:1px solid #eee;text-align:center">${l.quantity}</td><td style="padding:6px 0;border-top:1px solid #eee;text-align:right;white-space:nowrap">${esc(vnd(l.line_total, locale))}</td></tr>`,
    )
    .join("");
  return `<table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px">
<thead><tr><th style="text-align:left;padding:6px 0;color:#666;font-weight:600">${esc(C.items)}</th><th style="padding:6px 8px;color:#666;font-weight:600">${esc(C.qty)}</th><th></th></tr></thead>
<tbody>${rows}</tbody>
<tfoot><tr><td colspan="2" style="padding:10px 0;border-top:2px solid #111;font-weight:700">${esc(C.total)}</td><td style="padding:10px 0;border-top:2px solid #111;text-align:right;font-weight:800;color:#e11d2e;white-space:nowrap">${esc(vnd(order.total, locale))}</td></tr></tfoot>
</table>`;
}

function bankBlock(order: OrderRow, locale: Locale, C: Copy) {
  const account = getBankAccount();
  if (!account) return "";
  return `<div style="margin-top:16px;background:#fff4cc;border:2px solid #111;border-radius:12px;padding:16px;font-size:14px">
<p style="margin:0;font-weight:700">${esc(C.bankTitle)}</p>
<p style="margin:4px 0 8px;color:#555">${esc(C.bankBody)}</p>
<table style="width:100%;border-collapse:collapse">
${row(C.bank, account.bankName)}${row(C.accountNo, account.accountNo)}${row(C.accountName, account.accountName)}${row(C.amount, vnd(order.total, locale))}${row(C.transferNote, sanitizeTransferNote(order.code))}
</table></div>`;
}

function trackButton(order: OrderRow, locale: Locale, C: Copy) {
  return `<p style="margin:20px 0 0"><a href="${esc(trackUrl(order, locale))}" style="display:inline-block;background:#e11d2e;color:#fff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:12px;border:2px solid #111">${esc(C.track)} →</a></p>`;
}

/** Customer email right after an order is saved (COD: summary; bank: summary + transfer details). */
export async function emailOrderConfirmation(order: OrderRow, lines: EmailLine[]) {
  if (!order.customer_email || !emailConfigured()) return false;
  const locale = orderLocale(order);
  const C = copy[locale];
  const body = `
<p style="margin:0 0 4px">${esc(C.greeting(order.customer_name))}</p>
<p style="margin:0;color:#555">${esc(C.receivedBody)}</p>
<table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px">
${row(C.orderCode, order.code)}${row(C.payment, C.methods[order.payment_method])}${row(C.shipTo, order.customer_address)}
</table>
${itemsTable(lines, order, locale, C)}
${order.payment_method === "bank" && order.payment_status !== "paid" ? bankBlock(order, locale, C) : ""}
${trackButton(order, locale, C)}`;
  return sendEmail({ to: order.customer_email, subject: C.subjectNew(order.code), html: layout(C.receivedTitle, body, C) });
}

/** Customer email once a bank transfer (or manual admin entry) marks the order paid. */
export async function emailPaymentReceived(order: OrderRow, amount: number) {
  if (!order.customer_email || !emailConfigured()) return false;
  const locale = orderLocale(order);
  const C = copy[locale];
  const body = `
<p style="margin:0 0 4px">${esc(C.greeting(order.customer_name))}</p>
<p style="margin:0;color:#555">${esc(C.paidBody)}</p>
<table style="width:100%;border-collapse:collapse;font-size:14px;margin-top:16px">
${row(C.orderCode, order.code)}${row(C.amount, vnd(amount, locale))}
</table>
${trackButton(order, locale, C)}`;
  return sendEmail({ to: order.customer_email, subject: C.subjectPaid(order.code), html: layout(C.paidTitle, body, C) });
}

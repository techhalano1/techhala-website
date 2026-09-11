import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders";
import { listTransactionsForOrder } from "@/lib/payments";
import { sanitizeTransferNote } from "@/lib/vietqr";
import { siteUrl } from "@/lib/site";
import { catalogColor } from "@/lib/catalog-colors";
import {
  dateTime,
  paymentMethodLabel,
  paymentStatusLabel,
  statusLabel,
  statusTone,
  vnd,
} from "@/lib/admin-ui";
import { AdminNoteForm, PaymentPanel, StatusActions } from "@/components/admin/OrderActions";

export default async function AdminOrderDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^[0-9a-f-]{36}$/i.test(id)) notFound();
  const order = await getOrderById(id);
  if (!order) notFound();
  const transactions = await listTransactionsForOrder(order.id);

  const trackUrl = `${siteUrl}/${order.locale}/orders/${order.code}?t=${order.access_token}`;
  const phoneDigits = order.customer_phone.replace(/\D/g, "");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/orders" className="text-sm text-muted hover:text-fg">
            ← Đơn hàng
          </Link>
          <h1 className="mt-1 font-mono text-2xl font-extrabold">{order.code}</h1>
          <p className="text-sm text-muted">Đặt lúc {dateTime(order.created_at)} · Ngôn ngữ: {order.locale.toUpperCase()}</p>
        </div>
        <span className={`rounded-lg border-2 border-ink px-3 py-1 text-sm font-bold ${statusTone[order.status]}`}>
          {statusLabel[order.status]}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <section className="kcard overflow-hidden">
            <h2 className="border-b-2 border-ink px-5 py-3 font-bold">Sản phẩm</h2>
            <table className="w-full text-sm">
              <tbody>
                {order.items.map((it) => (
                  <tr key={it.id} className="border-t border-border first:border-t-0">
                    <td className="px-5 py-2.5">
                      <span className="font-semibold">{it.product_name}</span>
                      {it.color && (
                        <span className="ml-2 text-xs text-muted">
                          Màu: {catalogColor(it.product_slug, it.color)?.name ?? it.color}
                        </span>
                      )}
                      <span className="block font-mono text-[11px] text-muted">{it.product_slug}</span>
                    </td>
                    <td className="px-3 py-2.5 text-right tabular-nums text-muted">
                      {it.quantity} × {vnd(it.unit_price)}
                    </td>
                    <td className="px-5 py-2.5 text-right font-bold tabular-nums">{vnd(it.line_total)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="border-t-2 border-ink">
                <tr>
                  <td className="px-5 py-2.5 text-sm text-muted" colSpan={2}>
                    Phí vận chuyển
                  </td>
                  <td className="px-5 py-2.5 text-right tabular-nums">{order.shipping_fee === 0 ? "Miễn phí" : vnd(order.shipping_fee)}</td>
                </tr>
                <tr>
                  <td className="px-5 py-2.5 font-bold" colSpan={2}>
                    Tổng cộng
                  </td>
                  <td className="px-5 py-2.5 text-right text-lg font-extrabold tabular-nums">{vnd(order.total)}</td>
                </tr>
              </tfoot>
            </table>
          </section>

          <section className="kcard p-5">
            <h2 className="font-bold">Khách hàng</h2>
            <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">Tên</dt>
                <dd className="font-semibold">{order.customer_name}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wider text-muted">Điện thoại</dt>
                <dd className="flex flex-wrap gap-3 font-semibold">
                  <a href={`tel:${phoneDigits}`} className="underline">
                    {order.customer_phone}
                  </a>
                  <a href={`https://zalo.me/${phoneDigits}`} target="_blank" rel="noopener noreferrer" className="text-accent underline">
                    Zalo
                  </a>
                </dd>
              </div>
              {order.customer_email && (
                <div>
                  <dt className="text-xs uppercase tracking-wider text-muted">Email</dt>
                  <dd>
                    <a href={`mailto:${order.customer_email}`} className="underline">
                      {order.customer_email}
                    </a>
                  </dd>
                </div>
              )}
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wider text-muted">Địa chỉ giao</dt>
                <dd>{order.customer_address}</dd>
              </div>
              {order.note && (
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase tracking-wider text-muted">Ghi chú của khách</dt>
                  <dd className="whitespace-pre-line rounded-lg bg-tint-yellow px-3 py-2">{order.note}</dd>
                </div>
              )}
            </dl>
          </section>

          <section className="kcard p-5">
            <h2 className="font-bold">Ghi chú nội bộ</h2>
            <div className="mt-3">
              <AdminNoteForm orderId={order.id} note={order.admin_note} />
            </div>
          </section>

          <section className="kcard p-5">
            <h2 className="font-bold">Lịch sử</h2>
            <ol className="mt-3 space-y-2 text-sm">
              {order.events.map((e) => (
                <li key={e.id} className="flex gap-3">
                  <span className="w-32 shrink-0 text-xs text-muted tabular-nums">{dateTime(e.created_at)}</span>
                  <span>
                    {e.from_status ? `${statusLabel[e.from_status]} → ` : ""}
                    <span className="font-semibold">{statusLabel[e.to_status]}</span>
                    {e.note && <span className="text-muted"> · {e.note}</span>}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        <aside className="space-y-6">
          <section className="kcard p-5">
            <h2 className="font-bold">Xử lý đơn</h2>
            <div className="mt-3">
              <StatusActions orderId={order.id} status={order.status} />
            </div>
          </section>

          <section className="kcard p-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold">Thanh toán</h2>
              <span className={`text-xs font-bold ${order.payment_status === "paid" ? "text-[#0d6b3a]" : "text-muted"}`}>
                {paymentStatusLabel[order.payment_status]}
              </span>
            </div>
            <p className="mt-1 text-sm text-muted">{paymentMethodLabel[order.payment_method]}</p>
            {order.payment_method === "bank" && order.payment_status === "unpaid" && (
              <p className="mt-2 rounded-lg bg-tint-yellow px-3 py-2 text-xs">
                Nội dung CK khách cần ghi: <span className="font-mono font-bold">{sanitizeTransferNote(order.code)}</span>
              </p>
            )}
            {order.transfer_reported_at && order.payment_status === "unpaid" && (
              <p className="mt-2 rounded-lg border-2 border-accent bg-tint-pink px-3 py-2 text-xs font-bold">
                Khách báo đã chuyển khoản lúc {dateTime(order.transfer_reported_at)} — kiểm tra tài khoản /{" "}
                <Link href="/admin/payments" className="underline">
                  giao dịch chưa khớp
                </Link>
                .
              </p>
            )}
            {transactions.length > 0 && (
              <ul className="mt-3 space-y-1 text-xs">
                {transactions.map((tx) => (
                  <li key={tx.id} className="flex justify-between gap-2 text-muted">
                    <span>
                      {tx.transfer_type === "in" ? "Tiền vào" : "Tiền ra"} · {tx.gateway ?? tx.provider} · {dateTime(tx.transaction_at ?? tx.created_at)}
                    </span>
                    <span className="font-mono tabular-nums">{vnd(tx.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
            {order.payments.length > 0 && (
              <ul className="mt-3 space-y-1 text-xs">
                {order.payments.map((p) => (
                  <li key={p.id} className="flex justify-between gap-2">
                    <span>
                      {p.provider}
                      {p.provider_ref ? ` · ${p.provider_ref}` : ""}
                    </span>
                    <span className="font-bold tabular-nums">{vnd(p.amount)}</span>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4">
              <PaymentPanel
                orderId={order.id}
                method={order.payment_method}
                paymentStatus={order.payment_status}
                total={order.total}
              />
            </div>
          </section>

          <section className="kcard p-5 text-sm">
            <h2 className="font-bold">Link tra cứu cho khách</h2>
            <p className="mt-1 text-xs text-muted">Gửi link này qua Zalo/SMS để khách xem tình trạng đơn.</p>
            <input readOnly value={trackUrl} className="mt-2 w-full rounded-lg border border-border bg-bg px-2 py-1.5 font-mono text-[11px]" />
          </section>
        </aside>
      </div>
    </div>
  );
}

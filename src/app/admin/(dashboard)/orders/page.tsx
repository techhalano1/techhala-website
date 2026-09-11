import Link from "next/link";
import { isOrderStatus, orderStatuses } from "@/lib/db";
import { listOrders } from "@/lib/orders";
import { dateTime, paymentMethodLabel, paymentStatusLabel, statusLabel, statusTone, vnd } from "@/lib/admin-ui";

export const metadata = { title: "Đơn hàng" };

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status: statusRaw, q } = await searchParams;
  const status = statusRaw && isOrderStatus(statusRaw) ? statusRaw : undefined;
  const orders = await listOrders({ status, q, limit: 200 });

  const chip = (href: string, label: string, active: boolean) => (
    <Link key={href} href={href} className="kchip text-xs" aria-pressed={active}>
      {label}
    </Link>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Đơn hàng</h1>
          <p className="text-sm text-muted">{orders.length} đơn</p>
        </div>
        <form className="flex gap-2" role="search">
          {status && <input type="hidden" name="status" value={status} />}
          <input
            name="q"
            defaultValue={q}
            placeholder="Mã đơn, SĐT, tên khách…"
            className="h-10 w-64 rounded-xl border-2 border-ink bg-bg-elev px-3 text-sm outline-none focus:shadow-hard-accent"
          />
          <button type="submit" className="kbtn kbtn-ink h-10 px-4 text-xs">
            Tìm
          </button>
        </form>
      </div>

      <div className="flex flex-wrap gap-2">
        {chip(q ? `/admin/orders?q=${encodeURIComponent(q)}` : "/admin/orders", "Tất cả", !status)}
        {orderStatuses.map((s) =>
          chip(`/admin/orders?status=${s}${q ? `&q=${encodeURIComponent(q)}` : ""}`, statusLabel[s], status === s),
        )}
      </div>

      <div className="kcard overflow-x-auto">
        {orders.length === 0 ? (
          <p className="p-5 text-sm text-muted">Không có đơn nào khớp bộ lọc.</p>
        ) : (
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-2">Mã</th>
                <th className="px-3 py-2">Khách</th>
                <th className="px-3 py-2">Địa chỉ</th>
                <th className="px-3 py-2 text-right">Tổng</th>
                <th className="px-3 py-2">Thanh toán</th>
                <th className="px-3 py-2">Trạng thái</th>
                <th className="px-5 py-2">Lúc</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-border align-top hover:bg-tint-peach/40">
                  <td className="px-5 py-2.5 font-mono font-bold">
                    <Link href={`/admin/orders/${o.id}`} className="hover:underline">
                      {o.code}
                    </Link>
                  </td>
                  <td className="px-3 py-2.5">
                    {o.customer_name}
                    <span className="block text-xs text-muted">{o.customer_phone}</span>
                  </td>
                  <td className="max-w-[260px] px-3 py-2.5 text-xs text-muted">{o.customer_address}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">{vnd(o.total)}</td>
                  <td className="px-3 py-2.5 text-xs">
                    {paymentMethodLabel[o.payment_method]}
                    <span className={`block font-bold ${o.payment_status === "paid" ? "text-[#0d6b3a]" : "text-muted"}`}>
                      {paymentStatusLabel[o.payment_status]}
                    </span>
                  </td>
                  <td className="px-3 py-2.5">
                    <span className={`whitespace-nowrap rounded-md border border-ink px-2 py-0.5 text-xs font-bold ${statusTone[o.status]}`}>
                      {statusLabel[o.status]}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-2.5 text-xs text-muted tabular-nums">{dateTime(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

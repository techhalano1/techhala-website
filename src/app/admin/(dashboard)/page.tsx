import Link from "next/link";
import { listOrders, listStock, orderStats } from "@/lib/orders";
import { listBankTransactions } from "@/lib/payments";
import { dateTime, paymentMethodLabel, statusLabel, statusTone, vnd } from "@/lib/admin-ui";
import { orderStatuses } from "@/lib/db";

export default async function AdminHome() {
  const [stats, recent, stock, unmatched] = await Promise.all([
    orderStats(),
    listOrders({ limit: 8 }),
    listStock(),
    listBankTransactions({ unmatchedOnly: true, limit: 50 }),
  ]);
  const totalOnHand = stock.reduce((s, v) => s + v.on_hand, 0);
  const totalReserved = stock.reduce((s, v) => s + v.reserved, 0);
  const totalSold = stock.reduce((s, v) => s + v.sold, 0);
  const low = stock.filter((v) => v.active && v.on_hand - v.reserved <= 2);

  const cards = [
    { label: "Chờ xác nhận", value: stats.byStatus.pending ?? 0, href: "/admin/orders?status=pending", tone: "bg-tint-yellow" },
    { label: "Đang xử lý / giao", value: (stats.byStatus.confirmed ?? 0) + (stats.byStatus.packed ?? 0) + (stats.byStatus.shipping ?? 0), href: "/admin/orders", tone: "bg-tint-blue" },
    { label: "Đã giao", value: stats.byStatus.delivered ?? 0, href: "/admin/orders?status=delivered", tone: "bg-tint-green" },
    { label: "Doanh thu đã giao", value: vnd(stats.deliveredRevenue), href: "/admin/orders?status=delivered", tone: "bg-tint-peach" },
    { label: "Tồn kho (tất cả SKU)", value: totalOnHand, href: "/admin/inventory", tone: "bg-tint-purple" },
    { label: "Đang giữ cho đơn", value: totalReserved, href: "/admin/orders?status=confirmed", tone: "bg-tint-yellow" },
    { label: "Đã bán (xuất kho)", value: totalSold, href: "/admin/inventory", tone: "bg-tint-green" },
    { label: "Tiền đã thu", value: vnd(stats.paidTotal), href: "/admin/orders", tone: "bg-tint-blue" },
  ];
  if (unmatched.length > 0) {
    cards.unshift({ label: "Tiền vào chưa khớp đơn", value: unmatched.length, href: "/admin/payments", tone: "bg-tint-pink" });
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold">Tổng quan</h1>
        <p className="text-sm text-muted">Đơn hàng, kho và doanh thu theo thời gian thực từ Supabase.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link key={c.label} href={c.href} className={`kcard kcard-hover p-4 ${c.tone}`}>
            <p className="text-xs font-bold uppercase tracking-wider text-muted">{c.label}</p>
            <p className="mt-1 text-2xl font-extrabold tabular-nums">{c.value}</p>
          </Link>
        ))}
      </div>

      {low.length > 0 && (
        <div className="kcard p-5">
          <h2 className="font-bold">Sắp hết hàng (khả dụng ≤ 2)</h2>
          <ul className="mt-2 grid gap-1 text-sm sm:grid-cols-2">
            {low.map((v) => (
              <li key={v.variant_id} className="flex justify-between gap-3">
                <span>
                  {v.product_name}
                  {v.color_name ? ` · ${v.color_name}` : ""}
                </span>
                <span className="font-mono font-bold tabular-nums">{v.on_hand - v.reserved}</span>
              </li>
            ))}
          </ul>
          <Link href="/admin/inventory" className="mt-3 inline-block text-sm font-bold text-accent underline">
            Nhập kho →
          </Link>
        </div>
      )}

      <div className="kcard overflow-hidden">
        <div className="flex items-center justify-between border-b-2 border-ink px-5 py-3">
          <h2 className="font-bold">Đơn mới nhất</h2>
          <Link href="/admin/orders" className="text-sm font-bold text-accent underline">
            Tất cả đơn
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="p-5 text-sm text-muted">Chưa có đơn hàng nào. Khi khách đặt hàng trên website, đơn sẽ hiện ở đây.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-2">Mã</th>
                <th className="px-3 py-2">Khách</th>
                <th className="px-3 py-2">Tổng</th>
                <th className="px-3 py-2">TT</th>
                <th className="px-3 py-2">Trạng thái</th>
                <th className="px-5 py-2">Lúc</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.id} className="border-t border-border">
                  <td className="px-5 py-2 font-mono font-bold">
                    <Link href={`/admin/orders/${o.id}`} className="hover:underline">
                      {o.code}
                    </Link>
                  </td>
                  <td className="px-3 py-2">
                    {o.customer_name}
                    <span className="block text-xs text-muted">{o.customer_phone}</span>
                  </td>
                  <td className="px-3 py-2 tabular-nums">{vnd(o.total)}</td>
                  <td className="px-3 py-2">{paymentMethodLabel[o.payment_method]}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-md border border-ink px-2 py-0.5 text-xs font-bold ${statusTone[o.status]}`}>
                      {statusLabel[o.status]}
                    </span>
                  </td>
                  <td className="px-5 py-2 text-muted tabular-nums">{dateTime(o.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <p className="text-xs text-muted">
        Trạng thái đơn: {orderStatuses.map((s) => statusLabel[s]).join(" → ")}. Kho chỉ bị trừ khi đơn chuyển sang
        &ldquo;Đã đóng gói&rdquo;; đơn huỷ/hoàn trả sau đó sẽ cộng lại kho.
      </p>
    </div>
  );
}

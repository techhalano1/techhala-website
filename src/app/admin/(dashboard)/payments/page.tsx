import Link from "next/link";
import { requireDb } from "@/lib/db";
import { listBankTransactions } from "@/lib/payments";
import { extractOrderCode, getBankAccount } from "@/lib/vietqr";
import { dateTime, vnd } from "@/lib/admin-ui";
import { MatchTransactionForm } from "@/components/admin/MatchTransactionForm";

export const metadata = { title: "Thanh toán" };

export default async function AdminPaymentsPage() {
  const transactions = await listBankTransactions({ limit: 200 });
  const orderIds = [...new Set(transactions.map((t) => t.order_id).filter((id): id is string => id !== null))];
  const { data: orders } = orderIds.length
    ? await requireDb().from("orders").select("id, code, total, payment_status").in("id", orderIds)
    : { data: [] };
  const orderById = new Map((orders ?? []).map((o) => [o.id, o]));

  const unmatched = transactions.filter((t) => t.transfer_type === "in" && t.order_id === null);
  const bank = getBankAccount();
  const sepayReady = Boolean(process.env.SEPAY_API_KEY);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Thanh toán chuyển khoản</h1>
        <p className="text-sm text-muted">
          Giao dịch tiền vào do SePay đẩy về. Tiền có nội dung chứa mã đơn sẽ tự khớp và đánh dấu &ldquo;Đã thu&rdquo;;
          giao dịch chưa khớp cần bạn nhập mã đơn để khớp tay.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className={`kcard p-4 text-sm ${bank ? "bg-tint-green" : "bg-tint-pink"}`}>
          <p className="font-bold">Tài khoản nhận tiền (VietQR)</p>
          {bank ? (
            <p className="mt-1 text-muted">
              {bank.bankName} · <span className="font-mono">{bank.accountNo}</span> · {bank.accountName}
            </p>
          ) : (
            <p className="mt-1 text-muted">
              Chưa cấu hình <code className="font-mono">BANK_CODE</code>, <code className="font-mono">BANK_ACCOUNT_NO</code>,{" "}
              <code className="font-mono">BANK_ACCOUNT_NAME</code> — khách sẽ không thấy mã QR.
            </p>
          )}
        </div>
        <div className={`kcard p-4 text-sm ${sepayReady ? "bg-tint-green" : "bg-tint-yellow"}`}>
          <p className="font-bold">Đối soát tự động (SePay)</p>
          <p className="mt-1 text-muted">
            {sepayReady
              ? "Webhook đã bật tại /api/webhooks/sepay."
              : "Chưa đặt SEPAY_API_KEY — tiền vào không được tự khớp; ghi nhận thanh toán tay trong từng đơn."}
          </p>
        </div>
      </div>

      {unmatched.length > 0 && (
        <section className="kcard overflow-x-auto border-accent">
          <h2 className="border-b-2 border-ink bg-tint-yellow px-5 py-3 font-bold">Chưa khớp đơn ({unmatched.length})</h2>
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-2">Thời gian</th>
                <th className="px-3 py-2 text-right">Số tiền</th>
                <th className="px-3 py-2">Nội dung</th>
                <th className="px-5 py-2">Khớp với đơn</th>
              </tr>
            </thead>
            <tbody>
              {unmatched.map((t) => (
                <tr key={t.id} className="border-t border-border align-top">
                  <td className="px-5 py-2 whitespace-nowrap">{dateTime(t.transaction_at ?? t.created_at)}</td>
                  <td className="px-3 py-2 text-right font-mono font-bold tabular-nums">{vnd(t.amount)}</td>
                  <td className="max-w-[320px] px-3 py-2 text-muted">
                    {t.content ?? "—"}
                    {t.reference_code && <span className="block font-mono text-xs">{t.reference_code}</span>}
                  </td>
                  <td className="px-5 py-2">
                    <MatchTransactionForm txId={t.id} suggestedCode={extractOrderCode(t.content ?? t.reference_code)} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      <section className="kcard overflow-x-auto">
        <h2 className="border-b-2 border-ink px-5 py-3 font-bold">Tất cả giao dịch ({transactions.length})</h2>
        {transactions.length === 0 ? (
          <p className="px-5 py-6 text-sm text-muted">Chưa có giao dịch nào. Khi SePay đẩy webhook, giao dịch sẽ hiện ở đây.</p>
        ) : (
          <table className="w-full min-w-[720px] text-sm">
            <thead className="text-left text-xs uppercase tracking-wider text-muted">
              <tr>
                <th className="px-5 py-2">Thời gian</th>
                <th className="px-3 py-2">Loại</th>
                <th className="px-3 py-2 text-right">Số tiền</th>
                <th className="px-3 py-2">Nội dung</th>
                <th className="px-3 py-2">Ngân hàng</th>
                <th className="px-5 py-2">Đơn hàng</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t) => {
                const order = t.order_id ? orderById.get(t.order_id) : undefined;
                return (
                  <tr key={t.id} className="border-t border-border">
                    <td className="px-5 py-2 whitespace-nowrap">{dateTime(t.transaction_at ?? t.created_at)}</td>
                    <td className="px-3 py-2">
                      <span className={`rounded-md px-1.5 py-0.5 text-xs font-bold ${t.transfer_type === "in" ? "bg-tint-green" : "bg-tint-pink"}`}>
                        {t.transfer_type === "in" ? "Tiền vào" : "Tiền ra"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-right font-mono tabular-nums">{vnd(t.amount)}</td>
                    <td className="max-w-[320px] truncate px-3 py-2 text-muted" title={t.content ?? ""}>
                      {t.content ?? "—"}
                    </td>
                    <td className="px-3 py-2 text-muted">
                      {t.gateway ?? t.provider}
                      <span className="block font-mono text-xs">#{t.provider_tx_id}</span>
                    </td>
                    <td className="px-5 py-2">
                      {order ? (
                        <Link href={`/admin/orders/${order.id}`} className="font-mono font-bold text-accent hover:underline">
                          {order.code}
                        </Link>
                      ) : t.transfer_type === "in" ? (
                        <span className="text-xs font-bold text-accent">Chưa khớp</span>
                      ) : (
                        <span className="text-xs text-muted">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}

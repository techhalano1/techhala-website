"use client";

import { useActionState, useState, useTransition } from "react";
import type { OrderStatus, PaymentMethod, PaymentStatus } from "@/lib/db";
import { nextStatuses, statusActionLabel } from "@/lib/admin-ui";
import {
  changeOrderStatus,
  recordPayment,
  updateAdminNote,
  updatePaymentStatus,
  type ActionResult,
} from "@/app/admin/actions";

const field = "w-full rounded-xl border-2 border-ink bg-bg-elev px-3 py-2 text-sm outline-none focus:shadow-hard-accent";

function ErrorLine({ result }: { result: ActionResult | null }) {
  if (!result || result.ok) return null;
  return (
    <p role="alert" className="rounded-lg border-2 border-accent bg-tint-pink px-3 py-2 text-xs font-medium">
      {result.error}
    </p>
  );
}

export function StatusActions({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  const options = nextStatuses[status];
  if (options.length === 0) return <p className="text-sm text-muted">Đơn đã kết thúc.</p>;

  const run = (next: OrderStatus) => {
    const destructive = next === "cancelled" || next === "returned";
    if (destructive && !window.confirm(`${statusActionLabel[next]}?`)) return;
    start(async () => setResult(await changeOrderStatus(orderId, next)));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {options.map((next) => (
          <button
            key={next}
            type="button"
            disabled={pending}
            onClick={() => run(next)}
            className={`kbtn h-10 px-4 text-xs ${
              next === "cancelled" || next === "returned" ? "kbtn-white" : "kbtn-accent"
            }`}
          >
            {statusActionLabel[next]}
          </button>
        ))}
      </div>
      <ErrorLine result={result} />
    </div>
  );
}

export function PaymentPanel({
  orderId,
  method,
  paymentStatus,
  total,
}: {
  orderId: string;
  method: PaymentMethod;
  paymentStatus: PaymentStatus;
  total: number;
}) {
  const [result, action, pending] = useActionState<ActionResult | null, FormData>(recordPayment, null);
  const [pending2, start] = useTransition();
  const [result2, setResult2] = useState<ActionResult | null>(null);

  if (paymentStatus === "paid") {
    return (
      <div className="space-y-2">
        <button
          type="button"
          disabled={pending2}
          className="kbtn kbtn-white h-9 px-3 text-xs"
          onClick={() => {
            if (!window.confirm("Đánh dấu đã hoàn tiền cho khách?")) return;
            start(async () => setResult2(await updatePaymentStatus(orderId, "refunded")));
          }}
        >
          Đã hoàn tiền
        </button>
        <ErrorLine result={result2} />
      </div>
    );
  }

  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="orderId" value={orderId} />
      <div className="grid grid-cols-2 gap-2">
        <label className="block text-xs font-bold">
          Số tiền
          <input name="amount" type="number" min={1} step={1000} defaultValue={total} required className={`${field} mt-1`} />
        </label>
        <label className="block text-xs font-bold">
          Hình thức
          <select name="provider" defaultValue={method === "cod" ? "cod" : "bank"} className={`${field} mt-1`}>
            <option value="bank">Chuyển khoản</option>
            <option value="cod">Tiền mặt COD</option>
            <option value="other">Khác</option>
          </select>
        </label>
      </div>
      <label className="block text-xs font-bold">
        Mã giao dịch / ghi chú
        <input name="ref" className={`${field} mt-1`} placeholder="VD: FT2409…" />
      </label>
      <button type="submit" disabled={pending} className="kbtn kbtn-ink h-9 px-4 text-xs">
        {pending ? "Đang lưu…" : "Ghi nhận đã thu tiền"}
      </button>
      {result?.ok && <p className="text-xs font-bold text-[#0d6b3a]">Đã ghi nhận.</p>}
      <ErrorLine result={result} />
    </form>
  );
}

export function AdminNoteForm({ orderId, note }: { orderId: string; note: string | null }) {
  const [result, action, pending] = useActionState<ActionResult | null, FormData>(updateAdminNote, null);
  return (
    <form action={action} className="space-y-2">
      <input type="hidden" name="orderId" value={orderId} />
      <textarea
        name="adminNote"
        rows={3}
        defaultValue={note ?? ""}
        placeholder="Ghi chú nội bộ: đã gọi khách, hẹn giao, mã vận đơn…"
        className={field}
      />
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="kbtn kbtn-white h-9 px-4 text-xs">
          {pending ? "Đang lưu…" : "Lưu ghi chú"}
        </button>
        {result?.ok && <span className="text-xs font-bold text-[#0d6b3a]">Đã lưu.</span>}
      </div>
      <ErrorLine result={result} />
    </form>
  );
}

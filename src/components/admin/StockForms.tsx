"use client";

import { useActionState, useState, useTransition } from "react";
import { stockIn, syncCatalogAction, type ActionResult } from "@/app/admin/actions";

const field = "rounded-xl border-2 border-ink bg-bg-elev px-3 py-2 text-sm outline-none focus:shadow-hard-accent";

export function StockInForm({ variants }: { variants: { id: string; label: string }[] }) {
  const [result, action, pending] = useActionState<ActionResult | null, FormData>(stockIn, null);
  return (
    <form action={action} className="flex flex-wrap items-end gap-3">
      <label className="block text-xs font-bold">
        Sản phẩm / màu
        <select name="variantId" required className={`${field} mt-1 block min-w-[260px]`}>
          {variants.map((v) => (
            <option key={v.id} value={v.id}>
              {v.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-xs font-bold">
        Số lượng (âm = trừ)
        <input name="qty" type="number" required defaultValue={10} className={`${field} mt-1 block w-32`} />
      </label>
      <label className="block text-xs font-bold">
        Loại
        <select name="reason" className={`${field} mt-1 block`}>
          <option value="purchase">Nhập hàng</option>
          <option value="adjust">Điều chỉnh / kiểm kho</option>
        </select>
      </label>
      <label className="block flex-1 text-xs font-bold">
        Ghi chú
        <input name="note" placeholder="Lô hàng, nhà cung cấp…" className={`${field} mt-1 block w-full`} />
      </label>
      <button type="submit" disabled={pending} className="kbtn kbtn-accent h-10 px-5 text-xs">
        {pending ? "Đang lưu…" : "Ghi vào kho"}
      </button>
      {result?.ok && <span className="text-xs font-bold text-[#0d6b3a]">Đã cập nhật kho.</span>}
      {result && !result.ok && (
        <span role="alert" className="text-xs font-bold text-accent">
          {result.error}
        </span>
      )}
    </form>
  );
}

export function SyncCatalogButton() {
  const [pending, start] = useTransition();
  const [result, setResult] = useState<ActionResult | null>(null);
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => setResult(await syncCatalogAction()))}
        className="kbtn kbtn-white h-9 px-4 text-xs"
      >
        {pending ? "Đang đồng bộ…" : "Đồng bộ danh mục từ website"}
      </button>
      {result?.ok && <span className="text-xs font-bold text-[#0d6b3a]">Đã đồng bộ.</span>}
      {result && !result.ok && (
        <span role="alert" className="text-xs font-bold text-accent">
          {result.error}
        </span>
      )}
    </div>
  );
}

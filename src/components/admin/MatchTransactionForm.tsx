"use client";

import { useActionState } from "react";
import { matchTransaction, type ActionResult } from "@/app/admin/actions";

const field = "rounded-xl border-2 border-ink bg-bg-elev px-3 py-1.5 text-sm outline-none focus:shadow-hard-accent";

export function MatchTransactionForm({ txId, suggestedCode }: { txId: number; suggestedCode?: string | null }) {
  const [result, action, pending] = useActionState<ActionResult | null, FormData>(matchTransaction, null);
  return (
    <form action={action} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="txId" value={txId} />
      <input
        name="code"
        required
        placeholder="TH-XXXXXXX"
        defaultValue={suggestedCode ?? ""}
        className={`${field} w-36 font-mono uppercase`}
        aria-label="Mã đơn hàng"
      />
      <button type="submit" disabled={pending} className="kbtn kbtn-accent h-8 px-3 text-xs">
        {pending ? "Đang khớp…" : "Khớp đơn"}
      </button>
      {result?.ok && <span className="text-xs font-bold text-[#0d6b3a]">Đã khớp.</span>}
      {result && !result.ok && (
        <span role="alert" className="text-xs font-bold text-accent">
          {result.error}
        </span>
      )}
    </form>
  );
}

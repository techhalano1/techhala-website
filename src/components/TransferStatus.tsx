"use client";

import { useEffect, useState } from "react";
import type { Dictionary } from "@/content";
import { paymentStatusAction } from "@/app/[locale]/orders/actions";
import { BankTransferPanel, type BankTransferInfo } from "@/components/BankTransferPanel";
import { ReportTransferButton } from "@/components/ReportTransferButton";

const POLL_MS = 5000;
const POLL_FOR_MS = 20 * 60 * 1000;

/**
 * VietQR panel that polls the order's payment status and swaps to a "paid" banner
 * as soon as the transfer is reconciled (SePay webhook or admin match).
 */
export function TransferStatus({
  info,
  code,
  token,
  locale,
  labels: D,
  alreadyReported = false,
  onPaid,
}: {
  info: BankTransferInfo;
  code: string;
  token?: string;
  locale: string;
  labels: Dictionary["orders"]["detail"];
  alreadyReported?: boolean;
  onPaid?: () => void;
}) {
  const [paid, setPaid] = useState(false);

  useEffect(() => {
    if (!token || paid) return;
    const started = Date.now();
    let cancelled = false;
    const tick = async () => {
      if (cancelled || document.visibilityState === "hidden") return;
      const status = await paymentStatusAction(code, token);
      if (cancelled) return;
      if (status === "paid") {
        setPaid(true);
        onPaid?.();
      }
    };
    const id = setInterval(() => {
      if (Date.now() - started > POLL_FOR_MS) clearInterval(id);
      else void tick();
    }, POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [code, token, paid, onPaid]);

  if (paid) {
    return (
      <div className="rounded-xl border-2 border-ink bg-tint-green p-5 text-left" role="status" aria-live="polite">
        <p className="text-lg font-extrabold">✓ {D.bank.paid}</p>
        <p className="mt-1 text-sm text-muted">{D.bank.paidNext}</p>
      </div>
    );
  }

  return (
    <BankTransferPanel info={info} locale={locale} labels={D}>
      {token && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-bold text-muted" aria-live="polite">
            <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
            {D.bank.waiting}
          </span>
          <ReportTransferButton code={code} token={token} alreadyReported={alreadyReported} labels={D.bank} />
        </div>
      )}
    </BankTransferPanel>
  );
}

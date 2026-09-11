"use client";

import { useState } from "react";
import type { Dictionary } from "@/content";
import { formatVnd } from "@/lib/site";

/** Everything the client needs to render a transfer request; computed server-side from BANK_* env. */
export type BankTransferInfo = {
  qrDataUrl: string;
  bankName: string;
  accountNo: string;
  accountName: string;
  amount: number;
  transferNote: string;
};

function CopyButton({ value, labels }: { value: string; labels: { copy: string; copied: string } }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        } catch {
          /* clipboard unavailable (http / old browser) — value is visible anyway */
        }
      }}
      className="rounded-md border border-border px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider text-muted hover:text-fg"
      aria-live="polite"
    >
      {copied ? labels.copied : labels.copy}
    </button>
  );
}

export function BankTransferPanel({
  info,
  locale,
  labels: D,
  children,
}: {
  info: BankTransferInfo;
  locale: string;
  labels: Dictionary["orders"]["detail"];
  children?: React.ReactNode;
}) {
  const B = D.bank;
  const row = (label: string, value: string, mono = false) => (
    <div className="flex items-center justify-between gap-3 py-2">
      <span className="text-muted">{label}</span>
      <span className="flex items-center gap-2 text-right">
        <span className={`font-bold ${mono ? "font-mono tabular-nums" : ""}`}>{value}</span>
        <CopyButton value={value} labels={B} />
      </span>
    </div>
  );

  return (
    <div className="rounded-xl border-2 border-ink bg-tint-yellow p-4 text-left text-sm">
      <p className="font-bold">{D.bankTitle}</p>
      <p className="mt-1 text-muted">{D.bankBody}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-[180px_1fr] sm:items-start">
        <figure className="mx-auto w-[180px] rounded-xl border-2 border-ink bg-white p-2 shadow-hard">
          {/* eslint-disable-next-line @next/next/no-img-element -- inline SVG data URL */}
          <img src={info.qrDataUrl} alt="VietQR" width={164} height={164} className="h-auto w-full" />
          <figcaption className="mt-1 text-center text-[11px] font-bold text-muted">VietQR · Napas 247</figcaption>
        </figure>
        <div className="divide-y divide-ink/10 rounded-xl border border-ink/10 bg-white/70 px-3">
          {row(B.bank, info.bankName)}
          {row(B.accountNo, info.accountNo, true)}
          {row(B.accountName, info.accountName)}
          {row(B.amount, formatVnd(info.amount, locale), true)}
          {row(D.transferNote, info.transferNote, true)}
        </div>
      </div>

      <p className="mt-3 text-xs text-muted">{B.auto}</p>
      {children}
    </div>
  );
}

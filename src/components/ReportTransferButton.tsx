"use client";

import { useState, useTransition } from "react";
import type { Dictionary } from "@/content";
import { reportTransferAction } from "@/app/[locale]/orders/actions";

export function ReportTransferButton({
  code,
  token,
  alreadyReported,
  labels: B,
}: {
  code: string;
  token: string;
  alreadyReported: boolean;
  labels: Dictionary["orders"]["detail"]["bank"];
}) {
  const [reported, setReported] = useState(alreadyReported);
  const [pending, start] = useTransition();

  if (reported) {
    return (
      <p className="mt-3 rounded-lg border-2 border-ink bg-tint-green px-3 py-2 text-sm font-bold" role="status">
        {B.reported}
      </p>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await reportTransferAction(code, token);
          if (res.ok) setReported(true);
        })
      }
      className="kbtn kbtn-ink mt-3 h-10 px-4 text-sm"
    >
      {pending ? B.reporting : B.report}
    </button>
  );
}

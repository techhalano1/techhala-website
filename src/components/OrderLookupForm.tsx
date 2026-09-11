"use client";

import { useActionState } from "react";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { lookupOrder, type LookupState } from "@/app/[locale]/orders/actions";

const field =
  "w-full rounded-xl border-2 border-ink bg-bg-elev px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted/70 focus:shadow-hard-accent";

export function OrderLookupForm({
  locale,
  copy,
  initialCode,
}: {
  locale: Locale;
  copy: Dictionary["orders"]["form"];
  initialCode?: string;
}) {
  const [state, action, pending] = useActionState<LookupState, FormData>(lookupOrder, { status: "idle" });

  return (
    <form action={action} className="kcard mx-auto max-w-md space-y-4 p-6 sm:p-8">
      <input type="hidden" name="locale" value={locale} />
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">{copy.code}</span>
        <input
          name="code"
          required
          autoComplete="off"
          defaultValue={initialCode}
          placeholder="TH-XXXXXXX"
          className={`${field} font-mono uppercase`}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">{copy.phone}</span>
        <input name="phone" type="tel" required autoComplete="tel" inputMode="tel" className={field} />
      </label>
      {state.status === "not_found" && (
        <p role="alert" className="rounded-xl border-2 border-accent bg-tint-pink px-3.5 py-2.5 text-sm font-medium">
          {copy.notFound}
        </p>
      )}
      <button type="submit" disabled={pending} className="kbtn kbtn-accent h-11 w-full text-sm">
        {pending ? copy.searching : copy.submit}
      </button>
    </form>
  );
}

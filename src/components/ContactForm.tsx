"use client";

import { useActionState } from "react";
import type { Dictionary } from "@/content";
import type { Locale } from "@/lib/i18n";
import { submitContact, type ContactState } from "@/app/[locale]/contact/actions";

const field =
  "w-full rounded-md border border-border bg-bg px-3.5 py-2.5 text-sm outline-none transition placeholder:text-muted/70 focus:border-accent";

export function ContactForm({ locale, t }: { locale: Locale; t: Dictionary["contact"]["form"] }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitContact, {
    status: "idle",
  });

  if (state.status === "success") {
    return (
      <div className="rounded-xl border border-accent/40 bg-accent/5 p-6 text-sm" role="status">
        {t.success}
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">{t.name}</span>
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">{t.email}</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">{t.company}</span>
          <input name="company" autoComplete="organization" className={field} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-muted">{t.topic}</span>
          <select name="topic" className={field} defaultValue={t.topics[0]}>
            {t.topics.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block text-sm">
        <span className="mb-1.5 block text-muted">{t.message}</span>
        <textarea name="message" required rows={5} className={field} />
      </label>
      {state.status === "error" && (
        <p className="text-sm text-red-500" role="alert">
          {t.error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-md bg-fg px-6 text-sm font-medium text-bg transition hover:opacity-90 disabled:opacity-60"
      >
        {pending ? t.sending : t.submit}
      </button>
    </form>
  );
}

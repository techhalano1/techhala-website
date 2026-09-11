"use client";

import { useActionState } from "react";
import { login, type LoginState } from "@/app/admin/actions";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="mt-6 space-y-4">
      {next && <input type="hidden" name="next" value={next} />}
      <label className="block">
        <span className="mb-1.5 block text-sm font-bold">Mật khẩu</span>
        <input
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          className="w-full rounded-xl border-2 border-ink bg-bg-elev px-3.5 py-2.5 text-sm outline-none focus:shadow-hard-accent"
        />
      </label>
      {state.error && (
        <p role="alert" className="rounded-xl border-2 border-accent bg-tint-pink px-3.5 py-2.5 text-sm font-medium">
          {state.error}
        </p>
      )}
      <button type="submit" disabled={pending} className="kbtn kbtn-accent h-11 w-full text-sm">
        {pending ? "Đang đăng nhập…" : "Đăng nhập"}
      </button>
    </form>
  );
}

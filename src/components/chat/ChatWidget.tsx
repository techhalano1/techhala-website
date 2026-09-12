"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { Dictionary, Product } from "@/content";
import { localePath, type Locale } from "@/lib/i18n";
import { company, formatVnd } from "@/lib/site";
import { ProductVisual } from "@/components/ProductVisual";
import { AddToCartButton } from "@/components/cart/AddToCartButton";
import { useCart } from "@/components/cart/CartProvider";
import { OPEN_HALA_EVENT, type OpenHalaDetail } from "@/components/chat/openHala";

type Msg = { id: string; role: "user" | "assistant"; content: string; status?: "streaming" | "error" };

const STORAGE_KEY = "th_chat_v1";
const SESSION_KEY = "th_chat_session";
const MAX_CHARS = 1000;
const PRODUCT_TOKEN = /\[\[product:([a-z0-9-]+)\]\]/g;

const chip = "inline-flex h-8 items-center gap-1 rounded-full border-2 border-ink bg-tint-peach px-3 text-[11px] font-semibold transition hover:bg-tint-yellow";

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function sessionId() {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = uid() + uid();
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return "anon";
  }
}

/** Renders assistant text as paragraphs, then one card per distinct known product marker (in order of mention). */
function renderAssistant(text: string, bySlug: Map<string, Product>, cards: (p: Product) => ReactNode) {
  const clean = text.replace(/\[\[error\]\]/g, "").replace(/\*\*(.+?)\*\*/g, "$1");
  const seen = new Set<string>();
  const products: Product[] = [];
  for (const m of clean.matchAll(PRODUCT_TOKEN)) {
    const p = bySlug.get(m[1]);
    if (p && !seen.has(p.slug)) {
      seen.add(p.slug);
      products.push(p);
    }
  }
  const body = clean.replace(PRODUCT_TOKEN, "").replace(/[ \t]+([.,;:!?])/g, "$1").replace(/ {2,}/g, " ");
  return [
    <Text key="t" text={body} />,
    ...products.map((p) => <div key={`p${p.slug}`}>{cards(p)}</div>),
  ];
}

function Text({ text }: { text: string }) {
  const paras = text
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (paras.length === 0) return null;
  return (
    <>
      {paras.map((para, i) => {
        const lines = para.split("\n");
        const isList = lines.every((l) => /^\s*([-•*]|\d+[.)])\s+/.test(l));
        if (isList) {
          return (
            <ul key={i} className="my-1 list-disc space-y-0.5 pl-4">
              {lines.map((l, j) => (
                <li key={j}>{linkify(l.replace(/^\s*([-•*]|\d+[.)])\s+/, ""))}</li>
              ))}
            </ul>
          );
        }
        return (
          <p key={i} className="my-1 whitespace-pre-line">
            {linkify(para)}
          </p>
        );
      })}
    </>
  );
}

function linkify(s: string) {
  const out: ReactNode[] = [];
  const re = /(https?:\/\/[^\s)]+)|(\(?\+84\)?[\s.-]?0?868[\s.-]?862[\s.-]?564|0868[\s.-]?862[\s.-]?564)/g;
  let last = 0;
  for (const m of s.matchAll(re)) {
    const idx = m.index ?? 0;
    out.push(s.slice(last, idx));
    if (m[1]) {
      const label = m[1].replace(/^https?:\/\//, "").replace(/\/$/, "");
      out.push(
        <a key={idx} href={m[1]} className="font-semibold text-accent underline" target={m[1].startsWith(company.zaloUrl) ? "_blank" : undefined} rel="noopener noreferrer">
          {label}
        </a>,
      );
    } else {
      out.push(
        <a key={idx} href={`tel:${company.phoneE164}`} className="font-semibold text-accent underline">
          {m[0]}
        </a>,
      );
    }
    last = idx + m[0].length;
  }
  out.push(s.slice(last));
  return out;
}

export function ChatWidget({ locale, t }: { locale: Locale; t: Dictionary }) {
  const c = t.shop.chat;
  const pathname = usePathname();
  const { count, setOpen: setCartOpen } = useCart();
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const bySlug = useMemo(() => new Map(t.products.items.map((p) => [p.slug, p])), [t.products.items]);
  const onProductPage = /\/products\/[^/]+$/.test(pathname ?? "") && !pathname?.endsWith("/products/hal-sdlc");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { locale: Locale; msgs: Msg[] };
        if (saved.locale === locale && Array.isArray(saved.msgs)) setMsgs(saved.msgs.filter((m) => m.status !== "streaming"));
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, [locale]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ locale, msgs: msgs.slice(-40) }));
    } catch {
      /* ignore */
    }
  }, [msgs, hydrated, locale]);

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [msgs, open]);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const { prompt } = (e as CustomEvent<OpenHalaDetail>).detail ?? {};
      if (prompt) setInput(prompt.slice(0, MAX_CHARS));
      setOpen(true);
    };
    window.addEventListener(OPEN_HALA_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_HALA_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim().slice(0, MAX_CHARS);
      if (!content || busy) return;
      const history = [...msgs.filter((m) => m.status !== "error"), { id: uid(), role: "user" as const, content }];
      const reply: Msg = { id: uid(), role: "assistant", content: "", status: "streaming" };
      setMsgs([...history, reply]);
      setInput("");
      setBusy(true);
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      const finish = (patch: Partial<Msg>) => setMsgs((cur) => cur.map((m) => (m.id === reply.id ? { ...m, ...patch } : m)));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            locale,
            sessionId: sessionId(),
            messages: history.slice(-12).map(({ role, content }) => ({ role, content })),
          }),
          signal: ctrl.signal,
        });
        if (!res.ok || !res.body) {
          const msg = res.status === 429 ? c.rateLimited : res.status === 503 ? c.unavailable : c.error;
          finish({ content: msg, status: "error" });
          return;
        }
        const reader = res.body.getReader();
        const dec = new TextDecoder();
        let acc = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += dec.decode(value, { stream: true });
          finish({ content: acc });
        }
        if (acc.includes("[[error]]")) {
          const body = acc.replace("[[error]]", "").trim();
          finish({ content: body || c.error, status: body ? undefined : "error" });
        } else {
          finish({ content: acc.trim() || c.error, status: acc.trim() ? undefined : "error" });
        }
      } catch (err) {
        if ((err as Error).name !== "AbortError") finish({ content: c.error, status: "error" });
        else finish({ status: undefined });
      } finally {
        setBusy(false);
        abortRef.current = null;
      }
    },
    [busy, msgs, locale, c],
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const reset = () => {
    abortRef.current?.abort();
    setMsgs([]);
    setInput("");
  };

  const productCard = (p: Product) => (
    <div className="my-2 flex items-center gap-3 rounded-xl border-2 border-ink bg-bg-elev p-2 shadow-hard-sm">
      <Link href={localePath(locale, `/products/${p.slug}`)} className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-tint-peach">
        <ProductVisual product={p} sizes="56px" />
      </Link>
      <div className="min-w-0 flex-1">
        <Link href={localePath(locale, `/products/${p.slug}`)} className="line-clamp-1 text-sm font-bold hover:text-accent">
          {p.name}
        </Link>
        <p className="text-xs text-muted">
          <span className="font-bold text-accent">{formatVnd(p.price, locale)}</span>
          {p.ageLabel ? <span> · {p.ageLabel}</span> : null}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          <AddToCartButton
            slug={p.slug}
            color={p.colors?.[0]?.id}
            label={t.shop.cart.addToCart}
            addedLabel={t.shop.cart.added}
            className="h-7 px-2.5 text-[11px]"
            openDrawer={false}
          />
          <Link href={localePath(locale, `/products/${p.slug}`)} className="kbtn kbtn-white h-7 px-2.5 text-[11px]">
            {c.viewProduct}
          </Link>
        </div>
      </div>
    </div>
  );

  const showGreeting = msgs.length === 0;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? c.close : c.open}
        aria-expanded={open}
        aria-controls="th-chat-panel"
        className={`fixed right-4 z-40 flex h-14 items-center gap-2 rounded-full border-2 border-ink bg-accent pl-4 pr-5 text-sm font-bold text-white shadow-hard transition hover:-translate-y-0.5 sm:right-5 ${
          onProductPage ? "bottom-20 lg:bottom-5 lg:left-5 lg:right-auto" : "bottom-5"
        } ${open ? "hidden sm:flex" : ""}`}
      >
        <ChatIcon />
        <span className="hidden sm:inline">{c.open}</span>
      </button>

      {open && (
        <section
          id="th-chat-panel"
          role="dialog"
          aria-label={c.title}
          className={`fixed inset-0 z-[55] flex flex-col overflow-hidden bg-bg-elev sm:inset-auto sm:bottom-24 sm:right-5 sm:h-[min(640px,calc(100vh-7rem))] sm:w-[400px] sm:rounded-2xl sm:border-2 sm:border-ink sm:shadow-hard ${
            onProductPage ? "lg:left-5 lg:right-auto" : ""
          }`}
        >
          <header className="flex items-center gap-3 border-b-2 border-ink bg-ink px-4 py-3 text-white">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent">
              <ChatIcon />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-extrabold">{c.title}</p>
              <p className="truncate text-[11px] text-white/70">{c.subtitle}</p>
            </div>
            <button type="button" onClick={reset} className="rounded-lg px-2 py-1 text-[11px] font-semibold text-white/80 hover:bg-white/10" title={c.reset}>
              {c.reset}
            </button>
            <button type="button" onClick={() => setOpen(false)} aria-label={c.close} className="rounded-lg p-1.5 hover:bg-white/10">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-bg px-3 py-4 text-sm">
            {showGreeting && (
              <>
                <Bubble role="assistant">
                  <p>{c.greeting}</p>
                </Bubble>
                <div className="flex flex-wrap gap-1.5 pl-1">
                  {c.suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => void send(s)}
                      className="rounded-full border-2 border-ink bg-bg-elev px-3 py-1 text-left text-xs font-semibold transition hover:bg-tint-peach"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </>
            )}
            {msgs.map((m) => (
              <Bubble key={m.id} role={m.role} error={m.status === "error"}>
                {m.role === "user" ? (
                  <p className="whitespace-pre-line">{m.content}</p>
                ) : m.status === "streaming" && !m.content ? (
                  <span className="inline-flex items-center gap-1 text-muted">
                    <Dots /> {c.thinking}
                  </span>
                ) : (
                  renderAssistant(m.content, bySlug, productCard)
                )}
              </Bubble>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-1.5 border-t-2 border-ink bg-bg-elev px-3 py-2">
            <a href={`tel:${company.phoneE164}`} className={chip}>
              ☎ {t.shop.callUs}
            </a>
            <a href={company.zaloUrl} target="_blank" rel="noopener noreferrer" className={chip}>
              {t.shop.zalo}
            </a>
            {count > 0 ? (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setCartOpen(true);
                }}
                className={`${chip} !bg-accent !text-white`}
              >
                {c.checkout} · {count}
              </button>
            ) : null}
          </div>

          <form onSubmit={onSubmit} className="flex items-end gap-2 border-t-2 border-ink bg-bg-elev p-2">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value.slice(0, MAX_CHARS))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  void send(input);
                }
              }}
              rows={1}
              placeholder={c.placeholder}
              aria-label={c.placeholder}
              className="max-h-28 min-h-[40px] flex-1 resize-none rounded-xl border-2 border-ink bg-bg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent"
            />
            <button type="submit" disabled={busy || !input.trim()} className="kbtn kbtn-accent h-10 px-4 text-sm">
              {c.send}
            </button>
          </form>
          <p className="bg-bg-elev px-3 pb-2 text-[10px] leading-tight text-muted">{c.disclaimer}</p>
        </section>
      )}
    </>
  );
}

function Bubble({ role, error, children }: { role: "user" | "assistant"; error?: boolean; children: ReactNode }) {
  const mine = role === "user";
  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`min-w-0 max-w-[88%] break-words [overflow-wrap:anywhere] rounded-2xl border-2 border-ink px-3 py-2 leading-relaxed ${
          mine ? "rounded-br-md bg-ink text-white" : error ? "rounded-bl-md bg-tint-pink" : "rounded-bl-md bg-bg-elev"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

function Dots() {
  return (
    <span className="inline-flex gap-0.5" aria-hidden>
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.3s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted [animation-delay:-0.15s]" />
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted" />
    </span>
  );
}

function ChatIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5v-8Z" strokeLinejoin="round" />
      <circle cx="9" cy="9.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="9.5" r="1" fill="currentColor" stroke="none" />
      <circle cx="15" cy="9.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

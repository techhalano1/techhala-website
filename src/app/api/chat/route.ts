import { after } from "next/server";
import { getCatalog } from "@/lib/catalog";
import {
  buildSystemPrompt,
  chatConfigured,
  filterProductTokens,
  logChat,
  requestOrigin,
  sanitizeHistory,
  soldOutSlugs,
  streamCompletion,
  throttled,
} from "@/lib/chat";
import { matchFaq } from "@/lib/chat-faq";
import { isLocale, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BODY_BYTES = 16 * 1024;

const text = (status: number, body: string, extra: Record<string, string> = {}) =>
  new Response(body, { status, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", ...extra } });

function logLater(...args: Parameters<typeof logChat>) {
  try {
    after(() => logChat(...args));
  } catch {
    void logChat(...args);
  }
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "unknown";
  if (throttled(ip)) return text(429, "rate_limited");

  const len = Number(req.headers.get("content-length") ?? 0);
  if (len > MAX_BODY_BYTES) return text(413, "too_large");
  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return text(413, "too_large");

  let body: { messages?: unknown; locale?: unknown; sessionId?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return text(400, "bad_json");
  }
  const messages = sanitizeHistory(body.messages);
  if (!messages) return text(400, "bad_messages");
  const locale: Locale = typeof body.locale === "string" && isLocale(body.locale) ? body.locale : "vi";
  const sessionId = typeof body.sessionId === "string" && /^[A-Za-z0-9_-]{8,64}$/.test(body.sessionId) ? body.sessionId : "anon";

  const origin = requestOrigin(req.headers);
  const userText = messages[messages.length - 1].content;

  // Canned answers first: common questions cost no tokens (and work even without an OpenAI key).
  let validSlugs: Set<string>;
  try {
    const [products, soldOut] = await Promise.all([getCatalog(locale), soldOutSlugs()]);
    validSlugs = new Set(products.map((p) => p.slug));
    const hit = matchFaq(userText, { locale, products: products.filter((p) => !soldOut.has(p.slug)), origin });
    if (hit) {
      logLater(sessionId, locale, userText, hit.text, `faq:${hit.id}`);
      return text(200, hit.text, { "x-chat-source": `faq:${hit.id}` });
    }
  } catch (err) {
    console.error("[chat] context failed", err);
    return text(500, "context_failed");
  }

  if (!chatConfigured()) return text(503, "chat_unavailable");

  let system: string;
  try {
    system = await buildSystemPrompt(locale, messages, origin);
  } catch (err) {
    console.error("[chat] context failed", err);
    return text(500, "context_failed");
  }

  const encoder = new TextEncoder();
  let full = "";

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const delta of streamCompletion(system, messages, req.signal)) {
          full += delta;
          controller.enqueue(encoder.encode(delta));
        }
      } catch (err) {
        if (!req.signal.aborted) {
          console.error("[chat] upstream failed", err instanceof Error ? err.message : err);
          controller.enqueue(encoder.encode("\n\n[[error]]"));
        }
      } finally {
        controller.close();
        const cleaned = filterProductTokens(full, validSlugs).trim();
        if (cleaned) logLater(sessionId, locale, userText, cleaned, "ai");
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-accel-buffering": "no",
      "x-chat-source": "ai",
    },
  });
}

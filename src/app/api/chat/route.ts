import { after } from "next/server";
import { getCatalog } from "@/lib/catalog";
import {
  buildSystemPrompt,
  chatConfigured,
  filterProductTokens,
  logChat,
  sanitizeHistory,
  streamCompletion,
  throttled,
} from "@/lib/chat";
import { isLocale, type Locale } from "@/lib/i18n";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const MAX_BODY_BYTES = 16 * 1024;

const text = (status: number, body: string) =>
  new Response(body, { status, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store" } });

export async function POST(req: Request) {
  if (!chatConfigured()) return text(503, "chat_unavailable");

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

  let system: string;
  let validSlugs: Set<string>;
  try {
    const [prompt, products] = await Promise.all([buildSystemPrompt(locale), getCatalog("vi")]);
    system = prompt;
    validSlugs = new Set(products.map((p) => p.slug));
  } catch (err) {
    console.error("[chat] context failed", err);
    return text(500, "context_failed");
  }

  const encoder = new TextEncoder();
  const userText = messages[messages.length - 1].content;
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
        if (cleaned) {
          try {
            after(() => logChat(sessionId, locale, userText, cleaned));
          } catch {
            void logChat(sessionId, locale, userText, cleaned);
          }
        }
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
      "x-accel-buffering": "no",
    },
  });
}

import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { notifyPayment } from "@/lib/notify";
import { recordBankTransaction, reconcileTransaction, type IncomingTransaction } from "@/lib/payments";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * SePay "money in" webhook (https://docs.sepay.vn/tich-hop-webhooks.html).
 * Auth: `Authorization: Apikey <SEPAY_API_KEY>`. Must answer 2xx + {"success":true} within 30s,
 * otherwise SePay retries (up to 7 times) — so everything after storing the tx is best effort.
 */

function authorized(header: string | null) {
  const expected = process.env.SEPAY_API_KEY;
  if (!expected || !header) return false;
  const m = /^Apikey\s+(.+)$/i.exec(header.trim());
  if (!m) return false;
  const a = Buffer.from(m[1]);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

function str(v: unknown, max = 500) {
  return typeof v === "string" ? v.slice(0, max) : typeof v === "number" ? String(v) : null;
}

function parseSepayTransaction(body: unknown): IncomingTransaction | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const id = str(b.id, 64);
  const amount = Number(b.transferAmount);
  const type = str(b.transferType, 8)?.toLowerCase();
  if (!id || !Number.isFinite(amount) || amount < 0 || (type !== "in" && type !== "out")) return null;

  const rawDate = str(b.transactionDate, 32);
  const at = rawDate ? new Date(`${rawDate.replace(" ", "T")}+07:00`) : null;

  return {
    provider: "sepay",
    providerTxId: id,
    gateway: str(b.gateway, 64),
    accountNumber: str(b.accountNumber, 64),
    transferType: type,
    amount,
    content: str(b.content),
    code: str(b.code, 64),
    referenceCode: str(b.referenceCode, 128),
    transactionAt: at && !Number.isNaN(at.getTime()) ? at.toISOString() : null,
  };
}

export async function POST(req: Request) {
  if (!process.env.SEPAY_API_KEY) return NextResponse.json({ success: false, error: "not configured" }, { status: 503 });
  if (!authorized(req.headers.get("authorization"))) {
    return NextResponse.json({ success: false, error: "unauthorized" }, { status: 401 });
  }
  if (!getDb()) return NextResponse.json({ success: false, error: "database not configured" }, { status: 503 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "invalid json" }, { status: 400 });
  }
  const tx = parseSepayTransaction(body);
  if (!tx) return NextResponse.json({ success: false, error: "invalid payload" }, { status: 400 });

  let stored;
  try {
    stored = await recordBankTransaction(tx);
  } catch (err) {
    console.error("[sepay] store failed", err);
    return NextResponse.json({ success: false, error: "storage error" }, { status: 500 });
  }
  if (!stored) return NextResponse.json({ success: true, result: "duplicate" });

  try {
    const outcome = await reconcileTransaction(stored, tx.code);
    console.info(`[sepay] tx ${tx.providerTxId} ${tx.transferType} ${tx.amount} -> ${outcome.result}`);
    await notifyPayment(outcome, stored);
    return NextResponse.json({ success: true, result: outcome.result });
  } catch (err) {
    // The tx is stored; the owner can match it manually from /admin/payments.
    console.error("[sepay] reconcile failed", err);
    return NextResponse.json({ success: true, result: "stored_unmatched" });
  }
}

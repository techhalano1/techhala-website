import { requireDb, type BankTransactionRow, type OrderRow } from "@/lib/db";
import { markOrderPaid, normalizeOrderCode } from "@/lib/orders";
import { extractOrderCode, getBankAccount, sanitizeTransferNote, vietQrDataUrl } from "@/lib/vietqr";
import type { BankTransferInfo } from "@/components/BankTransferPanel";

/** QR + account details for paying `total` against order `code`; null when BANK_* env is not configured. */
export async function transferInfoFor(code: string, total: number): Promise<BankTransferInfo | null> {
  const account = getBankAccount();
  if (!account) return null;
  const transferNote = sanitizeTransferNote(code);
  return {
    qrDataUrl: await vietQrDataUrl(account, { amount: total, note: transferNote }),
    bankName: account.bankName,
    accountNo: account.accountNo,
    accountName: account.accountName,
    amount: total,
    transferNote,
  };
}

export type IncomingTransaction = {
  provider: string;
  providerTxId: string;
  gateway?: string | null;
  accountNumber?: string | null;
  transferType: "in" | "out";
  amount: number;
  content?: string | null;
  /** Order code pre-extracted by the provider, if any. */
  code?: string | null;
  referenceCode?: string | null;
  transactionAt?: string | null;
};

export type ReconcileOutcome =
  | { result: "duplicate" }
  | { result: "ignored"; reason: "outgoing" | "no_order_code" | "order_not_found" }
  | { result: "already_paid"; order: OrderRow }
  | { result: "paid"; order: OrderRow }
  | { result: "underpaid"; order: OrderRow; missing: number };

/** Store the raw transaction. Returns null when this provider tx id was already recorded (webhook retry). */
export async function recordBankTransaction(tx: IncomingTransaction): Promise<BankTransactionRow | null> {
  const db = requireDb();
  const { data, error } = await db
    .from("bank_transactions")
    .insert({
      provider: tx.provider,
      provider_tx_id: tx.providerTxId,
      gateway: tx.gateway ?? null,
      account_number: tx.accountNumber ?? null,
      transfer_type: tx.transferType,
      amount: Math.round(tx.amount),
      content: tx.content ?? null,
      reference_code: tx.referenceCode ?? null,
      transaction_at: tx.transactionAt ?? null,
    })
    .select()
    .single();
  if (error) {
    if (error.code === "23505") return null;
    throw error;
  }
  return data;
}

async function attachTransaction(txId: number, orderId: string) {
  const db = requireDb();
  const { error } = await db
    .from("bank_transactions")
    .update({ order_id: orderId, matched_at: new Date().toISOString() })
    .eq("id", txId);
  if (error) throw error;
}

/** Pay `order` from a recorded bank transaction; a no-op when the order is already paid. */
async function settle(tx: BankTransactionRow, order: OrderRow): Promise<ReconcileOutcome> {
  await attachTransaction(tx.id, order.id);
  if (order.payment_status === "paid") return { result: "already_paid", order };
  if (tx.amount < order.total) return { result: "underpaid", order, missing: order.total - tx.amount };
  const paid = await markOrderPaid(order.id, { provider: tx.provider, amount: tx.amount, ref: tx.reference_code || tx.provider_tx_id });
  if (!paid) return { result: "already_paid", order: { ...order, payment_status: "paid" } };
  return { result: "paid", order: { ...order, payment_status: "paid" } };
}

/** Match an incoming transaction to an order by the code in its transfer note and mark the order paid. */
export async function reconcileTransaction(tx: BankTransactionRow, hintedCode?: string | null): Promise<ReconcileOutcome> {
  if (tx.transfer_type !== "in") return { result: "ignored", reason: "outgoing" };

  const code = extractOrderCode(hintedCode) ?? extractOrderCode(tx.content);
  if (!code) return { result: "ignored", reason: "no_order_code" };

  const db = requireDb();
  const { data: order, error } = await db.from("orders").select("*").eq("code", code).maybeSingle();
  if (error) throw error;
  if (!order) return { result: "ignored", reason: "order_not_found" };

  return settle(tx, order);
}

/** Admin fallback: link an unmatched transaction to an order by code. */
export async function matchTransactionToOrder(txId: number, rawCode: string): Promise<ReconcileOutcome> {
  const db = requireDb();
  const [{ data: tx, error: tErr }, { data: order, error: oErr }] = await Promise.all([
    db.from("bank_transactions").select("*").eq("id", txId).maybeSingle(),
    db.from("orders").select("*").eq("code", normalizeOrderCode(rawCode)).maybeSingle(),
  ]);
  if (tErr) throw tErr;
  if (oErr) throw oErr;
  if (!tx) throw new Error("transaction not found");
  if (!order) return { result: "ignored", reason: "order_not_found" };
  if (tx.transfer_type !== "in") return { result: "ignored", reason: "outgoing" };
  return settle(tx, order);
}

export async function listBankTransactions(opts: { limit?: number; unmatchedOnly?: boolean } = {}) {
  const db = requireDb();
  let q = db
    .from("bank_transactions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(opts.limit ?? 100);
  if (opts.unmatchedOnly) q = q.is("order_id", null).eq("transfer_type", "in");
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function listTransactionsForOrder(orderId: string) {
  const db = requireDb();
  const { data, error } = await db.from("bank_transactions").select("*").eq("order_id", orderId).order("created_at");
  if (error) throw error;
  return data;
}

/** Customer says they have transferred; recorded once so the owner can prioritise checking. */
export async function reportTransfer(orderId: string) {
  const db = requireDb();
  const { data, error } = await db
    .from("orders")
    .update({ transfer_reported_at: new Date().toISOString(), updated_at: new Date().toISOString() })
    .eq("id", orderId)
    .is("transfer_reported_at", null)
    .eq("payment_method", "bank")
    .eq("payment_status", "unpaid")
    .select()
    .maybeSingle();
  if (error) throw error;
  return data;
}

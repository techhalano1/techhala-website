/* Dev smoke test: npx tsx --env-file=.env.local scripts/smoke-payments.ts
 * Optional: SMOKE_WEBHOOK_URL=http://localhost:3000/api/webhooks/sepay to also hit the HTTP route. */
import { requireDb } from "../src/lib/db";
import { addStockMovement, createOrder, getOrderById, listStock, syncCatalog } from "../src/lib/orders";
import {
  matchTransactionToOrder,
  reconcileTransaction,
  recordBankTransaction,
  reportTransfer,
  transferInfoFor,
  type IncomingTransaction,
} from "../src/lib/payments";
import { crc16, extractOrderCode, getBankAccount, sanitizeTransferNote, buildVietQrPayload } from "../src/lib/vietqr";

let failures = 0;
function check(label: string, ok: boolean, detail?: unknown) {
  console.log(`${ok ? "ok  " : "FAIL"} ${label}${detail !== undefined ? ` — ${JSON.stringify(detail)}` : ""}`);
  if (!ok) failures++;
}

const run = `smoke-${Date.now()}`;
function tx(partial: Partial<IncomingTransaction> & { providerTxId: string; amount: number }): IncomingTransaction {
  return {
    provider: "sepay",
    gateway: "Techcombank",
    accountNumber: "000",
    transferType: "in",
    content: null,
    code: null,
    referenceCode: `${run}-${partial.providerTxId}`,
    transactionAt: new Date().toISOString(),
    ...partial,
    providerTxId: `${run}-${partial.providerTxId}`,
  };
}

async function main() {
  const db = requireDb();
  await syncCatalog(db);

  // --- VietQR ---------------------------------------------------------------
  check("extractOrderCode from bank content", extractOrderCode("CK don TH ABCD234 cam on") === "TH-ABCD234");
  check("extractOrderCode ignores junk", extractOrderCode("chuyen tien an trua") === null);
  check("sanitizeTransferNote drops hyphen/accents", sanitizeTransferNote("TH-ABCD234 Đơn") === "THABCD234 Don");
  const payload = buildVietQrPayload({ bin: "970407", accountNo: "339889996", accountName: "X", bankName: "TCB" }, { amount: 2490000, note: "THABCD234" });
  check("VietQR payload has valid CRC", payload.endsWith(crc16(payload.slice(0, -4))));
  check("VietQR payload carries amount + note", payload.includes("54072490000") && payload.includes("THABCD234"));
  const account = getBankAccount();
  check("BANK_* configured", account !== null, account ? { bank: account.bankName, acct: account.accountNo.replace(/\d(?=\d{3})/g, "•") } : null);

  // --- Fixture order ----------------------------------------------------------
  const stock = await listStock();
  const v = stock.find((s) => s.product_slug === "halabuddy" && s.color);
  if (!v) throw new Error("no halabuddy variant");
  await addStockMovement(v.variant_id, 3, "purchase", run);
  const order = await createOrder({
    lines: [{ slug: "halabuddy", name: "HalaBuddy", color: v.color ?? undefined, unitPrice: v.price, quantity: 1, lineTotal: v.price }],
    payment: "bank",
    customer: { name: "Smoke Payments", phone: "+84 868 862 564", email: "", address: "119 Trần Duy Hưng", note: run },
    locale: "vi",
  });
  console.log("order", order.code, order.total);
  const info = await transferInfoFor(order.code, order.total);
  check("transferInfoFor returns QR data url", info === null || info.qrDataUrl.startsWith("data:image/svg+xml"));
  check("transferInfoFor amount = total", info === null || info.amount === order.total);

  // --- Stock enforcement ------------------------------------------------------
  const tooMany = await createOrder({
    lines: [{ slug: "halabuddy", name: "HalaBuddy", color: v.color ?? undefined, unitPrice: v.price, quantity: 9999, lineTotal: v.price * 9999 }],
    payment: "cod",
    customer: { name: "Smoke Payments", phone: "+84 868 862 564", email: "", address: "x", note: run },
    locale: "vi",
  }).then(() => "created", (e: Error) => e.constructor.name);
  check("createOrder rejects qty > available", tooMany === "OutOfStockError", tooMany);

  // --- Reconciliation ---------------------------------------------------------
  const out = (await recordBankTransaction(tx({ providerTxId: "out", amount: order.total, transferType: "out", content: order.code })))!;
  const rOut = await reconcileTransaction(out, order.code);
  check("outgoing transfer ignored", rOut.result === "ignored" && rOut.reason === "outgoing", rOut);

  const unknown = (await recordBankTransaction(tx({ providerTxId: "unknown", amount: order.total, content: "TH-ZZZZZZ9 test" })))!;
  const rUnknown = await reconcileTransaction(unknown);
  check("unknown order code stored unmatched", rUnknown.result === "ignored" && rUnknown.reason === "order_not_found", rUnknown);

  const noCode = (await recordBankTransaction(tx({ providerTxId: "nocode", amount: 1000, content: "chuyen tien" })))!;
  const rNoCode = await reconcileTransaction(noCode);
  check("no order code stored unmatched", rNoCode.result === "ignored" && rNoCode.reason === "no_order_code", rNoCode);

  const under = (await recordBankTransaction(tx({ providerTxId: "under", amount: order.total - 10000, content: `CK ${order.code}` })))!;
  const rUnder = await reconcileTransaction(under);
  check("underpaid does not settle", rUnder.result === "underpaid" && rUnder.missing === 10000, rUnder.result);
  check("order still unpaid after underpayment", (await getOrderById(order.id))?.payment_status === "unpaid");

  const reported = await reportTransfer(order.id);
  check("customer transfer report recorded", reported?.transfer_reported_at !== null);
  check("customer transfer report idempotent", (await reportTransfer(order.id)) === null);

  const exact = (await recordBankTransaction(tx({ providerTxId: "exact", amount: order.total, content: `${order.code.replace("-", "")} HalaBuddy` })))!;
  const rExact = await reconcileTransaction(exact);
  check("exact transfer marks paid (code without hyphen)", rExact.result === "paid", rExact.result);
  const paidOrder = await getOrderById(order.id);
  check("order.payment_status = paid", paidOrder?.payment_status === "paid");
  check("one payment row", paidOrder?.payments.length === 1 && paidOrder.payments[0].amount === order.total);
  check("transaction linked to order", (await db.from("bank_transactions").select("order_id").eq("id", exact.id).single()).data?.order_id === order.id);

  const dup = await recordBankTransaction(tx({ providerTxId: "exact", amount: order.total, content: order.code }));
  check("duplicate provider tx id is rejected (null)", dup === null);

  const again = (await recordBankTransaction(tx({ providerTxId: "again", amount: order.total, content: order.code })))!;
  const rAgain = await reconcileTransaction(again);
  check("second full transfer → already_paid", rAgain.result === "already_paid", rAgain.result);
  check("still exactly one payment row", (await getOrderById(order.id))?.payments.length === 1);

  // manual match of the unknown one to a second order
  const order2 = await createOrder({
    lines: [{ slug: "halabuddy", name: "HalaBuddy", color: v.color ?? undefined, unitPrice: v.price, quantity: 1, lineTotal: v.price }],
    payment: "bank",
    customer: { name: "Smoke Payments 2", phone: "+84 868 862 564", email: "", address: "x", note: run },
    locale: "vi",
  });
  const rManual = await matchTransactionToOrder(unknown.id, order2.code.toLowerCase());
  check("admin manual match settles", rManual.result === "paid", rManual.result);
  check("order2 paid", (await getOrderById(order2.id))?.payment_status === "paid");
  const rManualOut = await matchTransactionToOrder(out.id, order2.code);
  check("admin cannot match outgoing tx", rManualOut.result === "ignored" && rManualOut.reason === "outgoing");

  // --- HTTP route (optional) --------------------------------------------------
  const url = process.env.SMOKE_WEBHOOK_URL;
  if (url && process.env.SEPAY_API_KEY) {
    const post = (body: unknown, auth?: string) =>
      fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", ...(auth ? { authorization: auth } : {}) },
        body: typeof body === "string" ? body : JSON.stringify(body),
      });
    const good = `Apikey ${process.env.SEPAY_API_KEY}`;
    check("route: missing auth → 401", (await post({}, undefined)).status === 401);
    check("route: wrong key → 401", (await post({}, "Apikey nope")).status === 401);
    check("route: invalid json → 400", (await post("{oops", good)).status === 400);
    check("route: missing id → 400", (await post({ transferAmount: 1, transferType: "in" }, good)).status === 400);
    check("route: bad transferType → 400", (await post({ id: 1, transferAmount: 1, transferType: "sideways" }, good)).status === 400);
    const httpOrder = await createOrder({
      lines: [{ slug: "halabuddy", name: "HalaBuddy", color: v.color ?? undefined, unitPrice: v.price, quantity: 1, lineTotal: v.price }],
      payment: "bank",
      customer: { name: "Smoke HTTP", phone: "+84 868 862 564", email: "", address: "x", note: run },
      locale: "vi",
    });
    const sepayBody = {
      id: `${run}-http`,
      gateway: "Techcombank",
      transactionDate: "2025-01-01 10:00:00",
      accountNumber: "000",
      code: null,
      content: `${httpOrder.code} thanh toan`,
      transferType: "in",
      transferAmount: httpOrder.total,
      accumulated: 0,
      subAccount: null,
      referenceCode: `${run}-http`,
      description: "",
    };
    const r1 = await post(sepayBody, good);
    const j1 = (await r1.json()) as { success: boolean; result?: string };
    check("route: valid incoming → 200 paid", r1.status === 200 && j1.success && j1.result === "paid", j1);
    check("route: order paid", (await getOrderById(httpOrder.id))?.payment_status === "paid");
    const r2 = await post(sepayBody, good);
    const j2 = (await r2.json()) as { success: boolean; result?: string };
    check("route: duplicate → 200 duplicate", r2.status === 200 && j2.success && j2.result === "duplicate", j2);
    check("route: still one payment row", (await getOrderById(httpOrder.id))?.payments.length === 1);
    await db.from("orders").delete().eq("id", httpOrder.id);
  } else {
    console.log("skip HTTP route checks (set SMOKE_WEBHOOK_URL + SEPAY_API_KEY)");
  }

  // --- Cleanup ------------------------------------------------------------------
  await db.from("bank_transactions").delete().like("provider_tx_id", `${run}-%`);
  await db.from("orders").delete().in("id", [order.id, order2.id]);
  await db.from("inventory_movements").delete().eq("variant_id", v.variant_id).eq("note", run);

  console.log(failures === 0 ? "\nALL PASSED" : `\n${failures} FAILED`);
  if (failures > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

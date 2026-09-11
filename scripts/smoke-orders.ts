/* Dev smoke test: npx tsx --env-file=.env.local scripts/smoke-orders.ts */
import { requireDb } from "../src/lib/db";
import {
  addStockMovement,
  createOrder,
  findOrderByCodeAndPhone,
  getOrderByToken,
  listStock,
  markOrderPaid,
  setOrderStatus,
  syncCatalog,
} from "../src/lib/orders";

async function main() {
  const db = requireDb();
  console.log("sync", await syncCatalog(db));

  const stock = await listStock();
  const v = stock.find((s) => s.product_slug === "halabuddy" && s.color);
  if (!v) throw new Error("no halabuddy variant");
  await addStockMovement(v.variant_id, 5, "purchase", "smoke");

  const order = await createOrder({
    lines: [{ slug: "halabuddy", name: "HalaBuddy", color: v.color ?? undefined, unitPrice: v.price, quantity: 2, lineTotal: v.price * 2 }],
    payment: "bank",
    customer: { name: "Smoke Test", phone: "+84 868 862 564", email: "", address: "119 Trần Duy Hưng", note: "smoke" },
    locale: "vi",
  });
  console.log("created", order.code);

  const byPhone = await findOrderByCodeAndPhone(order.code.toLowerCase(), "0868862564");
  console.log("lookup by phone ok:", byPhone?.id === order.id);
  const byToken = await getOrderByToken(order.code, order.access_token);
  console.log("lookup by token ok:", byToken?.items.length === 1);

  const after = (await listStock()).find((s) => s.variant_id === v.variant_id)!;
  console.log("reserved after order:", after.reserved - v.reserved, "(expect 2)");

  await setOrderStatus(order.id, "confirmed");
  await setOrderStatus(order.id, "packed");
  const packed = (await listStock()).find((s) => s.variant_id === v.variant_id)!;
  console.log("on_hand delta after packed:", packed.on_hand - (v.on_hand + 5), "(expect -2)");

  await markOrderPaid(order.id, { provider: "bank", amount: order.total, ref: "SMOKE" });
  await setOrderStatus(order.id, "shipping");
  await setOrderStatus(order.id, "returned", "smoke return");
  const returned = (await listStock()).find((s) => s.variant_id === v.variant_id)!;
  console.log("on_hand delta after return:", returned.on_hand - (v.on_hand + 5), "(expect 0)");

  // cleanup
  await db.from("orders").delete().eq("id", order.id);
  await db.from("inventory_movements").delete().eq("variant_id", v.variant_id).eq("note", "smoke");
  const final = (await listStock()).find((s) => s.variant_id === v.variant_id)!;
  console.log("restored on_hand:", final.on_hand === v.on_hand);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

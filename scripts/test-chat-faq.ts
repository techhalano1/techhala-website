/**
 * Offline test for the canned-answer matcher (no server, no OpenAI).
 *   npx tsx scripts/test-chat-faq.ts
 */
import { en } from "../src/content/en";
import { vi } from "../src/content/vi";
import { matchFaq, type FaqContext } from "../src/lib/chat-faq";

const origin = "https://techhala.com";
const ctxVi: FaqContext = { locale: "vi", products: vi.products.items, origin };
const ctxEn: FaqContext = { locale: "en", products: en.products.items, origin };

let failures = 0;
function expectRule(msg: string, rule: string | null, ctx = ctxVi) {
  const hit = matchFaq(msg, ctx);
  const got = hit?.id ?? null;
  const ok = got === rule;
  console.log(`${ok ? "OK  " : "FAIL"} [${ctx.locale}] "${msg}" → ${got ?? "model"}${ok ? "" : ` (expected ${rule ?? "model"})`}`);
  if (!ok) failures++;
  return hit;
}

// --- Should be answered without the model ---------------------------------------
expectRule("Xin chào", "greeting");
expectRule("hello", "greeting", ctxEn);
expectRule("Cảm ơn bạn", "thanks");

const age = expectRule("Bé 7 tuổi học tiếng Anh nên mua mẫu nào?", "age");
if (age) {
  const slugs = [...age.text.matchAll(/\[\[product:([a-z0-9-]+)\]\]/g)].map((m) => m[1]);
  console.log(`     → ${slugs.join(", ")}`);
  if (!slugs.includes("halabuddy") || slugs.some((s) => s.startsWith("combo") || s.startsWith("de-"))) {
    console.log("FAIL age 7 should list HalaBuddy and only robots");
    failures++;
  }
  if (!age.text.includes("₫")) {
    console.log("FAIL age answer should include live prices");
    failures++;
  }
}
expectRule("Which robot for a 7-year-old learning English?", "age", ctxEn);
expectRule("con tôi 5 tuổi", "age");
expectRule("cháu học lớp 3", "age");
expectRule("bé 12t", "age");
expectRule("Robot nào phù hợp cho ông bà?", "seniors");
expectRule("Which robot suits grandparents?", "seniors", ctxEn);
expectRule("robot trợ lý cho gia đình", "family");
expectRule("Mua và thanh toán như thế nào?", "buy-pay");
expectRule("How do I order and pay?", "buy-pay", ctxEn);
expectRule("có thanh toán COD không", "buy-pay");
const buyNamed = expectRule("tôi muốn mua HalaBuddy Mini", "buy-pay");
if (buyNamed && !buyNamed.text.includes("[[product:halabuddy-mini]]")) {
  console.log("FAIL buy-pay with product name should include the product card");
  failures++;
}
expectRule("Bảo hành bao lâu?", "warranty");
expectRule("How long is the warranty?", "warranty", ctxEn);
expectRule("Giao hàng mất bao lâu?", "shipping");
expectRule("có freeship không", "shipping");
expectRule("tra cứu đơn hàng", "tracking");
expectRule("where is my order", "tracking", ctxEn);
expectRule("Địa chỉ cửa hàng ở đâu?", "contact");
expectRule("số hotline", "contact");
expectRule("Có phải trả phí hằng tháng không?", "subscription");
expectRule("Robot có cần Wi-Fi không?", "internet");
expectRule("mua số lượng lớn cho trường học", "bulk");
const price = expectRule("Giá bao nhiêu?", "price");
if (price && !price.text.includes("[[product:halabuddy-mini]]")) {
  console.log("FAIL price list should include HalaBuddy Mini");
  failures++;
}
const priceNamed = expectRule("HalaBuddy Pro giá bao nhiêu", "price");
if (priceNamed) {
  const slugs = [...priceNamed.text.matchAll(/\[\[product:([a-z0-9-]+)\]\]/g)].map((m) => m[1]);
  if (slugs.join() !== "halabuddy-pro") {
    console.log(`FAIL named price should list only halabuddy-pro, got ${slugs.join(",")}`);
    failures++;
  }
}
const track = expectRule("kiểm tra đơn hàng của tôi", "tracking");
if (track && !track.text.includes(`${origin}/vi/orders`)) {
  console.log("FAIL tracking answer should link to the request origin");
  failures++;
}

// --- Should go to the model ------------------------------------------------------
expectRule("HalaBuddy và HalaBuddy Pro khác nhau chỗ nào?", null);
expectRule("Bé 7 tuổi đã có HalaBuddy Mini rồi, muốn nâng cấp thì chọn gì?", null);
expectRule("Bé 7 tuổi và ông bà thì nên mua mẫu nào?", null);
expectRule("pin dùng được bao lâu?", null);
expectRule("Hôm nay thời tiết thế nào?", null);
expectRule("Viết cho tôi một bài thơ", null);
expectRule("có trả góp không?", null);
expectRule("giao hàng bao lâu? có bảo hành không?", null);
expectRule("bé 2 tuổi dùng được không", null);
expectRule("ok", null);
expectRule(
  "Tôi có hai bé, một bé 7 tuổi rất thích tiếng Anh nhưng hơi nhút nhát, còn bé lớn 13 tuổi chuẩn bị thi IELTS, ngân sách khoảng 6 triệu cho cả hai, nên chọn combo nào cho hợp lý và có hỗ trợ cài đặt tại nhà không?",
  null,
);

console.log(failures ? `\n${failures} failure(s)` : "\nAll FAQ checks passed");
process.exit(failures ? 1 : 0);

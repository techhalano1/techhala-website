import type { Product } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { company } from "@/lib/site";

/**
 * Canned answers for the most common storefront questions. Matched before OpenAI is
 * called so these turns cost no tokens. Precision over recall: anything long, multi-intent,
 * or with signals the rules can't handle falls through to the model.
 */

export type FaqContext = { locale: Locale; products: Product[]; origin: string };
export type FaqHit = { id: string; text: string };

const MAX_FAQ_CHARS = 160;
const MAX_AGE_CHARS = 120;

/** Lowercase, strip Vietnamese diacritics and punctuation; single-spaced and padded for word-boundary checks. */
export function normalize(s: string) {
  const base = s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  return base ? ` ${base} ` : "";
}

const has = (norm: string, phrase: string) => norm.includes(` ${phrase} `);
const hasAny = (norm: string, phrases: string[]) => phrases.some((p) => has(norm, p));

const vnd = (n: number) => new Intl.NumberFormat("vi-VN").format(n) + " ₫";

type Rule = {
  id: string;
  /** Every group must match at least one phrase (AND of ORs). */
  all: string[][];
  /** Any of these present → leave it to the model. */
  none?: string[];
  /** Generic rule: yields to any specific rule that also matches. */
  weak?: boolean;
  answer: (ctx: FaqContext, norm: string) => string | null;
};

const vi = (ctx: FaqContext) => ctx.locale === "vi";

const NEXT_STEP = {
  vi: `Để mua, bạn bấm "Thêm vào giỏ" trên thẻ sản phẩm rồi "Thanh toán" (COD hoặc chuyển khoản/QR). Cần tư vấn thêm, gọi ${company.phoneDisplay} hoặc Zalo ${company.zaloUrl}.`,
  en: `To buy, tap "Add to cart" on a product card, then "Checkout" (COD or bank transfer/QR). Need help? Call ${company.phoneDisplay} or Zalo ${company.zaloUrl}.`,
};

const AGE_RE = /(\d{1,2})\s*(tuoi|t|tui|years? old|years?|yrs?|yo|y o|age)(?= |$)|(?:^| )(lop|grade)\s*(\d{1,2})(?= |$)/;
const REFINE = [
  "da co", "da mua", "nang cap", "so sanh", "khac nhau", "khac gi", "hon", "pin", "thong so", "kich thuoc", "ket noi", "bao hanh",
  "giao hang", "tra gop", "already", "upgrade", "compare", "difference", "vs", "battery", "spec", "warranty", "shipping",
];

function robotsFor(products: Product[], pred: (p: Product) => boolean) {
  return products.filter((p) => (p.category === "education" || p.category === "home") && pred(p)).sort((a, b) => a.price - b.price).slice(0, 3);
}

function productLines(ps: Product[]) {
  return ps.map((p) => `- ${p.name} [[product:${p.slug}]] — ${p.ageLabel ? `${p.ageLabel}, ` : ""}${vnd(p.price)}${p.tagline ? `: ${p.tagline}` : ""}`).join("\n");
}

/** Products whose name (or slug) appears in the message; a name that is a prefix of another matched name is dropped. */
function namedProducts(products: Product[], norm: string) {
  const named = products.filter((p) => has(norm, normalize(p.name).trim()) || has(norm, p.slug.replace(/-/g, " ")));
  return named.filter((p) => !named.some((q) => q !== p && normalize(q.name).includes(normalize(p.name).trim())));
}

function ageInGroup(age: number, group: string) {
  const m = /^(\d+)-(\d+)$/.exec(group);
  return m ? age >= Number(m[1]) && age <= Number(m[2]) : false;
}

const rules: Rule[] = [
  {
    id: "greeting",
    all: [],
    answer: (ctx, norm) => {
      const greet = ["hi", "hello", "hey", "alo", "chao", "xin chao", "chao ban", "chao shop", "chao em", "chao anh", "chao chi", "chao ad", "good morning", "good afternoon"];
      if (!greet.includes(norm.trim())) return null;
      return vi(ctx)
        ? "Chào bạn! Mình là Hala 👋 Bạn đang tìm robot học tiếng Anh cho bé (mấy tuổi?) hay robot trợ lý cho gia đình/ông bà? Mình gợi ý mẫu phù hợp ngay."
        : "Hi! I'm Hala 👋 Are you looking for an English-learning robot for a child (what age?) or a home assistant for the family/grandparents? I'll suggest the right model.";
    },
  },
  {
    id: "thanks",
    all: [],
    answer: (ctx, norm) => {
      const thx = ["cam on", "cam on ban", "cam on shop", "ok cam on", "cam on nhieu", "thank you", "thanks", "thank you so much", "ok thanks", "tam biet", "bye"];
      if (!thx.includes(norm.trim())) return null;
      return vi(ctx)
        ? `Rất vui được hỗ trợ bạn! Khi cần, gọi ${company.phoneDisplay} hoặc Zalo ${company.zaloUrl} nhé. Chúc bạn và bé học vui 🎉`
        : `Happy to help! Reach us anytime at ${company.phoneDisplay} or Zalo ${company.zaloUrl}. Have a great day 🎉`;
    },
  },
  {
    id: "age",
    all: [],
    none: REFINE,
    answer: (ctx, norm) => {
      if (norm.length > MAX_AGE_CHARS) return null;
      const m = AGE_RE.exec(norm);
      if (!m) return null;
      const age = m[1] ? Number(m[1]) : Number(m[4]) + 5;
      if (!Number.isFinite(age) || age < 4 || age > 15) return null;
      const ps = robotsFor(ctx.products, (p) => p.ages.some((g) => ageInGroup(age, g)));
      if (ps.length === 0) return null;
      const lines = productLines(ps);
      return vi(ctx)
        ? `Với bé ${age} tuổi, mình gợi ý:\n${lines}\n\n${NEXT_STEP.vi} Muốn mình tư vấn kỹ hơn (ngân sách, tính năng), bạn cứ hỏi tiếp nhé!`
        : `For a ${age}-year-old, I'd suggest:\n${lines}\n\n${NEXT_STEP.en} Ask me for more detail (budget, features) anytime!`;
    },
  },
  {
    id: "seniors",
    all: [["ong ba", "ong", "ba noi", "ba ngoai", "nguoi gia", "nguoi lon tuoi", "cao tuoi", "bo me lon tuoi", "grandparent", "grandparents", "grandma", "grandpa", "elderly", "senior", "seniors", "old people"]],
    none: REFINE,
    answer: (ctx) => {
      const ps = robotsFor(ctx.products, (p) => p.ages.includes("seniors"));
      if (ps.length === 0) return null;
      const lines = productLines(ps);
      return vi(ctx)
        ? `Cho ông bà / người lớn tuổi, mình gợi ý:\n${lines}\n\n${NEXT_STEP.vi}`
        : `For grandparents / seniors, I'd suggest:\n${lines}\n\n${NEXT_STEP.en}`;
    },
  },
  {
    id: "family",
    all: [["gia dinh", "ca nha", "tro ly gia dinh", "nha thong minh", "smart home", "family", "household", "whole family", "home assistant"]],
    none: [...REFINE, "tuoi", "be", "con", "chau", "kid", "child", "year"],
    answer: (ctx) => {
      const ps = robotsFor(ctx.products, (p) => p.ages.includes("family"));
      if (ps.length === 0) return null;
      const lines = productLines(ps);
      return vi(ctx) ? `Robot trợ lý cho gia đình, mình gợi ý:\n${lines}\n\n${NEXT_STEP.vi}` : `For the whole family, I'd suggest:\n${lines}\n\n${NEXT_STEP.en}`;
    },
  },
  {
    id: "price",
    weak: true,
    all: [["bang gia", "gia bao nhieu", "gia the nao", "bao nhieu tien", "gia ca", "gia cac", "gia san pham", "gia tu", "bao nhieu", "price", "prices", "price list", "how much", "cost"]],
    none: [...REFINE, "tuoi", "year", "ship", "giao"],
    answer: (ctx, norm) => {
      const named = namedProducts(ctx.products, norm);
      const ps = named.length
        ? named.slice(0, 4)
        : ctx.products.filter((p) => p.category === "education" || p.category === "home").sort((a, b) => a.price - b.price).slice(0, 5);
      if (ps.length === 0) return null;
      const lines = ps.map((p) => `- ${p.name} [[product:${p.slug}]]: ${vnd(p.price)}${p.compareAtPrice ? ` (${vi(ctx) ? "giá gốc" : "was"} ${vnd(p.compareAtPrice)})` : ""}${p.ageLabel ? ` · ${p.ageLabel}` : ""}`).join("\n");
      const more = `${ctx.origin}/${ctx.locale}/products`;
      const ship = ps.every((p) => p.freeShipping) ? (vi(ctx) ? " (miễn phí giao hàng)" : " (free shipping)") : "";
      return vi(ctx)
        ? `Giá hiện tại${ship}:\n${lines}\n\nCombo và phụ kiện xem thêm tại ${more}. ${NEXT_STEP.vi}`
        : `Current prices${ship}:\n${lines}\n\nCombos and accessories: ${more}. ${NEXT_STEP.en}`;
    },
  },
  {
    id: "buy-pay",
    weak: true,
    all: [["mua", "dat hang", "dat mua", "thanh toan", "tra tien", "chuyen khoan", "cod", "vietqr", "quet qr", "order", "buy", "purchase", "payment", "pay", "bank transfer", "checkout"]],
    none: [...REFINE, "tuoi", "mau nao", "nen mua", "phu hop", "cho be", "cho con", "cho chau", "cho ong", "cho ba", "goi y", "which", "recommend", "suggest", "for my", "year", "tra gop", "installment", "the tin dung", "credit card", "momo", "vnpay", "zalopay"],
    answer: (ctx, norm) => {
      const orders = `${ctx.origin}/${ctx.locale}/orders`;
      const named = namedProducts(ctx.products, norm).slice(0, 2);
      const intro = named.length
        ? (vi(ctx) ? `Bạn có thể đặt ngay:\n${productLines(named)}\n\n` : `You can order right away:\n${productLines(named)}\n\n`)
        : "";
      return intro + (vi(ctx)
        ? `Mua rất đơn giản:\n- Bấm "Thêm vào giỏ" trên sản phẩm rồi bấm "Thanh toán".\n- Điền tên, số điện thoại, địa chỉ nhận hàng.\n- Chọn COD (trả tiền khi nhận hàng) hoặc chuyển khoản: hệ thống hiện mã VietQR đã điền sẵn số tiền và mã đơn, bạn quét bằng app ngân hàng bất kỳ.\n- Sau khi đặt, tra cứu đơn tại ${orders} bằng mã đơn + số điện thoại.\n\nGiao hàng toàn quốc miễn phí, 2–4 ngày làm việc. Cần hỗ trợ: ${company.phoneDisplay} / Zalo ${company.zaloUrl}.`
        : `Ordering is simple:\n- Tap "Add to cart" on a product, then "Checkout".\n- Enter your name, phone number and delivery address.\n- Choose COD (pay on delivery) or bank transfer: you'll get a VietQR code pre-filled with the amount and order code — scan it with any banking app.\n- Track your order at ${orders} with the order code + phone number.\n\nFree nationwide shipping in 2–4 working days. Need help: ${company.phoneDisplay} / Zalo ${company.zaloUrl}.`);
    },
  },
  {
    id: "shipping",
    all: [["giao hang", "ship", "shipping", "van chuyen", "delivery", "deliver", "phi giao", "freeship", "mien phi giao", "bao lau nhan", "khi nao nhan", "nhan hang", "giao toi", "giao ve"]],
    none: [...REFINE.filter((k) => k !== "shipping" && k !== "giao hang"), "tuoi", "year"],
    answer: (ctx) =>
      vi(ctx)
        ? `TechHala giao hàng toàn quốc miễn phí, nhận hàng trong 2–4 ngày làm việc. Bạn có thể chọn COD để trả tiền khi nhận. Sau khi đặt, theo dõi đơn tại ${ctx.origin}/${ctx.locale}/orders. Cần gấp, gọi ${company.phoneDisplay} để mình sắp xếp nhé.`
        : `We ship nationwide for free; delivery takes 2–4 working days. You can choose COD to pay on delivery. Track your order at ${ctx.origin}/${ctx.locale}/orders. In a hurry? Call ${company.phoneDisplay}.`,
  },
  {
    id: "warranty",
    all: [["bao hanh", "warranty", "guarantee", "doi tra", "doi moi", "tra hang", "hoan tien", "refund", "return", "returns"]],
    none: REFINE.filter((k) => k !== "bao hanh" && k !== "warranty"),
    answer: (ctx) =>
      vi(ctx)
        ? `Tất cả robot TechHala được bảo hành 12 tháng và đổi mới trong 30 ngày đầu nếu lỗi do nhà sản xuất. Các trường hợp đổi trả khác, hỗ trợ kỹ thuật, cài đặt và hướng dẫn sử dụng: liên hệ hotline ${company.phoneDisplay} hoặc Zalo ${company.zaloUrl}.`
        : `Every TechHala robot comes with a 12-month warranty and a 30-day replacement for manufacturer defects. For other returns, technical support, setup and guidance, contact hotline ${company.phoneDisplay} or Zalo ${company.zaloUrl}.`,
  },
  {
    id: "tracking",
    all: [["tra cuu", "kiem tra don", "don hang cua toi", "don cua toi", "tinh trang don", "trang thai don", "ma don", "track", "tracking", "my order", "order status", "where is my order", "don hang da", "da giao chua"]],
    answer: (ctx) => {
      const orders = `${ctx.origin}/${ctx.locale}/orders`;
      return vi(ctx)
        ? `Bạn tra cứu đơn tại ${orders} bằng mã đơn (dạng TH-XXXX, có trong trang xác nhận/tin nhắn) và số điện thoại đặt hàng. Trang này hiện trạng thái đơn, thanh toán và mã QR nếu bạn chọn chuyển khoản. Không tìm thấy đơn, gọi ${company.phoneDisplay} mình kiểm tra ngay.`
        : `Track your order at ${orders} using the order code (TH-XXXX, shown on the confirmation page) and the phone number you ordered with. It shows order and payment status, plus the QR code if you chose bank transfer. Can't find it? Call ${company.phoneDisplay}.`;
    },
  },
  {
    id: "contact",
    weak: true,
    all: [["lien he", "hotline", "so dien thoai", "sdt", "dia chi", "o dau", "cua hang", "showroom", "van phong", "email", "zalo", "contact", "phone number", "address", "where are you", "location", "store", "office", "gio mo cua", "opening hours", "xem truc tiep", "den xem", "visit"]],
    none: ["tuoi", "year", "giao", "ship", "nhan hang"],
    answer: (ctx) =>
      vi(ctx)
        ? `Liên hệ TechHala:\n- Hotline: ${company.phoneDisplay}\n- Zalo: ${company.zaloUrl}\n- Email: ${company.email}\n- Địa chỉ: ${company.address}\nBạn muốn đến xem robot trực tiếp thì gọi/nhắn trước để hẹn lịch nhé.`
        : `Contact TechHala:\n- Hotline: ${company.phoneDisplay}\n- Zalo: ${company.zaloUrl}\n- Email: ${company.email}\n- Address: ${company.address}\nWant to see the robots in person? Call or message ahead to book a time.`,
  },
  {
    id: "subscription",
    all: [["phi hang thang", "thue bao", "phi thang", "phi duy tri", "tra phi", "phi them", "monthly fee", "subscription", "recurring", "extra fee", "hidden fee"]],
    answer: (ctx) =>
      vi(ctx)
        ? `Không bắt buộc trả phí hằng tháng. Giá mua đã bao gồm bài học cơ bản và cập nhật phần mềm, không phát sinh phí thuê bao. Gói nội dung Premium 12 tháng là tuỳ chọn thêm nếu bố mẹ muốn nhiều bài học và đề luyện thi hơn.`
        : `No mandatory monthly fee. The purchase price includes the core lessons and software updates with no subscription. The 12-month Premium content pack is an optional add-on for more lessons and exam practice.`,
  },
  {
    id: "internet",
    all: [["wifi", "wi fi", "internet", "ket noi mang", "mat mang", "khong co mang", "offline", "co can mang"]],
    none: ["tuoi", "year"],
    answer: (ctx) =>
      vi(ctx)
        ? `Có. Robot dùng Wi-Fi gia đình để hội thoại và cập nhật bài học. Một số trò chơi và bài hát vẫn dùng được khi mất mạng.`
        : `Yes. The robot uses your home Wi-Fi for conversation and lesson updates. Some games and songs still work offline.`,
  },
  {
    id: "bulk",
    all: [["truong hoc", "trung tam", "so luong lon", "mua si", "gia si", "dai ly", "doanh nghiep", "bulk", "school", "schools", "wholesale", "distributor", "reseller", "b2b"]],
    answer: (ctx) =>
      vi(ctx)
        ? `TechHala có chính sách giá riêng và tài khoản quản lý lớp cho trường học, trung tâm tiếng Anh và đại lý. Bạn liên hệ hotline ${company.phoneDisplay} hoặc email ${company.email} để nhận báo giá theo số lượng nhé.`
        : `We offer special pricing and classroom management accounts for schools, English centres and resellers. Contact ${company.phoneDisplay} or ${company.email} for a volume quote.`,
  },
];

/** Returns a canned answer for `message`, or null when the model should handle it. */
export function matchFaq(message: string, ctx: FaqContext): FaqHit | null {
  const norm = normalize(message);
  if (!norm || norm.length > MAX_FAQ_CHARS + 2) return null;
  if ((message.match(/\?/g) ?? []).length > 1) return null;

  const hits: { rule: Rule; text: string }[] = [];
  for (const rule of rules) {
    if (rule.none && hasAny(norm, rule.none)) continue;
    if (!rule.all.every((group) => hasAny(norm, group))) continue;
    const text = rule.answer(ctx, norm);
    if (text) hits.push({ rule, text });
  }
  const strong = hits.filter((h) => !h.rule.weak);
  const pick = strong.length ? strong : hits;
  // Multi-intent questions are left to the model.
  return pick.length === 1 ? { id: pick[0].rule.id, text: pick[0].text } : null;
}

import QRCode from "qrcode";

/** NAPAS BINs for the banks most likely to be used as a receiving account. Source: api.vietqr.io/v2/banks. */
export const bankBins: Record<string, { bin: string; name: string }> = {
  TCB: { bin: "970407", name: "Techcombank" },
  VCB: { bin: "970436", name: "Vietcombank" },
  MB: { bin: "970422", name: "MB Bank" },
  ACB: { bin: "970416", name: "ACB" },
  VPB: { bin: "970432", name: "VPBank" },
  BIDV: { bin: "970418", name: "BIDV" },
  ICB: { bin: "970415", name: "VietinBank" },
  VBA: { bin: "970405", name: "Agribank" },
  TPB: { bin: "970423", name: "TPBank" },
  STB: { bin: "970403", name: "Sacombank" },
  HDB: { bin: "970437", name: "HDBank" },
  VIB: { bin: "970441", name: "VIB" },
  SHB: { bin: "970443", name: "SHB" },
  OCB: { bin: "970448", name: "OCB" },
  MSB: { bin: "970426", name: "MSB" },
  SEAB: { bin: "970440", name: "SeABank" },
  LPB: { bin: "970449", name: "LPBank" },
  EIB: { bin: "970431", name: "Eximbank" },
  NAB: { bin: "970428", name: "Nam A Bank" },
  VCCB: { bin: "970454", name: "BVBank" },
  CAKE: { bin: "546034", name: "CAKE by VPBank" },
  TIMO: { bin: "963388", name: "Timo" },
};

export type BankAccount = {
  bin: string;
  bankName: string;
  accountNo: string;
  accountName: string;
};

/**
 * Receiving bank account, server-only. `BANK_CODE` is a key of `bankBins` (e.g. TCB);
 * `BANK_BIN` overrides the BIN for banks not in the table.
 */
export function getBankAccount(): BankAccount | null {
  const code = process.env.BANK_CODE?.trim().toUpperCase();
  const accountNo = process.env.BANK_ACCOUNT_NO?.replace(/\s+/g, "");
  const accountName = process.env.BANK_ACCOUNT_NAME?.trim();
  const known = code ? bankBins[code] : undefined;
  const bin = process.env.BANK_BIN?.trim() || known?.bin;
  if (!accountNo || !accountName || !bin || !/^\d{6}$/.test(bin)) return null;
  return {
    bin,
    bankName: process.env.BANK_NAME?.trim() || known?.name || code || bin,
    accountNo,
    accountName,
  };
}

function tlv(id: string, value: string) {
  if (value.length > 99) throw new Error(`VietQR field ${id} too long`);
  return `${id}${String(value.length).padStart(2, "0")}${value}`;
}

/** CRC-16/CCITT-FALSE (poly 0x1021, init 0xFFFF) as required by EMVCo QR. */
export function crc16(input: string) {
  let crc = 0xffff;
  for (const byte of Buffer.from(input, "utf8")) {
    crc ^= byte << 8;
    for (let i = 0; i < 8; i++) {
      crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/** Bank apps often reject accents / punctuation in the transfer note. Keep it plain ASCII. */
export function sanitizeTransferNote(note: string) {
  return note
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/[^A-Za-z0-9 ]/g, "")
    .trim()
    .slice(0, 25);
}

/**
 * EMVCo / NAPAS 247 "transfer to account" payload (what VietQR-compatible bank apps scan).
 * Dynamic QR when an amount is given: the app pre-fills amount + note and locks them.
 */
export function buildVietQrPayload(account: BankAccount, opts: { amount?: number; note?: string } = {}) {
  const amount = opts.amount && opts.amount > 0 ? Math.round(opts.amount) : undefined;
  const note = opts.note ? sanitizeTransferNote(opts.note) : "";

  const merchantInfo =
    tlv("00", "A000000727") +
    tlv("01", tlv("00", account.bin) + tlv("01", account.accountNo)) +
    tlv("02", "QRIBFTTA");

  let payload =
    tlv("00", "01") +
    tlv("01", amount ? "12" : "11") +
    tlv("38", merchantInfo) +
    tlv("53", "704") +
    (amount ? tlv("54", String(amount)) : "") +
    tlv("58", "VN") +
    (note ? tlv("62", tlv("08", note)) : "");

  payload += "6304";
  return payload + crc16(payload);
}

/** Inline SVG data URL for `<img src>`; rendered server-side so bank details never ship as env vars to the client. */
export async function vietQrDataUrl(account: BankAccount, opts: { amount?: number; note?: string } = {}) {
  const svg = await QRCode.toString(buildVietQrPayload(account, opts), {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    color: { dark: "#111111", light: "#ffffff" },
  });
  return `data:image/svg+xml;base64,${Buffer.from(svg).toString("base64")}`;
}

/** Order codes look like TH-ABC2345 (7 chars, no 0/1/I/O). Banks may drop the hyphen or lowercase the note. */
const ORDER_CODE_RE = /\bTH[\s-]?([A-HJ-NP-Z2-9]{7})\b/i;

export function extractOrderCode(text: string | null | undefined) {
  if (!text) return null;
  const m = ORDER_CODE_RE.exec(text.toUpperCase());
  return m ? `TH-${m[1]}` : null;
}

function normalize(value: string | undefined): string | undefined {
  const trimmed = value?.trim().replace(/\/+$/, "");
  if (!trimmed) return undefined;
  const withScheme = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  try {
    return new URL(withScheme).origin;
  } catch {
    return undefined;
  }
}

export const siteUrl =
  normalize(process.env.NEXT_PUBLIC_SITE_URL) ??
  normalize(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  "http://localhost:3000";

export const company = {
  name: "TechHala",
  phoneDisplay: "(+84) 0868 862 564",
  phoneE164: "+84868862564",
  phoneLocal: "0868862564",
  email: "lam.nguyen@techhala.com",
  address: "119 Trần Duy Hưng, Trung Hòa, Cầu Giấy, Hà Nội",
  addressParts: {
    street: "119 Trần Duy Hưng",
    ward: "Trung Hòa",
    district: "Cầu Giấy",
    city: "Hà Nội",
    country: "VN",
  },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=119+Tr%E1%BA%A7n+Duy+H%C6%B0ng%2C+Trung+H%C3%B2a%2C+C%E1%BA%A7u+Gi%E1%BA%A5y%2C+H%C3%A0+N%E1%BB%99i",
  zaloUrl: "https://zalo.me/0868862564",
  github: "https://github.com/techhalano1",
} as const;

export function formatVnd(amount: number, locale: string) {
  return new Intl.NumberFormat(locale === "vi" ? "vi-VN" : "en-US", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

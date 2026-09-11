"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { defaultLocale, isLocale, localePath } from "@/lib/i18n";
import { Heading, Section } from "@/components/ui";

const copy = {
  en: { title: "Page not found", body: "The page you are looking for does not exist.", home: "Back to home" },
  vi: { title: "Không tìm thấy trang", body: "Trang bạn đang tìm không tồn tại.", home: "Về trang chủ" },
} as const;

export default function NotFound() {
  const seg = usePathname().split("/")[1] ?? "";
  const locale = isLocale(seg) ? seg : defaultLocale;
  const c = copy[locale];
  return (
    <Section className="text-center">
      <p className="font-mono text-sm text-accent">404</p>
      <Heading as="h1" className="mt-3">
        {c.title}
      </Heading>
      <p className="mt-4 text-muted">{c.body}</p>
      <Link
        href={localePath(locale)}
        className="mt-8 inline-flex h-11 items-center rounded-md bg-fg px-5 text-sm font-medium text-bg"
      >
        {c.home}
      </Link>
    </Section>
  );
}

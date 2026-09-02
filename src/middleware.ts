import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n";

function pickLocale(request: NextRequest) {
  const header = request.headers.get("accept-language") ?? "";
  for (const part of header.split(",")) {
    const code = part.trim().split(";")[0].toLowerCase().split("-")[0];
    if (isLocale(code)) return code;
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];
  if (first && isLocale(first)) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/${pickLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};

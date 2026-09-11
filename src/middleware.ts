import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale, type Locale } from "@/lib/i18n";

const LOCALE_COOKIE = "locale";
const ONE_YEAR = 60 * 60 * 24 * 365;

function pickLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  return saved && isLocale(saved) ? saved : defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (first && isLocale(first)) {
    const response = NextResponse.next();
    if (request.cookies.get(LOCALE_COOKIE)?.value !== first) {
      response.cookies.set(LOCALE_COOKIE, first, {
        path: "/",
        maxAge: ONE_YEAR,
        sameSite: "lax",
      });
    }
    return response;
  }

  const url = request.nextUrl.clone();
  url.pathname = `/${pickLocale(request)}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|admin|.*\\..*).*)"],
};

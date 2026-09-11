import { NextResponse, type NextRequest } from "next/server";
import {
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  defaultLocale,
  isLocale,
  type Locale,
} from "@/lib/i18n";

// Only full document navigations count as a locale choice; client-side
// router requests (RSC, prefetch) persist the choice via `rememberLocale`.
function isDocumentNavigation(request: NextRequest) {
  const h = request.headers;
  const dest = h.get("sec-fetch-dest");
  if (dest) return dest === "document";
  return h.get("accept")?.includes("text/html") === true;
}

function pickLocale(request: NextRequest): Locale {
  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  return saved && isLocale(saved) ? saved : defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (first && isLocale(first)) {
    const response = NextResponse.next();
    if (
      isDocumentNavigation(request) &&
      request.cookies.get(LOCALE_COOKIE)?.value !== first
    ) {
      response.cookies.set(LOCALE_COOKIE, first, {
        path: "/",
        maxAge: LOCALE_COOKIE_MAX_AGE,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
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

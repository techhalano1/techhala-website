import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "th_admin";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 14;

function secret() {
  return process.env.ADMIN_SESSION_SECRET ?? process.env.ADMIN_PASSWORD ?? "";
}

export function adminConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

function sign(exp: number) {
  return createHmac("sha256", secret()).update(String(exp)).digest("hex");
}

function safeEqual(a: string, b: string) {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function checkPassword(candidate: string) {
  const expected = process.env.ADMIN_PASSWORD;
  return Boolean(expected) && safeEqual(candidate, expected!);
}

export function makeSessionToken() {
  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  return `${exp}.${sign(exp)}`;
}

export function verifySessionToken(token: string | undefined) {
  if (!token || !adminConfigured()) return false;
  const [expRaw, sig] = token.split(".");
  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || !sig) return false;
  if (exp < Math.floor(Date.now() / 1000)) return false;
  return safeEqual(sig, sign(exp));
}

export async function isAdmin() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

/** For server actions and pages: redirect to login unless the admin cookie is valid. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

export async function setAdminCookie() {
  const store = await cookies();
  store.set(ADMIN_COOKIE, makeSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function clearAdminCookie() {
  const store = await cookies();
  store.delete({ name: ADMIN_COOKIE, path: "/admin" });
}

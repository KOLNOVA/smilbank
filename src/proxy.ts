import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES = ["/dashboard", "/portefeuille", "/contrats", "/investissements", "/documents", "/profil"];
const ADMIN_ROUTES = ["/gestion-sb"];
const PUBLIC_ROUTES = ["/", "/services", "/produits", "/actualites", "/contact", "/connexion", "/mentions-legales", "/api"];

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) return NextResponse.next();
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
  const isAdmin = ADMIN_ROUTES.some((route) => pathname.startsWith(route));
  if (!isProtected && !isAdmin) return NextResponse.next();
  const hasToken = req.headers.get("authorization")?.startsWith("Bearer ");
  const hasCookie = req.cookies.get("refreshToken")?.value;
  if (!hasToken && !hasCookie) {
    const loginUrl = new URL("/connexion", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/portefeuille/:path*", "/contrats/:path*", "/investissements/:path*", "/documents/:path*", "/profil/:path*", "/gestion-sb/:path*"],
};

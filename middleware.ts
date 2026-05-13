import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_PATH_PREFIX = "/admin";

export default async function middleware(req: Request) {
  const url = new URL(req.url);

  if (!url.pathname.startsWith(ADMIN_PATH_PREFIX)) {
    return NextResponse.next();
  }

  // Secure + Edge-safe: JWT verification only (no Prisma / Node built-ins)
  const token = await getToken({
    req: req as any,
    secret: process.env.AUTH_SECRET,
  });

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", url));
  }

  // Optional role check (recommended). Your jwt callback stores `token.role`.
  const role = (token as any).role as string | undefined;
  if (!role) {
    return NextResponse.redirect(new URL("/login", url));
  }

  // Allow at least INVENTORY_CONTENT_ADMIN or SUPER_ADMIN
  const allowed = new Set(["SUPER_ADMIN", "INVENTORY_CONTENT_ADMIN"]);
  if (!allowed.has(role)) {
    return NextResponse.redirect(new URL("/login", url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};


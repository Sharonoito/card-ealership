import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

const ADMIN_PATH_PREFIX = "/admin";
const allowedAdminRoles = new Set(["SUPER_ADMIN", "INVENTORY_CONTENT_ADMIN"]);

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;

  if (!nextUrl.pathname.startsWith(ADMIN_PATH_PREFIX)) {
    return NextResponse.next();
  }

  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  if (!token) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  const role = typeof token.role === "string" ? token.role : undefined;
  if (!role || !allowedAdminRoles.has(role)) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

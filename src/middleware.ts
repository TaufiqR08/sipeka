import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  const { pathname } = request.nextUrl;

  // Jika user sudah login dan mencoba akses login page, redirect ke dashboard
  if (token && pathname.startsWith("/auth/login")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Jika user belum login dan akses root "/", redirect ke login
  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // Jika user belum login dan mencoba akses dashboard/rute protected, redirect ke login
  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*", "/auth/login/:path*"],
};

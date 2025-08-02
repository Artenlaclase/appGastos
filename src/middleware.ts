// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./lib/firebase-admin";

export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value;

  try {
    if (sessionCookie) {
      await auth.verifySessionCookie(sessionCookie, true);
      return NextResponse.next();
    }

    // No session cookie - redirect to login
    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(pathname)}`, request.url)
    );
  } catch (error) {
    return NextResponse.redirect(
      new URL(`/login?error=auth&from=${encodeURIComponent(pathname)}`, request.url)
    );
  }
}

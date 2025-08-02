// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./lib/firebase-admin";
import { log } from "./lib/logger";

// Optimized matcher for protected paths only
export const config = {
  matcher: ["/dashboard/:path*", "/settings/:path*"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session")?.value;

  try {
    // Verify session cookie for protected routes
    if (sessionCookie) {
      await auth.verifySessionCookie(sessionCookie, true);
      return NextResponse.next();
    }

    // No session cookie - redirect to login
    log.warn("Unauthorized access attempt", { pathname });
    return NextResponse.redirect(new URL(`/login?from=${encodeURIComponent(pathname)}`, request.url));
    
  } catch (error) {
    log.error("Authentication error", { error, pathname });
    return NextResponse.redirect(new URL(`/login?error=auth&from=${encodeURIComponent(pathname)}`, request.url));
  }
}
// src/middleware.ts
import { NextResponse, type NextRequest } from "next/server";
import { auth } from "./lib/firebase-admin";

export async function middleware(request: NextRequest) {
  const protectedPaths = ["/dashboard", "/settings"];
  const { pathname } = request.nextUrl;

  if (protectedPaths.some(path => pathname.startsWith(path))) {
    const sessionCookie = request.cookies.get("session")?.value;

    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await auth.verifySessionCookie(sessionCookie, true);
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}
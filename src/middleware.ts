// src/middleware.ts
import { NextResponse } from "next/server"
import { auth } from "@/lib/firebase-admin"

export async function middleware(request: Request) {
  const session = request.cookies.get('session')?.value
  const { pathname } = new URL(request.url)

  // Rutas protegidas
  const protectedRoutes = ['/dashboard']

  try {
    if (protectedRoutes.some(route => pathname.startsWith(route))) {
      if (!session) {
        return NextResponse.redirect(new URL('/login', request.url))
      }

      await auth.verifySessionCookie(session, true)
    }
    return NextResponse.next()
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
}
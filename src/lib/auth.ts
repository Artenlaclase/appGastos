/// src/lib/auth.ts
import { cookies } from "next/headers"
import { auth } from "@/lib/firebase-admin" // Necesitarás configurar firebase-admin

export async function verifySession() {
  const sessionCookie = cookies().get('session')?.value
  if (!sessionCookie) return null

  try {
    return await auth.verifySessionCookie(sessionCookie, true)
  } catch (error) {
    console.error("Error verifying session:", error)
    return null
  }
}
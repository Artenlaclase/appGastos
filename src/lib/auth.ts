// src/lib/auth.ts
'use server';
import { cookies } from "next/headers";
import { auth } from "./firebase-admin";
import { type DecodedIdToken } from "firebase-admin/auth";

// Verifica la cookie de sesión y devuelve los claims decodificados
export async function verifySession(): Promise<DecodedIdToken | null> {
  const cookieStore = await cookies(); // No necesitas importar el tipo
  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) {
    return null;
  }

  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    return decodedClaims;
  } catch (error) {
    console.error("Error verifying session cookie:", error);
    return null;
  }
}

// Crea una cookie de sesión a partir de un ID token
export async function createSessionCookie(
  idToken: string,
  maxAge: number = 60 * 60 * 24 * 5
): Promise<string> {
  try {
    const sessionCookie = await auth.createSessionCookie(idToken, {
      expiresIn: maxAge * 1000,
    });
    return sessionCookie;
  } catch (error) {
    console.error("Error creating session cookie:", error);
    throw new Error("Failed to create session cookie");
  }
}

// Revoca la sesión en Firebase
export async function revokeSession(sessionCookie: string): Promise<void> {
  try {
    const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
    await auth.revokeRefreshTokens(decodedClaims.sub);
  } catch (error) {
    console.error("Error revoking session:", error);
    throw new Error("Failed to revoke session");
  }
}

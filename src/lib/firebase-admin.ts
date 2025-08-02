// src/lib/firebase-admin.ts
import { cert, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
  throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable")
}

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)

const app = initializeApp({
  credential: cert(serviceAccount)
})

export const auth = getAuth(app)
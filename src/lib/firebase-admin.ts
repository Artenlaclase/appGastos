// src/lib/firebase-admin.ts
import { cert, initializeApp } from "firebase-admin/app"
import { getAuth } from "firebase-admin/auth"

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
)

const app = initializeApp({
  credential: cert(serviceAccount)
})

export const auth = getAuth(app)
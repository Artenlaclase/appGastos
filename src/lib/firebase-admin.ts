// src/lib/firebase-admin.ts
import { cert, initializeApp } from "firebase-admin/app";
import { getAuth, Auth } from "firebase-admin/auth";
import { log } from "./logger";

let auth: Auth;

try {
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    log.fatal("Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable");
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT_KEY environment variable");
  }

  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  const app = initializeApp({
    credential: cert(serviceAccount)
  });

  log.info("Firebase Admin initialized successfully");
  auth = getAuth(app);
} catch (error) {
  log.fatal("Failed to initialize Firebase Admin", { error });
  throw error;
}

export { auth };
// Conectare Firebase — configurația vine EXCLUSIV din variabile de mediu (NEXT_PUBLIC_*).
// Nicio cheie nu e scrisă în cod. Se setează în Netlify → Environment variables (și în .env.local local).
//
// Dacă env-ul lipsește, aplicația funcționează în mod DEMO (localStorage) — fără să crape.

import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/** True doar dacă env-ul Firebase e configurat. Altfel rulăm în mod demo (localStorage). */
export const isFirebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app: FirebaseApp | undefined;

function getFirebaseApp(): FirebaseApp | null {
  if (!isFirebaseEnabled) return null;
  if (!app) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig as Required<typeof firebaseConfig>);
  }
  return app;
}

export function fbAuth(): Auth | null {
  const a = getFirebaseApp();
  return a ? getAuth(a) : null;
}

export function fbDb(): Firestore | null {
  const a = getFirebaseApp();
  return a ? getFirestore(a) : null;
}

export function fbStorage(): FirebaseStorage | null {
  const a = getFirebaseApp();
  return a ? getStorage(a) : null;
}

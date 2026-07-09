// Autentificare admin.
// - Cu Firebase configurat: login real prin Firebase Auth (user + parolă create de tine în Firebase).
// - Fără Firebase (mod demo): fallback pe credențialele de mai jos + localStorage.

import { isFirebaseEnabled, fbAuth } from "./firebase";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";

// Folosite DOAR în modul demo (fără Firebase).
export const ADMIN_CREDENTIALS = {
  email: "admin@careval.ro",
  password: "careval2026",
};

const KEY = "careval_admin_session_v1";

export async function login(email: string, password: string): Promise<boolean> {
  if (isFirebaseEnabled) {
    try {
      await signInWithEmailAndPassword(fbAuth()!, email.trim(), password);
      return true;
    } catch {
      return false;
    }
  }
  // Fallback demo
  const ok =
    email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password;
  if (ok && typeof window !== "undefined") window.localStorage.setItem(KEY, "1");
  return ok;
}

export async function logout(): Promise<void> {
  if (isFirebaseEnabled) {
    await signOut(fbAuth()!);
    return;
  }
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}

/** Ascultă starea de autentificare. Returnează funcția de dezabonare. */
export function subscribeAuth(cb: (authed: boolean) => void): () => void {
  if (isFirebaseEnabled) {
    return onAuthStateChanged(fbAuth()!, (user) => cb(!!user));
  }
  // Fallback demo: citim o singură dată din localStorage.
  if (typeof window !== "undefined") cb(window.localStorage.getItem(KEY) === "1");
  else cb(false);
  return () => {};
}

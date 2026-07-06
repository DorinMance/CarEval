// Autentificare DEMO pentru panoul de admin.
// La go-live: se înlocuiește cu Firebase Auth / NextAuth. UI-ul rămâne la fel.

export const ADMIN_CREDENTIALS = {
  email: "admin@careval.ro",
  password: "careval2026",
};

const KEY = "careval_admin_session_v1";

export function login(email: string, password: string): boolean {
  const ok =
    email.trim().toLowerCase() === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password;
  if (ok && typeof window !== "undefined") {
    window.localStorage.setItem(KEY, "1");
  }
  return ok;
}

export function logout(): void {
  if (typeof window !== "undefined") window.localStorage.removeItem(KEY);
}

export function isAuthed(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

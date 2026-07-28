/**
 * Rezolvator minim pentru rularea modulelor din `lib/` direct cu Node.
 *
 * Proiectul scrie importuri fără extensie („./products”), pentru că Next.js le
 * rezolvă singur. Node, în schimb, cere calea exactă. Hook-ul de mai jos adaugă
 * `.ts` când importul relativ nu are extensie — atât, nimic altceva.
 *
 * Folosit doar de scripturile de verificare locală (vezi previzualizare-email.ts).
 */
export async function resolve(specifier, context, next) {
  if (specifier.startsWith(".") && !/\.[a-z]+$/i.test(specifier)) {
    try {
      return await next(specifier + ".ts", context);
    } catch {
      /* nu e .ts — lăsăm rezolvarea normală să încerce */
    }
  }
  return next(specifier, context);
}

/**
 * Comprimă o poză în browser înainte de a o transforma în dataURL.
 *
 * De ce: pozele de telefon au 3–5 MB, iar base64 mai adaugă 33%. Wizardul cere
 * până la 5 grupuri de imagini, deci coșul depășea cota de localStorage (~5 MB)
 * după 1–2 poze și arunca QuotaExceededError. O poză de 4 MB iese acum la ~180 KB,
 * fără pierdere vizibilă pentru constatarea unei avarii.
 */

export const MAX_FILE_BYTES = 25 * 1024 * 1024; // respinge fișierele absurde înainte de decodare
const MAX_EDGE = 1600;
const QUALITY = 0.82;

/** Raportul maxim base64/binar — folosit ca să evităm citirea originalului doar
 *  pentru a-i compara mărimea (pe 25 MB ar aloca ~33 MB degeaba, exact OOM-ul
 *  pe care fișierul ăsta îl previne). */
const B64_RATIO = 1.38;

function readAsDataURL(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result as string);
    r.onerror = () => reject(r.error ?? new Error("Citirea fișierului a eșuat."));
    r.readAsDataURL(file);
  });
}

export async function compressToDataURL(file: File): Promise<string> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("Fișier prea mare (peste 25 MB).");
  }
  // Încercăm decodarea pentru ORICE imagine, inclusiv HEIC (Safari îl decodează
  // nativ). Filtrarea pe tip lăsa pozele de iPhone să treacă necomprimate, adică
  // exact cazul care umple localStorage.
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return readAsDataURL(file); // browser fără createImageBitmap sau format nedecodabil
  }

  try {
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));

    const canvas = document.createElement("canvas");
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    if (!ctx) return readAsDataURL(file);
    // Fundal alb înainte de desenare: la fallback-ul JPEG (care nu are canal alfa)
    // o imagine transparentă — un deviz scanat, un screenshot — ar ieși pe negru.
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bitmap, 0, 0, w, h);

    let out = canvas.toDataURL("image/webp", QUALITY);
    if (!out.startsWith("data:image/webp")) out = canvas.toDataURL("image/jpeg", QUALITY);

    // Comparăm cu o estimare a mărimii base64 a originalului, nu cu originalul citit —
    // citirea ar aloca inutil ~1.38× mărimea fișierului.
    return out.length < file.size * B64_RATIO ? out : readAsDataURL(file);
  } finally {
    bitmap.close?.();
  }
}

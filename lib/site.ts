/**
 * Adresa canonică a site-ului. Sursă unică de adevăr pentru metadataBase,
 * sitemap, robots și JSON-LD — ca să nu mai fie scrisă de mână în 5 locuri.
 * Se poate suprascrie pe medii de test cu NEXT_PUBLIC_SITE_URL.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://careval.ro").replace(/\/$/, "");

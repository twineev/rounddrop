/**
 * Normalize LinkedIn profile URLs so different formats of the same URL
 * match when we compare them for mutual-connection lookups.
 */
export function normalizeLinkedinUrl(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  try {
    const withProto = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    const u = new URL(withProto);
    if (!/linkedin\.com$/i.test(u.hostname.replace(/^www\./, ""))) return null;
    const path = u.pathname.replace(/\/+$/, "").toLowerCase();
    return `https://linkedin.com${path}`;
  } catch {
    return null;
  }
}

export function toProxyUploadsUrl(url?: string) {
  if (!url) return "";

  // Already proxied/local
  if (url.startsWith("/uploads/")) return url;

  // Convert absolute backend url → /uploads/...
  // Example: http://localhost:5000/uploads/avatars/x.png → /uploads/avatars/x.png
  const idx = url.indexOf("/uploads/");
  if (idx !== -1) return url.slice(idx);

  // If backend returns just "uploads/..." or "avatars/..."
  if (url.startsWith("uploads/")) return `/${url}`;
  if (url.startsWith("avatars/")) return `/uploads/${url}`;

  return url; // fallback
}
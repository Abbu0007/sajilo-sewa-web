export function toUploadsPath(url?: string | null) {
  if (!url) return "";
  const u = url.trim();
  if (u.startsWith("http://10.0.2.2:5000")) return u.replace("http://10.0.2.2:5000", "");
  if (u.startsWith("http://127.0.0.1:5000")) return u.replace("http://127.0.0.1:5000", "");
  if (u.startsWith("http://localhost:5000")) return u.replace("http://localhost:5000", "");

  if (u.startsWith("/uploads/")) return u;


  if (u.startsWith("uploads/")) return `/${u}`;

  return u;
}
// Resolves a stored URL to a browser-loadable absolute URL.
// - Absolute URLs (http/https/data/blob) pass through unchanged.
// - Relative paths like "/api/files/..." are prefixed with NEXT_PUBLIC_BACKEND_URL.
// Works in both server and client components (uses build-time env var).
export function resolveImageUrl(url) {
  if (!url) return "";
  if (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  ) {
    return url;
  }
  const base = process.env.NEXT_PUBLIC_BACKEND_URL || "";
  if (url.startsWith("/")) return `${base}${url}`;
  return `${base}/${url}`;
}

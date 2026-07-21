import axios from "axios";

// Client-side base URL (browser)
export const CLIENT_API =
  (process.env.NEXT_PUBLIC_BACKEND_URL || "") + "/api";

// Server-side base URL (fetching from server components)
export const SERVER_API =
  (process.env.INTERNAL_BACKEND_URL ||
    process.env.NEXT_PUBLIC_BACKEND_URL ||
    "http://localhost:8001") + "/api";

// ---- Client axios (for admin + client components) ----
const api = axios.create({ baseURL: CLIENT_API });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("dc_admin_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fire on-demand ISR revalidation after every successful admin mutation
// so Vercel serves fresh HTML immediately (instead of stale-cached SSR up to 60s).
api.interceptors.response.use(async (response) => {
  try {
    if (typeof window === "undefined") return response;
    const method = (response.config?.method || "").toLowerCase();
    if (method === "post" || method === "patch" || method === "put" || method === "delete") {
      const token = localStorage.getItem("dc_admin_token");
      if (token) {
        // Fire and forget — don't block the UI on this
        fetch("/next-api/revalidate", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }).catch(() => {});
      }
    }
  } catch {}
  return response;
});

export default api;

export function formatApiErrorDetail(detail) {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .filter(Boolean)
      .join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
}

// ---- Server helpers with ISR (60s revalidate) ----
export async function fetchServer(path, { revalidate = 60, tags } = {}) {
  try {
    const res = await fetch(`${SERVER_API}${path}`, {
      next: { revalidate, ...(tags ? { tags } : {}) },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

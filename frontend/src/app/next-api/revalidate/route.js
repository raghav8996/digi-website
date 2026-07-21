import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";

// Runs on Vercel as a serverless function (dynamic, no cache)
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const PUBLIC_PATHS = ["/", "/about", "/stores", "/offers", "/contact"];
const CACHE_TAGS = ["site-content", "products", "offers", "announcements", "testimonials", "instagram-posts"];

async function verifyAdmin(authHeader) {
  if (!authHeader?.startsWith("Bearer ")) return false;
  const backend = process.env.NEXT_PUBLIC_BACKEND_URL;
  if (!backend) return false;
  try {
    const res = await fetch(`${backend}/api/auth/me`, {
      headers: { Authorization: authHeader },
      cache: "no-store",
    });
    if (!res.ok) return false;
    const user = await res.json();
    return user?.role === "admin";
  } catch {
    return false;
  }
}

export async function POST(request) {
  const auth = request.headers.get("authorization");
  const ok = await verifyAdmin(auth);
  if (!ok) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  // Bust the cache for every public route + layout so nested pages refresh too
  for (const p of PUBLIC_PATHS) {
    revalidatePath(p);
  }
  revalidatePath("/", "layout");
  // Also bust any fetch-tagged data
  for (const t of CACHE_TAGS) {
    revalidateTag(t);
  }
  return NextResponse.json({ revalidated: true, paths: PUBLIC_PATHS, tags: CACHE_TAGS, at: Date.now() });
}

export async function GET() {
  return NextResponse.json({ hint: "POST with Authorization: Bearer <admin JWT> to revalidate" });
}

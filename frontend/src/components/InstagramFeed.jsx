import { Instagram, ExternalLink, ArrowUpRight } from "lucide-react";
import Script from "next/script";
import { INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/stores";

/**
 * InstagramFeed — free-tier friendly IG embed with graceful fallback.
 *
 * Priority order (first non-empty wins):
 *   1. NEXT_PUBLIC_BEHOLD_ID       — Behold.so (recommended: free tier supports HTTPS)
 *   2. NEXT_PUBLIC_LIGHTWIDGET_ID  — LightWidget (paid plan required for HTTPS)
 *   3. Admin-managed instagram_posts grid (default; always works)
 */
export default function InstagramFeed({ posts = [] }) {
  const beholdId = process.env.NEXT_PUBLIC_BEHOLD_ID;
  const widgetId = process.env.NEXT_PUBLIC_LIGHTWIDGET_ID;
  const active = posts.filter((p) => p.is_active).slice(0, 6);
  const mode = beholdId ? "behold" : widgetId ? "lightwidget" : "grid";
  if (mode === "grid" && !active.length) return null;

  return (
    <section
      data-testid="instagram-section"
      className="px-5 md:px-10 py-24 md:py-32 border-t border-black/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#7a1b2e]/12 border border-[#7a1b2e]/30 px-3 py-1 text-[10px] uppercase tracking-[0.22em] font-bold text-[#7a1b2e]">
              <Instagram size={12} /> {INSTAGRAM_HANDLE}
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-[#0f0f11] mt-4 tracking-tight">
              Latest from the store.
            </h2>
            <p className="text-[#4a4a55] mt-3">
              Product launches, offers and everyday store moments — the drop lands here first.
            </p>
          </div>
          <a
            data-testid="instagram-follow-cta"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold bg-[#1d1d1f] text-white hover:bg-black transition-colors self-start md:self-auto"
          >
            <Instagram size={14} /> Follow on Instagram
          </a>
        </div>

        {mode === "behold" ? (
          <div
            data-testid="instagram-widget-behold"
            className="rounded-3xl overflow-hidden border border-black/8 bg-white p-2 md:p-4"
          >
            {/* Behold custom element */}
            {/* eslint-disable-next-line react/no-unknown-property */}
            <behold-widget feed-id={beholdId} style={{ display: "block", minHeight: 320 }} />
            <Script
              src="https://w.behold.so/widget.js"
              type="module"
              strategy="afterInteractive"
            />
          </div>
        ) : mode === "lightwidget" ? (
          <div
            data-testid="instagram-widget"
            className="rounded-3xl overflow-hidden border border-black/8 bg-white p-4"
          >
            <iframe
              src={`https://lightwidget.com/widgets/${widgetId}.html`}
              scrolling="no"
              allowtransparency="true"
              className="lightwidget-widget"
              style={{ width: "100%", border: 0, overflow: "hidden", minHeight: 320 }}
              title="DigiConnect Instagram feed"
            />
            <Script
              src="https://cdn.lightwidget.com/widgets/lightwidget.js"
              strategy="afterInteractive"
            />
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {active.map((p, i) => (
              <a
                key={p.id}
                data-testid={`ig-tile-${i}`}
                href={p.post_url || INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="group relative aspect-square rounded-2xl overflow-hidden border border-black/8 bg-black"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.image_url}
                  alt={p.caption || "Instagram post"}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11]/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                  {p.caption && (
                    <p className="text-[11px] text-[#0f0f11]/90 line-clamp-3 leading-snug">
                      {p.caption}
                    </p>
                  )}
                  <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-[#7a1b2e] uppercase tracking-[0.18em]">
                    View post <ArrowUpRight size={11} />
                  </div>
                </div>
                <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-black/60 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Instagram size={11} className="text-[#0f0f11]" />
                </div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

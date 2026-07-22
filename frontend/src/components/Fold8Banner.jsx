import { Sparkles, ArrowUpRight } from "lucide-react";
import { STORE_LOCATIONS } from "@/lib/stores";

// Server component — receives editable content from the parent server page.
// `content` is the singleton /site-content document; falls back to hardcoded defaults if fields missing.
export default function Fold8Banner({ content = {} }) {
  if (content && content.banner_active === false) return null;

  const badge = content.banner_badge ?? "Coming soon · Pre-reserve";
  const line1 = content.banner_title_line1 ?? "Galaxy Z Fold8.";
  const line2 = content.banner_title_line2 ?? "Be first in line.";
  const description =
    content.banner_description ??
    "India's most anticipated foldable is landing at DigiConnect. Reserve your unit today, unlock launch-day priority pickup and an exclusive in-store gift bundle.";
  const buttonText = content.banner_button_text ?? "Reserve";
  const imageUrl =
    content.banner_image_url ||
    "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=940&q=80";
  const imageAlt = content.banner_image_alt ?? "Galaxy Z Fold concept";
  const imageCaption = content.banner_image_caption ?? "Concept · Actual product may vary";
  const waMessage = encodeURIComponent(
    content.banner_whatsapp_message ??
      "Hi DigiConnect, I'd like to pre-reserve the Galaxy Z Fold8."
  );

  return (
    <section
      data-testid="fold8-banner"
      className="relative mx-auto max-w-7xl px-5 md:px-10 -mt-8 md:-mt-16 z-10"
      aria-label="Pre-reserve banner"
    >
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0a0a0a] via-[#0f0710] to-[#050505]">
        <div className="absolute -top-28 -right-28 h-72 w-72 rounded-full bg-[#ff2d7a]/25 blur-3xl" />
        <div className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-[#6a00ff]/15 blur-3xl" />
        <div className="relative grid md:grid-cols-[1.4fr_1fr] gap-8 p-8 md:p-12 items-center">
          <div>
            <span
              data-testid="banner-badge"
              className="inline-flex items-center gap-2 rounded-full bg-[#ff2d7a]/12 border border-[#ff2d7a]/30 px-3 py-1 text-[10px] uppercase tracking-[0.22em] font-bold text-[#ff2d7a]"
            >
              <Sparkles size={12} /> {badge}
            </span>
            <h2
              data-testid="banner-title"
              className="mt-4 font-display text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[0.95]"
            >
              {line1}
              <br />
              {line2}
            </h2>
            <p
              data-testid="banner-description"
              className="mt-4 max-w-lg text-white/80 text-sm md:text-base leading-relaxed"
            >
              {description}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {STORE_LOCATIONS.map((s) => (
                <a
                  key={s.id}
                  data-testid={`fold8-reserve-${s.id}`}
                  href={`https://wa.me/${s.whatsapp}?text=${waMessage}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs md:text-sm font-bold bg-[#ff2d7a] text-white hover:bg-[#e91764] transition-colors"
                >
                  {buttonText} · {s.name} <ArrowUpRight size={14} />
                </a>
              ))}
            </div>
          </div>

          <div className="relative hidden md:flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-56 w-56 rounded-full bg-[#ff2d7a]/20 blur-3xl" />
            </div>
            <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-[3/4] w-56 rotate-[-6deg] bg-black">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-testid="banner-image"
                src={imageUrl}
                alt={imageAlt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11]/70 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-[10px] uppercase tracking-[0.22em] text-white/80 font-bold">
                {imageCaption}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Star, Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { STORE_LOCATIONS } from "@/lib/stores";

function initials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function findStoreName(id) {
  if (id === "both") return "Both stores";
  return STORE_LOCATIONS.find((s) => s.id === id)?.name || "In store";
}

/**
 * Testimonials — horizontal snap carousel with prev/next buttons.
 * Emits Review schema (JSON-LD) for SEO.
 */
export default function Testimonials({ items = [], variant = "home", storeFilter = null }) {
  const active = items
    .filter((t) => t.is_active)
    .filter((t) => (storeFilter ? t.store === storeFilter || t.store === "both" : true));
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const update = () => {
      setCanPrev(el.scrollLeft > 8);
      setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [active.length]);

  const scrollBy = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const first = el.querySelector("[data-review]");
    const step = first ? first.clientWidth + 16 : 320;
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  const reviewLdHtml = useMemo(() => {
    const ld = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: active.map((t, i) => ({
        "@type": "Review",
        position: i + 1,
        author: { "@type": "Person", name: t.author },
        reviewRating: { "@type": "Rating", ratingValue: t.rating, bestRating: 5 },
        reviewBody: t.text,
        itemReviewed: {
          "@type": "ElectronicsStore",
          name:
            t.store === "gaur-city"
              ? "DigiConnect — Gaur City Mall"
              : t.store === "grand-venice"
                ? "DigiConnect — Grand Venice Mall"
                : "DigiConnect",
        },
      })),
    };
    return { __html: JSON.stringify(ld) };
  }, [active]);

  if (!active.length) return null;

  const label =
    storeFilter && STORE_LOCATIONS.find((s) => s.id === storeFilter)
      ? `What ${STORE_LOCATIONS.find((s) => s.id === storeFilter).name} customers say`
      : "What our customers say";

  return (
    <section
      data-testid="testimonials-section"
      className="px-5 md:px-10 py-24 md:py-32 border-t border-white/5"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={reviewLdHtml}
      />
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <p className="overline">Reviews</p>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mt-3 tracking-tighter">
              {label}.
            </h2>
            <p className="text-white/60 mt-3">
              Real feedback from customers who walked in, tried the Galaxy, walked out happy.
            </p>
          </div>
          <div className="flex gap-2 self-start md:self-auto">
            <button
              data-testid="testimonials-prev"
              onClick={() => scrollBy(-1)}
              disabled={!canPrev}
              className="h-11 w-11 rounded-full border border-white/10 bg-white/[0.03] text-white/80 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              data-testid="testimonials-next"
              onClick={() => scrollBy(1)}
              disabled={!canNext}
              className="h-11 w-11 rounded-full border border-white/10 bg-white/[0.03] text-white/80 hover:text-white hover:bg-white/[0.06] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          data-testid="testimonials-track"
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 -mx-2 px-2 scroll-smooth"
          style={{ scrollbarWidth: "none" }}
        >
          <style>{`
            [data-testid="testimonials-track"]::-webkit-scrollbar { display: none; }
          `}</style>
          {active.map((t, i) => (
            <article
              key={t.id}
              data-review
              data-testid={`testimonial-${i}`}
              className="dc-tile p-6 md:p-8 min-w-[85%] sm:min-w-[420px] md:min-w-[440px] snap-start flex flex-col"
            >
              <Quote size={22} className="text-[#ff007f]" />
              <p className="text-white/85 mt-4 leading-relaxed text-[15px] grow">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star
                    key={`${t.id}-star-${j}`}
                    size={14}
                    className={j < t.rating ? "fill-[#ff007f] text-[#ff007f]" : "text-white/20"}
                  />
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-3">
                {t.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.avatar_url}
                    alt={t.author}
                    className="h-10 w-10 rounded-full object-cover border border-white/10"
                  />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-[#ff007f]/20 border border-[#ff007f]/40 flex items-center justify-center text-[#ff007f] text-xs font-bold">
                    {initials(t.author)}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-display font-bold text-white text-sm truncate">{t.author}</p>
                  <p className="text-[11px] text-white/50 truncate">
                    {findStoreName(t.store)}
                    {t.date ? ` · ${t.date}` : ""}
                    {t.source ? ` · via ${t.source}` : ""}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

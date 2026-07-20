import Link from "next/link";
import { Tag, Clock, MapPin, MessageCircle } from "lucide-react";
import { STORE_LOCATIONS } from "@/lib/stores";

function findStore(id) {
  return STORE_LOCATIONS.find((s) => s.id === id);
}

export default function OffersSection({ offers = [], variant = "home" }) {
  const active = offers.filter((o) => o.is_active);
  if (!active.length && variant === "home") return null;

  return (
    <section
      data-testid="offers-section"
      className="px-5 md:px-10 py-24 md:py-32 border-t border-black/5"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#7a1b2e]/12 border border-[#7a1b2e]/30 px-3 py-1 text-[10px] uppercase tracking-[0.22em] font-bold text-[#7a1b2e]">
              <Tag size={12} /> Limited time · In-store
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-black text-[#0f0f11] mt-4 tracking-tighter">
              In-Store Offers.
            </h2>
            <p className="text-[#4a4a55] mt-3">
              Bundles, trade-ins and launch bonuses that only unlock when you walk in.
            </p>
          </div>
          {variant === "home" && (
            <Link
              href="/offers"
              data-testid="offers-all-link"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#7a1b2e] hover:text-[#0f0f11] transition-colors"
            >
              All offers →
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {active.map((o, i) => {
            const storeDetail =
              o.store && o.store !== "both" ? findStore(o.store) : null;
            const primaryStore = storeDetail || STORE_LOCATIONS[0];
            return (
              <article
                key={o.id}
                data-testid={`offer-card-${i}`}
                className="dc-tile overflow-hidden flex flex-col"
              >
                {o.image_url && (
                  <div className="aspect-[16/10] overflow-hidden bg-black relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={o.image_url}
                      alt={o.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f11]/70 via-black/10 to-transparent" />
                    {o.tag && (
                      <span className="absolute top-3 left-3 rounded-full bg-[#7a1b2e] text-white text-[10px] uppercase tracking-[0.22em] font-bold px-3 py-1">
                        {o.tag}
                      </span>
                    )}
                  </div>
                )}
                <div className="p-6 flex flex-col grow">
                  {!o.image_url && o.tag && (
                    <span className="inline-flex self-start rounded-full bg-[#7a1b2e]/15 border border-[#7a1b2e]/30 text-[#7a1b2e] text-[10px] uppercase tracking-[0.22em] font-bold px-3 py-1 mb-3">
                      {o.tag}
                    </span>
                  )}
                  <h3 className="font-display text-xl md:text-2xl font-bold text-[#0f0f11] leading-tight">
                    {o.title}
                  </h3>
                  {o.description && (
                    <p className="text-[#4a4a55] text-sm mt-3 leading-relaxed grow">
                      {o.description}
                    </p>
                  )}
                  <div className="mt-5 pt-5 border-t border-black/5 flex flex-wrap items-center justify-between gap-3">
                    <div className="text-xs text-[#83838f] flex items-center gap-3">
                      {o.valid_until && (
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} /> Until {o.valid_until}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={12} />
                        {o.store === "both" ? "Both stores" : storeDetail?.name || "In store"}
                      </span>
                    </div>
                    <a
                      data-testid={`offer-cta-${i}`}
                      href={primaryStore.whatsappUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold bg-[#7a1b2e] text-white hover:bg-[#5f1524] transition-colors"
                    >
                      <MessageCircle size={12} /> Claim
                    </a>
                  </div>
                </div>
              </article>
            );
          })}

          {!active.length && (
            <div className="col-span-full text-center text-[#83838f]/80 py-16 text-sm">
              New offers land here soon.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

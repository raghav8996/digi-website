import Link from "next/link";
import {
  ArrowUpRight,
  Cpu,
  Store,
  ShieldCheck,
  Headphones,
  Layers,
  Instagram,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { fetchServer } from "@/lib/api";
import { STORE_LOCATIONS, INSTAGRAM_URL, INSTAGRAM_HANDLE } from "@/lib/stores";
import Fold8Banner from "@/components/Fold8Banner";
import AnnouncementStrip from "@/components/AnnouncementStrip";
import OffersSection from "@/components/OffersSection";
import LocationCard from "@/components/LocationCard";

export const revalidate = 60;

const FEATURES = [
  {
    icon: Store,
    title: "Authorized Samsung Experience Store",
    body: "A Samsung-designated retail outlet and SmartCafé partner — trusted, exclusive, and built for the full Galaxy ecosystem.",
    span: "md:col-span-2",
  },
  {
    icon: Cpu,
    title: "Live S, Z & A-series demos",
    body: "Handle every current Galaxy flagship, foldable, and A-series device — hands-on, no rush.",
    span: "md:col-span-1",
  },
  {
    icon: Headphones,
    title: "SmartCafé setting",
    body: "A lounge-style space with expert staff walking you through Buds, Watch and Tab ecosystems.",
    span: "md:col-span-1",
  },
  {
    icon: ShieldCheck,
    title: "100% genuine, backed by Samsung",
    body: "Every device is authentic Samsung stock — priced right, ready in-store.",
    span: "md:col-span-2",
  },
];

export default async function HomePage() {
  const [products, announcements, offers] = await Promise.all([
    fetchServer("/products?active_only=true"),
    fetchServer("/announcements?active_only=true"),
    fetchServer("/offers?active_only=true"),
  ]);

  return (
    <>
      {/* HERO */}
      <section
        data-testid="hero-section"
        className="relative overflow-hidden pt-16 md:pt-24 pb-24 md:pb-32 px-5 md:px-10 dc-grain"
      >
        <div className="dc-aurora" />

        <div className="relative max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-white/60 mb-8 dc-reveal">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ff007f]" />
            Samsung Experience Store · Greater Noida
          </div>

          <h1 className="dc-reveal font-display font-black text-white tracking-tighter leading-[0.9] text-5xl sm:text-6xl md:text-7xl lg:text-[104px] max-w-5xl">
            The Samsung
            <br />
            <span className="dc-gradient-text">ecosystem</span>,
            <br />
            unboxed in person.
          </h1>

          <p className="dc-reveal mt-8 max-w-2xl text-lg md:text-xl text-white/70 leading-relaxed">
            Two Samsung-exclusive flagship stores in Greater Noida. Every Galaxy device — S, Z, A,
            tablets, wearables and audio — live, hands-on, guided by people who actually use them.
          </p>

          <div className="dc-reveal mt-10 flex flex-wrap items-center gap-4">
            <Link
              data-testid="hero-cta-stores"
              href="/stores"
              className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-bold bg-[#ff007f] text-white hover:bg-[#e60073] hover:-translate-y-0.5 transition-all"
            >
              Find a Store <ArrowUpRight size={16} />
            </Link>
            <Link
              data-testid="hero-cta-offers"
              href="/offers"
              className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-bold bg-white/[0.04] border border-white/15 text-white hover:bg-white/[0.08] transition-colors"
            >
              <Sparkles size={16} /> In-Store Offers
            </Link>
            <a
              data-testid="hero-cta-instagram"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full px-7 py-4 text-sm font-bold text-white/70 hover:text-white transition-colors"
            >
              <Instagram size={16} /> {INSTAGRAM_HANDLE}
            </a>
          </div>

          <AnnouncementStrip announcements={announcements} />

          <div className="dc-reveal mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-8">
            {[
              ["2", "Retail locations"],
              ["100%", "Genuine Samsung"],
              ["Since 2021", "Serving Greater Noida"],
              ["Daily", "Live demos"],
            ].map(([v, l]) => (
              <div key={l}>
                <div className="font-display text-3xl md:text-4xl font-black text-white">{v}</div>
                <div className="text-xs uppercase tracking-[0.18em] text-white/50 mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOLD8 BANNER */}
      <Fold8Banner />

      {/* WHY US - BENTO */}
      <section
        data-testid="features-section"
        className="px-5 md:px-10 py-24 md:py-32 mt-8 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <p className="overline">Why DigiConnect</p>
              <h2 className="font-display text-4xl md:text-5xl font-black text-white mt-3 tracking-tighter">
                A Samsung-exclusive store, done right.
              </h2>
            </div>
            <p className="text-white/60 max-w-md">
              We&apos;re not a general electronics shop. Every square foot is dedicated to the Galaxy
              ecosystem — with people who genuinely know it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={f.title} data-testid={`feature-tile-${i}`} className={`dc-tile p-8 ${f.span}`}>
                <div className="h-11 w-11 rounded-xl bg-[#ff007f]/15 border border-[#ff007f]/30 flex items-center justify-center text-[#ff007f]">
                  <f.icon size={20} />
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-white mt-6">{f.title}</h3>
                <p className="text-white/60 mt-3 leading-relaxed text-sm">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFERS (top 3) */}
      <OffersSection offers={offers.slice(0, 3)} variant="home" />

      {/* PRODUCTS */}
      <section
        data-testid="products-section"
        className="px-5 md:px-10 py-24 md:py-32 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <p className="overline">Featured in store</p>
              <h2 className="font-display text-4xl md:text-5xl font-black text-white mt-3 tracking-tighter">
                What&apos;s live at the SmartCafé.
              </h2>
            </div>
            <Link
              href="/stores"
              data-testid="products-visit-link"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#ff007f] hover:text-white transition-colors"
            >
              Come see them <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, i) => (
              <article
                key={p.id}
                data-testid={`product-card-${i}`}
                className="dc-tile overflow-hidden flex flex-col"
              >
                <div className="aspect-[4/3] overflow-hidden bg-black relative">
                  {p.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30">
                      <Layers size={28} />
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col grow">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-[#ff007f] font-bold">
                    {p.category}
                  </p>
                  <h3 className="font-display font-bold text-white text-lg mt-1.5">{p.name}</h3>
                  <p className="text-white/60 text-xs mt-2 leading-relaxed grow">{p.highlight}</p>
                  {p.price && (
                    <div className="mt-4 pt-4 border-t border-white/5 text-white/80 text-sm font-semibold">
                      {p.price}
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* VISIT US */}
      <section
        data-testid="visit-section"
        className="px-5 md:px-10 py-24 md:py-32 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 max-w-2xl">
            <p className="overline">Visit us</p>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mt-3 tracking-tighter">
              Two flagship stores. <span className="dc-gradient-text">Greater Noida.</span>
            </h2>
            <p className="text-white/60 mt-4">
              Drop by for a demo, an upgrade, or just to see the Galaxy Z Fold in person. No
              appointments needed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {STORE_LOCATIONS.map((s) => (
              <LocationCard key={s.id} store={s} testIdPrefix="home-location" />
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        data-testid="cta-section"
        className="px-5 md:px-10 py-24 md:py-32 border-t border-white/5"
      >
        <div className="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-[#0a0a0a] p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#ff007f]/20 blur-3xl" />
          <div className="relative">
            <p className="overline">Say hi</p>
            <h3 className="font-display text-3xl md:text-5xl font-black text-white mt-3 tracking-tighter max-w-3xl">
              Ping us on WhatsApp — we&apos;ll answer during store hours.
            </h3>
            <p className="text-white/60 mt-4 max-w-xl">
              Pick your nearest store. We can help you compare devices, check stock, or reserve one
              before you walk in.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {STORE_LOCATIONS.map((s) => (
                <a
                  key={s.id}
                  data-testid={`cta-whatsapp-${s.id}`}
                  href={s.whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold bg-[#ff007f] text-white hover:bg-[#e60073] transition-colors"
                >
                  <MessageCircle size={16} /> {s.name}
                </a>
              ))}
              <a
                data-testid="cta-instagram"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold bg-white/[0.05] border border-white/15 text-white hover:bg-white/[0.08] transition-colors"
              >
                <Instagram size={16} /> Follow on Instagram
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

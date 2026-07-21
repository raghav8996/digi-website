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
import ProductCard from "@/components/ProductCard";
import Testimonials from "@/components/Testimonials";
import InstagramFeed from "@/components/InstagramFeed";

export const dynamic = "force-dynamic";

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
  const [products, announcements, offers, testimonials, igPosts, siteContent] = await Promise.all([
    fetchServer("/products?active_only=true"),
    fetchServer("/announcements?active_only=true"),
    fetchServer("/offers?active_only=true"),
    fetchServer("/testimonials?active_only=true"),
    fetchServer("/instagram-posts?active_only=true"),
    fetchServer("/site-content"),
  ]);

  const hero = siteContent || {};

  return (
    <>
      {/* HERO — Apple/Samsung.com product-forward */}
      <section
        data-testid="hero-section"
        className="relative overflow-hidden pt-14 md:pt-20 pb-16 md:pb-24 px-5 md:px-10"
      >
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1.15fr_1fr] gap-10 lg:gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#6e6e73] mb-6 dc-reveal">
              <span className="h-1.5 w-1.5 rounded-full bg-[#ff2d7a]" />
              Samsung Experience Store · Greater Noida
            </div>

            <h1 className="dc-reveal font-display text-white tracking-tight leading-[1.03] text-4xl sm:text-5xl md:text-6xl lg:text-[76px] max-w-3xl">
              The Samsung ecosystem,
              <br />
              <span className="text-[#6e6e73]">unboxed in person.</span>
            </h1>

            <p className="dc-reveal mt-6 max-w-xl text-lg text-[#a1a1a6] leading-relaxed">
              Two Samsung-exclusive flagship stores in Greater Noida. Every Galaxy device — S, Z, A,
              tablets, wearables and audio — live, hands-on, guided by people who actually use them.
            </p>

            <div className="dc-reveal mt-8 flex flex-wrap items-center gap-3">
              <Link
                data-testid="hero-cta-stores"
                href="/stores"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold bg-[#ffffff] text-[#0a0a0b] hover:bg-white transition-colors"
              >
                Find a Store <ArrowUpRight size={15} />
              </Link>
              <Link
                data-testid="hero-cta-offers"
                href="/offers"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white hover:bg-white/5 transition-colors"
              >
                See in-store offers →
              </Link>
            </div>

            <AnnouncementStrip announcements={announcements} />
          </div>

          {/* Product hero image (right column on desktop) */}
          <div className="relative dc-reveal">
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto rounded-3xl overflow-hidden bg-[#0d0d0f]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-testid="hero-image"
                src={hero.hero_image_url || "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1200&q=80"}
                alt={hero.hero_image_alt || "Galaxy device on display"}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-[#050505]/95 backdrop-blur rounded-2xl px-4 py-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)]">
                <div>
                  <p data-testid="hero-live-demo-label" className="text-[10px] uppercase tracking-[0.2em] text-[#6e6e73] font-semibold">{hero.hero_live_demo_label || "Live demo"}</p>
                  <p data-testid="hero-live-demo-title" className="text-sm font-semibold text-white">{hero.hero_live_demo_title || "Galaxy Z Fold — feel the fold in person."}</p>
                </div>
                <Link
                  href={hero.hero_live_demo_href || "/stores"}
                  data-testid="hero-live-demo-cta"
                  className="text-xs font-semibold text-white hover:text-black inline-flex items-center gap-1 whitespace-nowrap"
                >
                  {hero.hero_live_demo_cta || "Visit"} <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics strip */}
        <div className="max-w-7xl mx-auto mt-14 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-white/10 pt-8">
          {[
            ["2", "Retail locations"],
            ["100%", "Genuine Samsung"],
            ["Since 2021", "Serving Greater Noida"],
            ["Daily", "Live demos"],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="font-display text-2xl md:text-3xl font-bold text-white">{v}</div>
              <div className="text-xs uppercase tracking-[0.16em] text-[#6e6e73] mt-1 font-medium">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FOLD8 BANNER */}
      <Fold8Banner />

      {/* BRAND STORY — Since 2021 */}
      <section
        data-testid="story-section"
        className="relative px-5 md:px-10 py-24 md:py-32 mt-8 overflow-hidden"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-[#ff2d7a]/8 blur-[120px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
          <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 order-2 lg:order-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              data-testid="story-image"
              src={hero.story_image_url || "https://images.pexels.com/photos/11297769/pexels-photo-11297769.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=1200&w=940"}
              alt={hero.story_image_alt || "DigiConnect Samsung Experience Store interior"}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] uppercase tracking-[0.2em] text-[#ff2d7a] font-bold">Est. 2021</p>
                <p className="font-display text-lg font-bold text-white mt-1">Greater Noida flagship</p>
              </div>
              <div className="rounded-full bg-white/10 backdrop-blur border border-white/15 px-3 py-1 text-[10px] font-bold text-white uppercase tracking-widest">
                SmartCafé
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <p className="overline">Our story</p>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white mt-3 tracking-tight leading-[1.05]">
              A Samsung store, done <span className="text-[#ff2d7a]">the right way.</span>
            </h2>
            <p className="mt-6 text-lg text-white/70 leading-relaxed max-w-xl">
              DigiConnect started in 2021 with a simple belief — buying a Galaxy device should
              feel as considered as the device itself. Two flagship stores later, we&apos;re still
              obsessed with the same thing.
            </p>
            <div className="mt-10 grid grid-cols-3 gap-6 max-w-lg">
              {[
                ["4+", "Years serving Greater Noida"],
                ["2", "Samsung Experience Stores"],
                ["1", "Ecosystem, fully unboxed"],
              ].map(([v, l]) => (
                <div key={l}>
                  <div className="font-display text-3xl md:text-4xl font-black text-white">{v}</div>
                  <div className="text-[11px] uppercase tracking-[0.14em] text-white/50 mt-2 leading-snug">{l}</div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/about"
                data-testid="story-cta-about"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold bg-[#ff2d7a] text-white hover:bg-[#e91764] transition-colors"
              >
                Read our story <ArrowUpRight size={15} />
              </Link>
              <Link
                href="/stores"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold border border-white/15 text-white hover:bg-white/[0.05] transition-colors"
              >
                Visit a store
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* WHY US - BENTO */}
      <section
        data-testid="features-section"
        className="px-5 md:px-10 py-24 md:py-32 mt-8 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div className="max-w-2xl">
              <p className="overline">Why DigiConnect</p>
              <h2 className="font-display text-4xl md:text-5xl font-black text-white mt-3 tracking-tight">
                A Samsung-exclusive store, done right.
              </h2>
            </div>
            <p className="text-[#a1a1a6] max-w-md">
              We&apos;re not a general electronics shop. Every square foot is dedicated to the Galaxy
              ecosystem — with people who genuinely know it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f, i) => (
              <div key={f.title} data-testid={`feature-tile-${i}`} className={`dc-tile p-8 ${f.span}`}>
                <div className="h-11 w-11 rounded-xl bg-[#ff2d7a]/15 border border-[#ff2d7a]/30 flex items-center justify-center text-[#ff2d7a]">
                  <f.icon size={20} />
                </div>
                <h3 className="font-display text-xl md:text-2xl font-bold text-white mt-6">{f.title}</h3>
                <p className="text-[#a1a1a6] mt-3 leading-relaxed text-sm">{f.body}</p>
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
              <h2 className="font-display text-4xl md:text-5xl font-black text-white mt-3 tracking-tight">
                What&apos;s live at the SmartCafé.
              </h2>
            </div>
            <Link
              href="/stores"
              data-testid="products-visit-link"
              className="inline-flex items-center gap-2 text-sm font-bold text-[#ff2d7a] hover:text-white transition-colors"
            >
              Come see them <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <Testimonials items={testimonials} variant="home" />

      {/* INSTAGRAM */}
      <InstagramFeed posts={igPosts} />

      {/* VISIT US */}
      <section
        data-testid="visit-section"
        className="px-5 md:px-10 py-24 md:py-32 border-t border-white/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 max-w-2xl">
            <p className="overline">Visit us</p>
            <h2 className="font-display text-4xl md:text-5xl font-black text-white mt-3 tracking-tight">
              Two flagship stores. <span className="dc-gradient-text italic">Greater Noida.</span>
            </h2>
            <p className="text-[#a1a1a6] mt-4">
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
        className="dc-section-dark px-5 md:px-10 py-24 md:py-32"
      >
        <div className="max-w-6xl mx-auto rounded-3xl border border-white/10 bg-black/30 p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-[#ff2d7a]/40 blur-3xl" />
          <div className="relative">
            <p className="overline">Say hi</p>
            <h3 className="font-display text-3xl md:text-5xl font-black text-white mt-3 tracking-tight max-w-3xl leading-[1.05]">
              Ping us on WhatsApp — we&apos;ll answer during store hours.
            </h3>
            <p className="text-white/70 mt-4 max-w-xl">
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
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold bg-[#ffffff] text-[#0a0a0b] hover:bg-white transition-colors"
                >
                  <MessageCircle size={16} /> {s.name}
                </a>
              ))}
              <a
                data-testid="cta-instagram"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-bold bg-[#050505]/[0.05] border border-white/15 text-white hover:bg-[#050505]/[0.08] transition-colors"
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

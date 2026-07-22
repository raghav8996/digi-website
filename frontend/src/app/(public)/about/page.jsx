import { Heart, ShieldCheck, Zap, TrendingUp, BadgeCheck, Compass, Handshake, Building2 } from "lucide-react";
import { fetchServer } from "@/lib/api";
import { resolveImageUrl } from "@/lib/images";

export const metadata = {
  title: "About DigiConnect",
  description:
    "DigiConnect is a Samsung-Experience Store established in 2021 in Greater Noida. Since inception we've grown into two flagship locations and are building a multi-brand offline retail portfolio across India.",
  alternates: { canonical: "https://digiconnect.net.in/about" },
};

const CORE_VALUES = [
  {
    icon: Heart,
    title: "Customer Satisfaction",
    body: "Prioritising the needs of every customer with personalised, unhurried service — the way premium retail should feel.",
  },
  {
    icon: ShieldCheck,
    title: "Integrity",
    body: "Conducting business in an honest and transparent manner. Genuine stock, transparent pricing, no upsell games.",
  },
  {
    icon: Zap,
    title: "Innovation",
    body: "Staying ahead of market trends and offering the latest Samsung products the moment they land.",
  },
  {
    icon: TrendingUp,
    title: "Growth",
    body: "Focused on continuous expansion and enhancing the customer experience at every touchpoint.",
  },
  {
    icon: BadgeCheck,
    title: "Reliability",
    body: "Providing dependable products and a store experience customers can trust — every visit.",
  },
];

const FORWARD_PILLARS = [
  {
    icon: Building2,
    title: "Multi-city footprint",
    body: "Expanding across high-potential markets in India with modern, customer-centric retail spaces that deliver hands-on brand experiences.",
  },
  {
    icon: Handshake,
    title: "Multi-brand portfolio",
    body: "Actively onboarding new, high-value brands — across categories — seeking stronger offline visibility and deeper market penetration.",
  },
  {
    icon: Compass,
    title: "Retail expertise",
    body: "Years of experience in consumer behaviour, store experience design and last-mile retail operations — helping brands convert interest into loyalty.",
  },
];

export default async function AboutPage() {
  const siteContent = await fetchServer("/site-content", { tags: ["site-content"] });
  const heroImg = resolveImageUrl(siteContent?.about_hero_image_url || "");
  const heroAlt = siteContent?.about_hero_image_alt || "DigiConnect Samsung Experience Store";

  return (
    <>
      {/* HERO */}
      <section data-testid="about-hero" className="pt-20 md:pt-28 pb-16 md:pb-24 px-5 md:px-10 border-b border-white/5 relative overflow-hidden">
        <div className="dc-aurora" />
        <div className="relative max-w-7xl mx-auto grid md:grid-cols-[1.15fr_1fr] gap-10 md:gap-16 items-center">
          <div>
            <p className="overline">About DigiConnect</p>
            <h1 className="font-display font-black text-white tracking-tight leading-none text-5xl md:text-7xl mt-3">
              Where technology, <span className="dc-gradient-text italic">meets people.</span>
            </h1>
            <p className="mt-8 max-w-2xl text-[#a1a1a6] text-lg leading-relaxed">
              Since its inception, DigiConnect has expanded from a single store to two successful
              locations, both in prime retail areas — a reflection of the demand for quality Samsung
              products and genuine customer satisfaction. Our growth strategy focuses on expanding our
              physical presence with plans to open more stores in key locations in the years ahead.
            </p>
          </div>
          {heroImg ? (
            <div className="relative aspect-[4/5] w-full max-w-md md:ml-auto rounded-3xl overflow-hidden border border-white/10 bg-[#0d0d0f]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                data-testid="about-hero-image"
                src={heroImg}
                alt={heroAlt}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/10 to-transparent pointer-events-none" />
            </div>
          ) : null}
        </div>
      </section>

      {/* STORY */}
      <section data-testid="about-story" className="px-5 md:px-10 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="overline">The story</p>
            <h2 className="font-display text-3xl md:text-4xl font-black text-white mt-3 tracking-tight">
              From a single store to a retail vision.
            </h2>
          </div>
          <div className="space-y-5 text-[#a1a1a6] leading-relaxed">
            <p>
              DigiConnect started in{" "}
              <span className="text-white font-semibold">2021</span> as a sole proprietorship with a
              single Samsung-Experience Store. Today, both our locations at Gaur City Mall and Grand
              Venice Mall stand as flagship SmartCafé destinations for the Galaxy ecosystem.
            </p>
            <p>
              Every square foot of our stores is designed for hands-on discovery — live demos across
              the S, Z and A series, plus tablets, wearables and audio, in a relaxed lounge-style
              setting with staff who genuinely use these devices.
            </p>
            <p>
              What began as a Samsung-exclusive retail experience is evolving into something bigger
              — a modern offline retail platform built to host multiple premium brands across
              categories.
            </p>
          </div>
        </div>
      </section>

      {/* CORE VALUES */}
      <section data-testid="about-values" className="px-5 md:px-10 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="overline">Core values</p>
            <h2 className="font-display text-3xl md:text-5xl font-black text-white mt-3 tracking-tight">
              What we care about.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CORE_VALUES.map((v, i) => (
              <div key={v.title} data-testid={`value-card-${i}`} className="dc-tile p-7">
                <div className="h-11 w-11 rounded-xl bg-[#ff2d7a]/15 border border-[#ff2d7a]/30 flex items-center justify-center text-[#ff2d7a]">
                  <v.icon size={20} />
                </div>
                <h3 className="font-display text-xl font-bold text-white mt-5">{v.title}</h3>
                <p className="text-[#a1a1a6] mt-2 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GOING FORWARD */}
      <section data-testid="about-forward" className="px-5 md:px-10 py-20 md:py-28 border-b border-white/5 relative overflow-hidden">
        <div className="absolute -top-40 right-0 h-[500px] w-[700px] rounded-full bg-[#ff2d7a]/8 blur-[120px] pointer-events-none" />
        <div className="relative max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start mb-16">
            <div>
              <p className="overline">Going forward</p>
              <h2 className="font-display text-3xl md:text-5xl font-black text-white mt-3 tracking-tight leading-[1.05]">
                Building India&apos;s next offline <span className="dc-gradient-text italic">retail powerhouse.</span>
              </h2>
            </div>
            <div className="space-y-5 text-[#a1a1a6] leading-relaxed">
              <p>
                As DigiConnect continues to grow, our long-term vision is to expand our footprint
                across multiple cities — strengthening our presence in high-potential markets
                throughout India. With each new location, we aim to build modern, customer-centric
                retail spaces that deliver memorable, hands-on brand experiences.
              </p>
              <p>
                Our strategy goes beyond expansion. We are actively onboarding new, high-value
                brands to our portfolio — companies seeking stronger offline visibility, deeper
                market penetration and a trusted partner that understands how customers interact
                with products in the real world.
              </p>
              <p>
                Offline engagement remains one of the most powerful ways to build brand credibility
                in India, and our retail ecosystem is built to maximise that impact through
                personalised interactions, guided product exploration and authentic customer
                relationships.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FORWARD_PILLARS.map((p, i) => (
              <div key={p.title} data-testid={`forward-pillar-${i}`} className="dc-tile p-7">
                <div className="h-11 w-11 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center text-white">
                  <p.icon size={20} />
                </div>
                <h3 className="font-display text-xl font-bold text-white mt-5">{p.title}</h3>
                <p className="text-[#a1a1a6] mt-2 text-sm leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MISSION */}
      <section data-testid="about-mission" className="px-5 md:px-10 py-20 md:py-28">
        <div className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-[#050505] p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#ff2d7a]/20 blur-3xl" />
          <div className="relative">
            <p className="overline">Our mission</p>
            <p className="font-display text-2xl md:text-4xl font-black text-white mt-4 leading-tight tracking-tight">
              To become a{" "}
              <span className="dc-gradient-text italic">multi-brand, multi-location</span> offline
              retail powerhouse — empowering brands to reach customers more effectively, and
              enabling customers to experience technology the way it&apos;s meant to be discovered.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

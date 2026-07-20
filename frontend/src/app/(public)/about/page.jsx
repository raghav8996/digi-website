import { Heart, Zap, TrendingUp, Shield, Compass, Target } from "lucide-react";

export const metadata = {
  title: "About DigiConnect",
  description:
    "DigiConnect is a Samsung-exclusive Experience Store established in 2021 in Greater Noida. Learn about our story, values and vision.",
  alternates: { canonical: "https://digiconnect.net.in/about" },
};

const VALUES = [
  { icon: Heart, title: "Customer-first", body: "Personalised, unhurried service — the way premium retail should feel." },
  { icon: Shield, title: "Integrity", body: "Genuine Samsung products, transparent pricing, no upsell games." },
  { icon: Zap, title: "Innovation", body: "The latest Galaxy launches, live in store the moment they land." },
  { icon: TrendingUp, title: "Growth", body: "Expanding thoughtfully — every new store is a proper experience space." },
  { icon: Compass, title: "Expertise", body: "Staff who actually use these devices — ask us anything." },
  { icon: Target, title: "Focus", body: "Samsung-exclusive. That’s all we do, and we do it well." },
];

export default function AboutPage() {
  return (
    <>
      <section data-testid="about-hero" className="pt-20 md:pt-28 pb-16 px-5 md:px-10 border-b border-white/5 relative overflow-hidden">
        <div className="dc-aurora" />
        <div className="relative max-w-6xl mx-auto">
          <p className="overline">About DigiConnect</p>
          <h1 className="font-display font-black text-white tracking-tight leading-none text-5xl md:text-7xl mt-3">
            Samsung, <span className="dc-gradient-text italic">unhurried.</span>
          </h1>
          <p className="mt-8 max-w-3xl text-[#a1a1a6] text-lg leading-relaxed">
            Founded in 2021 in Greater Noida, DigiConnect is a Samsung-designated Experience Store
            and SmartCafé partner. What started as a single store has grown into two flagship
            locations — dedicated entirely to the Galaxy ecosystem.
          </p>
        </div>
      </section>

      <section data-testid="about-story" className="px-5 md:px-10 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <div>
            <p className="overline">The story</p>
            <h2 className="font-display text-3xl md:text-4xl font-black text-white mt-3 tracking-tight">
              Two flagship stores. One obsession.
            </h2>
          </div>
          <div className="space-y-5 text-[#a1a1a6] leading-relaxed">
            <p>
              DigiConnect is a Samsung-exclusive retail experience. Established in{" "}
              <span className="text-white font-semibold">2021</span> as a sole proprietorship, we&apos;ve
              built a reputation for high-quality Galaxy products and a genuinely helpful in-store
              experience.
            </p>
            <p>
              Both stores are Samsung Experience Stores and SmartCafé partners — spaces designed for
              hands-on discovery. Knowledgeable staff, live demos across the S, Z and A series, plus
              tablets, wearables and audio, all in a relaxed lounge-style environment.
            </p>
            <p>
              Our vision is to keep growing our Samsung retail footprint across India — building
              modern, customer-centric flagship stores that make the Galaxy ecosystem tangible.
            </p>
          </div>
        </div>
      </section>

      <section data-testid="about-values" className="px-5 md:px-10 py-20 md:py-28 border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl mb-14">
            <p className="overline">Core values</p>
            <h2 className="font-display text-3xl md:text-5xl font-black text-white mt-3 tracking-tight">
              What we care about.
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VALUES.map((v, i) => (
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

      <section data-testid="about-mission" className="px-5 md:px-10 py-20 md:py-28">
        <div className="max-w-5xl mx-auto rounded-3xl border border-white/10 bg-[#050505] p-10 md:p-16 relative overflow-hidden">
          <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[#ff2d7a]/20 blur-3xl" />
          <div className="relative">
            <p className="overline">Our mission</p>
            <p className="font-display text-2xl md:text-4xl font-black text-white mt-4 leading-tight tracking-tight">
              To build India&apos;s most-loved network of Samsung-exclusive Experience Stores — where
              customers discover the Galaxy ecosystem the way it&apos;s meant to be experienced.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
